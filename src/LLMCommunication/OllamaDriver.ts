import Env from "../Core/Env.ts";
import ObjectUtil from "../Core/ObjectUtil.ts";
import CV from "../CV/CV.ts";
import Advert from "../Tuning/Advert.ts";
import LLMDriver from "./LLMDriver.ts";

/**
Notes on this solution:

*/


class OllamaDriver implements LLMDriver {
    private model: string;

    constructor(model: string = 'phi') {
        this.model = model
    }

    private transformInput(cv: CV, advert: Advert): string {
        const cvAsTextJSON = JSON.stringify(cv.toJSON(), null, 4);
        const messageFromUser = 
`Given this CV as JSON format: 
${cvAsTextJSON}

And this job advert:
${advert.getTextContent()}

Your task is to edit this json without changing it's structure so that descriptions match
keywords and requirements from the advert given above as much as possible.
Remember you can't lie, you can't change meaning of those sentences, 
keep in mind context for each change like job title or school name,
if you're editing bullet points under entries in work experience section remember to use first person active voice
and start sentences with active verbs.

In the technical skills sections you can make sure my skills are aligned with whatever the advert 
requires if you think they're somehow related to my listed skills.

DO NOT mention the name of the company given in the advert anywhere in this CV.

DO NOT edit "jobTitle" and "company" fields.

DO NOT leave anything empty.

DO NOT MAKE ANYTHING SHORTER THAN IT ALREADY IS.

MAKE SURE THE SKILL YOU'RE ADDING INTO THE BULLET POINTS ARE TRUE AND RELATED TO THE ORIGINAL JSON.

DO NOT CHANGE THE MEANING OF ANYTHING.

MAKE SURE YOU DON'T LOOSE ANY CONTEXT THAT WAS ALREADY THERE.

Remember to output only the revised JSON and nothing else!`;

        return messageFromUser
    }

    async sendToLLM(cv: CV, advert: Advert): Promise<string> {
        const messageFromUser = await this.transformInput(cv, advert);

        const completion = await (await fetch(Env.getOllamaURL(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: this.model, 
                messages: [
                    { role: "user", content: messageFromUser },  
                ],
                stream: false,
            })
        })).json();
        if (!completion.message.content) {
            throw new Error('Autocompletion could not be performed - empty response')
        }
        return completion.message.content;
    }

}

export default OllamaDriver;