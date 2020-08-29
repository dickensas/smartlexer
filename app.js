let database;
let template;

let SQL = "";
let level = 0;
let spaces = 3;
let tabs = false;
let intended_SQL = [];
let ansiAlias = false;
let foundFrom = false;
let queryScope = [];
let gutter = 0;
let full_obj = {};
let parsingXML = false;

function isWrapBy(key){
	if(!database.wrapBy) return false;
	for(let i=0;i<database.wrapBy.length;i++){
		if(key.toLowerCase() === database.wrapBy[i].name.toLowerCase()) return true;
	}
	return false;
}

function isWrapAt(key){
	if(!database.wrapAt) return false;
	for(let i=0;i<database.wrapAt.length;i++){
		if(key.toLowerCase() === database.wrapAt[i].name.toLowerCase()) return true;
	}
	return false;
}

function mTemplate(obj, templates) {
	let pattern_match = true;
	for(let i=0;i<templates.length;i++){
		let fr_args = templates[i].fr.args;
		let to_args = templates[i].to.args;
		pattern_match = true;
				
		for(let j=0;j<fr_args.length;j++) {
			let arg_from_arr = fr_args[j].split(":");
			let arg_from_id = parseInt(arg_from_arr[0]);
			let arg_from_type = arg_from_arr[1];
			if(obj.arguments[arg_from_id-1]){
				if(obj.arguments[arg_from_id-1].name=="char_length"){
					console.log(obj);
					throw Error("aaaa");
				}
				if(obj.arguments[arg_from_id-1].name && isSP(arg_from_type,obj.arguments[arg_from_id-1].name) && arg_from_arr[2].toLowerCase() === obj.arguments[arg_from_id-1].name.toLowerCase()){
					console.log(arg_from_type + " type match " + i);
				}
				else if(obj.arguments[arg_from_id-1].callee && isSP(arg_from_type,obj.arguments[arg_from_id-1].callee.name) && arg_from_arr[2].toLowerCase() === obj.arguments[arg_from_id-1].callee.name.toLowerCase() ){
					console.log(arg_from_type + " type match " + i);
				}
				else if(arg_from_type==="I" && obj.arguments[arg_from_id-1].name && obj.arguments[arg_from_id-1].type === "Identifier" ){
					console.log("Identifier match " + i);
				}
				else if(arg_from_type==="L" && obj.arguments[arg_from_id-1].value && obj.arguments[arg_from_id-1].type === "Literal" ){
					console.log("Literal match " + i);
				}
				else if(arg_from_type==="CE" && obj.arguments[arg_from_id-1].type === "CallExpression" ){
					traverse(obj.arguments[arg_from_id-1]);
				}
				else if(arg_from_type==="BE" && obj.arguments[arg_from_id-1].type === "BinaryExpression" ){
					traverse(obj.arguments[arg_from_id-1]);
				}
				else{
					pattern_match =false;
					break;
				}
			}
		}
		
		
		if(pattern_match) {
			let new_arguments = [];
			for(let j=0;j<to_args.length;j++) {
				let arg_to_arr = to_args[j].split(":");
				let arg_to_id = parseInt(arg_to_arr[0]);
				let arg_to_type = arg_to_arr[1];
				if(obj.arguments[arg_to_id-1] && arg_to_type==="_EXP" && arg_to_arr[2] && arg_to_arr[2].length>0){
					
					try{
						if(arg_to_arr[2]==="A"){
							new_arguments.push(obj.arguments[arg_to_id-1].arguments[parseInt(arg_to_arr[3])-1]);
						}
					}catch(e){
						
					}

				}else if(obj.arguments[arg_to_id-1] && arg_to_type!=="_REM"){
					new_arguments.push(obj.arguments[arg_to_id-1]);
				}
			}
			obj.arguments = new_arguments;
			obj.callee.name = templates[i].to.name;
			break;
		}
	}
	if(pattern_match == false){
		//console.log(obj);
	}
	if(templates.length==0 && obj.callee){
		console.log(obj);
		console.log("no templates found for " + obj.callee.name);
	}
}

function isSP(sp, key) {
	if(!database[sp]) return false;
	for(let i=0;i<database[sp].length;i++) {
		if(database[sp][i].name.toLowerCase() == key.toLowerCase()){
			return true;
		}
	}
	return false;
}

