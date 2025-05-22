import CVSimpleListSectionElement from "./CVSimpleListSectionElement.ts";

type CVAdditionalEntryData = {
    title: string,
    content: string
}

class CVAdditionalEntry extends CVSimpleListSectionElement {
    private additionalEntryData: any;

    override toJSON(): any {
        return this.additionalEntryData;
    }

    constructor(data: CVAdditionalEntryData) {
        super({            
            "ELEMENT_TITLE": data.title,
            "ELEMENT_CONTENT": data.content,
        });
        this.additionalEntryData = data;
    }
}

export default CVAdditionalEntry;