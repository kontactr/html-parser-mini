const parser = require("./parser/parserOne");

let p = `<html
 hello a=b c =d world w1 w2=w3 >hello world One <div baby=true hello word> parse 
< b hello q=q de f > q </html>`;

let parsedTree = parser.parser(p);
console.log(parsedTree);