module.exports= {
	"display": function(value) {
	    if( value && value.constructor === String)
	    	return "\"" + value + "\""
    	else
    		return value
	}
}