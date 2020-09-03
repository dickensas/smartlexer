var database={};
var template={};
var unranged_tokens = [];
var ranged_tokens = [];

var finalString = "";
var level = 0;
var spaces = 3;
var tabs = false;
var intendedFinalString = [];
var ansiAlias = false;
var foundFrom = false;
var queryScope = [];
var gutter = 0;
var full_obj = {};
var parsingXML = false;

function isWrapBy(key,range) {
	if (!database.wrapBy)
		return false;
	for (var i = 0; i < database.wrapBy.length; i++) {
		if (key.toLowerCase() === database.wrapBy[i].name.toLowerCase()){
			/*if(range && range.length>1 && database.wrapBy[i].skipAt){
				var prevTok = getToken(range,1).value;
				console.log(range)
				console.log("---" + prevTok);
				if(database.wrapBy[i].skipAt.indexOf(prevTok)!=-1){
					return false;
				}
			}*/
			return true;
		}
	}
	return false;
}

function isWrapAt(key) {
	if (!database.wrapAt)
		return false;
	for (var i = 0; i < database.wrapAt.length; i++) {
		//console.log(key);
		if (key && key.toLowerCase() === database.wrapAt[i].name.toLowerCase()){
			if(database.wrapAt[i].gutter==="+"){
				gutter+=spaces;
			}else if(database.wrapAt[i].gutter==="-"){
				gutter-=spaces;
			}
			return true;
		}
	}
	return false;
}

function rangeArangeTokens(tokens){
	for(var i=0;i<tokens.length;i++){
		if(tokens[i].range && tokens[i].range.length>1){
			if(!ranged_tokens[tokens[i].range[0]]) {
				ranged_tokens[tokens[i].range[0]] = {};
				if(!ranged_tokens[tokens[i].range[0]][tokens[i].range[1]]){
					ranged_tokens[tokens[i].range[0]][tokens[i].range[1]]={};
				}
				ranged_tokens[tokens[i].range[0]][tokens[i].range[1]] = tokens[i];
				ranged_tokens[tokens[i].range[0]][tokens[i].range[1]].rangeIndex = i;
			}
		}
	}
}

function mTemplate(obj, templates, emit) {
	var pattern_match = true;
	for (var i = 0; i < templates.length; i++) {
		var fr_args = templates[i].fr.args;
		var to_args = templates[i].to.args;
		pattern_match = true;

		for (var j = 0; j < fr_args.length; j++) {
			var arg_from_arr = fr_args[j].split(":");
			var arg_from_id = parseInt(arg_from_arr[0]);
			var arg_from_type = arg_from_arr[1];
			if (obj.arguments[arg_from_id - 1]) {
				if (obj.arguments[arg_from_id - 1].name
						&& isSP(arg_from_type,
								obj.arguments[arg_from_id - 1].name)
						&& arg_from_arr[2].toLowerCase() === obj.arguments[arg_from_id - 1].name
								.toLowerCase()) {
					console.log(arg_from_type + " type match " + i);
				} else if (obj.arguments[arg_from_id - 1].callee
						&& isSP(arg_from_type,
								obj.arguments[arg_from_id - 1].callee.name)
						&& arg_from_arr[2].toLowerCase() === obj.arguments[arg_from_id - 1].callee.name
								.toLowerCase()) {
					console.log(arg_from_type + " type match " + i);
				} else if (arg_from_type === "I"
						&& obj.arguments[arg_from_id - 1].name
						&& obj.arguments[arg_from_id - 1].type === "Identifier") {
					console.log("Identifier match " + i);
				} else if (arg_from_type === "L"
						&& obj.arguments[arg_from_id - 1].value
						&& obj.arguments[arg_from_id - 1].type === "Literal") {
					console.log("Literal match " + i);
				} else if (arg_from_type === "CE"
						&& obj.arguments[arg_from_id - 1].type === "CallExpression") {
					traverse(obj.arguments[arg_from_id - 1],emit);
				} else if (arg_from_type === "BE"
						&& obj.arguments[arg_from_id - 1].type === "BinaryExpression") {
					traverse(obj.arguments[arg_from_id - 1],emit);
				} else {
					pattern_match = false;
					break;
				}
			}
		}

		if (pattern_match) {
			var new_arguments = [];
			for (var j = 0; j < to_args.length; j++) {
				var arg_to_arr = to_args[j].split(":");
				var arg_to_id = parseInt(arg_to_arr[0]);
				var arg_to_type = arg_to_arr[1];
				if (obj.arguments[arg_to_id - 1] && arg_to_type === "_EXP"
						&& arg_to_arr[2] && arg_to_arr[2].length > 0) {

					try {
						if (arg_to_arr[2] === "A") {
							new_arguments
									.push(obj.arguments[arg_to_id - 1].arguments[parseInt(arg_to_arr[3]) - 1]);
						}
					} catch (e) {

					}

				} else if (obj.arguments[arg_to_id - 1]
						&& arg_to_type !== "_REM") {
					new_arguments.push(obj.arguments[arg_to_id - 1]);
				}
			}
			obj.arguments = new_arguments;
			obj.callee.name = templates[i].to.name;
			break;
		}
	}
	if (pattern_match == false) {
		// console.log(obj);
	}
	if (templates.length == 0 && obj.callee) {
		// console.log(obj);
		console.log("no templates found for " + obj.callee.name);
	}
}

