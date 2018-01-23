const path = require('path')
const findWithStarting = require('./find-file-starting-with')
const fs = require('fs')
const mimeTypes = require('mime-types')

let serveFile = (path, res) => {
	let fileBaseName = path
	let qIndex = path.indexOf('?')
	if(qIndex > 0) {
		fileBaseName = fileBaseName.substring(0, qIndex)
	}
	res.set('Content-Type',  mimeTypes.lookup(fileBaseName) || 'text/plain')
	fs.createReadStream(path).pipe(res)	
}

const createStaticServer = function(pathRoot) {
	return function(req, res, next) {
		
		let fn = path.join(pathRoot, req.url)
		if(fn.indexOf(pathRoot) != 0) {
			// kick out anything which is a security problem
			return next()
		}
		
		fs.exists(fn, (exists) => {
			if(exists) {
				if(fn.indexOf('?') > 0) {
					// It exists but won't get served since it has a question mark
					// in the name of the file. We'll have to server it.
					return serveFile(fn, res)
				}
				else {
					// This exists so we'll just continue. The normal static file server should pick this up
					next()
				}
			}
			else {
				findWithStarting(fn, function(err, found) {
					if(found) {
						if(found.indexOf('?') > 0) {
							return serveFile(found, res)
						}
						else {
							req.path = found.substring(pathRoot.length)
							req.url = req.path
						}
					}
					return next()
				})
			}
		})
	}
}

module.exports = createStaticServer