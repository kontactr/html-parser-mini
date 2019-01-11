const parser = require("./parser/parserOne");

let p = `<html hello a=b c =d world w1 w2=w3 />`;

let parsedTree = parser.parser(p);
console.log(parsedTree);