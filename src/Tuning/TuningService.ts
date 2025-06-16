import CV from "../CV/CV.ts";
import CVFactory from "../CV/CVFactory.ts";
import LLMService from "../LLMCommunication/LLMService.ts";
import Advert from "./Advert.ts";

class TuningService {
    private llmService: LLMService;

    constructor() {
        this.llmService = new LLMService();
    }

    private getCVStructureAsString(): string {
        return `
        {
            "workExperience": [
                {
                    "company": string,
                    "jobTitle": string,
                    "location": string,
                    "date": string,
                    "bulletPoints": string[]
                }
            ],
            "education": [
                {
                    "schoolName": string,
                    "degree": string,
                    "location": string,
                    "date": string,
                    "description": string
                }
            ],
            "activities": [
                {
                    "title": string,
                    "subtitle": string,
                    "location": string,
                    "date": string,
                    "description": string
                }
            ],
            "additional": [
                {
                    "title": string,
                    "content": string
                },
            ]
        }
        `
    }

    public async tuneCV(cv: CV, advert: Advert|null): Promise<CV> {
        const result = await this.llmService.sendToLLM(cv, advert);
        const resultAsJSON = JSON.parse(result);
        const newCV = CVFactory.fromJSON(resultAsJSON);
        return newCV;
    }
}

export default TuningService;