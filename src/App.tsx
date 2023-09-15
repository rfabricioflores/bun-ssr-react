interface Props {
    page: JSX.Element
}

export default function App({ page }: Props) {
    return (
        <body>
            <nav>
                <h1>My Awesome SSR</h1>
                <ul>
                    <li>
                        <a href="/home">Home</a>
                    </li>
                    <li>
                        <a href="/contact">Contact</a>
                    </li>
                </ul>         
            </nav>
            {page}
        </body> 
    );
}