import Env from "../Core/Env.ts";

class OllamaStreamer {
    public static async generateFromModel(model: string, prompt: string): Promise<string> {
        const response = await fetch(`${Env.getOllamaURL()}/api/generate`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            model,
            prompt,
            stream: true
            })
        });

        if (!response.body) {
            throw new Error("No response body received from server");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullOutput = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter(Boolean);

            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    const content = json.response ?? ""; // or json.message?.content
                    await Deno.stdout.write(new TextEncoder().encode(content)); // live output
                    fullOutput += content;
                } catch {
                    console.error("Error parsing line:", line);
                }
            }
        }

        return fullOutput;
    }
}

export default OllamaStreamer;