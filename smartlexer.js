var database={};
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
			if(database.wrapBy[i].gutter==="+"){
				gutter+=spaces;
			}else if(database.wrapBy[i].gutter==="-"){
				gutter-=spaces;
			}
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
	if(!database.template) return [];
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
		if (_pend && _pend[_pend.length - 1] == ' ' && finalString && finalString[0] == ' ') {
			_pend = _pend.substr(0, _pend.length - 1);
			intendedFinalString[intendedFinalString.length - 1] = _pend;
		}
	}
	{
		var _pend = intendedFinalString[intendedFinalString.length - 1];
		if (_pend && _pend[_pend.length - 1] == '.' && finalString && finalString[0] == ' ') {
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
		"fake" : true,
		"range" : typeof token === "string"? [-1, -1]:token.range,
		"name" : typeof token === "string"? token: token.value,
		"typeAnnotation" : null,
		"optional" : false
	};
}

function nextToken(range,ctx){
	if(!ranged_tokens[range[0]]) return;
	if(!ranged_tokens[range[0]][range[1]]) return;
	var rangeIndex = ranged_tokens[range[0]][range[1]].rangeIndex;
	if(unranged_tokens[rangeIndex+1]){
		var nextValue = unranged_tokens[rangeIndex+1].value;
		if(nextValue===";" || nextValue==="}" || nextValue===":" || nextValue==="]" || nextValue===")"){
			toString(fakeIdentifier(unranged_tokens[rangeIndex+1]),ctx);
		}
	}
}

function prevToken(range,ctx){
	if(!ranged_tokens[range[0]]) return;
	if(!ranged_tokens[range[0]][range[1]]) return;
	var rangeIndex = ranged_tokens[range[0]][range[1]].rangeIndex;
	if(unranged_tokens[rangeIndex-1]){
		var prevValue = unranged_tokens[rangeIndex-1].value;
		if(prevValue==="." || prevValue==="{" || prevValue==="[" || prevValue==="(" || prevValue==="@"){
			toString(fakeIdentifier(unranged_tokens[rangeIndex-1]),ctx);
		}
	}
}

function getToken(range,np){
	if(!ranged_tokens[range[0]]) return "";
	if(!ranged_tokens[range[0]][range[1]]) return "";
	var rangeIndex = ranged_tokens[range[0]][range[1]].rangeIndex;
	if(typeof np !== 'undefined' && np!=null && np!=0)
		rangeIndex += np;
	return nextValue = unranged_tokens[rangeIndex];
}

function isOneOf(arr, name){
	if(!arr) return false;
	for(var i=0;i<arr.length;i++){
		if(arr[i].name.toLowerCase()===name.toLowerCase()){
			return true;
		}
	}
	return false;
}

