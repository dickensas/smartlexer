const assert = require('chai').assert;
const pegjs = require('pegjs');
const smartlexer = require('../../smartlexer.js');
const fs = require("fs");
const path = require("path")
var beautify = require("json-beautify");
const handlebars = require('handlebars');

describe('FetchTOSoapUI', function () {
  it('Should parse JSON', function () {
        var dName = __dirname;
        dName = dName.replace(/\\/g,"/")
        
        var sName = path.resolve('.')
        sName = sName.replace(/\\/g,"/")
        
        dName = dName.substr(sName.length+1);
        
        const grammer = smartlexer.templateGenerate(__dirname, "templates",dName)
        
        var parser = pegjs.generate(grammer);
      
        var sourceCode = fs.readFileSync("test/fetch-to-soapui/src/test1.json", "utf8");
        
        sourceCode = sourceCode.trim();
        
        var url = sourceCode;
        url = url.substring(6)
        var firstCurl = url.indexOf('{')
        url = url.substring(0, firstCurl);
        url = url.trim();
        if(url.endsWith(","))
            url = url.substring(0,url.length-1)
        
        if(sourceCode.endsWith(";"))
            sourceCode = sourceCode.substring(0,sourceCode.length-1)
        if(sourceCode.endsWith(")"))
            sourceCode = sourceCode.substring(0,sourceCode.length-1)
        
        sourceCode = '{"url": ' 
        + url
        + ","
        + '"body":'
        + sourceCode.substring(6 + url.length+1, sourceCode.length)
        + '}';
        
        
        var ast1 = parser.parse(sourceCode);
        
        var targetHelper = require("./soapui-tamplates/MainTemplate.mustache.js")
        var targetSource = fs.readFileSync("test/fetch-to-soapui/soapui-tamplates/MainTemplate.mustache", "utf8");
        for(var _p in targetHelper){
            if(typeof targetHelper[_p] == "function"){
                handlebars.registerHelper(_p,targetHelper[_p]);
            }
        }
        
        var files = fs.readdirSync("test/fetch-to-soapui/soapui-tamplates");
        files = files.filter(function(file) {
            return path.extname(file).toLowerCase() === ".mustache" && file != "MainTemplate.mustache";
        });
        
        for(var i=0; i<files.length;i++){
            var file = files[i];
            var label = file.substr(0,file.indexOf("."));
            var content = fs.readFileSync("test/fetch-to-soapui/soapui-tamplates/" + file, 'utf8');
            const _content = handlebars.compile(content);
            handlebars.registerPartial(label, _content)
        }
        handlebars.registerHelper('qescape', function(variable) {
          return variable.replace(/(["])/g, '&quot;');
        });
        const _content = handlebars.compile(targetSource);
        var newContent = _content(ast1);
        console.log(newContent)
        
    });
});