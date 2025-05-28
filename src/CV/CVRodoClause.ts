import CVSection from "./CVSection.ts"
import { TemplatePaths, TemplateService } from "./TemplateService.ts";

type CVRodoClauseData = {
    "PATTERN": string,
    "COMPANY_NAME": string
}

class CVRodoClause implements CVSection {
    private data: CVRodoClauseData;

    constructor(data: CVRodoClauseData) {
        this.data = data;
    }

    renderFromTemplate(): Promise<string> {
        const templatedPattern = TemplateService.renderFromString(
            this.data.PATTERN,
            {
                "COMPANY_NAME": this.data.COMPANY_NAME
            }
        );

        const modifiedData = {
            ...this.data,
            "PATTERN": templatedPattern,
        }
        return TemplateService.renderFromTemplate(
            TemplatePaths.RODO_CLAUSE_SECTION,
            modifiedData
        );
    }

    toJSON() {
        return {
            pattern: this.data.PATTERN,
            companyName: this.data.COMPANY_NAME
        };
    }

    toText(): string {
        const templatedPattern = TemplateService.renderFromString(
            this.data.PATTERN,
            {"COMPANY_NAME": this.data.COMPANY_NAME}
        );
        return `${templatedPattern}`
    }
}

export default CVRodoClause