function toString(ast, ctx, noScan) {
	if (ast.length) {
		for (var i = 0; i < ast.length; i++) {
			toString(ast[i],ctx,noScan);
		}
	} else {
		
		if (ast.type === "CallExpression") {
			indend(ast.callee.name)
			indend("(");
			for (var j = 0; j < ast.arguments.length; j++) {
				toString(ast.arguments[j],ctx,true)
				if (j != ast.arguments.length - 1) {
					indend(",")
				}
			}
			indend(")");
		} else if(ast.type === "ForStatement"){
			var _for = fakeIdentifier("for");
			toString(_for,_for,noScan);
			toString(ast.init,_for,noScan);
			toString(ast.test,_for,noScan);
			toString(ast.update,_for,noScan);
			toString(ast.body,null,noScan);
		} else if(ast.type === "FunctionExpression"){
			toString(ast.params,ctx,noScan);
			toString(ast.body,ctx,noScan);
		} else if(ast.type === "Decorator"){
			toString(ast.expression,ctx,noScan);
		} else if(ast.type === "MethodDefinition"){
			toString(ast.key,ctx,noScan);
			toString(ast.decorators,ctx,noScan);
			toString(ast.value,ctx,noScan);
		} else if(ast.type === "BlockStatement") {
			toString(ast.body,ctx,noScan);
		} else if(ast.type === "LabeledStatement"){
			toString(ast.label,ctx,noScan);
			toString(ast.body,ctx,noScan);
		} else if(ast.type === "TypeAnnotation"){
			toString(ast.typeAnnotation,ctx,noScan);
		} else if(ast.type === "GenericTypeAnnotation"){
			toString(ast.id,ctx,noScan);
		} else if(ast.type === "ClassProperty"){
			toString(ast.key,ctx,noScan);
			if(ast.typeAnnotation!=null)
			   toString(ast.typeAnnotation,ctx,noScan);
		} else if(ast.type === "ClassBody"){
			toString(ast.body,ctx);
		} else if(ast.type === "ClassDeclaration"){
			database.keywords && database.keywords.push({name:ast.id.name})
			indend("class ");
			toString(ast.id,ctx,noScan);
			toString(ast.body,ctx,noScan);
		} else if (ast.type === "ReturnStatement") {
			indend("return ");
			toString(ast.argument,ctx,noScan);
		} else if (ast.type === "ExpressionStatement") {
			toString(ast.expression,ctx,noScan);
		} else if (ast.type === "Literal") {
			if (ast.raw != null && !(ast.value == null && ast.raw == "null")){
				if(!noScan)prevToken(ast.range,ctx,noScan);
				indend(ast.raw);
				if(!noScan)nextToken(ast.range,ctx,noScan);
			}else if (ast.value != null){
				if(!noScan)prevToken(ast.range,ctx,noScan);
				indend(ast.value);
				if(!noScan)nextToken(ast.range,ctx,noScan);
			}
		} else if (ast.type === "ImportDeclaration") {
			indend("import ")
			for (var j = 0; j < ast.specifiers.length; j++) {
				toString(ast.specifiers[j],ctx,noScan)
				//indend(".")
			}

		} else if (ast.type === "ImportDefaultSpecifier") {
			toString(ast.local,ctx,noScan)
		} else if (ast.type === "ThisExpression") {
			toString(fakeIdentifier(getToken(ast.range)),ctx,noScan)
		} else if (ast.type === "Identifier") {
			if(ast.prefixAttribute) toString(ast.prefixAttribute,ctx,noScan)
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
			
			prevToken(ast.range,ctx)
			if(ast.name==="")
				indend(getToken(ast.range).value)
			else
				indend(ast.name)
			if(isSP("keywords",ast.name)){
				indend(" ");
			}
			if(!checkSpace() && database.noSpace){
				if(database.noSpace.indexOf(getToken(ast.range,1).value)!=-1){
					indend(" ");
				}	
			}else if(!checkSpace()){
				indend(" ");
			}
			//if(ast.fake!==true)
			nextToken(ast.range,ctx);
			if (isGutterKeyword(ast.name)) {
				gutter = gutter + ast.name.length + 1;
			}
			if (isWrapBy(ast.name, ast.range)) {
				if(typeof database.noWrapContext === "undefined" || database.noWrapContext === null)
					doWrap()
				else if(typeof ctx !== "undefined" && ctx!==null && isOneOf(database.noWrapContext,ctx.name)){
					//don't wrap
				}else
					doWrap()
			}
		} else if (ast.type === "UpdateExpression") {
			if(ast.prefix === true){
				indend(ast.operator)
				toString(ast.argument,ctx,noScan)
			}else{
				toString(ast.argument,ctx,noScan)
				indend(ast.operator)
			}
		} else if (ast.type === "BinaryExpression") {
			toString(ast.left,ctx,noScan)
			indend(ast.operator)
			if (isWrapBy(ast.operator, ast.range)) {
				doWrap()
			}
			toString(ast.right,ctx)
		} else if (ast.type === "AssignmentExpression") {
			//if (ansiAlias && !foundFrom) {
				//toString(ast.right,ctx)
				//toString(ast.left,ctx)
			//} else {
				if(ast.left.value===null && ast.left.type=="Literal" && getToken(ast.left.range).value===ast.operator){
					toString(fakeIdentifier(getToken(ast.left.range,-1)),ctx,noScan)
				}else{
					toString(ast.left,ctx,noScan)
				}
				indend(ast.operator)
				toString(ast.right,ctx,noScan)
			//}
		} else if (ast.type === "MemberExpression") {
			toString(ast.object,ctx,noScan)
			toString(ast.property,ctx,noScan)
		} else if (ast.type === "SequenceExpression") {
			for (var j = 0; j < ast.expressions.length; j++) {
				toString(ast.expressions[j],ctx,noScan)
				if (j != ast.expressions.length - 1) {
					indend(",")
					if (isWrapBy(",")) {
						doWrap()
					}
				}
			}
		} else if(ast.range && !ast.name && ast.type && ast.range!="EmptyStatement"){
			/*if(getToken(ast.range)){
				toString(fakeIdentifier(getToken(ast.range)));
			}*/
		} else {
			/*for(var _p in ast){
				console.log(ast[_p])
				if(ast[_p] && ast[_p].range && ast[_p].type){
					toString(ast[_p])
				}
			}*/
		}
	}
}