function isSP(sp, key) {
	if (!database[sp])
		return false;
	for (var i = 0; i < database[sp].length; i++) {
		//console.log(database[sp][i].name.toLowerCase() === key.toLowerCase())
		if (database[sp][i].name.toLowerCase() === key.toLowerCase()) {
			return true;
		}
	}
	return false;
}

function frFound(from) {
	var templates = [];
	for (var i = 0; i < database.template.length; i++) {
		if (database.template[i].fr.name === from) {
			templates.push(database.template[i]);
		}
	}
	return templates;
}

function isGutterKeyword(name) {
	if(!database.gutter_keywords) return false;
	for (var i = 0; i < database.gutter_keywords.length; i++) {
		if (database.gutter_keywords[i].name.toLowerCase() === name
				.toLowerCase()) {
			return true;
		}
	}
	return false;
}

function doWrap(left) {
	if (left != null && left != 0) {
		intendedFinalString.push(" ".padStart(left, ' '));
	} else if(intendedFinalString.length===0){
		gutter = 0;
		intendedFinalString.push("");
	} else {
		gutter = " ".padStart(gutter, ' ').length;
		intendedFinalString.push(" ".padStart(gutter, ' '));
	}
}
function checkSpace(){
	if(intendedFinalString[intendedFinalString.length - 1]){
		var str = intendedFinalString[intendedFinalString.length - 1];
		return str[str.length-1] === ' ';
	}
	return false;
}
function indend(finalString) {
	if (intendedFinalString.length === 0) {
		doWrap();
	}
	if (!parsingXML
			&& (intendedFinalString[intendedFinalString.length - 1] + finalString).length >= database.max) {
		doWrap();
	}

	{
		var _pend = intendedFinalString[intendedFinalString.length - 1];
		if (_pend && _pend[_pend.length - 1] == ' ' && finalString[0] == ' ') {
			_pend = _pend.substr(0, _pend.length - 1);
			intendedFinalString[intendedFinalString.length - 1] = _pend;
		}
	}
	{
		var _pend = intendedFinalString[intendedFinalString.length - 1];
		if (_pend && _pend[_pend.length - 1] == '.' && finalString[0] == ' ') {
			finalString = finalString.substr(0, finalString.length - 1);
		}
	}
	intendedFinalString[intendedFinalString.length - 1] = intendedFinalString[intendedFinalString.length - 1]
			+ finalString;
}

function fakeIdentifier(token) {
	return {
		"type" : "Identifier",
		"loc" : {
			"source" : null,
			"start" : {
				"line" : -1,
				"column" : -1
			},
			"end" : {
				"line" : -1,
				"column" : -1
			}
		},
		"range" : token.range,
		"name" : token.value,
		"typeAnnotation" : null,
		"optional" : false
	};
}

function nextToken(range){
	if(!ranged_tokens[range[0]]) return;
	if(!ranged_tokens[range[0]][range[1]]) return;
	var rangeIndex = ranged_tokens[range[0]][range[1]].rangeIndex;
	if(unranged_tokens[rangeIndex+1]){
		var nextValue = unranged_tokens[rangeIndex+1].value;
		if(nextValue===";" || nextValue==="}" || nextValue===":"){
			toString(fakeIdentifier(unranged_tokens[rangeIndex+1]));
		}
	}
}

