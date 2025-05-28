import Env from "../Core/Env.ts";
import CV from "../CV/CV.ts";
import Advert from "../Tuning/Advert.ts";
import LLMDriver from "./LLMDriver.ts";
import OllamaByPartsPreciseContextDriver from "./OllamaByPartsPreciseContextDriver.ts";
// import OllamaByPartsDriver from "./OllamaByPartsDriver.ts";
// import OllamaByPartsFreakyDriver from "./OllamaByPartsFreakyDriver.ts";
// import OllamaDriver from "./OllamaDriver.ts";


class LLMService {
    private llmDriver: LLMDriver;

    constructor() {
        this.llmDriver = new OllamaByPartsPreciseContextDriver(Env.getModelName());
    }

    async sendToLLM(cv: CV, advert: Advert): Promise<string> {
        return await this.llmDriver.sendToLLM(cv, advert);
    }
}

export default LLMService;