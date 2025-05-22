import { TemplateService, TemplatePaths } from '../../src/CV/TemplateService.ts'
import { assertEquals } from "jsr:@std/assert";


Deno.test("template from string gets filled with data", () => {
    const result = TemplateService.renderFromString(
        "This should render {%EXAMPLE_VARIABLE%}", 
        {
            "EXAMPLE_VARIABLE": "correctly"
        }
    );
    assertEquals(result, "This should render correctly");
})

Deno.test("template from file gets loaded correctly (does not crash)", async () => {
    await TemplateService.renderFromTemplate(TemplatePaths.BASE, {});
})