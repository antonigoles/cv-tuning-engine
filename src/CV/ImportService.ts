import CV from './CV.ts'
import CVFactory from './CVFactory.ts';

class ImportService {
    constructor() {}

    public async importCVFromJSONFile(path: string): Promise<CV> {
        const text = await Deno.readTextFile(path);
        const json = JSON.parse(text);
        return CVFactory.fromJSON(json);
    }

}

export default ImportService;