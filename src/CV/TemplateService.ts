import Env from "../Core/Env.ts";

const TEMPLATE_PATH= `${Env.getAssetsPath()}/template`

class TemplatePaths {
    public static BASE: string 
    = `${TEMPLATE_PATH}/base.template.html`;
    

    public static LIST_SECTION: string
     = `${TEMPLATE_PATH}/list-section/list-section.template.html`;
    
    public static LIST_SECTION_ELEMENT: string
     = `${TEMPLATE_PATH}/list-section/list-section-element.template.html`;
    

    public static SIMPLE_LIST_SECTION: string 
    = `${TEMPLATE_PATH}/simple-list-section/simple-list-section.template.html`;
    
    public static SIMPLE_LIST_SECTION_ELEMENT: string 
    = `${TEMPLATE_PATH}/simple-list-section/simple-list-section-element.template.html`;

    public static RODO_CLAUSE_SECTION: string
    = `${TEMPLATE_PATH}/rodo-clause.template.html`
}

type TempalteVariables = { [key: string]: string }

class TemplateService {
    public static renderFromString(template: string, data: TempalteVariables): string {
        for (const variable in data) {
            template = template.replaceAll(`{%${variable}%}`, data[variable])
        }
        return template;
    }

    public static async renderFromTemplate(
        path: string, 
        data: TempalteVariables
    ): Promise<string> {
        const template = await Deno.readTextFile(path);
        return TemplateService.renderFromString(template, data);
    }
}

export { TemplateService, TemplatePaths }