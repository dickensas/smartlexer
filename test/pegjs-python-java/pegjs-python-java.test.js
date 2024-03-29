const assert = require('chai').assert;
const pegjs = require('pegjs');
const smartlexer = require('../../smartlexer.js');
const fs = require("fs");
const path = require("path")
const handlebars = require('handlebars');

describe('PEG.js Grammer Python To Java', function () {
    it('Should parse Python and Covert to Java', function () {
		var dName = __dirname;
		dName = dName.replace(/\\/g,"/")
		
		var sName = path.resolve('.')
		sName = sName.replace(/\\/g,"/")
		
		dName = dName.substr(sName.length+1);
		
		const grammer = smartlexer.templateGenerate(
		__dirname, "templates", dName,
		"data/python.json"
		)
		
		var parser = pegjs.generate(grammer);

		const sourceCode = smartlexer.readFileSync(fs, "test/pegjs-python-java/src/test1.py")
		
		var newSourceCode = smartlexer.bracketize(sourceCode);

		var ast1 = parser.parse(newSourceCode);

		var targetHelper = require("./java-tamplates/MainTemplate.mustache.js")
	    var targetSource = smartlexer.readFileSync(fs, "test/pegjs-python-java/java-tamplates/MainTemplate.mustache");
		for(var _p in targetHelper){
			if(typeof targetHelper[_p] == "function"){
				handlebars.registerHelper(_p,targetHelper[_p]);
			}
		}
		
		var files1 = smartlexer.readdirSync(fs, "test/pegjs-python-java/java-tamplates");
        var files = []
        for( var i =0 ;i<files1.length;i++) {
			if(path.extname(files1[i]).toLowerCase() === ".mustache" && files1[i] != "MainTemplate.mustache") {
				files.push(files1[i])
			}
		}
		
		for(var i=0; i<files.length;i++){
			var file = files[i];
			var label = file.substr(0,file.indexOf("."));
			var content = smartlexer.readFileSync(fs,"test/pegjs-python-java/java-tamplates/" + file);
			const _content = handlebars.compile(content);
			handlebars.registerPartial(label, _content)
		}
		
	    const _content = handlebars.compile(targetSource);
		var newContent = _content(ast1);
		console.log(newContent)
    });
});