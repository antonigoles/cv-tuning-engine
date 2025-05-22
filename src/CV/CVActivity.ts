import CVListSectionElements from "./CVListSectionElement.ts";

type CVActivitiesData = {
    title: string,
    subtitle: string,
    location: string,
    date: string,
    description: string
}

class CVActivity extends CVListSectionElements {
    constructor(data: CVActivitiesData) {
        super({            
            "SECTION_HEADER_LEFT_TOP": data.title,
            "SECTION_HEADER_LEFT_BOTTOM": data.subtitle,
            
            "SECTION_HEADER_RIGHT_TOP": data.location,
            "SECTION_HEADER_RIGHT_BOTTOM": data.date,

            "SECTION_DESCRIPTION": data.description
        });
    }
}

export default CVActivity;