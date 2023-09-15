import { renderToReadableStream } from 'react-dom/server';
import App from "./App";
import Home from './components/Home';
import Contact from './components/Contact';
import Error from './components/Error';

const server = Bun.serve({
    port: 8080,
    async fetch(req) {
        if(req.method === "GET") {
            const path = new URL(req.url).pathname;
            console.log(path)

            switch(path) {
                case '/':
                    return await render(<Home/>);
                case '/home':
                    return await render(<Home/>);
                case '/contact':
                    return await render(<Contact/>);
                default:
                    return await render(<Error/>);
            }
        }

        return new Response("404 not found")
    }
});

async function render(page: JSX.Element): Promise<Response> {
    const html = await renderToReadableStream(<App page={page}/>)

    return new Response(html, {
        headers: {"Content-Type": "text/html"}
    })
}

console.log(`Listening on port ${server.port}`);