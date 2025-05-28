import Serializable from '../Serializable.ts';
import CVActivitiesSection from './CVActivitiesSection.ts';
import CVAdditionalSection from './CVAdditionalSection.ts';
import CVSection from './CVSection.ts'
import CVWorkSection from './CVWorkSection.ts';
import Renderable from './Renderable.ts';
import { TemplatePaths, TemplateService } from './TemplateService.ts';
import CVEducationSection from './CVEducationSection.ts';
import CVRodoClause from './CVRodoClause.ts';

class CV implements Renderable, Serializable {
    private sections: CVSection[] = [];

    constructor(
        private name: string,
        private lastName: string,
        private location: string,
        private phone: string,
        private email: string,
        private summary: string = ""
    ) {}
    
    async renderFromTemplate(): Promise<string> {
        let renderedSections: string = "";
        for (const section of this.sections) {
            renderedSections += await section.renderFromTemplate();
        }
        
        return await TemplateService.renderFromTemplate(
            TemplatePaths.BASE, 
            {
                "NAME": this.name,
                "LAST_NAME": this.lastName,
                "LOCATION": this.location,
                "PHONE": this.phone,
                "EMAIL": this.email,
                "CV_SUMMARY": this.summary, 
                "CV_CONTENT": renderedSections
            }
        );
    }

    public addSection(section: CVSection): void {
        this.sections.push(section);
    }

    public toJSON(): any {
        const json: any = {
            name: this.name,
            lastName: this.lastName,
            location: this.location,
            phone: this.phone,
            email: this.email,
            summary: this.summary,
            workExperience: [],
            education: [],
            activities: [],
            additional: [],
        };

        for (const section of this.sections) {
            const sectionAsJson = section.toJSON();
            let type = '';
            if (section instanceof CVWorkSection) type = 'workExperience';
            if (section instanceof CVEducationSection) type = 'education';
            if (section instanceof CVActivitiesSection) type = 'activities';
            if (section instanceof CVAdditionalSection) type = 'additional';
            if (section instanceof CVRodoClause) type = 'RODOClause';
            if (type == '') {
                console.log(`Error while serializing to JSON: unexpected section type`, section)
            }
            json[type] = sectionAsJson
        }
        return json;
    }

    public toText(): string {
        let result = `${this.name} ${this.lastName}\n`
        result += `${this.location} | ${this.phone} | ${this.email}\n\n`
        result += this.summary + "\n\n";
        for (const section of this.sections) {
            result += section.toText() + "\n";
        }
        return result;
    }
}

export default CV;