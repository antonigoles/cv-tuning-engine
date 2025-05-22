import Env from "../Core/Env.ts";
import ObjectUtil from "../Core/ObjectUtil.ts";
import CV from "../CV/CV.ts";
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

Make sure your changes match information provided by CV

YOUR ANSWER SHOULD ONLY CONTAIN THE MODIFIED SENTENCE, ABSOLUTELY NOTHING ELSE THAN THAT

Advert:
${advert.getTextContent()}

Full User CV:
${userCVAsText}

Sentence to edit:
${fieldValue}

Your revised version:
`;
        
        const completion = await (await fetch(Env.getOllamaURL(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: this.model, 
                messages: [
                    { role: "user", content: userPrompt }, 
                ],
                stream: false,
                keep_alive: turnOffModelAfter ? 0 : 16
            })
        })).json();
        // console.log(completion.message.content)
        if (!completion.message.content) {
            throw new Error('Autocompletion could not be performed - empty response')
        }
        return completion.message.content;
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

        return JSON.stringify(cvAsJson, null, 4);
    }
}

export default OllamaByPartsDriver;