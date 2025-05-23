import Env from "../Core/Env.ts";
import ObjectUtil from "../Core/ObjectUtil.ts";
import CV from "../CV/CV.ts";
import CVFactory from "../CV/CVFactory.ts";
import Advert from "../Tuning/Advert.ts";
import LLMDriver from "./LLMDriver.ts";

/**
Notes on this solution:
- Is fast
- Will never crash, worst case scenario are weird sentences
- Lacks context for fields which makes it generate weird sentences
*/


class OllamaByPartsDriver implements LLMDriver {
    private model: string;

    constructor(model: string = 'phi') {
        this.model = model
    }

    private getFieldsToModify(cvAsJSON: any): string[] {
        const fields = [];
        if (cvAsJSON['workExperience']) {
            for (let i = 0; i<cvAsJSON['workExperience'].length; i++ ) {
                for (let j = 0; j<cvAsJSON['workExperience'][i]['bulletPoints'].length; j++ ) {
                    fields.push(`workExperience.${i}.bulletPoints.${j}`)
                }
            }
        }

        if (cvAsJSON['education']) {
            for (let i = 0; i<cvAsJSON['education'].length; i++ ) {
                fields.push(`education.${i}.description`)
            }
        }

        if (cvAsJSON['activities']) {
            for (let i = 0; i<cvAsJSON['activities'].length; i++ ) {
                fields.push(`activities.${i}.description`)
            }
        }

        if (cvAsJSON['additional']) {
            for (let i = 0; i<cvAsJSON['additional'].length; i++ ) {
                fields.push(`additional.${i}.content`)
            }
        }

        return fields;
    }

    private async tuneSpecificField(
        fieldValue: string, 
        userCVAsText: string, 
        advert: Advert, 
        turnOffModelAfter:boolean=false
    ): Promise<string> {
        const userPrompt = 
`Your task is to modify fragment of text given by user from his CV 
so that it matches the advert below as much as possible. 
Do not change meaning of those sentences.
Do not generate lies.
Sentences have to be written in first person active voice.
DO NOT START SENTENCES WITH "I" TRY TO USE ACTIVE VERBS
The text should be at most few sentences.

Try not to repeat yourself.

Make sure your changes match information provided by CV.

YOUR ANSWER SHOULD ONLY CONTAIN THE MODIFIED SENTENCE, ABSOLUTELY NOTHING ELSE THAN THAT.

Advert:
${advert.getTextContent()}

Full User CV:
${userCVAsText}

Sentence to edit:
${fieldValue}

Your revised version:
`;
        
        const completion = await fetch(`${Env.getOllamaURL()}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: this.model, 
                // messages: [
                //     { role: "user", content: userPrompt }, 
                // ],
                prompt: userPrompt,
                stream: false,
                keep_alive: turnOffModelAfter ? 0 : 16
            })
        });

        const result = await completion.json();
        console.log(result.response)

        // console.log(completion.message.content)
        if (!result.response) {
            throw new Error('Autocompletion could not be performed - empty response')
        }
        return result.response;
    }

    private async generateSummary(cvAsText: string, advert: Advert): Promise<string> {
        const userPrompt = 
`
Generate short summary for this CV that I could put on top:
${cvAsText}

And base it mostly on advert below so that keywords and sentences match as much as possible for the ATS searchability:
${advert}

FOCUS ON WHAT THE RECRUITER IN THE ADVERT NEEDS AND MATCH IT WITH CV AS MUCH AS POSSIBLE.

DONT FORGET ABOUT THE SOFT SKILLS.

DO NOT TALK ABOUT THE NUMBERS, YOU CAN BE BROAD IN SUMMARY. 

OMIT ANY FORMATTING ONLY RAW TEXT.

REPOND ONLY WITH RESULT.
`;
        
        const completion = await fetch(`${Env.getOllamaURL()}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: this.model, 
                prompt: userPrompt,
                stream: false,
                keep_alive: 0
            })
        });

        const result = await completion.json();
        console.log(result.response)

        // console.log(completion.message.content)
        if (!result.response) {
            throw new Error('Autocompletion could not be performed - empty response')
        }
        return result.response;
    }

    async sendToLLM(cv: CV, advert: Advert): Promise<string> {
        const cvAsJson: any = cv.toJSON();
        const cvAsText: string = cv.toText();

        const fieldsToModify = this.getFieldsToModify(cvAsJson);
        
        let counter = 0;
        for (const field of fieldsToModify) {
            counter++;
            const fieldValue = ObjectUtil.getByPath(field, cvAsJson);
            const result = await this.tuneSpecificField(fieldValue, cvAsText, advert, counter == fieldsToModify.length);
            ObjectUtil.modifyByPath(field, result, cvAsJson);
            console.log(`Field ${counter} out of ${fieldsToModify.length} finished`)
        }

        console.log("Generating summary...")
        const postTransformCV = CVFactory.fromJSON(cvAsJson);
        const summary = await this.generateSummary(postTransformCV.toText(), advert);
        ObjectUtil.modifyByPath("summary", summary, cvAsJson);
        console.log("Done!")

        return JSON.stringify(cvAsJson, null, 4);
    }
}

export default OllamaByPartsDriver;