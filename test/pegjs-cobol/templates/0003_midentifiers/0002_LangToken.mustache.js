module.exports.data = {
	"tokens": [
		{"name":"identification", "first":true},
		{"name":"division"},
		{"name":"pic"},
		{"name":"environment"},
		{"name":"data"},
		{"name":"working"},
		{"name":"procedure"},
		{"name":"display"},
		{"name":"goback"},
		{"name":"end"},
		{"name":"program"},
		{"name":"and"},
		{"name":"or"},
		{"name":"stop"},
		{"name":"run"},
		{"name":"perform"},
		{"name":"varying"},
		{"name":"from"},
		{"name":"by"},
		{"name":"until"},
		{"name":"spaces"},
		{"name":"all"},
		{"name":"to"},
		{"name":"move"},
		{"name":"compute"},
		{"name":"thru"},
		{"name":"times"},
		{"name":"file"},
		{"name":"configuration"},
		{"name":"linkage"},
		{"name":"not"},
		{"name":"redefines"},
		{"name":"value"},
		{"name":"section"}
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