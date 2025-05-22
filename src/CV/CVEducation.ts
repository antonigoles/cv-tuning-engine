import CVListSectionElements from "./CVListSectionElement.ts";

type CVEducationData = {
    schoolName: string,
    degree: string,
    location: string,
    date: string,
    description: string
}

class CVEducation extends CVListSectionElements {
    private educationData: any;

    override toJSON(): any {
        return this.educationData;
    }

    toText(): string {
        let textLines = `${this.educationData.degree} at ${this.educationData.schoolName}\n`;
        textLines += `${this.educationData.location}\n`
        textLines += `${this.educationData.date}`
        textLines += `- ${this.educationData.description}\n`;
        return textLines;
    }

    constructor(data: CVEducationData) {
        super({            
            "SECTION_HEADER_LEFT_TOP": data.schoolName,
            "SECTION_HEADER_LEFT_BOTTOM": data.degree,
            
            "SECTION_HEADER_RIGHT_TOP": data.location,
            "SECTION_HEADER_RIGHT_BOTTOM": data.date,

            "SECTION_DESCRIPTION": data.description
        });
        this.educationData = data;
    }
}

export default CVEducation;