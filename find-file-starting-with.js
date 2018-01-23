let fs = require('fs')
let path = require('path')

function trimParameters(name) {
	let i = name.indexOf('?')
	if(i >= 0) {
		return name.substring(0, i)
	}
	return name
}


let findFileStartingWith = function(filePath, callback) {
	let basename = path.basename(filePath)
	let dirname = path.dirname(filePath)
	
	fs.readdir(dirname, function(err, items) {
		
		if(err) {
			callback(err)
			return
		}
		
		for(let item of items) {
			if(basename.indexOf(item) == 0) {
				callback(null, dirname + '/' + item)
				return
			}
		}
		for(let item of items) {
			if(item.indexOf(basename) == 0) {
				callback(null, dirname + '/' + item)
				return
			}
		}
		
		let trimmedBasename = trimParameters(basename)
		
		for(let item of items) {
			if(trimParameters(item) == trimmedBasename) {
				callback(null, dirname + '/' + item)
				return
			}
		}
		
		callback()
	})
}

module.exports = findFileStartingWith
