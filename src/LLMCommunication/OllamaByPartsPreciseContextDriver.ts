import Env from "../Core/Env.ts";
import ObjectUtil from "../Core/ObjectUtil.ts";
import CV from "../CV/CV.ts";
import CVFactory from "../CV/CVFactory.ts";
import Advert from "../Tuning/Advert.ts";
import LLMDriver from "./LLMDriver.ts";
import OllamaStreamer from "./OllamaStreamer.ts";


class Field {
    constructor(
        public path: string, 
        public content: string
    ) {};
}

class ContextBlock {
    private fields: Field[] = [];
    private context: string = "";

    constructor() {}

    public addField(path: string, content: string) {
        this.fields.push(new Field(path, content));
        this.context += content + "\n";
    }

    public addContextLine(line: string) {
        this.context += line + "\n";
    }

    public getContext() {
        return this.context;
    }

    public getFields() {
        return this.fields
    }
}

class OllamaByPartsPreciseContextDriver implements LLMDriver {
    private model: string;

    constructor(model: string = 'phi') {
        this.model = model
    }

    private getContextBlocks(cvAsJSON: any): ContextBlock[] {
        const blocks: ContextBlock[] = [];

        if (cvAsJSON['workExperience']) {
            for (let i = 0; i<cvAsJSON['workExperience'].length; i++ ) {
                const workContext = new ContextBlock();
                workContext.addContextLine(`Job Title: ${cvAsJSON['workExperience'][i]['jobTitle']}`)
                workContext.addContextLine(`Description: `)
                for (let j = 0; j<cvAsJSON['workExperience'][i]['bulletPoints'].length; j++ ) {
                    workContext.addField(
                        `workExperience.${i}.bulletPoints.${j}`,
                        cvAsJSON['workExperience'][i]['bulletPoints'][j]
                    )
                }
                blocks.push(workContext);
            }
        }

        if (cvAsJSON['education']) {
            for (let i = 0; i<cvAsJSON['education'].length; i++ ) {
                const educationContext = new ContextBlock();
                educationContext.addContextLine(`School name: ${cvAsJSON['education'][i]['schoolName']}`)
                educationContext.addContextLine(`Degree name: ${cvAsJSON['education'][i]['degree']}`)
                educationContext.addField(
                    `education.${i}.description`,
                    cvAsJSON['education'][i]['description']
                )
                blocks.push(educationContext);
            }
        }

        if (cvAsJSON['activities']) {
            for (let i = 0; i<cvAsJSON['activities'].length; i++ ) {
                const activitiesContext = new ContextBlock();
                activitiesContext.addContextLine(`${cvAsJSON['activities']['title']}`)
                activitiesContext.addContextLine(`${cvAsJSON['activities']['subtitle']}`)
                activitiesContext.addField(
                    `activities.${i}.description`,
                    cvAsJSON['activities'][i]['description']
                );
                blocks.push(activitiesContext);
            }
        }

        if (cvAsJSON['additional']) {
            for (let i = 0; i<cvAsJSON['additional'].length; i++ ) {
                const additionalContext = new ContextBlock();
                additionalContext.addContextLine(`${cvAsJSON['additional']['title']}:`);
                additionalContext.addField(
                    `additional.${i}.content`,
                    cvAsJSON['additional'][i]['content']
                )
                blocks.push(additionalContext);
            }
        }

        return blocks;
    }

