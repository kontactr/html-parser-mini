const parser = require("./parser/parserOne");

let p = `
<html>
    <head>
        <meta />
        <meta />
        <title>Title</title>
    </head>
    <body>
        <header id=id wq=qt hello qwerty pq='pq' qp="qp" pewe = " pewe " dg=dg pwe helloWorld={a:a,b:b,c:[1,2,3],d:f()}  >
            <span>Header Section</span>
            <span pww= "  pwww " />
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