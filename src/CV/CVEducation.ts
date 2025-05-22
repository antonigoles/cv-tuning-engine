import CVListSectionElements from "./CVListSectionElement.ts";

type CVEducationData = {
    schoolName: string,
    degree: string,
    location: string,
    date: string,
    description: string
}

class CVEducation extends CVListSectionElements {
    constructor(data: CVEducationData) {
        super({            
            "SECTION_HEADER_LEFT_TOP": data.schoolName,
            "SECTION_HEADER_LEFT_BOTTOM": data.degree,
            
            "SECTION_HEADER_RIGHT_TOP": data.location,
            "SECTION_HEADER_RIGHT_BOTTOM": data.date,

            "SECTION_DESCRIPTION": data.description
        });
    }
}

export default CVEducation;