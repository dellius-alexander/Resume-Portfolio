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
// import environment variables
require('./utils/config').config().catch(console.dir)
const fs = require('fs')
const path = require('path');
const https = require('https');
// const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const indexRouter = require('./routes/index');
const errorHandler = require('./utils/errorHandler');
const {sslOptions, cfg} = require('./utils/sslOptions')

/**
 * Server middleware configuration. The order of middleware is crucial.
 * The middleware that parse request bodies and cookies should come before
 * the middleware that manages sessions. Likewise, you can add Multer middleware
 * to handle file uploads after the middleware that parse request bodies and
 * cookies but before the middleware that manages sessions. The middleware for handling CORS,
 * adding security headers and logging HTTP requests should come before the
 * middleware for serving static files, setting up routes and handling errors.
 *
 * It's important to note that the order of middleware execution matters as
 * it can affect the behavior of your application. Middleware that parses request
 * bodies, for example, will not work correctly if it is placed after middleware
 * that handles routes.
 *
 * Also, it's important to note that this example is just an example of a common
 * order, you could have different middleware or different order depending on
 * your use case.
 * TODO(modularize and separate middleware components, static files and routes)
 * @return {Promise<void>}
 */
async function main() {
    /**
     * Initialize server configuration
     */
    try {
        // set static assets options
        const staticOptions = {
            dotfiles: 'ignore',
            etag: false,
            extensions: ['htm', 'html'],
            index: true,
            maxAge: '1d',
            redirect: false,
            setHeaders: async function (res, path, stat) {
                res.set('x-timestamp', Date.now())
            }
        }

        // Middleware for parsing request bodies
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        /**
         * Middleware for handling file uploads.
         * Used for file upload support
         * for parsing multipart/form-data
         */

        app.use(upload.array('files'));
        // Middleware for parsing cookies
        app.use(cookieParser());

        // Middleware for managing sessions
        app.use(session({
            secret: 'mysecret',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true }
        }));

        // Middleware for handling CORS
        // CORS stands for Cross-Origin Resource Sharing. We enable CORS checking,
        // a mechanism that uses additional HTTP headers to tell browsers to give
        // a web application running at one origin, access to selected resources
        // from a different origin
        app.use(cors());

        /**
         * Middleware for adding security headers.
         * By default, Helmet sets the following headers:
         *
         * Content-Security-Policy:
         *      default-src 'self'; base-uri 'self'; font-src 'self' https: data:; form-action 'self';
         *      frame-ancestors 'self'; img-src 'self' https: data: ; object-src 'none'; script-src 'self';
         *      script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests
         * Cross-Origin-Embedder-Policy: require-corp
         * Cross-Origin-Opener-Policy: same-origin
         * Cross-Origin-Resource-Policy: same-origin
         * Origin-Agent-Cluster: ?1
         * Referrer-Policy: no-referrer
         * Strict-Transport-Security: max-age=15552000; includeSubDomains
         * X-Content-Type-Options: nosniff
         * X-DNS-Prefetch-Control: off
         * X-Download-Options: noopen
         * X-Frame-Options: SAMEORIGIN
         * X-Permitted-Cross-Domain-Policies: none
         * X-XSS-Protection: 0
         *
         * Please see https://content-security-policy.com for more details.
         */
        app.use(helmet.contentSecurityPolicy({
            useDefaults: false,
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    process.env.HOSTNAME,
                    "*.googleapis.com",
                    " https://code.jquery.com/jquery-3.6.1.min.js",
                    "https://www.google.com/maps/",
                    " https://fonts.googleapis.com/",
                    "'unsafe-inline'",
                    "'unsafe-eval'"
                ],
                objectSrc: ["'none'"],
                fontSrc: ["'self'"," https://fonts.gstatic.com/","https:", "data:", "'unsafe-inline'"],
                styleSrc: ["'self'", " https://fonts.googleapis.com/", "'unsafe-inline'"],
                frameSrc: ["'self'", "https://www.google.com/maps/"],
                upgradeInsecureRequests: [],
            },
        }));

        // Middleware for logging HTTP requests
        app.use(morgan('combined'));


        /**
         * The <code> app.engine('html', require(<YOUR TEMPLATE ENGINE>).renderFile) </code>
         * is used to register the template engine for .html files. It maps a file
         * extension to a specific template engine. but it's not necessary as pug,
         * handlebars, Mustache natively support rendering files with the .html extension.
         *
         * If you would like to use <YOUR TEMPLATE ENGINE> to render .html files you can
         * use <code> app.engine('html', require(<YOUR TEMPLATE ENGINE>).renderFile) </code>
         * function, but it's not required, you can stick to the <code>app.set('view engine', '<YOUR TEMPLATE ENGINE>')</code>
         * and use the .<YOUR TEMPLATE ENGINE> or .html file extension to render your views.
         */
        app.set(`view engine`, 'ejs');
        // set view engine to explicitly override default behavior to include parsing of .html files
        app.engine('html', require('ejs').__express)
        // set the view directory and .html as the default extension
        app.set('views', path.join(__dirname, 'views'));

        // setup static file paths
        app.use('/css', express.static(path.join(__dirname, 'node_modules/aos')))
        app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/css')))
        app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/')))
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
        // TODO(complete email routing and googleapis token authentication for email server.)
        // app.use('/js', express.static(path.join(__dirname, 'node_modules/php-email-form')))
        app.use('/js', express.static(path.join(__dirname, 'node_modules/html5shiv.min.js')))
        app.use('/js', express.static(path.join(__dirname, 'node_modules/webfont')))

        // add assets directory static file paths
        app.use('/js', express.static(path.join(__dirname, 'assets/js')))
        app.use('/css', express.static(path.join(__dirname, 'assets/css')))
        app.use('/img', express.static(path.join(__dirname, 'assets/img')))
        app.use('/scss', express.static(path.join(__dirname, 'assets/scss')))
        app.use('/scss/bootstrap-icons.scss', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/bootstrap-icons.scss')))
        // fonts path for boxicons
        app.use('/fonts', express.static(path.join(__dirname, 'node_modules/boxicons/fonts')))
        app.use('/fonts', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/fonts')))

        // Middleware for handling index route
        console.log('Setting index route......')
        app.use('/', indexRouter);

        // Middleware for handling errors
        console.log('Setting errorCallback......')
        app.use('/', errorHandler);

        console.log('Setting server configurations......')

        /**
         * configure server to use SSL.
         * Test if server state is up by running: curl -k https://HOSTNAME:PORT
         * @type {Server<typeof https.IncomingMessage, typeof https.ServerResponse>}
         */
        await https.createServer(sslOptions, app)
            .listen(
                cfg.port,
                cfg.hostname,
                () => {
                    console.log(`Example app is listening on https://${cfg.hostname}:${cfg.port}`);
                    console.log(`To test server entrypoint Run: curl -k https://${cfg.hostname}:${cfg.port}`);
                })
            .on('load', async function(req, res) {
                    console.log(`Successfully loaded`)
                    console.log(req, res)
            })
            .on('success', async function(req, res) {
                console.log(`Successfully up and running`)
                console.log(req, res)
            })
            .on('error', errorHandler)


        console.log('Server initialization complete......')
    } catch (e) {
        console.dir(e)
        console.error('Something went wrong during server initialization.')

    }
}

main().catch(console.dir);
