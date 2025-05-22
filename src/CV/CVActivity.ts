import CVListSectionElements from "./CVListSectionElement.ts";

type CVActivitiesData = {
    title: string,
    subtitle: string,
    location: string,
    date: string,
    description: string
}

class CVActivity extends CVListSectionElements {
    private activityData: any;

    override toJSON(): any {
        return this.activityData;
    }

    toText(): string {
        let textLines = `${this.activityData.title}\n`
        textLines += `${this.activityData.subtitle}\n`;
        textLines += `${this.activityData.location}\n`
        textLines += `${this.activityData.date}`
        textLines += `- ${this.activityData.description}\n`;
        return textLines;
    }

    constructor(data: CVActivitiesData) {
        super({            
            "SECTION_HEADER_LEFT_TOP": data.title,
            "SECTION_HEADER_LEFT_BOTTOM": data.subtitle,
            
            "SECTION_HEADER_RIGHT_TOP": data.location,
            "SECTION_HEADER_RIGHT_BOTTOM": data.date,

            "SECTION_DESCRIPTION": data.description
        });
        this.activityData = data;
    }
}

export default CVActivity;