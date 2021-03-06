module.exports.data = {
	"tokens": [
		"identification division",
		"environment division",
		"data division",
		"procedure division"
	],
	"statementize": function (text) {
	   var arr = text.split(" ")
	   var statement = ""
	   for(var i=0;i<arr.length;i++){
		   statement = statement + module.exports.data.titleCase(arr[i])
	   }
	   statement = statement + "Statement"
	   return statement
    },
    "makeRule": function (text){
       var arr = text.split(" ")
 	   var rule = ""
 	   for(var i=0;i<arr.length;i++){
 		  rule = rule + ("id"+(i+1)+":") + module.exports.data.makeToken(arr[i]) + " Spaces? "
 	   }
       return rule + "EOS?"
    },
	"titleCase": function (text) {
	   return text[0].toUpperCase() + (text).substr(1);
    },
    "makeToken": function (text) {
 	   return module.exports.data.titleCase(text) + "Token";
    },
    "isFirst": function(index) {
       return index === 0
    }
}