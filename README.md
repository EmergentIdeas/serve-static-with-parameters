# serve-static-with-parameters

Serves files with names where the base file name and base URL path match. An
example would be serving a file `/some/path/to/styles.css?ver=1234` in response
to an URL `/some/path/to/styles.css?version=abc`. That is, it ignores the URL
parameters portion in both URL and file name.

If an acceptable matching file exists that express's static-serve module would
serve, this module will either take no action or change the request's path to
point to it. That's because this module does a horrible job of adding and
handling cache headers (it doesn't). If a file can be served by express's built
in module, that's better.

Use like:

```
const staticServer = require('serve-static-with-parameters')
app.use(staticServer(filesDir))

```

## Why

The reason to do this is that when you mirror a site, many of the file names
can contain version strings. You can't use express to serve a static mirror of
the site unless you can serve the files with those strings.

