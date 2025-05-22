import { OpenAI } from "https://deno.land/x/openai@v4.68.1/mod.ts";
import Env from "../Core/Env.ts";
import LLMDriver from "./LLMDriver.ts";
import Advert from "../Tuning/Advert.ts";
import CV from "../CV/CV.ts";


class GPTDriver implements LLMDriver {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: Env.getOpenAIToken(),
        });
    }

    private async transformInput(cv: CV, advert: Advert): Promise<{ startingPrompt: string, messageFromUser: string }> {
        const cvAsTextJSON = await cv.toJSON();
        const startingPrompt = 
`Your task is to take advert given by user and modify this CV: 
${cvAsTextJSON}

so that it matches given advert as much as possible for the ATS systems used by HR departments 
to give high matching score. Do not change meaning of sentences, your edits can't be lies.
Your answer should only contain JSON with the same structure as given above and nothing else`;

        return { 
            startingPrompt, 
            messageFromUser: advert.getTextContent() 
        }
    }

    async sendToLLM(cv: CV, advert: Advert): Promise<string> {
        // return "{ \"test\": \"DEBUG RESULT\" }";
        const {startingPrompt, messageFromUser} = await this.transformInput(cv, advert);
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4.1-nano-2025-04-14", 
            messages: [
                { role: "system", content: startingPrompt }, 
                { role: "user", content: messageFromUser }, 
            ],
        });
        if (!completion.choices[0].message.content) {
            throw new Error('Autocompletion could not be performed - empty response')
        }
        return completion.choices[0].message.content;
    }
}

export default GPTDriver;