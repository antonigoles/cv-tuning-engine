import CVListSectionElements from './CVListSectionElement.ts';
import CVSection from './CVSection.ts';
import { TemplatePaths, TemplateService } from './TemplateService.ts';

type CVListSectionData = {
    "SECTION_NAME": string,
}

class CVListSection implements CVSection {    
    private data: CVListSectionData;
    private elements: CVListSectionElements[] = [];
    
    constructor(data: CVListSectionData) {
        this.data = data;
    }

    public addElement(element: CVListSectionElements): void {
        this.elements.push(element);
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