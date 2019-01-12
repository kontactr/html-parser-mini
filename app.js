const parser = require("./parser/parserOne");

let p = `
<html>
<head q=a>
<body>
hello world
</body>
<quer />
hello world
</head>
<meta />
</html>
`;

let parsedTree = parser.parser(p);
console.log(parsedTree);