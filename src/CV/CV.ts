import CVSection from './CVSection.ts'
import Renderable from './Renderable.ts';
import { TemplatePaths, TemplateService } from './TemplateService.ts';

class CV implements Renderable {
    private sections: CVSection[] = [];

    constructor() {}
    
    async renderFromTemplate(): Promise<string> {
        let renderedSections: string = "";
        for (const section of this.sections) {
            renderedSections += await section.renderFromTemplate();
        }
        
        return await TemplateService.renderFromTemplate(
            TemplatePaths.BASE, 
            {
                "CV_CONTENT": renderedSections
            }
        );
    }

    public addSection(section: CVSection): void {
        this.sections.push(section);
    }

    public toJSON(): JSON {
        return JSON.parse("{}");
    }
}

export default CV;