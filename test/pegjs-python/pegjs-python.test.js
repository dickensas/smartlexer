const assert = require('chai').assert;
const pegjs = require('pegjs');
const smartlexer = require('../../smartlexer.js');
const fs = require("fs");
const path = require("path")

describe('PEG.js Grammer Python', function () {
    it('Should parse Python', function () {
		var dName = __dirname;
		dName = dName.replace(/\\/g,"/")
		
		var sName = path.resolve('.')
		sName = sName.replace(/\\/g,"/")
		
		dName = dName.substr(sName.length+1);
		
		const grammer = smartlexer.templateGenerate(__dirname, "templates",dName)
		
		//console.log(sName);
		
		//console.log(grammer);
		
//		const grammer = mustache.render(template, jsonData, partials);
//		//console.log(grammer1);
//		const grammer = fs.readFileSync('.settings/my.txt', 'utf8');
        //console.log(grammer);
		var parser = pegjs.generate(grammer);
//		
		const sourceCode = fs.readFileSync("test/pegjs-python/src/test1.py", "utf8");
//		
		var ast1 = parser.parse(sourceCode);
		console.log(JSON.stringify(ast1));
		
		/*var targetSource = fs.readFileSync("test/pegjs-sql/aa.mustache", "utf8");
		
		ast1.isMemberExpression = function () {
			console.log(this.name)
	        return this.type === "MemberExpression";
	    };
	    
	    ast1.isSELECTStatement = function () {
	    	console.log(this.name)
	        return this.type === "SELECTStatement";
	    };
	    
	    ast1.isFROMExpression = function () {
	    	console.log(this.name)
	        return this.type === "FROMExpression";
	    };
	    
	    ast1.isWHEREExpression = function () {
	    	console.log(this.name)
	        return this.type === "WHEREExpression";
	    };
	    
	    ast1.isBinaryExpression = function () {
	    	console.log(this.name)
	        return this.type === "BinaryExpression";
	    };
		
		targetSource =  mustache.render(targetSource, ast1);
		
		console.log(targetSource)*/

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