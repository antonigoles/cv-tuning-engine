import { parseArgs } from "jsr:@std/cli/parse-args";
import ImportService from "./src/CV/ImportService.ts";
import ExportService from "./src/CV/ExportService.ts";
import Advert from "./src/Tuning/Advert.ts";
import TuningService from "./src/Tuning/TuningService.ts";

function IncorrectUsage(message: string) {
    console.error(`Incorrect usage: ${message}`);
    Deno.exit();
}

const flags = parseArgs(Deno.args, {
    string: [
        "html-from-json",
        "tune-json",
        "with-advert",
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

if (flags["tune-json"]) {
    if (!flags["out"]) {
        IncorrectUsage("--tune-json flag requires --out and --with-advert flag");
    } else {
        const importService = new ImportService();
        const exportService = new ExportService();
        const tuningService = new TuningService();
        const cv = await importService.importCVFromJSONFile(flags["tune-json"]);
        const advert = flags["with-advert"] ? await Advert.fromPath(flags["with-advert"]) : null;
        const newCV = await tuningService.tuneCV(cv, advert);
        await Deno.writeTextFile(flags["out"]+'/cv.json', JSON.stringify(newCV.toJSON(), null, 4))
        await exportService.exportHTMLFromCV(newCV, "", flags["out"]+'/cv.html');
    }
    Deno.exit();
}

console.log('Correct usage: ${executable} ${flags}')
console.log("Available flags:")
console.log("--out=<path>                       - used for commands that create some output file")
console.log("--html-from-json=<path_to_json>    - convert compatible JSON to a HTML CV (required --out flag)")
