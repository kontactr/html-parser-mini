const parser = require("./parser/parserOne");

let p = `
<html>
    <head>
        <meta />
        <meta />
        <title>Title</title>
    </head>
    <body>
        <header id=id wq=qt hello qwerty qt='ddffff defff' dg=dg pwe / >
            <span>Header Section</span>
        </header>
        <section>
            <article>
            </article>
            <article>
            </article>
        </section>
        <section>
            <design>Design Goes Here</design>
        </section>
        <footer>
            <section>
                <span>Footer Section Goes Here</span>
            </section>
        </footer>
    </body>
</html>
`;

let parsedTree = parser.parser(p);
console.log(parsedTree);