import "jsr:@std/dotenv/load";

class Env {
    private static readVariableOrCrash(key: string): string {
        const variable = Deno.env.get(key);
        if (!variable) {
            throw new Error(`Uninitialized env variable \"${key}\"`);
        }
        return variable;
    }

    public static getExportsPath(): string {
        return Env.readVariableOrCrash('EXPORTS_FOLDER_PATH')
    }

    public static getAssetsPath(): string {
        return Env.readVariableOrCrash('ASSETS_FOLDER_PATH')
    }

    public static getOpenAIToken(): string {
        return Env.readVariableOrCrash('OPEN_AI_TOKEN')
    }

    public static getOllamaURL(): string {
        return Env.readVariableOrCrash('OLLAMA_URL')
    }
}

export default Env;