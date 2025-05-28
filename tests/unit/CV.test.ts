import { assertEquals } from "jsr:@std/assert/equals";
import Env from "../../src/Core/Env.ts";
import CV from "../../src/CV/CV.ts";
import ImportService from "../../src/CV/ImportService.ts";
import { expect } from "jsr:@std/expect";
import { assertNotEquals } from "jsr:@std/assert/not-equals";
import CVFactory from "../../src/CV/CVFactory.ts";

let cvFromFile: CV;
let cvFromFileAsJSON: any;

Deno.test("Load CV, Convert to JSON and test if conversion was correct", async (test) => {
    await test.step("1. Load CV from example file in assets", async () => {
        const importService = new ImportService();
        cvFromFile = await importService.importCVFromJSONFile(`${Env.getAssetsPath()}/my_base_cv.json`);
    })

    await test.step("2. Convert CV back to JSON and check if it crashes", async () => {
        cvFromFileAsJSON = cvFromFile.toJSON();

        expect(cvFromFileAsJSON).toHaveProperty('workExperience');
        expect(cvFromFileAsJSON.workExperience).toHaveLength(3);

        expect(cvFromFileAsJSON).toHaveProperty('education');
        expect(cvFromFileAsJSON.education).toHaveLength(1);

        expect(cvFromFileAsJSON).toHaveProperty('activities');
        expect(cvFromFileAsJSON.activities).toHaveLength(1);

        expect(cvFromFileAsJSON).toHaveProperty('additional');
        expect(cvFromFileAsJSON.additional).toHaveLength(4);
    })

    await test.step("3. Compare loaded CV to original data", async () => {
        const ogJSON: any = JSON.parse(await Deno.readTextFile(`${Env.getAssetsPath()}/my_base_cv.json`));
        assertEquals(ogJSON, cvFromFileAsJSON);
    })
})

Deno.test("Test empty CV to JSON conversion", () => {
    const cv = CVFactory.fromJSON({});
    const cvAsJSON = cv.toJSON();
    assertNotEquals(cvAsJSON, null);
})


Deno.test("Test  CV to Text conversion", () => {
    const cvAsText = cvFromFile.toText();
    console.log(cvAsText)
    assertNotEquals(cvAsText, null);
})