function frFound(from) {
	let templates = [];
	for(let i=0;i<database.template.length;i++) {
		if(database.template[i].fr.name === from){
			templates.push(database.template[i]);
		}
	}
	return templates;
}

function isGutterKeyword(name){
	for(let i=0;i<database.gutter_keywords.length;i++) {
		if(database.gutter_keywords[i].name.toLowerCase() === name.toLowerCase()){
			return true;
		}
	}
	return false;
}

function doWrap(left){
	if(left!=null && left!=0){
		intended_SQL.push(" ".padStart(left,' '));
	}else{
		gutter = " ".padStart(spaces,' ').length;
		intended_SQL.push(" ".padStart(spaces,' '));
	}
}

function indend(SQL){
	if(intended_SQL.length===0){
		doWrap();
	}
	if(!parsingXML && (intended_SQL[intended_SQL.length-1] + SQL) .length>=database.max){
		doWrap();
	}
	intended_SQL[intended_SQL.length-1] = 
	intended_SQL[intended_SQL.length-1] + SQL;
}

function toString(ast,nsp) {
	let localStr = " ";
	if(nsp!=null && nsp==true){
		localStr = "";
	}
	
	if(ast.length){
		for(let i=0;i<ast.length;i++){
			indend(toString(ast[i]));
		}
	}else{
		let _ast = ast;
		if(ast.expression){
			_ast = ast.expression;
		}
		if(_ast.type === "CallExpression") {
			indend(_ast.callee.name)
			indend("(");
		}
		
		if(_ast.type === "CallExpression") {
			for(let j=0;j<_ast.arguments.length;j++){
				indend(toString(_ast.arguments[j]))
				if(j!=_ast.arguments.length-1){
					indend(",")
				}
			}
		}else if(_ast.type === "Literal" ) {
			if(_ast.raw!=null)
				indend(_ast.raw)
			else
				indend(_ast.value)
		}else if(_ast.type === "ImportDeclaration" ) {
			indend("import ")
			for(let j=0;j<_ast.specifiers.length;j++){
				indend(toString(_ast.specifiers[j],true).trim())
				//if(j!=_ast.specifiers.length-1){
					indend(".")
				//}
			}
			
		}else if(_ast.type === "ImportDefaultSpecifier" ) {
			indend(toString(_ast.local,true).trim())
		}
		//ImportDeclaration
		else if(_ast.type === "Identifier" ) {
			if(isWrapAt(_ast.name)){
				doWrap(gutter - (_ast.name.length + 1) )
			}
			if(isGutterKeyword(_ast.name)){
				_ast.name = _ast.name.toUpperCase();
				queryScope.push(true);
			}
			let _pend = intended_SQL[intended_SQL.length-1];
			if(_pend && _pend.indexOf(". ", _pend.length - ". ".length) !== -1){
				_pend = _pend.substr(0,_pend.length-1);
				intended_SQL[intended_SQL.length-1] = _pend;
			}
			indend(_ast.name)
			if(isGutterKeyword(_ast.name)){
				spaces = spaces + _ast.name.length + 1;
			}
			if(isWrapBy(_ast.name)){
				doWrap()
			}
			if(_ast.name.toLowerCase() === "from"){
				foundFrom = true;
			}
		}else if(_ast.type === "BinaryExpression" ) {
			indend(toString(_ast.left))
			indend(_ast.operator)
			if(isWrapBy(_ast.operator)){
				doWrap()
			}
			indend(toString(_ast.right))
		}else if(_ast.type === "AssignmentExpression" ) {
				if(ansiAlias && !foundFrom){
					indend(toString(_ast.right))
					indend(" ")
					indend(toString(_ast.left))
				}else{
					indend(toString(_ast.left))
					indend(_ast.operator + " ")
					indend(toString(_ast.right))
				}
		}else if(_ast.type === "MemberExpression" ) {
			indend(toString(_ast.object,true).trim())
			indend(".")
			indend(toString(_ast.property,true).trim())
		}else if(_ast.type === "SequenceExpression" ) {
			for(let j=0;j<_ast.expressions.length;j++){
				indend(toString(_ast.expressions[j]))
				if(j!=_ast.expressions.length-1){
					indend(",")
					if(isWrapBy(",")){
						doWrap()
					}
				}
			}
		}
		
		if(_ast.type === "CallExpression")
			indend(")");
	}
	return localStr;
}

