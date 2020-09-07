module.exports.data = {
	"tokens": [
		{"name":"abstract", "first":true},
		{"name":"assert"},
		{"name":"boolean"},
		{"name":"break"},
		{"name":"byte"},
		{"name":"case"},
		{"name":"catch"},
		{"name":"char"},
		{"name":"class"},
		{"name":"const"},
		{"name":"continue"},
		{"name":"default"},
		{"name":"do"},
		{"name":"double"},
		{"name":"else"},
		{"name":"enum"},
		{"name":"extends"},
		{"name":"false"},
		{"name":"final"},
		{"name":"finally"},
		{"name":"float"},
		{"name":"for"},
		{"name":"goto"},
		{"name":"if"},
		{"name":"implements"},
		{"name":"import"},
		{"name":"instanceof"},
		{"name":"int"},
		{"name":"interface"},
		{"name":"long"},
		{"name":"native"},
		{"name":"new"},
		{"name":"null"},
		{"name":"package"},
		{"name":"private"},
		{"name":"protected"},
		{"name":"public"},
		{"name":"return"},
		{"name":"short"},
		{"name":"static"},
		{"name":"strictfp"},
		{"name":"super"},
		{"name":"switch"},
		{"name":"synchronized"},
		{"name":"this"},
		{"name":"throw"},
		{"name":"throws"},
		{"name":"transient"},
		{"name":"true"},
		{"name":"try"},
		{"name":"void"},
		{"name":"volatile"},
		{"name":"while"}
	],
	"tokenize": function () {
        return function (text, render) {
           return render(text)[0].toUpperCase() + 
		         (render(text)+"Token").substr(1).padEnd(25," ") + 
				 render("=") + 
				 render(" \"" + text + "\"").padEnd(20," ") + 
				 "!IdentifierPart";
        }
    },
	"tokenlist": function () {
        return function (text, render) {
           return render(text)[0].toUpperCase() + 
		         (render(text)+"Token").substr(1);
        }
    }
}