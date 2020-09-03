var assert = require('chai').assert;
describe('SQL', function () {
  describe('SQL indentation', function () {
    it('WHERE should properly intend spaces like [WHERE d.deptid]', function () {
    	const fs = require("fs")
		fs.readFile('test/sql/data/sql.json', 'utf8' , function(err1, data1) {
			if (err1) {
				console.error(err1)
				return
			}
			fs.readFile('test/sql/src/test1.sql', 'utf8' , function(err, data) {
				if (err) {
					console.error(err)
					return
				}
				var smartlexer = require('../../smartlexer.js');
		    	var strSql = smartlexer.parse(data1, data);
		    	assert.equal(strSql.indexOf("WHERE d.deptid")!=-1, true);
		    	
			});
		});
		
    	
    });
  });
});