    private async tuneFromContextBlock(
        contextBlock: ContextBlock, 
        advert: Advert, 
    ): Promise<Field[]> {
        const userPrompt = (fieldValue: string) =>  
`You're a friendly recruitment specialist tasked 
with helping the user tailor his CV to a specific job advert
so that it matches the advert as much as possible.

You'll be provided with context, advert and 
a piece of list of texts that should be modified based on this context to match advert as much as possible.

Sentences have to be written in first person active voice.
DO NOT START SENTENCES WITH "I" MAKE SURE TO USE ACTIVE VERBS
The text should be at most few sentences.

Make sure not to repeat yourself.

Make sure your changes match information provided by the context

Switch job titles in context from those in the advert if they sound close enough.

DO NOT EDIT THE PATH FIELD, ONLY CONTENT

DO NOT LIE, DO NOT MENTION THINGS THAT DID NOT HAPPEN IN THE CONTEXT

DO NOT GO "OVER THE BOARD" MAKE SURE WHAT YOU'RE WRITING IS ALIGNED WITH THE CONTEXT AND YOU'RE NOT GOING INSANE

MAKE SURE TOOLS MENTIONED IN YOUR EDITS WERE ACTUALLY USED IN THE CONTEXT YOU'VE BEEN GIVEN

YOUR ANSWER SHOULD ONLY CONTAIN JSON STYLE ARRAY OF MODIFIED SENTENCES IN THE SAME FORMAT AS THEY WERE PASSED, ABSOLUTELY NOTHING ELSE THAN THAT.

Advert:
${advert.getTextContent()}

Full Context for this field:
${contextBlock.getContext()}

Sentences to edit:
${fieldValue}

Your revised version:
`;
        const edits: Field[] = [];

        const fieldsParsed = contextBlock.getFields().map( (e: Field) => JSON.stringify(e, null, 4)).join(',')

        const completion = await OllamaStreamer.generateFromModel(this.model, userPrompt(`[${fieldsParsed}]`));

        const cleanedData = JSON.parse(completion.replaceAll(/<think>[\s\S]*?<\/think>/g, ''))

        console.log(cleanedData)

        for (const field of cleanedData) {
            edits.push(new Field(field['path'], field['content']))
        }        

        return edits;
    }

    private async generateSummary(cvAsText: string, advert: Advert): Promise<string> {
        const userPrompt = 
`
Generate short summary that I could put on top of this CV:
${cvAsText}

And base it mostly on advert below so that keywords and sentences match as much as possible for the ATS searchability:
${advert}

FOCUS ON WHAT THE RECRUITER IN THE ADVERT NEEDS AND MATCH IT WITH CV AS MUCH AS POSSIBLE.

DONT FORGET ABOUT THE SOFT SKILLS.

DO NOT TALK ABOUT THE NUMBERS, YOU CAN BE BROAD IN SUMMARY. 

MAKE SURE TEXT YOU GENERATED MATCHES THE CV AND IS FACTUALLY CORRECT.

OMIT ANY FORMATTING ONLY RAW TEXT.

DO NOT INSERT ANY "[COMPANY'S NAME]" INTO THE SUMMARY

REPOND ONLY WITH THE SUMMARY, DO NOT ADD ANYTHING ELSE
`;        
        const completion = await OllamaStreamer.generateFromModel(this.model, userPrompt);
        const cleanedData = completion.replaceAll(/<think>[\s\S]*?<\/think>/g, '');

        return cleanedData;
    }

    async sendToLLM(cv: CV, advert: Advert): Promise<string> {
        const cvAsJson: any = cv.toJSON();

        const contextBlocks = this.getContextBlocks(cvAsJson);
        
        let counter = 0;
        for (const block of contextBlocks) {
            counter++;
            const reseditedFields = await this.tuneFromContextBlock(block, advert);
            for (const editedField of reseditedFields) {
                ObjectUtil.modifyByPath(editedField.path, editedField.content, cvAsJson);
            }
            console.log(`Field ${counter} out of ${contextBlocks.length} finished`)
        }

        console.log("Generating summary...")
        const postTransformCV = CVFactory.fromJSON(cvAsJson);
        const summary = await this.generateSummary(postTransformCV.toText(), advert);
        ObjectUtil.modifyByPath("summary", summary, cvAsJson);
        console.log("Done!")

        return JSON.stringify(cvAsJson, null, 4);
    }
}

export default OllamaByPartsPreciseContextDriver;