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
		{"name":"WHERE"},
		{"name":"AND"},
		{"name":"OR"},
		{"name":"ORDER"},
		{"name":"GROUP"},
		{"name":"HAVING"},
		{"name":"BEGIN"},
		{"name":"END"},
		{"name":"CASE"},
		{"name":"WHEN"},
		{"name":"THEN"},
		{"name":"ELSE"},
		{"name":"AS"},
		{"name":"IS"},
		{"name":"IN"},
		{"name":"EXISTS"},
		{"name":"LIKE"},
		{"name":"UNION"},
		{"name":"ALL"},
		{"name":"BY"}
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