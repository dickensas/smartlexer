let database;
let template;

let finalString = "";
let level = 0;
let spaces = 3;
let tabs = false;
let intendedFinalString = [];
let ansiAlias = false;
let foundFrom = false;
let queryScope = [];
let gutter = 0;
let full_obj = {};
let parsingXML = false;

function isWrapBy(key) {
	if (!database.wrapBy)
		return false;
	for (let i = 0; i < database.wrapBy.length; i++) {
		if (key.toLowerCase() === database.wrapBy[i].name.toLowerCase())
			return true;
	}
	return false;
}

function isWrapAt(key) {
	if (!database.wrapAt)
		return false;
	for (let i = 0; i < database.wrapAt.length; i++) {
		if (key.toLowerCase() === database.wrapAt[i].name.toLowerCase())
			return true;
	}
	return false;
}

function mTemplate(obj, templates, emit) {
	let pattern_match = true;
	for (let i = 0; i < templates.length; i++) {
		let fr_args = templates[i].fr.args;
		let to_args = templates[i].to.args;
		pattern_match = true;

		for (let j = 0; j < fr_args.length; j++) {
			let arg_from_arr = fr_args[j].split(":");
			let arg_from_id = parseInt(arg_from_arr[0]);
			let arg_from_type = arg_from_arr[1];
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
			let new_arguments = [];
			for (let j = 0; j < to_args.length; j++) {
				let arg_to_arr = to_args[j].split(":");
				let arg_to_id = parseInt(arg_to_arr[0]);
				let arg_to_type = arg_to_arr[1];
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
	for (let i = 0; i < database[sp].length; i++) {
		if (database[sp][i].name.toLowerCase() == key.toLowerCase()) {
			return true;
		}
	}
	return false;
}

function frFound(from) {
	let templates = [];
	for (let i = 0; i < database.template.length; i++) {
		if (database.template[i].fr.name === from) {
			templates.push(database.template[i]);
		}
	}
	return templates;
}

function isGutterKeyword(name) {
	for (let i = 0; i < database.gutter_keywords.length; i++) {
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
	} else {
		gutter = " ".padStart(spaces, ' ').length;
		intendedFinalString.push(" ".padStart(spaces, ' '));
	}
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
		let _pend = intendedFinalString[intendedFinalString.length - 1];
		if (_pend && _pend[_pend.length - 1] == ' ' && finalString[0] == ' ') {
			_pend = _pend.substr(0, _pend.length - 1);
			intendedFinalString[intendedFinalString.length - 1] = _pend;
		}
	}
	intendedFinalString[intendedFinalString.length - 1] = intendedFinalString[intendedFinalString.length - 1]
			+ finalString;
}

function toString(ast, nsp) {
	if (ast.length) {
		for (let i = 0; i < ast.length; i++) {
			toString(ast[i]);
		}
	} else {
		
		if (ast.type === "CallExpression") {
			indend(ast.callee.name)
			indend("(");
			for (let j = 0; j < ast.arguments.length; j++) {
				toString(ast.arguments[j])
				if (j != ast.arguments.length - 1) {
					indend(",")
				}
			}
			indend(")");
		} else if (ast.type === "ExpressionStatement") {
			toString(ast.expression);
		} else if (ast.type === "Literal") {
			if (ast.raw != null && !(ast.value == null && ast.raw == "null"))
				indend(ast.raw)
			else if (ast.value != null)
				indend(ast.value)

		} else if (ast.type === "ImportDeclaration") {
			indend("import ")
			for (let j = 0; j < ast.specifiers.length; j++) {
				toString(ast.specifiers[j])
				indend(".")
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
				let _pend = intendedFinalString[intendedFinalString.length - 1];
				if (_pend
						&& _pend.indexOf(". ", _pend.length - ". ".length) !== -1) {
					_pend = _pend.substr(0, _pend.length - 1);
					intendedFinalString[intendedFinalString.length - 1] = _pend;
				}
			}
			{
				let _pend = intendedFinalString[intendedFinalString.length - 1];
				if (_pend
						&& _pend.indexOf(" .", _pend.length - " .".length) !== -1) {
					_pend = _pend.substr(0, _pend.length - 2) + ".";
					intendedFinalString[intendedFinalString.length - 1] = _pend;
				}
			}
			if (typeof nsp === "boolean" && nsp === true)
				indend(ast.name)
			else
				indend(" " + ast.name + " ")

			if (isGutterKeyword(ast.name)) {
				spaces = spaces + ast.name.length + 1;
			}
			if (isWrapBy(ast.name)) {
				doWrap()
			}
		} else if (ast.type === "BinaryExpression") {
			toString(ast.left)
			indend(ast.operator)
			if (isWrapBy(ast.operator)) {
				doWrap()
			}
			toString(ast.right)
		} else if (ast.type === "AssignmentExpression") {
			if (ansiAlias && !foundFrom) {
				toString(ast.right)
				indend(" ")
				toString(ast.left)
			} else {
				toString(ast.left)
				indend(ast.operator + " ")
				toString(ast.right)
			}
		} else if (ast.type === "MemberExpression") {
			toString(ast.object)
			indend(".")
			toString(ast.property, true)
		} else if (ast.type === "SequenceExpression") {
			for (let j = 0; j < ast.expressions.length; j++) {
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

function traverse(ast, emit) {
	if (ast && ast.length) {
		for (let i = 0; i < ast.length; i++) {
			traverse(ast[i],emit);
		}
	} else {
		if (ast.type === "ExpressionStatement") {
			traverse(ast.expression,emit);
			if(emit){
				let _em = emit(ast.expression);
				if(typeof _em === 'undefined')
					console.log("WARNING: Emit did not return any value, ignoring")
				else ast.expression = _em;
			} 
		} else if (ast.type === "CallExpression") {
			let fFound = frFound(ast.callee.name);
			mTemplate(ast, fFound,emit);
			for (let j = 0; j < ast.arguments.length; j++) {
				traverse(ast.arguments[j],emit)
			}
		} else if (ast.type === "BinaryExpression") {
			traverse(ast.left,emit);
			traverse(ast.right,emit);
		} else if (ast.type === "AssignmentExpression") {
			traverse(ast.left,emit);
			traverse(ast.right,emit);
		} else if (ast.type === "MemberExpression") {
			traverse(ast.object,emit);
			traverse(ast.property,emit);
		} else if (ast.type === "SequenceExpression") {
			for (let j = 0; j < ast.expressions.length; j++) {
				traverse(ast.expressions[j],emit)
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
			console.log(name)
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
		const ast = flow.parse(data);
		full_obj = JSON.parse(JSON.stringify(ast)).body;
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

if (typeof process === 'object') {
	if (typeof process.versions === 'object') {
		if (typeof process.versions.node !== 'undefined') {
			console.log("nodejs detected " + process.versions.node)
			const fs = require("fs")
			const flow = require("flow-parser")
			fs.readFile('database.json', 'utf8' , (err1, data1) => {
				if (err1) {
					console.error(err1)
					return
				}
				if(!process.argv[2]) throw Error("please provide source file")
				
				fs.readFile(process.argv[2], 'utf8' , (err, data) => {
					if (err) {
						console.error(err)
						return
					}
					
					database = JSON.parse(data1);
					template = database.template;
					datatypes = database.datatypes;
					const ast = flow.parse(data);
					//console.log(JSON.stringify(ast));
					full_obj = JSON.parse(JSON.stringify(ast)).body;
					if(process.argv[3]){
						const elis = require("./" + process.argv[3])
						traverse(full_obj, elis.listener);
					}else{
						traverse(full_obj);
					}
					toString(full_obj);
					console.log(intendedFinalString.join("\n"))
				});
			});
		}
	}
}