const assert = require('chai').assert;
const pegjs = require('pegjs');
const smartlexer = require('../../smartlexer.js');
const fs = require("fs");
const path = require("path")

describe('PEG.js Grammer Java', function () {
    it('Should parse Java annotation', function () {

		var dName = __dirname;
		dName = dName.replace(/\\/g,"/")
		
		var sName = path.resolve('.')
		sName = sName.replace(/\\/g,"/")
		
		dName = dName.substr(sName.length+1);
		
		const grammer = smartlexer.templateGenerate(__dirname, "templates",dName)
//		//console.log(grammer1);
//		const grammer = fs.readFileSync('.settings/my.txt', 'utf8');
        //console.log(grammer);
		var parser = pegjs.generate(grammer);

		const sourceCode = fs.readFileSync("test/pegjs/src/test1.java", "utf8");

		var ast1 = parser.parse(sourceCode);
		//console.log(JSON.stringify(ast1));

		/*fs.readFile('test/pegjs/data/java.pegjs', 'utf8' , function(err1, grammer) {
			if (err1) {
				console.error(err1)
				return
			}
			fs.readFile('test/pegjs/src/test1.java', 'utf8' , function(err, sourceCode) {
				if (err) {
					console.error(err)
					return
				}
				
				fs.readFile('test/pegjs/data/java.json', 'utf8' , function(err2, database) {
					if (err2) {
						console.error(err2)
						return
					}
					var smartlexer = require("../../smartlexer.js");
					//var smartGrammer = smartlexer.toPegJs(JSON.parse(database));
					//grammer += smartGrammer;
					var parser = pegjs.generate(grammer);
					var ast1 = parser.parse(sourceCode);
					console.log(JSON.stringify(ast1.body[0]));
					//console.log(grammer);
				});
			});
		});*/
    });
});