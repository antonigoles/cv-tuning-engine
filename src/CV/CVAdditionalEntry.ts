import CVSimpleListSectionElement from "./CVSimpleListSectionElement.ts";

type CVAdditionalEntryData = {
    title: string,
    content: string
}

class CVAdditionalEntry extends CVSimpleListSectionElement {
    constructor(data: CVAdditionalEntryData) {
        super({            
            "ELEMENT_TITLE": data.title,
            "ELEMENT_CONTENT": data.content,
        });
    }
}

export default CVAdditionalEntry;