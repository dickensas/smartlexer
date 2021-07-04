const assert = require('chai').assert;
const pegjs = require('pegjs');
const smartlexer = require('../../smartlexer.js');
const fs = require("fs");
const path = require("path")
var beautify = require("json-beautify");

describe('PEG.js Grammer SQL', function () {
    it('Should parse SQL', function () {
		var dName = __dirname;
		dName = dName.replace(/\\/g,"/")
		
		var sName = path.resolve('.')
		sName = sName.replace(/\\/g,"/")
		
		dName = dName.substr(sName.length+1);
		
		const grammer = smartlexer.templateGenerate(__dirname, "templates", dName)
		const sourceCode = fs.readFileSync("test/pegjs-sql/src/test1.sql", "utf8");
		const outSource = smartlexer.parsePeg(sourceCode, grammer, "{}");
		console.log(outSource);
    });
});