class ObjectUtil {
    public static modifyByPath(path: string, value: any, object: any) {
        const pathParts = path.split(".");
        let currentRef: any = object;
        while (pathParts.length > 1) {
            currentRef = currentRef[pathParts[0]];
            if (currentRef == undefined) {
                throw new Error(`Path ${path} not found on object at ${pathParts[0]}`)
            }
            pathParts.shift();
        }
        currentRef[pathParts[0]] = value;
        return currentRef;
    }

    public static getByPath(path: string, object: any) {
        const pathParts = path.split(".");
        let currentRef: any = object;
        while (pathParts.length >= 1) {
            currentRef = currentRef[pathParts[0]];
            if (currentRef == undefined) {
                throw new Error(`Path ${path} not found on object at ${pathParts[0]}`)
            }
            pathParts.shift();
        }
        return currentRef;
    }
}

export default ObjectUtil;