function prevToken(range){
	if(!ranged_tokens[range[0]]) return;
	if(!ranged_tokens[range[0]][range[1]]) return;
	var rangeIndex = ranged_tokens[range[0]][range[1]].rangeIndex;
	if(unranged_tokens[rangeIndex-1]){
		var prevValue = unranged_tokens[rangeIndex-1].value;
		if(prevValue==="." || prevValue==="{"){
			toString(fakeIdentifier(unranged_tokens[rangeIndex-1]));
		}
	}
}

function getToken(range,np){
	if(!ranged_tokens[range[0]]) return "";
	if(!ranged_tokens[range[0]][range[1]]) return "";
	var rangeIndex = ranged_tokens[range[0]][range[1]].rangeIndex;
	if(typeof np !== 'undefined' && np!=null && np>0)
		rangeIndex += np;
	return nextValue = unranged_tokens[rangeIndex];
}

function toString(ast, nsp) {
	if (ast.length) {
		for (var i = 0; i < ast.length; i++) {
			toString(ast[i]);
		}
	} else {
		
		if (ast.type === "CallExpression") {
			indend(ast.callee.name)
			indend("(");
			for (var j = 0; j < ast.arguments.length; j++) {
				toString(ast.arguments[j])
				if (j != ast.arguments.length - 1) {
					indend(",")
				}
			}
			indend(")");
		} //else if (ast.type === "EmptyStatement") { 
			//nextToken(ast.range,-1);
			//toString(fakeIdentifier(getToken(ast.range)));
		//} 
		else if (ast.type === "BlockStatement") {
			/*indend("{");
			if (isWrapAt("{")) {
				doWrap();
			}*/
			
			//prevToken(ast.range);
			
			toString(ast.body);
			/*if (isWrapAt("}")) {
				doWrap();
			}
			indend("}");
			if (isWrapBy("}")) {
				doWrap();
			}*/
		} else if(ast.type === "LabeledStatement"){
			toString(ast.label);
			toString(ast.body);
		} else if(ast.type === "TypeAnnotation"){
			toString(ast.typeAnnotation);
		} else if(ast.type === "GenericTypeAnnotation"){
			toString(ast.id);
		} else if(ast.type === "ClassProperty"){
			toString(ast.key);
			if(ast.typeAnnotation!=null)
			   toString(ast.typeAnnotation);
		} else if(ast.type === "ClassBody"){
			toString(ast.body);
		} else if(ast.type === "ClassDeclaration"){
			database.keywords.push({name:ast.id.name})
			indend("class ");
			toString(ast.id);
			toString(ast.body);
		} else if (ast.type === "ReturnStatement") {
			indend("return ");
			toString(ast.argument);
			//nextToken(ast.argument.range);
		} else if (ast.type === "ExpressionStatement") {
			toString(ast.expression);
		} else if (ast.type === "Literal") {
			if (ast.raw != null && !(ast.value == null && ast.raw == "null")){
				indend(ast.raw);
				nextToken(ast.range);
			}else if (ast.value != null){
				indend(ast.value);
				nextToken(ast.range);
			}
		} else if (ast.type === "ImportDeclaration") {
			indend("import ")
			for (var j = 0; j < ast.specifiers.length; j++) {
				toString(ast.specifiers[j])
				//indend(".")
			}

		} else if (ast.type === "ImportDefaultSpecifier") {
			toString(ast.local)
		}
		else if (ast.type === "Identifier") {
			if (isWrapAt(ast.name)) {
				doWrap(gutter - (ast.name.length + 1))
			}
			if (isGutterKeyword(ast.name)) {
				ast.name = ast.name.toUpperCase();
				queryScope.push(true);
			}
			{
				var _pend = intendedFinalString[intendedFinalString.length - 1];
				if (_pend
						&& _pend.indexOf(". ", _pend.length - ". ".length) !== -1) {
					_pend = _pend.substr(0, _pend.length - 1);
					intendedFinalString[intendedFinalString.length - 1] = _pend;
				}
			}
			{
				var _pend = intendedFinalString[intendedFinalString.length - 1];
				if (_pend
						&& _pend.indexOf(" .", _pend.length - " .".length) !== -1) {
					_pend = _pend.substr(0, _pend.length - 2) + ".";
					intendedFinalString[intendedFinalString.length - 1] = _pend;
				}
			}
			
			prevToken(ast.range)
			if(ast.name==="")
				indend(getToken(ast.range).value)
			else if (typeof nsp === "boolean" && nsp === true)
				indend(ast.name)
			else
				indend("" + ast.name + "")
			if(isSP("keywords",ast.name)){
				indend(" ");
			}
			if(!checkSpace() && getToken(ast.range,1).value!==".") indend(" ");
			nextToken(ast.range);
			if (isGutterKeyword(ast.name)) {
				spaces = spaces + ast.name.length + 1;
			}
			if (isWrapBy(ast.name, ast.range)) {
				doWrap()
			}
		} else if (ast.type === "UpdateExpression") {
			toString(ast.argument);
			indend(ast.operator)
		} else if (ast.type === "BinaryExpression") {
			toString(ast.left)
			indend(ast.operator)
			if (isWrapBy(ast.operator, ast.range)) {
				doWrap()
			}
			toString(ast.right)
		} else if (ast.type === "AssignmentExpression") {
			if (ansiAlias && !foundFrom) {
				toString(ast.right)
				toString(ast.left)
			} else {
				toString(ast.left)
				indend(ast.operator)
				toString(ast.right)
			}
		} else if (ast.type === "MemberExpression") {
			toString(ast.object, true)
			//indend(".")
			toString(ast.property, true)
		} else if (ast.type === "SequenceExpression") {
			for (var j = 0; j < ast.expressions.length; j++) {
				toString(ast.expressions[j])
				if (j != ast.expressions.length - 1) {
					indend(",")
					if (isWrapBy(",")) {
						doWrap()
					}
				}
			}
		}
	}
}

