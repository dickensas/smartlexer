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
		
		const grammer = smartlexer.templateGenerate(__dirname, "templates",dName)
		
		//console.log(sName);
		
		//console.log(grammer);
		
//		const grammer = mustache.render(template, jsonData, partials);
//		//console.log(grammer1);
//		const grammer = fs.readFileSync('.settings/my.txt', 'utf8');
        //console.log(grammer);
		var parser = pegjs.generate(grammer);
//		
		const sourceCode = fs.readFileSync("test/pegjs-python-java/src/test1.py", "utf8")
		
		function countSpace(current){
			var spaceCount = 0;
			for(var i=0;i<current.length;i++){
				if(current[i] === ' ') spaceCount++
				else if(current[i] === '\t') spaceCount+=2
				else break
			}
			return spaceCount
		}
		
		function startsWith(str, key){
			if(str.indexOf(key)==-1) return false
			
			var firstIndex = str.indexOf(key)
			
			var chars = 0
			var tabs = 0
			var index = 0
			for(var i=0;i<firstIndex;i++){
				if(str[i] === ' ') chars++
				else if(str[i] === '\t') tabs++
				else return false
				index++
			}
			
			return {
				chars: chars,
				index: index,
				tabs: tabs,
				key: key
			}
		}
		
		var numOpens = 0;
		
		function openBracket(current, key){
			var _class = startsWith(current, key)
			if(_class.constructor === Object){
				var colonIndex = current.indexOf(":")
				if(colonIndex!=-1){
					if(current.length>colonIndex+1){
						current = current.substr(0,colonIndex+1) + "{" + current.substr(colonIndex+1)
						numOpens++
					}else{
						current = current + "{"
						numOpens++
					}
				}
			}
			//console.log(current)
			return current
		}
//		
		var prevSpace = 0;
		const sourceArray = sourceCode.split("\n")
		for(var i=0;i<sourceArray.length;i++) {
			var current = sourceArray[i]
			
			var _current = current;
			_current = _current.replace(/\s/ig,"")
			_current = _current.replace(/\t/ig,"")
			if(_current.length>0) {
				var spaces = countSpace(current);
				//console.log((_current.length>0) + "  " + spaces + "  " + prevSpace + " " + numOpens + " " + current )
				if(spaces<prevSpace && numOpens>0){
					var prevIndent = prevSpace/2
					var curIndent = spaces/2
					//console.log("prevIndent: " + prevIndent)
					//console.log("curIndent: " + curIndent)
					var x = prevIndent;
					while(x>curIndent && numOpens>=0){
						
						//console.log(sourceArray[i-1])
						//console.log(numOpens)
						sourceArray[i-1] = sourceArray[i-1] +  "\n" + (numOpens==0?"": (" ".padStart(curIndent*2))) + "}"
						x--
						numOpens--
					}
				}
				else if(spaces==0 && numOpens>0){
					while(numOpens>0){
						sourceArray[i-1]= sourceArray[i-1] +  "\n" + (numOpens==0?"": (" ".padStart(curIndent*2))) + "}"
						numOpens--
					}
				}
				
				current = openBracket(current, "class ");
				current = openBracket(current, "def ");
				current = openBracket(current, "for ");
				current = openBracket(current, "while ");
				current = openBracket(current, "if ");
				current = openBracket(current, "elif ");
				current = openBracket(current, "else");
				
				sourceArray[i] = current;
				prevSpace = spaces
			}
			//console.log(sourceArray[i])
		}
		
		
		
		for(var i=0;i<sourceArray.length;i++) {
			//console.log(sourceArray[i])
		}
		
		var newSourceCode = sourceArray.join("\n")
		
		while(numOpens>0){
			newSourceCode = newSourceCode + "}"
			numOpens--
		}
		
		//console.log(newSourceCode)
		//console.log("generating AST")
		var ast1 = parser.parse(newSourceCode);
		//console.log(JSON.stringify(ast1));
		var targetHelper = require("./java-tamplates/MainTemplate.mustache.js")
	    var targetSource = fs.readFileSync("test/pegjs-python-java/java-tamplates/MainTemplate.mustache", "utf8");
		for(var _p in targetHelper){
			if(typeof targetHelper[_p] == "function"){
				handlebars.registerHelper(_p,targetHelper[_p]);
			}
		}
		
		var files = fs.readdirSync("test/pegjs-python-java/java-tamplates");
		files = files.filter(function(file) {
		    return path.extname(file).toLowerCase() === ".mustache" && file != "MainTemplate.mustache";
		});
		
		for(var i=0; i<files.length;i++){
			var file = files[i];
			var label = file.substr(0,file.indexOf("."));
			var content = fs.readFileSync("test/pegjs-python-java/java-tamplates/" + file, 'utf8');
			const _content = handlebars.compile(content);
			handlebars.registerPartial(label, _content)
		}
		
	    const _content = handlebars.compile(targetSource);
		var newContent = _content(ast1);
		console.log(newContent)
	    
		/*ast1.isMemberExpression = function () {
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