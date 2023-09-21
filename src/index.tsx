import { server } from '../lib/server';
import App from './App';
import { renderToReadableStream } from 'react-dom/server';
import Home from './components/Home';
import Contact from './components/Contact';

const app = server();

// Config
app.setVar("port", 8080);

// Routes
app.get("/", () => {
    return renderPage(<Home/>)
});

app.get("/contact", () => {
    return renderPage(<Contact/>)
});

app.listen(app.getVar("port"), () => {
    console.log(`Server running on port ${app.getVar("port")}`)
});


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
