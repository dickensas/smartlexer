var assert = require('chai').assert;
var pegjs = require('pegjs');
var mustache = require('mustache');
describe('PEG.js Grammer', function () {
    it('Should parse Java annotation', function () {
    	const fs = require("fs")
		/*const jsonData = require("../../test/pegjs/templates/VariableStatement.mustache.js").data
		fs.readFile('test/pegjs/templates/VariableStatement.mustache', 'utf8' , function(err1, template) {
			if (err1) {
				console.error(err1)
				return
			}
			console.log(jsonData)
			
			console.log(mustache.render(template, jsonData));
		});*/
		fs.readFile('test/pegjs/data/java.pegjs', 'utf8' , function(err1, grammer) {
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
		});
    });
});