import { parseArgs } from "jsr:@std/cli/parse-args";
import ImportService from "./src/CV/ImportService.ts";
import ExportService from "./src/CV/ExportService.ts";

function IncorrectUsage(message: string) {
    console.error(`Incorrect usage: ${message}`);
    Deno.exit();
}

const flags = parseArgs(Deno.args, {
    string: [
        "html-from-json",
        "out"
    ],
});

if (flags["html-from-json"]) {
    if (!flags["out"]) {
        IncorrectUsage("--out parameter is required when using --html-from-json flag");
    } else {
        const importService = new ImportService();
        const exportService = new ExportService();
        const cv = await importService.importCVFromJSONFile(flags["html-from-json"]);
        await exportService.exportHTMLFromCV(cv, "", flags["out"]);
    }
    Deno.exit();
}

console.log('Correct usage: ${executable} ${flags}')
console.log("Available flags:")
console.log("--out=<path>                       - used for commands that create some output file")
console.log("--html-from-json=<path_to_json>    - convert compatible JSON to a HTML CV (required --out flag)")
