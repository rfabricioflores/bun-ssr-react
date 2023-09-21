import { fileExtensions } from "../src/config";
import { renderFile } from "./renderFile";

interface Handler {
    (req: Request): Promise<Response> | Response;
}

export function server() {
    return SSR.instance;
}

class SSR {
    public static readonly instance = new SSR();

    private getMethods: Map<string, Handler> = new Map();
    private postMethods: Map<string, Handler> = new Map();

    private config: Map<string, any> = new Map();

    private constructor() {}

    listen(port: number = 8080, cb?: () => void) {
        const that = this;
        Bun.serve({
            port,
            async fetch(req) {
                const path = new URL(req.url).pathname;
                const method = req.method;


                switch(method) {
                    case "GET": {
                        const isValid = checkIfPathIsValidFile(path);
                        if(isValid) {
                            return renderFile("public", path)
                        } else {
                            const action = that.getMethods.get(path);
                            if(action) {
                                return action(req);
                            }
                        }
                    }
                    case "POST": {
                        const action = that.postMethods.get(path);
                        if(action) {
                            return action(req);
                        }
                    }
                    default: return new Response("Not found", { status: 404 });
                } 
            }
        });
        cb && cb();
    }

    setVar(key: string, value: any) {
        this.config.set(key, value);
    }

    getVar(key: string): any {
        return this.config.get(key);
    }

    getConfig() {}

    get(path: string, handler: Handler) {
        this.getMethods.set(path, handler)
    }

    post(path: string, handler: Handler) {
        this.postMethods.set(path, handler)
    }

}


function checkIfPathIsValidFile(pathname: string): boolean {
        const lastPath = pathname.split('/').pop();
        if(lastPath) {
            // Checks if the last path starts with "." or if it doesn't have a "." at all
            if(lastPath.indexOf('.') !==  0 || lastPath.indexOf('.') === -1) {
                // File path must have at least one dot and can not have a dot at the end
                if((lastPath.split('.').length - 1) >= 1 && !lastPath.endsWith(".")) {
                    // Finally it checks what files are allowed to render
                    let extension: boolean = false;
    
                    fileExtensions.forEach(ext => {
                        if(pathname.endsWith(ext)) {
                            extension = true;
                            return;
                        }
                    });
                
                    if(extension) return true;
                }
            }
        }

        return false;
}