function traverse(ast, prev, parent, emit) {
	if (ast && ast.length) {
		for (var i = 0; i < ast.length; i++) {
			traverse(ast[i],i>0?ast[i-1]:null,null,emit);
		}
	} else {
		if (ast.type === "ExpressionStatement") {
			traverse(ast.expression,prev,ast,emit);
			if(emit){
				var _em = emit(ast.expression, prev, ast);
				if(typeof _em === 'undefined')
					console.log("WARNING: Emit did not return any value, ignoring")
				else ast.expression = _em;
			} 
		} else if (ast.type === "CallExpression") {
			var fFound = frFound(ast.callee.name);
			mTemplate(ast, fFound, emit);
			for (var j = 0; j < ast.arguments.length; j++) {
				traverse(ast.arguments[j],j>0?ast.arguments[j-1]:null,ast,emit)
			}
		} else if (ast.type === "BlockStatement") {
			traverse(ast.body,prev,ast,emit);
		} else if (ast.type === "BinaryExpression") {
			traverse(ast.left,prev,ast,emit);
			traverse(ast.right,prev,ast,emit);
		} else if (ast.type === "UpdateExpression") {
			traverse(ast.argument,prev,ast,emit);
		} else if (ast.type === "AssignmentExpression") {
			traverse(ast.left,prev,ast,emit);
			traverse(ast.right,prev,ast,emit);
		} else if (ast.type === "MemberExpression") {
			traverse(ast.object,prev,ast,emit);
			traverse(ast.property,prev,ast,emit);
		} else if (ast.type === "SequenceExpression") {
			for (var j = 0; j < ast.expressions.length; j++) {
				traverse(ast.expressions[j],j>0?ast.expressions[j-1]:null,ast,emit)
			}
		}
	}
}

var jsConnector = {
	log : function(txt) {
		javaConnector.log(txt);
	},
	setJSON : function(name, json) {
		try {
			//console.log(name)
			window[name] = JSON.parse(json);
		} catch (e) {
			console.log(e)
		}
	},
	parseToLex : function(data) {
		database = window["database"];
		template = database.template;
		datatypes = database.datatypes;
		data = stripXML(data);
		const ast = flow.parse(data,{type:true, 
			tokens:true, 
			esproposal_class_instance_fields: true, 
			esproposal_class_static_fields:true, 
			esproposal_decorators:true, 
			esproposal_optional_chaining:true, 
			types:true
		});
		full_parent_obj = JSON.parse(JSON.stringify(ast));
		full_obj = full_parent_obj.body;
		unranged_tokens = full_parent_obj.tokens;
		rangeArangeTokens(full_parent_obj.tokens);
		traverse(full_obj, function(emit_ast){
			return javaConnector.emit(emit_ast);
		});
		toString(full_obj);
		javaConnector.showLex(unstripXML(intendedFinalString.join("\n")));
	}
};

function getJsConnector() {
	console.log = jsConnector.log;
	return jsConnector;
};