var addedTokens = [];
var symbols = [";",",","{","}","[","]","\\","/","|","@","#","$","%","^","&","*","(",")","-",".","?",">","<","`","~","!"];
function findPrefixMissingToken(r) {
	var missings = [];
	if(addedTokens.length>2){
		var rIndex = getToken(r).rangeIndex;
		tokenLoop:
		for(var k=rIndex;k>rIndex-2;k--){
			var psToken = unranged_tokens[k];
			if(symbols.indexOf(psToken.value)!=-1) continue
			for(var j=addedTokens.length;j>addedTokens.length-2;j--){
				if(addedTokens[j]){
					var v = getToken(addedTokens[j]);
					if(!(addedTokens[j][0]===psToken.range[0] && addedTokens[j][1]===psToken.range[1])){
						//console.log("Missing parent token: " + psoToken.value)
						missings.push({"token": psToken});
						break tokenLoop;
					}
				}
			}
		}
	}
	return missings;
}
function isExists(r, arg_parent){
	if(arg_parent!=null && arg_parent.constructor === Array){
		for(var i=0;i<arg_parent.length;i++){
			if(arg_parent[i].type && arg_parent[i].range){
				isExists(r,arg_parent[i])
			}
		}
	}else if(arg_parent!=null && (arg_parent.type==="Identifier" || arg_parent.type==="Literal")){
		if(r[0]===arg_parent.range[0] && r[1]===arg_parent.range[1]){
			return true;
		}
	}else if(arg_parent!=null && arg_parent.type && arg_parent.range){
		for(var prop in arg_parent){
			if(arg_parent[prop].type && arg_parent[prop].range){
				isExists(r,arg_parent[prop])
			}
		}
	}
	return false;
}
function findSuffixMissingToken(r, arg_parent) {
	var missings = [];
	if(addedTokens.length>2){
		var rIndex = getToken(r).rangeIndex;
		tokenLoop:
		for(var k=rIndex;k<rIndex+2;k++){
			var nxToken = unranged_tokens[k];
			if(symbols.indexOf(nxToken.value)!=-1) continue
			if(!isExists(nxToken.range, arg_parent)){
				console.log("Found missing token " + nxToken.value)
				missings.push({"token":nxToken});
				break tokenLoop;
			}
		}
	}
	return missings;
}
function addSuffixMissing(missings, arg_parent, arg_prop, inc){
	
	if(typeof arg_prop !== "undefined" && typeof inc !== "undefined" && typeof arg_parent !== "undefined") {
		var arr_prop = arg_parent[arg_prop];
		
		if(missings && missings.length>0 && arr_prop && arr_prop!=null && arr_prop.constructor === Array){
			var copy_arr_prop = [];
			
			for(var j=0;j<arr_prop.length;j++){
				copy_arr_prop.push(arr_prop[j])
			}
			
			copy_arr_prop.push({
				"type" : "Identifier",
				"loc" : missings[0].token.loc,
				"range" : missings[0].token.range,
				"name" : missings[0].token.value,
				"typeAnnotation" : null,
				"optional" : false
			});
			
			
			arg_parent[arg_prop] = copy_arr_prop;
		}
	}
}

