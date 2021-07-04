module.exports.data = {
	"tokens": [
		{"name":"def", "first":true},
		{"name":"None"},
		{"name":"and"},
		{"name":"for"},
		{"name":"while"},
		{"name":"in"},
		{"name":"or"},
		{"name":"not"},
		{"name":"class"},
		{"name":"if"},
		{"name":"elIf"},
		{"name":"else"},
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