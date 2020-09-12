module.exports.data = {
	"tokens": [
		{"name":"SELECT", "first":true},
		{"name":"INSERT"},
		{"name":"UPDATE"},
		{"name":"CREATE"},
		{"name":"ALTER"},
		{"name":"DELETE"},
		{"name":"GRANT"},
		{"name":"NULL"},
		{"name":"FROM"},
		{"name":"WHERE"}
	],
	"tokenize": function () {
        return function (text, render) {
           return render(text)[0].toUpperCase() + 
		         (render(text)+"Token").substr(1).padEnd(25," ") + 
				 render("=") + 
				 render(" \"" + text + "\"").padEnd(20," ");
        }
    },
	"tokenlist": function () {
        return function (text, render) {
           return render(text)[0].toUpperCase() + 
		         (render(text)+"Token").substr(1);
        }
    }
}