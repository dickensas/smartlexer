module.exports.data = {
	"tokens": [
		{"name":"eight", "column":8},
		{"name":"nine", "column":9},
		{"name":"ten", "column":10}
	],
	"titleCase": function (text) {
	   return text[0].toUpperCase() + (text).substr(1);
    },
    "isFirst": function(index) {
       return index === 0
    }
}