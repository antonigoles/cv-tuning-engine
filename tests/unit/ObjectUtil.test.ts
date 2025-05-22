import { assertEquals } from "jsr:@std/assert/equals";
import ObjectUtil from "../../src/Core/ObjectUtil.ts";

const exampleObject = {
    "path1": {
        "path2": {
            "value": "example"
        }
    }
}

const exampleObject2 = {
    "path1": {
        "path2": {
            "value": [
                {
                    "test": 123
                },
                {
                    "test": 234
                }
            ]
        }
    }
}

Deno.test("Test object util", () => {
    assertEquals(
        ObjectUtil.getByPath("path1.path2.value", exampleObject),
        exampleObject["path1"]["path2"]["value"]
    );

    ObjectUtil.modifyByPath("path1.path2.value", "exampleModified", exampleObject)

    assertEquals(
        ObjectUtil.getByPath("path1.path2.value", exampleObject),
        "exampleModified"
    );
})

Deno.test("Test object util on arrays", () => {
    assertEquals(
        ObjectUtil.getByPath("path1.path2.value.0.test", exampleObject2),
        123
    );

    assertEquals(
        ObjectUtil.getByPath("path1.path2.value.1.test", exampleObject2),
        234
    );

    ObjectUtil.modifyByPath("path1.path2.value.1.test", 675, exampleObject2)


    assertEquals(
        ObjectUtil.getByPath("path1.path2.value.1.test", exampleObject2),
        675
    );
})