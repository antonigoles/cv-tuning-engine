import Renderable from './Renderable.ts';
import { TemplatePaths, TemplateService } from './TemplateService.ts';

type CVListSectionElementData = {
    "ELEMENT_TITLE": string,
    "ELEMENT_CONTENT": string,
}

class CVSimpleListSectionElements implements Renderable {    
    private data: CVListSectionElementData;
    
    constructor(data: CVListSectionElementData) {
        this.data = data;
    }
    
    async renderFromTemplate(): Promise<string> {
        return await TemplateService.renderFromTemplate(
            TemplatePaths.SIMPLE_LIST_SECTION_ELEMENT, 
            this.data
        );
    }
}

export default CVSimpleListSectionElements;