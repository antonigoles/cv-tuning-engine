import CVSection from './CVSection.ts';
import CVSimpleListSectionElements from './CVSimpleListSectionElement.ts';
import { TemplatePaths, TemplateService } from './TemplateService.ts';

type CVSimpleListSectionData = {
    "SECTION_NAME": string,
}

class CVSimpleListSection implements CVSection {    
    private data: CVSimpleListSectionData;
    private elements: CVSimpleListSectionElements[] = [];
    
    constructor(data: CVSimpleListSectionData) {
        this.data = data;
    }
    
    toJSON(): any {
        return this.elements.map( element => element.toJSON() );
    }

    toText(): string {
        let textLines = `## ${this.data.SECTION_NAME}\n`;
        for (const element of this.elements) {
            textLines += element.toText() + "\n";
        }
        return textLines;
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