var assert = require('chai').assert;
describe('C++', function () {
  describe('cpp indentation', function () {
    it('return should properly intend spaces like [return 0;]', function () {
    	const fs = require("fs")
		fs.readFile('test/cpp/data/cpp.json', 'utf8' , function(err1, data1) {
			if (err1) {
				console.error(err1)
				return
			}
			fs.readFile('test/cpp/src/test1.cpp', 'utf8' , function(err, data) {
				if (err) {
					console.error(err)
					return
				}
				var smartlexer = require('../../smartlexer.js');
		    	var strCpp = smartlexer.parse(data1, data);
		    	//console.log(strCpp);
		    	assert.equal(strCpp.indexOf("return 0;")!=-1, true);
			});
		});
		
    	
    });
  });
});