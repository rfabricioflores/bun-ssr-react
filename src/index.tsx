import { renderToReadableStream } from 'react-dom/server';
import App from "./App";
import Home from './components/Home';
import Contact from './components/Contact';
import Error from './components/Error';

import { fileExtensions, publicFolder } from './config';

let pathname: string;

const server = Bun.serve({
    port: process.env.PORT || 8080,
    async fetch(req) {
        pathname = new URL(req.url).pathname;
        const method = req.method;

        switch(method) {
            case "GET":
                return await serve();
            default: return new Response("404 Not found", { status: 404 });
        }
    }
});

console.log(`Server running on port ${server.port}`);

async function serve() {
    
    // Serve static files
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
            
                if(extension) return await renderFile();
            }
        }
    }


    // Serves html
    return await routes();
}

async function routes() {
    switch(pathname) {
        case '/':
            return await renderPage(<Home/>);
        case '/home':
            return await renderPage(<Home/>);
        case '/contact':
            return await renderPage(<Contact/>);
        default:
            return await renderPage(<Error/>);
    }
}

async function renderPage(page: JSX.Element): Promise<Response> {
    try {
        const html = await renderToReadableStream(<App page={page}/>)

        return new Response(html, {
            headers: {"Content-Type": "text/html"},
            status: 200
        });
    } catch(e) {
        console.log(e);
        return new Response("An error ocurred, try again!", {status: 500});
    }
}


async function renderFile(): Promise<Response> {
    try {
        const file = Bun.file(`./${publicFolder}${pathname}`);

        if(await file.exists()) {
            return new Response(file, {
                headers: {"Content-Type": file.type},
                status: 200
            });
        }
        return new Response("404 Not Found", {status: 404});
    } catch(e) {
        console.log(e);
        return new Response("An error ocurred, try again!", {status: 500});
    }
}