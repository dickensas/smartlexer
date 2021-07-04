module.exports.data = {
	"tokens": [
		{"name":"def", "first":true},
		{"name":"None"},
		{"name":"and"},
		{"name":"or"},
		{"name":"not"},
		{"name":"class"},
		{"name":"is"}
	],
	"tokenize": function (text) {
	   return text[0].toUpperCase() + 
			 (text+"Token").substr(1).padEnd(25," ") + 
			 "=" + 
			 (" \"" + text + "\"i").padEnd(20," ");
    },
	"tokenlist": function (text) {
	   return text[0].toUpperCase() + 
			 (text+"Token").substr(1);
    }
}