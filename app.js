const parser = require("./parser/parserOne");

let p = `
<html>
    <head>
        <meta />
        <meta />
    </head>
    <body>
        <div>
            <div>
                <br />
                <a href=ssssss>Hello World</a>
            </div>
        </div>
    </body>
</html>
`;

let parsedTree = parser.parser(p);
console.log(parsedTree);