function stripXML(data) {
	const regexw = /\.\*/gi;
	data = data.replace(regexw, '.__WILD__');

	if (data.indexOf("<") != -1
			&& data.indexOf("</") != -1
			&& data.indexOf(">") != -1
			&& (data.indexOf("/>") != -1 || data.indexOf("</") != -1 || data
					.indexOf("<?") != -1)) {
		// console.log(data);
		console.log("XML Detected");
		const regexns = /\b:\b/gi;
		data = data.replace(regexns, '__NS__');
		// console.log(data);

		const regexqo = /<\?/gi;
		data = data.replace(regexqo, '__TAGQO__');
		// console.log(data);

		const regexqc = /\?>/gi;
		data = data.replace(regexqc, '__TAGQC__');
		// console.log(data);

		const regexco = /<\//gi;
		data = data.replace(regexco, '__TAGCO__');
		// console.log(data);

		const regexsc = /\/>/gi;
		data = data.replace(regexsc, '__TAGSC__');
		// console.log(data);

		const regexcc = />/gi;
		data = data.replace(regexcc, '__TAGCC__');
		// console.log(data);

		const regexo = /</gi;
		data = data.replace(regexo, '__TAGO__');
		// console.log(data);

		// console.log(data);

		parsingXML = true;
	}
	return data;
}

function unstripXML(joinedStr) {

	// console.log(joinedStr);
	const regexsc = /__TAGSC__/gi;
	joinedStr = joinedStr.replace(regexsc, '/>\n');

	const regexcc = /__TAGCC__/gi;
	joinedStr = joinedStr.replace(regexcc, '>\n');

	const regexqc = /__TAGQC__/gi;
	joinedStr = joinedStr.replace(regexqc, '?>\n');

	const regexw = /__WILD__/gi;
	joinedStr = joinedStr.replace(regexw, '*');

	const regexco = /__TAGCO__/gi;
	joinedStr = joinedStr.replace(regexco, '</');

	const regexo = /__TAGO__/gi;
	joinedStr = joinedStr.replace(regexo, '<');

	const regexqo = /__TAGQO__/gi;
	joinedStr = joinedStr.replace(regexqo, '<?');

	const regexns = /__NS__/gi;
	joinedStr = joinedStr.replace(regexns, ':');

	// console.log(joinedStr);
	return joinedStr;
}
var parse = function(argdatabase, argsource, arglistener){
	console.log("parser starting");
	const fs = require("fs")
	const flow = require("flow-parser")
	database = JSON.parse(argdatabase);
	template = database.template;
	datatypes = database.datatypes;
	const ast = flow.parse(argsource,{type:true, 
		tokens:true, 
		esproposal_class_instance_fields: true, 
		esproposal_class_static_fields:true, 
		esproposal_decorators:true, 
		esproposal_optional_chaining:true, 
		types:true
	});
	//console.log(JSON.stringify(ast));
	full_parent_obj = JSON.parse(JSON.stringify(ast));
	full_obj = full_parent_obj.body;
	unranged_tokens = full_parent_obj.tokens;
	rangeArangeTokens(full_parent_obj.tokens);
	if(arglistener){
		const elis = require("./" + arglistener);
		if(elis.start) elis.start(flow,full_obj)
		traverse(full_obj, null, null, function(pAstE, pPrev, pAst){
			return elis.listener(flow, pAstE, pPrev, pAst);
		});
		if(elis.end) elis.end(flow,full_obj)
	}else{
		traverse(full_obj);
	}
	toString(full_obj);
	return intendedFinalString.join("\n");
};
module.exports.parse = parse;
if(!(typeof global.it === 'function')){
	if (typeof process === 'object') {
		if (typeof process.versions === 'object') {
			if (typeof process.versions.node !== 'undefined') {
				console.log("nodejs detected " + process.versions.node)
				const fs = require("fs")
				const databaseJson = process.argv[4]?process.argv[4]:'database.json';
				fs.readFile(databaseJson, 'utf8' , function(err1, data1) {
					if (err1) {
						console.error(err1);
						return;
					}
					if(!process.argv[2]) throw Error("please provide source file")
					
					fs.readFile(process.argv[2], 'utf8' , function(err, data) {
						if (err) {
							console.error(err);
							return;
						}
						var strP = parse(data1, data);
						console.log(strP);
					});
				});
			}
		}
	}
}

