module.exports.data = {
	"tokens": [
		"program-id",
		"input-output",
		"working-storage",
		"local-storage",
		"end-display",
		"end-perform",
		"file-control"
	],
	"titleCase": function (text) {
	   if(text.indexOf("-")!=-1){
		   var arr = text.split("-")
		   var tc = ""
		   for(var i=0;i<arr.length;i++)
			  tc = tc + module.exports.data.titleCase(arr[i])
	       text = tc
	   }
	   return text[0].toUpperCase() + text.substr(1);
    },
    "makeToken": function (text) {
 	   return module.exports.data.titleCase(text) + "Token";
    },
    "isFirst": function(index) {
       return index === 0
    }
}