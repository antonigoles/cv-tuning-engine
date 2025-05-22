class Advert {
    private text: string;
    constructor(text: string) {
        this.text = text;
    }

    public getTextContent(): string {
        return this.text;
    }

    public static async fromPath(path: string): Promise<Advert> {
        const text = await Deno.readTextFile(path);
        return new Advert(text);
    }
}

export default Advert;