// import environment variables
const dotenv = require('dotenv')
const result = dotenv.config({ path: '*.env', encoding: 'utf8', debug: true, override: true })
if (result.error) {
    throw result.error
}

const express = require('express');
const path = require('path');
const cors = require('cors')
const https = require('https')
const fs = require('fs')

// const cons = require('consolidate')
// const serveIndex = require('serve-index');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// const expressApp = require("express/lib/router");

// instantiate express middleware
const app = express();

// assign the swig engine to parse .html file extensions
app.engine(`html`, require('ejs').renderFile);
// set view engine
app.set(`view engine`, `html`);
// CORS stands for Cross-Origin Resource Sharing. We enable CORS checking,
// a mechanism that uses additional HTTP headers to tell browsers to give
// a web application running at one origin, access to selected resources
// from a different origin
app.use(cors())
// Use node_modules scripts
// CSS dependencies
// app.use(expressApp)
// set static assets options
let staticOptions = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
}
// setup static file paths
app.use('/css', express.static(path.join(__dirname, 'node_modules/aos'), staticOptions))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/css'), staticOptions))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap-icons'), staticOptions))
app.use('/css', express.static(path.join(__dirname, 'node_modules/boxicons/css'), staticOptions))
app.use('/css', express.static(path.join(__dirname, 'node_modules/glightbox/css'), staticOptions))
app.use('/css', express.static(path.join(__dirname, 'node_modules/swiper'), staticOptions))
app.use('/css', express.static(path.join(__dirname, 'node_modules/boxicons/css'), staticOptions))
// app.use('/css', express.static(path.join(__dirname, '')))

// Javascript dependencies
app.use('/js', express.static(path.join(__dirname, 'node_modules/aos'), staticOptions))
app.use('/js', express.static(path.join(__dirname, 'node_modules/purecounter/dist'), staticOptions))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/js'), staticOptions))
app.use('/js', express.static(path.join(__dirname, 'node_modules/glightbox/js'), staticOptions))
app.use('/js', express.static(path.join(__dirname, 'node_modules/isotope-layout'), staticOptions))
app.use('/js', express.static(path.join(__dirname, 'node_modules/swiper'), staticOptions))
app.use('/js', express.static(path.join(__dirname, 'node_modules/typed.js'), staticOptions))
app.use('/js', express.static(path.join(__dirname, 'node_modules/waypoints'), staticOptions))
app.use('/js', express.static(path.join(__dirname, 'node_modules/php-email-form'), staticOptions))
app.use('/js', express.static(path.join(__dirname, 'node_modules/html5shiv.min.js'), staticOptions))
app.use('/js', express.static(path.join(__dirname, 'node_modules/webfont'), staticOptions))

// add assets directory static file paths
app.use('/js', express.static(path.join(__dirname, 'assets/js/'), staticOptions))
app.use('/css', express.static(path.join(__dirname, 'assets/css/'), staticOptions))
app.use('/img', express.static(path.join(__dirname, 'assets/img/'), staticOptions))
app.use('/scss', express.static(path.join(__dirname, 'assets/scss/'), staticOptions))
// fonts path for boxicons
app.use('/fonts', express.static(path.join(__dirname, 'node_modules/boxicons/fonts'), staticOptions))

// set the view directory and .html as the default extension
app.set(`views`, path.join(__dirname, `views`));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(`/`, indexRouter);
app.use(`/users`, usersRouter);
// set server port configuration options
const cfg = {
    port: process.env.PORT || 8080,
    hostname: process.env.HOSTNAME || process.env.NODEHOSTNAME,
    node_hostname: process.env.NODEHOSTNAME
}

// setup server listening host and port
// disable this if using https server
// app.listen(
//     cfg.port,
//     cfg.hostname,
//     () => {
//     console.log(`Example app is listening on https://${cfg.hostname}:${cfg.port}`)
// }
// );

// // initialize SSL configuration using child process
// const { exec } = require("node:child_process")
// // create the SSL Certificates
// exec(`/bin/bash ./cert.sh`, function(error ,stdout, stderr){
//     if (error) {
//         // log and return error message
//         console.error(`Could not execute command: ${error}, ${stderr}`)
//     }else{
//         console.log(`EXECUTING COMMAND: ${stdout}`)
//     }
// })

// create ssl options
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, `${process.env.SSL_KEY_FILE}`)),
    cert: fs.readFileSync(path.join(__dirname, `${process.env.SSL_CERT_FILE}`)),
}
// configure server to use SSL
// test if server state is up by running: curl -k https://HOSTNAME:PORT/
https.createServer(sslOptions, app).listen(cfg.port, cfg.hostname, () => {
    console.log(`Example app is listening on https://${cfg.node_hostname}${cfg.port === 443 ? '' : ':443'}`)
    console.log(`To test server entrypoint Run: curl -k https://${cfg.node_hostname}${cfg.port === 443 ? '' : ':443'}`)
})


// export our app
module.exports = app;
