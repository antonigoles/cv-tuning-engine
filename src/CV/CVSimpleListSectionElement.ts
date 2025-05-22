import Serializable from '../Serializable.ts';
import Renderable from './Renderable.ts';
import { TemplatePaths, TemplateService } from './TemplateService.ts';

type CVListSectionElementData = {
    "ELEMENT_TITLE": string,
    "ELEMENT_CONTENT": string,
}

abstract class CVSimpleListSectionElements implements Renderable, Serializable {    
    private data: CVListSectionElementData;
    
    constructor(data: CVListSectionElementData) {
        this.data = data;
    }
    
    abstract toJSON(): any;

    toText(): string {
        return `${this.data.ELEMENT_TITLE}: ${this.data.ELEMENT_CONTENT}`;
    }

    async renderFromTemplate(): Promise<string> {
        return await TemplateService.renderFromTemplate(
            TemplatePaths.SIMPLE_LIST_SECTION_ELEMENT, 
            this.data
        );
    }
}

export default CVSimpleListSectionElements;