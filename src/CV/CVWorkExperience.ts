import CVListSectionElements from "./CVListSectionElement.ts";

type CVWorkExperienceData = {
    company: string,
    jobTitle: string,
    location: string,
    date: string,
    bulletPoints: string[]
}

class CVWorkExperience extends CVListSectionElements {
    private workExperienceData: any;

    override toJSON(): any {
        return this.workExperienceData;
    }

    toText(): string {
        let textLines = `${this.workExperienceData.jobTitle} at ${this.workExperienceData.company}\n`;
        textLines += `${this.workExperienceData.location}\n`
        textLines += `${this.workExperienceData.date}`
        for (const bulletPoint of this.workExperienceData.bulletPoints) {
            textLines += `- ${bulletPoint}\n`;
        }
        return textLines;
    }

    constructor(data: CVWorkExperienceData) {
        super({            
            "SECTION_HEADER_LEFT_TOP": data.company,
            "SECTION_HEADER_LEFT_BOTTOM": data.jobTitle,
            
            "SECTION_HEADER_RIGHT_TOP": data.location,
            "SECTION_HEADER_RIGHT_BOTTOM": data.date,

            "SECTION_DESCRIPTION": data
                .bulletPoints.map( bulletPoint => `<li>${bulletPoint}</li>`).join(""),
        });
        this.workExperienceData = data;
    }
}

export default CVWorkExperience;