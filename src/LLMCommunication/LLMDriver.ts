import CV from "../CV/CV.ts";
import Advert from "../Tuning/Advert.ts";

interface LLMDriver {
    sendToLLM(cv: CV, advert: Advert|null): Promise<string>;
}

export default LLMDriver;