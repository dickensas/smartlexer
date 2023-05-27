module.exports= {
	"quotes": function(value) {
		if( value && value.indexOf("\"")!==-1) {
			return value
		} else {
			return "\"" + value + "\""
		}
	},
	"display": function(value) {
	    if( value && value.constructor === String)
	    	return "\"" + value + "\""
    	else
    		return value
	},
	"selfToThis": function(value) {
	    if( value === "self") {
			if(!global.members) {
				global.members = []
			}
	    	return "this"
	    } else {
			if(global.state === "assignment" || global.state === "member" && !global.members.includes(value)) {
				global.members.push(value)
			}
    		return value
    	}
	},
	"state": function(state) {
		global.state = state
		return ""
	},
	"globalMembers": function() {
		var strMembers = "";
		if(global.members) {
			for( var member of global.members ) {
				strMembers = strMembers + "Object " + member + ";\r\n"
			}
		}
		return strMembers
	},
	"arguments": function(args) {
		var strArgs = ""
		for( var arg in args) {
			for( var arg1 in args[arg]) {
				if(args[arg][arg1].name && args[arg][arg1].name!="self") {
					strArgs = strArgs+ "Object " + args[arg][arg1].name
				} else if(args[arg][arg1].value && args[arg][arg1].value!="self") {
					strArgs = strArgs+ "Object " + args[arg][arg1].value
				}
				if(args[arg][arg1].value!="self" && args[arg][arg1].name!="self")
				strArgs = strArgs+ ","
			}
		}
		if(strArgs.endsWith(",")) {
			strArgs = strArgs.substring(0,strArgs.length-1)
		}
		return strArgs
	},
	"fname": function(fname) {
		if( fname === "__init__") {
	    	return "public " + global.classContext
	    } else {
    		return "public void " + fname
    	}
	},
	"cname": function(cname) {
		global.classContext = cname
    	return cname
	}
}