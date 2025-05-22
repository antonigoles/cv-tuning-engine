import CVSimpleListSectionElements from './CVSimpleListSectionElement.ts';
import Renderable from './Renderable.ts';
import { TemplatePaths, TemplateService } from './TemplateService.ts';

type CVSimpleListSectionData = {
    "SECTION_NAME": string,
}

class CVSimpleListSection implements Renderable {    
    private data: CVSimpleListSectionData;
    private elements: CVSimpleListSectionElements[] = [];
    
    constructor(data: CVSimpleListSectionData) {
        this.data = data;
    }

    public addElement(element: CVSimpleListSectionElements): void {
        this.elements.push(element);
    }
    
    async renderFromTemplate(): Promise<string> {
        let SECTION_ELEMENTS = "";
        for (const element of this.elements) {
            SECTION_ELEMENTS += await element.renderFromTemplate();
        }
        return await TemplateService.renderFromTemplate(
            TemplatePaths.SIMPLE_LIST_SECTION, 
            { 
                ...this.data,
                "SECTION_ELEMENTS": SECTION_ELEMENTS
            }
        );
    }
}

export default CVSimpleListSection;