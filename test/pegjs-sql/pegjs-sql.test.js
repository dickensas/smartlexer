const assert = require('chai').assert;
const pegjs = require('pegjs');
const mustache = require('mustache');
const fs = require("fs");
const path = require("path")

describe('PEG.js Grammer', function () {
    it('Should parse SQL', function () {

		var template = '';

		//console.log(jsonData)
		var jsonData = {};
		var partials = {};
		//, "expressions"
		//var folders = ["charsets", "literals", "sequences", "midentifiers", "operators", "statements", "mexpressions"];
		var sourseTemplatePath = path.join(__dirname, 'templates');
		var folders = fs.readdirSync(sourseTemplatePath);
		
		var inc = 0;
		for(var x=0;x<folders.length;x++){
			var directoryPath = path.join(__dirname, 'templates/' + folders[x]);
			var label = folders[x].substr(5);
			label = label[0].toUpperCase() + label.substr(1,label.length-2);

			var files = fs.readdirSync(directoryPath);
			files = files.filter(function(file) {
			    return path.extname(file).toLowerCase() === ".mustache";
			});
			inc = 0;

			for(var i=0; i<files.length;i++){
				var file = files[i];
				var localData = {};
				try{
					var _ldata = require("../../test/pegjs-sql/templates/"+ folders[x] + "/" + file + ".js");
					if(_ldata.data) localData = _ldata.data;
				}catch(ex){}
				var content = fs.readFileSync("test/pegjs-sql/templates/" + folders[x] + "/" + file, 'utf8');
				content = mustache.render(content, localData);
				file = file.substr(0,file.indexOf("."));
			    file = file.substr(5);
			    //console.log(file);
				partials[file] = content;
				template = template + "\r\n{{> " + file + "}}\r\n";
			}

			for(var i in files){
				var file = files[i];
				if(file.toLowerCase().endsWith('.js')) continue
//				var oldfile = file;
				file = file.substr(0,file.indexOf("."));
				file = file.substr(5);
//				if(file.indexOf("_")==-1){
//					console.log((inc+"").padStart(4,"0")+"_"+file)
//					file = (inc+"").padStart(4,"0")+"_"+file;
//					inc++;
//					fs.renameSync("test/pegjs/templates/" + folders[x] + "/" +oldfile, "test/pegjs/templates/" + folders[x] + "/" + file);
//				}
				
				if(i==0){
					template = template + "\r\n" + label + "\r\n";
					template = template + "  = " + file + "\r\n";
				}else {
					template = template + "  / " + file + "\r\n";
				}
			}
		}

		const grammer = mustache.render(template, jsonData, partials);
//		//console.log(grammer1);
//		const grammer = fs.readFileSync('.settings/my.txt', 'utf8');
        console.log(grammer);
		var parser = pegjs.generate(grammer);
//		
		const sourceCode = fs.readFileSync("test/pegjs-sql/src/test1.sql", "utf8");
//		
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