interface Props {
    page: JSX.Element
}

export default function App({ page }: Props) {
    return (
        <html>
            <head>
                <link rel="stylesheet" href="/main.css" />
            </head>
            <body>
                <nav>
                    <a href="/">
                        <h1>My Awesome SSR</h1>
                    </a>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="/contact">Contact</a>
                        </li>
                    </ul>
                </nav>
                <main>
                    {page}
                </main>
            </body> 
        </html>
    );
}