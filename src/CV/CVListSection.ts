import CVListSectionElements from './CVListSectionElement.ts';
import Renderable from './Renderable.ts';
import { TemplatePaths, TemplateService } from './TemplateService.ts';

type CVListSectionData = {
    "SECTION_NAME": string,
}

class CVListSection implements Renderable {    
    private data: CVListSectionData;
    private elements: CVListSectionElements[] = [];
    
    constructor(data: CVListSectionData) {
        this.data = data;
    }

    public addElement(element: CVListSectionElements): void {
        this.elements.push(element);
    }
    
    async renderFromTemplate(): Promise<string> {
        let SECTION_ELEMENTS = "";
        for (const element of this.elements) {
            SECTION_ELEMENTS += await element.renderFromTemplate();
        }
        return await TemplateService.renderFromTemplate(
            TemplatePaths.LIST_SECTION, 
            { 
                ...this.data,
                "SECTION_ELEMENTS": SECTION_ELEMENTS
            }
        );
    }
}

export default CVListSection;