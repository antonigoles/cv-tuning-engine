import Serializable from '../Serializable.ts';
import CVActivitiesSection from './CVActivitiesSection.ts';
import CVAdditionalSection from './CVAdditionalSection.ts';
import CVSection from './CVSection.ts'
import CVWorkSection from './CVWorkSection.ts';
import Renderable from './Renderable.ts';
import { TemplatePaths, TemplateService } from './TemplateService.ts';
import CVEducationSection from './CVEducationSection.ts';

class CV implements Renderable, Serializable {
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

    public toJSON(): any {
        const json: any = {
            workExperience: [],
            education: [],
            activities: [],
            additional: []
        };

        for (const section of this.sections) {
            const sectionAsJson = section.toJSON();
            let type = '';
            if (section instanceof CVWorkSection) type = 'workExperience';
            if (section instanceof CVEducationSection) type = 'education';
            if (section instanceof CVActivitiesSection) type = 'activities';
            if (section instanceof CVAdditionalSection) type = 'additional';
            if (type == '') {
                console.log(`Error while serializing to JSON: unexpected section type`, section)
            }
            json[type] = sectionAsJson
        }
        return json;
    }

    public toText(): string {
        let result = "";
        for (const section of this.sections) {
            result += section.toText() + "\n";
        }
        return result;
    }
}

export default CV;