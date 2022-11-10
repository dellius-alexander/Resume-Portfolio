/**
 *    Copyright 2022 Dellius Alexander
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
// const rewrite = require("express-urlrewrite")
const express = require('express');
const path = require('path');
const cors = require('cors')
const https = require('https')
const fs = require('fs')
// const cons = require('consolidate')
// const serveIndex = require('serve-index');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// index router
const indexRouter = require('./routes/index');
// users router
const usersRouter = require('./routes/users');
// import environment variables
const dotenv = require('dotenv')
const result = dotenv.config({
                            path: path.join(__dirname, ".env"),
                            encoding: 'utf8',
                            debug: true,
                            override: true
                        }
                    )
if (result.error) {
    throw result.error
}

// express router
// const expressApp = require("express/lib/router");
// instantiate express middleware
const app = express();

/**
 * Initialize server configuration
 */
try {
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
    const staticOptions = {
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
    app.use('/css', express.static(path.join(__dirname, 'node_modules/aos')))
    app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/css')))
    app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap-icons')))
    app.use('/css', express.static(path.join(__dirname, 'node_modules/boxicons/css')))
    app.use('/css', express.static(path.join(__dirname, 'node_modules/glightbox/css')))
    app.use('/css', express.static(path.join(__dirname, 'node_modules/swiper')))
    app.use('/css', express.static(path.join(__dirname, 'node_modules/boxicons/css')))
    // app.use('/css', express.static(path.join(__dirname, '')))

    // Javascript dependencies
    app.use('/js', express.static(path.join(__dirname, 'node_modules/aos')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/purecounter/dist')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/js')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/glightbox/js')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/isotope-layout')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/swiper')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/typed.js')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/waypoints')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/php-email-form')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/html5shiv.min.js')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/webfont')))

    // add assets directory static file paths
    app.use('/js', express.static(path.join(__dirname, 'assets/js/')))
    app.use('/css', express.static(path.join(__dirname, 'assets/css/')))
    app.use('/img', express.static(path.join(__dirname, 'assets/img/')))
    app.use('/scss', express.static(path.join(__dirname, 'assets/scss/')))
    // fonts path for boxicons
    app.use('/fonts', express.static(path.join(__dirname, 'node_modules/boxicons/fonts')))

    // set the view directory and .html as the default extension
    app.set(`views`, path.join(__dirname, `views`) );
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    // app.use(expressApp)
    app.use(`/`, indexRouter);
    app.use(`/users`, usersRouter);
    /**
     * Set server port configuration options
     * @type {{hostname: string, port: (string|number), node_hostname: string}}
     */
    const cfg = {
        port: process.env.PORT || 8080,
        hostname: process.env.HOSTNAME || process.env.NODEHOSTNAME,
        node_hostname: process.env.NODEHOSTNAME
    }

    // /**
    //  * Setup server to use http protocol.
    //  * Disable this if using https protocol.
    //  */
    // app.listen(
    //     cfg.port,
    //     cfg.hostname,
    //     () => {
    //         console.log(`Example app is listening on https://${cfg.hostname}:${cfg.port}`)
    //     }
    // );

    /**
     * create ssl options
     * @type {{cert: Buffer, key: Buffer}}
     */
    const sslOptions = {
        key: fs.readFileSync(path.join(__dirname, `${process.env.SSL_KEY_FILE}`)),
        cert: fs.readFileSync(path.join(__dirname, `${process.env.SSL_CERT_FILE}`)),
    }
    /**
     * configure server to use SSL.
     * Test if server state is up by running: curl -k https://HOSTNAME:PORT
     * @type {Server<typeof https.IncomingMessage, typeof https.ServerResponse>}
     */
    const {message, response} = https.createServer(sslOptions, app)
        .listen(
            cfg.port,
             cfg.hostname,
             () => {
                    console.log(`Example app is listening on https://${cfg.hostname}:${cfg.port}`)
                    console.log(`To test server entrypoint Run: curl -k https://${cfg.hostname}:${cfg.port}`)
            }
         )
    console.log(`Server: ${message} | ${response}`)

} catch (e) {
    console.error(e)
    process.exit(1)
}
// export our app
module.exports = app;
