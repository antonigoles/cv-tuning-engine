import CV from './CV.ts'

const EXPORT_PATH = `/home/antoni/Pulpit/cv-tuning-engine/exports`;

class ExportService {
    constructor() {}

    public async exportHTMLFromCV(cv: CV, filename: string, export_path_override: string|null = null): Promise<void> {
        const htmlData = await cv.renderFromTemplate();
        if (export_path_override) {
            await Deno.writeTextFile(export_path_override, htmlData);
            return;
        } 
        await Deno.writeTextFile(`${EXPORT_PATH}/${filename}.html`, htmlData);
    }

    public async exportPDFFromCV(cv: CV, path: string): Promise<void> {

    }
}

export default ExportService;