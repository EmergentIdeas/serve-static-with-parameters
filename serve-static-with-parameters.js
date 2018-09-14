const pathtool = require('path')
const findWithStarting = require('./find-file-starting-with')
const fs = require('fs')
const mimeTypes = require('mime-types')

let serveFile = (path, res) => {
	let fileBaseName = path
	let qIndex = path.indexOf('?')
	if(qIndex > 0) {
		fileBaseName = fileBaseName.substring(0, qIndex)
	}
	
	let mimeType = mimeTypes.lookup(fileBaseName) || 'text/plain'
	if(pathtool.extname(fileBaseName) == '') {
		mimeType = "text/html"
	}
	res.set('Content-Type',  mimeType)
	fs.createReadStream(path).pipe(res)	
}

const createStaticServer = function(pathRoot) {
	return function(req, res, next) {
		
		let fn = pathtool.join(pathRoot, req.url)
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
					if(pathtool.extname(fn) == '') {
						// however, if it has no extension, make sure we mark it as html
						res.set('Content-Type',  'text/html')
					}
					
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