interface Renderable {
    renderFromTemplate(): Promise<string>;
}

export default Renderable;