function addPrefixMissing(missings, arg_parent, arg_prop, inc){
	if(typeof arg_prop !== "undefined" && typeof inc !== "undefined" && typeof arg_parent !== "undefined") {
		var arr_prop = arg_parent[arg_prop];
		if(missings && missings.length>0 && arr_prop && arr_prop!=null && arr_prop.constructor === Array){
			var copy_arr_prop = [];
			for(var j=0;j<arr_prop.length;j++){
				/*if(j===inc) copy_arr_prop.push({
					"type" : "Identifier",
					"loc" : missings[0].token.loc,
					"range" : missings[0].token.range,
					"name" : missings[0].token.value,
					"typeAnnotation" : null,
					"optional" : false
				})*/
				if(j==inc){
					arr_prop[j].prefixAttribute = {
						"type" : "Identifier",
						"loc" : missings[0].token.loc,
						"range" : missings[0].token.range,
						"name" : missings[0].token.value,
						"typeAnnotation" : null,
						"optional" : false
					}
				}
				copy_arr_prop.push(arr_prop[j])
			}
			arg_parent[arg_prop] = copy_arr_prop;
		}
	}
}
function fixMissingTokens(full_obj, arg_parent, arg_prop, inc) {
	if (full_obj!=null && full_obj.constructor === Array) {
		for (var i = 0; i < full_obj.length; i++) {
			//console.log(i + " " + full_obj[i].type + " " + full_obj[i].name + " " + full_obj[i].value)
			fixMissingTokens(full_obj[i], arg_parent, arg_prop, i)
		}
		var missings = findSuffixMissingToken(full_obj[full_obj.length-1].range, full_obj[full_obj.length-1]);
		
		addSuffixMissing(missings, arg_parent, arg_prop, full_obj.length-1);
	} else {
		if(full_obj!=null){
			if(full_obj.type==="Identifier" || full_obj.type==="Literal"){
				var r = full_obj.range
				addedTokens.push(r);
				//if(full_obj.name == "gear" || full_obj.value=="gear"){
					var missings = findPrefixMissingToken(r);
					if(missings.length>0){
						addedTokens.push(missings[0].token.range);
						//if(arg_prop) console.log("property is: " + arg_prop)
						//console.log("Gear .......");
						addPrefixMissing(missings, arg_parent, arg_prop, inc)
						//console.log(full_obj);
					}
				//}
			}else{
				for(var prop in full_obj){
					/*if(full_obj[prop]!=null && full_obj[prop].length)
						fixMissingTokens(full_obj[prop])
					else if(full_obj[prop]!=null && full_obj[prop].range && full_obj[prop].type && full_obj[prop].type!=="Identifier"  && full_obj[prop].type!=="Literal"){
						console.log(full_obj[prop].range)
						fixMissingTokens(full_obj[prop])
					}
					else*/ 
					if(full_obj[prop]!=null && full_obj[prop].constructor === Array && full_obj[prop].length>0 && full_obj[prop][0].type){
						//console.log(prop + " is an array")
						fixMissingTokens(full_obj[prop], full_obj, prop)
					}else if(full_obj[prop]!=null && full_obj[prop].range && full_obj[prop].type && (full_obj[prop].type==="Identifier" || full_obj[prop].type==="Literal")){
						//console.log(full_obj[prop].range)
						var r = full_obj[prop].range
						addedTokens.push(r);
						
						/*if(full_obj[prop].name == "gear" || full_obj[prop].value=="gear"){
							console.log(full_obj[prop]);
							reverseToken(r)
						}*/
						
						//if(full_obj[prop].type==="Identifier" || full_obj[prop].type==="Literal"){
							//console.log(full_obj[prop]);
						//}
						
						/*var tok = getToken(currRange);
						var tok1 = getToken(prevRange);
						
						var x = tok.rangeIndex;
						var y = tok1.rangeIndex;
						
						if(x && y){
							for(var j=x;j<=y;j++){
								console.log(unranged_tokens[j])
							}
							process.exit(0)
						}*/
					}else if(full_obj[prop]!=null && full_obj[prop].range && full_obj[prop].type){
						var r = full_obj[prop].range
						addedTokens.push(r);
						//reverseToken(r)
						//console.log(full_obj[prop])
						fixMissingTokens(full_obj[prop], full_obj, prop)
						//prevRange = currRange
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
		} else if (ast.type === "Decorator"){
			toString(ast.expression,ctx);
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
		} else {
			var _pP = null;
			for(var _p in ast){
				if(ast[_p] && ast[_p].range && ast[_p].type){
					traverse(ast[_p],_pP!=null?ast[_pP]:null,ast,emit)
				}
				_pP = _p
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
		data = stripXML(data);
		const ast = flow.parse(data,{type:true, 
			tokens:true, 
			esproposal_class_instance_fields: true, 
			esproposal_class_static_fields:true, 
			esproposal_decorators:true, 
			esproposal_optional_chaining:true, 
			types:true
		});
		full_parent_obj = ast; //JSON.parse(JSON.stringify(ast));
		full_obj = full_parent_obj.body;
		unranged_tokens = full_parent_obj.tokens;
		
		rangeArangeTokens(full_parent_obj.tokens);
		traverse(full_obj, null, null, function(emit_ast){
			return javaConnector.emit(emit_ast);
		});
		toString(full_obj);
		javaConnector.showLex(unstripXML(intendedFinalString.join("\r\n")));
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

toPegJs = function(database){
	var pegStr = "\r\n\r\n";
	var pegDefStr = "\r\n\r\n";
	var pegSpecialStr = "\r\n\r\n";
	if(database.specialKeywords){
	    if(database.specialKeywords.constructor === Array && database.specialKeywords.length>0){
	        pegSpecialStr += "SpecialKeyword\r\n";
	    }
	}
	if(database.keywords && database.keywords.constructor === Array && database.keywords.length>0){
	    pegStr += "Keyword\r\n";
	    var k = 0;
	    for(var i=0;i<database.keywords.length;i++){
	        if(database.keywords[i] && database.keywords[i].name && database.keywords[i].name.constructor === String){
	            var _keyword = database.keywords[i].name;
	            var _keywordTitle = _keyword[0].toUpperCase() + _keyword.substr(1) + "Token";
	            pegStr += "  " + (i===0?"=":"/") + " " + _keywordTitle + "\r\n";
	            pegDefStr+= _keywordTitle.padEnd(25,' ') + "= \"" + (_keyword + "\"").padEnd(20,' ') + "!IdentifierPart\r\n";
	
	            if(database.specialKeywords && database.specialKeywords.constructor === Array && database.specialKeywords.length > 0){
	                for(var j=0;j<database.specialKeywords.length;j++){
	                    if(database.specialKeywords[j] && database.specialKeywords[j].link && database.specialKeywords[j].link.constructor === String && database.specialKeywords[j].link === _keyword){
	                        pegSpecialStr += "  " + (k===0?"=":"/") + " " + _keywordTitle + "\r\n";
	                        k++;
	                        break;
	                    }
	                }
	            }
	        }
	    }
	}
    return pegStr + pegDefStr + pegSpecialStr;
};

var templateGenerate = function(directory, inTemplateDir, dName) {
		const pegjs = require('pegjs');
		const handlebars = require('handlebars');
		const fs = require("fs");
		const path = require("path")
		var template = '';

		//console.log(jsonData)
		var jsonData = {};
		var partials = {};
		//, "expressions"
		//var folders = ["charsets", "literals", "sequences", "midentifiers", "operators", "statements", "mexpressions"];
		var sourseTemplatePath = path.join(directory, inTemplateDir);
		var folders = fs.readdirSync(sourseTemplatePath);
		
		var inc = 0;
		for(var x=0;x<folders.length;x++){
			var directoryPath = path.join(directory, inTemplateDir +'/' + folders[x]);
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
					var _ldata = require("./" + dName + "/"+ inTemplateDir +"/"+ folders[x] + "/" + file + ".js");
					
					if(_ldata.data) {
						localData = _ldata.data;
						for(var _p in localData){
							if(typeof localData[_p] == "function"){
								handlebars.registerHelper(_p,localData[_p]);
								//console.log("Found helper: " + _p);
							}
						}
					}
				}catch(ex){}
				
				var content = fs.readFileSync(dName + "/"+ inTemplateDir +"/" + folders[x] + "/" + file, 'utf8');

				const _content = handlebars.compile(content);
				content = _content(localData);
				//console.log(content)
				file = file.substr(0,file.indexOf("."));
			    file = file.substr(5);
			    //console.log(file);
				partials[file] = content;
				template = template + "\r\n{{> " + file + "}}\r\n";
				
				for(var _p in localData){
					if(typeof localData[_p] == "function"){
						handlebars.unregisterHelper(_p,localData[_p]);
					}
				}
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
		
		for(var part in partials){
			handlebars.registerPartial(part,partials[part]);
		}
		
		const temp1 = handlebars.compile(template);
		
		const grammer = temp1(jsonData);
		return grammer;
}
        
var parse = function(argdatabase, argsource, arglistener){
	//console.log("parser starting");
	const fs = require("fs")
	const flow = require("flow-parser")
	database = JSON.parse(argdatabase);
	const ast = flow.parse(argsource,{type:true, 
		tokens:true, 
		esproposal_class_instance_fields: true, 
		esproposal_class_static_fields:true, 
		esproposal_decorators:true, 
		esproposal_optional_chaining:true, 
		types:true
	});
	//console.log(JSON.stringify(ast));
	full_parent_obj = ast;//full_parent_obj = JSON.parse(JSON.stringify(ast));
	full_obj = full_parent_obj.body;
	unranged_tokens = full_parent_obj.tokens;
	rangeArangeTokens(full_parent_obj.tokens);
	//console.log(unranged_tokens);
	//fixMissingTokens(full_obj);
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
if(typeof module != 'undefined' && typeof module.exports != 'undefined'){
    module.exports.toPegJs = toPegJs; 
	module.exports.parse = parse;
	module.exports.templateGenerate = templateGenerate;
}

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
if( typeof navigator !== 'undefined' && navigator.appVersion){
    if( navigator.appVersion.indexOf('PhantomJS')!=-1 ){
        String.prototype.padStart = function(len, ch){
            return Array(len - this.length + 1).join(ch) + this;
        }
        console.log("PhantomJS detected " + navigator.appVersion.substr(navigator.appVersion.indexOf("PhantomJS")).split(" ")[0] )
        const fs = require("fs");
        const system = require('system');
        const databaseJson = system.args[2]?system.args[2]:'test\\sql\\data\\sql.json';
        const source = system.args[1]?system.args[1]:'test\\sql\\src\\test1.sql';
        const db = fs.open(databaseJson, 'r').read();
        const src = fs.open(source, 'r').read();
        var strP = parse(db, src);
        console.log(strP);
    }
}