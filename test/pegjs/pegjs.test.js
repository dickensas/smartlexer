const assert = require('chai').assert;
const pegjs = require('pegjs');
const mustache = require('mustache');
const fs = require("fs");
const path = require("path")

describe('PEG.js Grammer', function () {
    it('Should parse Java annotation', function () {
    	
		const jsonData = require("../../test/pegjs/templates/Java.mustache.js").data
		var template =fs.readFileSync('test/pegjs/templates/java.mustache', 'utf8');
		const Identifier =fs.readFileSync('test/pegjs/templates/Identifier.mustache', 'utf8');
		const JavaTokens =fs.readFileSync('test/pegjs/templates/JavaTokens.mustache', 'utf8');
		
		//console.log(jsonData)
		
		var partials = {
			Identifier: Identifier,
			JavaTokens: JavaTokens
		};
		//, "expressions"
		var folders = ["charsets", "literals", "operators", "mexpressions", "statements"];
		
		for(var x=0;x<folders.length;x++){
			var directoryPath = path.join(__dirname, 'templates/' + folders[x]);
			var label = folders[x][0].toUpperCase() + folders[x].substr(1,folders[x].length-2);
		
			var files = fs.readdirSync(directoryPath);
		
			for(var i in files){
				var file = files[i];
				file = file.substr(0,file.indexOf("."));
				if(i==0){
					template = template + "\r\n" + label + "\r\n";
					template = template + "  = " + file + "\r\n";
				}else {
					template = template + "  / " + file + "\r\n";
				}
			}
			
			
			for(var i in files){
				var file = files[i];
				var content = fs.readFileSync("test/pegjs/templates/" + folders[x] + "/" + file, 'utf8');
				file = file.substr(0,file.indexOf("."));
				partials[file] = content;
				template = template + "\r\n{{> " + file + "}}\r\n";
			}
		}

		const grammer = mustache.render(template, jsonData, partials);
		//const grammer = fs.readFileSync('test/pegjs/data/java.pegjs', 'utf8');
		//console.log(grammer);
		var parser = pegjs.generate(grammer);
		
		const sourceCode = fs.readFileSync("test/pegjs/src/test1.java", "utf8");
		
		var ast1 = parser.parse(sourceCode);
		console.log(JSON.stringify(ast1));
		
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