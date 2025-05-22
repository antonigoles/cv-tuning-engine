import Renderable from './Renderable.ts';
import { TemplatePaths, TemplateService } from './TemplateService.ts';

type CVListSectionElementData = {
    "SECTION_HEADER_LEFT_TOP": string,
    "SECTION_HEADER_LEFT_BOTTOM": string,
    "SECTION_HEADER_RIGHT_TOP": string,
    "SECTION_HEADER_RIGHT_BOTTOM": string,
    "SECTION_DESCRIPTION": string
}

class CVListSectionElements implements Renderable {    
    private data: CVListSectionElementData;
    
    constructor(data: CVListSectionElementData) {
        this.data = data;
    }
    
    async renderFromTemplate(): Promise<string> {
        return await TemplateService.renderFromTemplate(
            TemplatePaths.LIST_SECTION_ELEMENT, 
            this.data
        );
    }
}

export default CVListSectionElements;