const assert = require('chai').assert;
const pegjs = require('pegjs');
const mustache = require('mustache');
const fs = require("fs");
const path = require("path")

describe('PEG.js Grammer', function () {
    it('Should parse Java annotation', function () {
    	
		const jsonData = require("../../test/pegjs/templates/Java.mustache.js").data
		var template =fs.readFileSync('test/pegjs/templates/java.mustache', 'utf8');
		const SpacesAndLines =fs.readFileSync('test/pegjs/templates/SpacesAndLines.mustache', 'utf8');
		const Comments =fs.readFileSync('test/pegjs/templates/Comments.mustache', 'utf8');
		const Unicode =fs.readFileSync('test/pegjs/templates/Unicode.mustache', 'utf8');
		const Identifier =fs.readFileSync('test/pegjs/templates/Identifier.mustache', 'utf8');
		const JavaTokens =fs.readFileSync('test/pegjs/templates/JavaTokens.mustache', 'utf8');
		
		//console.log(jsonData)
		
		var partials = {
			SpacesAndLines: SpacesAndLines,
			Comments: Comments,
			Unicode: Unicode,
			Identifier: Identifier,
			JavaTokens: JavaTokens
		};
		//, "expressions"
		var folders = ["literals", "operators", "statements", "mexpressions"];
		
		for(var x=0;x<folders.length;x++){
			var directoryPath = path.join(__dirname, 'templates/' + folders[x]);
			var label = folders[x][0].toUpperCase() + folders[x].substr(1,folders[x].length-2);
		
			console.log(directoryPath);
			console.log("======" + label + "=========");
		
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
		
		
		
		/*var directoryPath1 = path.join(__dirname, 'templates/statements');
		
		var files1 = fs.readdirSync(directoryPath1);
		
		for(var i in files1){
			var file = files1[i];
			file = file.substr(0,file.indexOf("."));
			if(i==0){
				template = template + "\r\nStatement\r\n";
				template = template + "  = " + file + "\r\n";
			}else {
				template = template + "  / " + file + "\r\n";
			}
		}
		
		
		for(var i in files1){
			var file = files1[i];
			var content = fs.readFileSync("test/pegjs/templates/statements/" + file, 'utf8');
			file = file.substr(0,file.indexOf("."));
			partials[file] = content;
			template = template + "\r\n{{> " + file + "}}\r\n";
		}
		
		
		var directoryPath2 = path.join(__dirname, 'templates/expressions');
		
		var files2 = fs.readdirSync(directoryPath2);
		
		for(var i in files2){
			var file = files2[i];
			file = file.substr(0,file.indexOf("."));
			if(i==0){
				template = template + "\r\nStatement\r\n";
				template = template + "  = " + file + "\r\n";
			}else {
				template = template + "  / " + file + "\r\n";
			}
		}
		
		
		for(var i in files2){
			var file = files2[i];
			var content = fs.readFileSync("test/pegjs/templates/expressions/" + file, 'utf8');
			file = file.substr(0,file.indexOf("."));
			partials[file] = content;
			template = template + "\r\n{{> " + file + "}}\r\n";
		}*/
		
		//console.log(template);
		
		const grammer = mustache.render(template, jsonData, partials);
		
		//console.log(mustache.render(JavaTokens, jsonData));
		
		//console.log(grammer)
		
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