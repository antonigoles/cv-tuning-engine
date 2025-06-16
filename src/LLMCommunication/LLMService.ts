import Env from "../Core/Env.ts";
import CV from "../CV/CV.ts";
import Advert from "../Tuning/Advert.ts";
import LLMDriver from "./LLMDriver.ts";
import OllamaByPartsNoAdvert from "./OllamaByPartsNoAdvert.ts";
import OllamaByPartsPreciseContextDriver from "./OllamaByPartsPreciseContextDriver.ts";
// import OllamaByPartsDriver from "./OllamaByPartsDriver.ts";
// import OllamaByPartsFreakyDriver from "./OllamaByPartsFreakyDriver.ts";
// import OllamaDriver from "./OllamaDriver.ts";


class LLMService {
    private llmDriver: LLMDriver;
    private llmDriverNoAdvert: LLMDriver;

    constructor() {
        this.llmDriver = new OllamaByPartsPreciseContextDriver(Env.getModelName());
        this.llmDriverNoAdvert = new OllamaByPartsNoAdvert(Env.getModelName());

    }

    async sendToLLM(cv: CV, advert: Advert|null): Promise<string> {
        if (!advert) return await this.llmDriverNoAdvert.sendToLLM(cv, null);
        return await this.llmDriver.sendToLLM(cv, advert);
    }
}

export default LLMService;