function traverse(ast) {
	if(ast.length){
		for(let i=0;i<ast.length;i++) {
			traverse(ast[i]);
		}
	}else{
		let _ast = ast;
		if(ast.expression){
			_ast = ast.expression;
		}
		if(_ast.type==="CallExpression"){
			let fFound = frFound(_ast.callee.name);
			mTemplate(_ast, fFound);
			for(let j=0;j<_ast.arguments.length;j++){
				traverse(_ast.arguments[j])
			}
		}else if(_ast.type==="BinaryExpression"){
			traverse(_ast.left);
			traverse(_ast.right);
		}else if(_ast.type==="AssignmentExpression"){
			traverse(_ast.left);
			traverse(_ast.right);
		}else if(_ast.type==="MemberExpression"){
			traverse(_ast.object);
			traverse(_ast.property);
		}else if(_ast.type === "SequenceExpression" ) {
			for(let j=0;j<_ast.expressions.length;j++){
				traverse(_ast.expressions[j])
			}
		}else{
			//console.log(_ast);
		}
	}
}

var jsConnector = {
	log : function(txt) {
		javaConnector.log(txt);
	},
	setJSON : function(name, json) {
		try {
			console.log(name)
			window[name] = JSON.parse(json);
		} catch (e) {
			console.log(e)
		}
	},
	parseToSQL : function(data) {
		database = window["database"];
		template = database.template;
		datatypes = database.datatypes;
		data = stripXML(data);
		const ast = flow.parse(data);
		full_obj = JSON.parse(JSON.stringify(ast)).body;
		traverse(full_obj);
		toString(full_obj);
		javaConnector.showSQL(unstripXML(intended_SQL.join("\n")));
	}
};

function getJsConnector() {
	console.log = jsConnector.log;
	return jsConnector;
};

function stripXML(data) {
	const regexw = /\.\*/gi;
	data = data.replace(regexw, ' __WILD__');
		
	if(
	data.indexOf("<")!=-1 &&
	data.indexOf("</")!=-1 &&
	data.indexOf(">")!=-1 &&
		(
			data.indexOf("/>")!=-1
			||
			data.indexOf("</")!=-1
			||
			data.indexOf("<?")!=-1
		)
	){
		//console.log(data);
		console.log("XML Detected");
		const regexqo = /<\?/gi;
		data = data.replace(regexqo, '__TAGQO__ ');
		//console.log(data);
		
		const regexqc = /\?>/gi;
		data = data.replace(regexqc, ' __TAGQC__');
		//console.log(data);
		
		const regexco = /<\//gi;
		data = data.replace(regexco, '__TAGCO__ ');
		//console.log(data);
		
		const regexsc = /\/>/gi;
		data = data.replace(regexsc, ' __TAGSC__');
		//console.log(data);
		
		const regexcc = />/gi;
		data = data.replace(regexcc, ' __TAGCC__');
		//console.log(data);
		
		const regexo = /</gi;
		data = data.replace(regexo, '__TAGO__ ');
		//console.log(data);
		
		
		//console.log(data);
		
		parsingXML = true;
	}
	return data;
}

function unstripXML(joinedStr){
			
	console.log("XML Detected");
	const regexqo = /__TAGQO__\s+/gi;
	joinedStr = joinedStr.replace(regexqo,'<?');
	//console.log(data);
	
	const regexqc = /\s+__TAGQC__/gi;
	joinedStr = joinedStr.replace(regexqc, '?>\n');
	
	const regexqc1 = /\__TAGQC__/gi;
	joinedStr = joinedStr.replace(regexqc1, '?>\n');
	//console.log(data);
	
	const regexco = /__TAGCO__\s+/gi;
	joinedStr = joinedStr.replace(regexco, '</');
	//console.log(data);
	
	const regexsc = /\s+__TAGSC__/gi;
	joinedStr = joinedStr.replace(regexsc, '/>\n');
	//console.log(data);
	
	const regexcc = /\s+__TAGCC__/gi;
	joinedStr = joinedStr.replace(regexcc, '>\n');
	//console.log(data);
	
	const regexo = /__TAGO__\s+/gi;
	joinedStr = joinedStr.replace(regexo, '<');
	//console.log(data);
	
	const regexw = /\s+__WILD__/gi;
	joinedStr = joinedStr.replace(regexw, '.*');
	//console.log(joinedStr);
	return joinedStr;
}