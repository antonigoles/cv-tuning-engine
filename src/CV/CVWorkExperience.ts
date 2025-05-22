import CVListSectionElements from "./CVListSectionElement.ts";

type CVWorkExperienceData = {
    company: string,
    jobTitle: string,
    location: string,
    date: string,
    bulletPoints: string[]
}

class CVWorkExperience extends CVListSectionElements {
    constructor(data: CVWorkExperienceData) {
        super({            
            "SECTION_HEADER_LEFT_TOP": data.company,
            "SECTION_HEADER_LEFT_BOTTOM": data.jobTitle,
            
            "SECTION_HEADER_RIGHT_TOP": data.location,
            "SECTION_HEADER_RIGHT_BOTTOM": data.date,

            "SECTION_DESCRIPTION": data
                .bulletPoints.map( bulletPoint => `<li>${bulletPoint}</li>`).join(""),
        });
    }
}

export default CVWorkExperience;