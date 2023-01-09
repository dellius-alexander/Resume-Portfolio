// noinspection DuplicatedCode

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
const path = require('path');
const fs = require('fs')
const dotenv = require('dotenv')
try {
    if (fs.existsSync(path.join(__dirname, '.env'))) {
        const result = dotenv.config({ // if we have environment file we use it, else default runtime environment
                path: path.join(__dirname, ".env"),
                encoding: 'utf8',
                debug: true,
                override: true
            }
        )
        if (result.error) {
            throw result.error
        }
        else {
            console.log(result)
        }
    }
}
catch (e) {
    console.error(e)
    console.error(`Startup will continue, defaulting to runtime environment.`)
}
////////////////////////////////////////////////////////////////
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
////////////////////////////////////////////////////////////////
// const rewrite = require("express-urlrewrite")
const express = require('express');
/**
 *  You will use this dependency to configure Express to add headers
 *  stating that your API accepts requests coming from other origins.
 *  This is known as Cross-Origin Resource Sharing (CORS).
 * @type {function(*): function(*, *, *): void}
 */
const cors = require('cors')
/**
 * Https Server object.
 * @type {{get: {(options: (RequestOptions | string | URL), callback?: (res: http.IncomingMessage) => void): http.ClientRequest, (url: (string | URL), options: RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest}, request: {(options: (RequestOptions | string | URL), callback?: (res: http.IncomingMessage) => void): http.ClientRequest, (url: (string | URL), options: RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest}, Agent: Agent, Server: Server, createServer: {<Request=typeof http.IncomingMessage extends typeof http.IncomingMessage, Response=typeof http.ServerResponse extends typeof http.ServerResponse>(requestListener?: http.RequestListener<Request, Response>): Server<Request, Response>, <Request=typeof http.IncomingMessage extends typeof http.IncomingMessage, Response=typeof http.ServerResponse extends typeof http.ServerResponse>(options: ServerOptions<Request, Response>, requestListener?: http.RequestListener<Request, Response>): Server<Request, Response>}, RequestOptions: http.RequestOptions & tls.SecureContextOptions & {rejectUnauthorized?: boolean | undefined, servername?: string | undefined}, globalAgent: Agent, AgentOptions: AgentOptions, ServerOptions: tls.SecureContextOptions & tls.TlsOptions & http.ServerOptions<Request, Response>} | {get: {(options: (RequestOptions | string | URL), callback?: (res: http.IncomingMessage) => void): http.ClientRequest, (url: (string | URL), options: RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest}, request: {(options: (RequestOptions | string | URL), callback?: (res: http.IncomingMessage) => void): http.ClientRequest, (url: (string | URL), options: RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest}, Agent: Agent, Server: Server, createServer: {<Request=typeof http.IncomingMessage extends typeof http.IncomingMessage, Response=typeof http.ServerResponse extends typeof http.ServerResponse>(requestListener?: http.RequestListener<Request, Response>): Server<Request, Response>, <Request=typeof http.IncomingMessage extends typeof http.IncomingMessage, Response=typeof http.ServerResponse extends typeof http.ServerResponse>(options: ServerOptions<Request, Response>, requestListener?: http.RequestListener<Request, Response>): Server<Request, Response>}, RequestOptions: http.RequestOptions & tls.SecureContextOptions & {rejectUnauthorized?: boolean | undefined, servername?: string | undefined}, globalAgent: Agent, AgentOptions: AgentOptions, ServerOptions: tls.SecureContextOptions & tls.TlsOptions & http.ServerOptions<Request, Response>} | {get: {(options: (RequestOptions | string | URL), callback?: (res: http.IncomingMessage) => void): http.ClientRequest, (url: (string | URL), options: RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest}, request: {(options: (RequestOptions | string | URL), callback?: (res: http.IncomingMessage) => void): http.ClientRequest, (url: (string | URL), options: RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest}, Agent: Agent, Server: Server, createServer: {<Request=typeof http.IncomingMessage extends typeof http.IncomingMessage, Response=typeof http.ServerResponse extends typeof http.ServerResponse>(requestListener?: http.RequestListener<Request, Response>): Server<Request, Response>, <Request=typeof http.IncomingMessage extends typeof http.IncomingMessage, Response=typeof http.ServerResponse extends typeof http.ServerResponse>(options: ServerOptions<Request, Response>, requestListener?: http.RequestListener<Request, Response>): Server<Request, Response>}, RequestOptions: http.RequestOptions & tls.SecureContextOptions & {rejectUnauthorized?: boolean | undefined, servername?: string | undefined}, globalAgent: Agent, AgentOptions: AgentOptions, ServerOptions: tls.SecureContextOptions & tls.TlsOptions & http.ServerOptions<Request, Response>} | {get: {(options: (RequestOptions | string | URL), callback?: (res: http.IncomingMessage) => void): http.ClientRequest, (url: (string | URL), options: RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest}, request: {(options: (RequestOptions | string | URL), callback?: (res: http.IncomingMessage) => void): http.ClientRequest, (url: (string | URL), options: RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest}, Agent: Agent, Server: Server, createServer: {<Request=typeof http.IncomingMessage extends typeof http.IncomingMessage, Response=typeof http.ServerResponse extends typeof http.ServerResponse>(requestListener?: http.RequestListener<Request, Response>): Server<Request, Response>, <Request=typeof http.IncomingMessage extends typeof http.IncomingMessage, Response=typeof http.ServerResponse extends typeof http.ServerResponse>(options: ServerOptions<Request, Response>, requestListener?: http.RequestListener<Request, Response>): Server<Request, Response>}, RequestOptions: http.RequestOptions & tls.SecureContextOptions & {rejectUnauthorized?: boolean | undefined, servername?: string | undefined}, globalAgent: Agent, AgentOptions: AgentOptions, ServerOptions: tls.SecureContextOptions & tls.TlsOptions & http.ServerOptions<Request, Response>} | {get: {(options: (RequestOptions | string | URL), callback?: (res: http.IncomingMessage) => void): http.ClientRequest, (url: (string | URL), options: RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest}, request: {(options: (RequestOptions | string | URL), callback?: (res: http.IncomingMessage) => void): http.ClientRequest, (url: (string | URL), options: RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest}, Agent: Agent, Server: Server, createServer: {<Request=typeof http.IncomingMessage extends typeof http.IncomingMessage, Response=typeof http.ServerResponse extends typeof http.ServerResponse>(requestListener?: http.RequestListener<Request, Response>): Server<Request, Response>, <Request=typeof http.IncomingMessage extends typeof http.IncomingMessage, Response=typeof http.ServerResponse extends typeof http.ServerResponse>(options: ServerOptions<Request, Response>, requestListener?: http.RequestListener<Request, Response>): Server<Request, Response>}, RequestOptions: http.RequestOptions & tls.SecureContextOptions & {rejectUnauthorized?: boolean | undefined, servername?: string | undefined}, globalAgent: Agent, AgentOptions: AgentOptions, ServerOptions: tls.SecureContextOptions & tls.TlsOptions & http.ServerOptions<Request, Response>} | {get: {(options: (RequestOptions | string | URL), callback?: (res: http.IncomingMessage) => void): http.ClientRequest, (url: (string | URL), options: RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest}, request: {(options: (RequestOptions | string | URL), callback?: (res: http.IncomingMessage) => void): http.ClientRequest, (url: (string | URL), options: RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest}, Agent: Agent, Server: Server, createServer: {<Request=typeof http.IncomingMessage extends typeof http.IncomingMessage, Response=typeof http.ServerResponse extends typeof http.ServerResponse>(requestListener?: http.RequestListener<Request, Response>): Server<Request, Response>, <Request=typeof http.IncomingMessage extends typeof http.IncomingMessage, Response=typeof http.ServerResponse extends typeof http.ServerResponse>(options: ServerOptions<Request, Response>, requestListener?: http.RequestListener<Request, Response>): Server<Request, Response>}, RequestOptions: http.RequestOptions & tls.SecureContextOptions & {rejectUnauthorized?: boolean | undefined, servername?: string | undefined}, globalAgent: Agent, AgentOptions: AgentOptions, ServerOptions: tls.SecureContextOptions & tls.TlsOptions & http.ServerOptions<Request, Response>}}
 */
const https_server = require('https')

// const cons = require('consolidate')
// const serveIndex = require('serve-index');
/**
 * Cookie Parser
 * @type {(function((string|Array)=, Object=): function(*, *, *): (*|undefined))|{JSONCookie?: *, JSONCookies?: *, signedCookie?: *, signedCookies?: *}}
 */
const cookieParser = require('cookie-parser');
/**
 * You will use this dependency to convert the body of incoming
 * requests into JavaScript objects.
 * @type {{urlencoded: Function, json: Function, raw: Function, text: Function}|{json?: *, raw?: *, text?: *, urlencoded?: *}}
 */
const bodyParser = require('body-parser');
/**
 * This library helps to secure Express APIs by defining various HTTP headers.
 * @type {Helmet | {crossOriginResourcePolicy: (options?: Readonly<CrossOriginResourcePolicyOptions>) => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, contentSecurityPolicy: ContentSecurityPolicy, referrerPolicy: (options?: Readonly<ReferrerPolicyOptions>) => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, dnsPrefetchControl: (options?: Readonly<XDnsPrefetchControlOptions>) => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, hsts: (options?: Readonly<StrictTransportSecurityOptions>) => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, hidePoweredBy: () => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, HelmetOptions: HelmetOptions, crossOriginEmbedderPolicy: (options?: Readonly<CrossOriginEmbedderPolicyOptions>) => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, noSniff: () => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, crossOriginOpenerPolicy: (options?: Readonly<CrossOriginOpenerPolicyOptions>) => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, originAgentCluster: () => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, xssFilter: () => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, ieNoOpen: () => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, frameguard: (options?: Readonly<XFrameOptionsOptions>) => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, expectCt: (options?: Readonly<ExpectCtOptions>) => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, permittedCrossDomainPolicies: (options?: Readonly<XPermittedCrossDomainPoliciesOptions>) => (_req: IncomingMessage, res: ServerResponse, next: () => void) => void, readonly default: Helmet}}
 */
const helmet = require('helmet')
/**
 * This library adds some logging capabilities to your Express API.
 * @type {(function((String|Function), Object=): function(*, *, *): void)|{compile?: *, format?: *, token?: *}}
 */
const logger = require('morgan');
// cryptographic signatures
const crypto = require('crypto');
// index router
const indexRouter = require('./src/backend/routes/index');
// users router
const usersRouter = require('./src/backend/routes/users');
// mail router
const mailApiRouter = require('./src/backend/routes/api/v1/mail');
// const mongodb = require('./src/backend/routes/mongo');
// error handler
const errorHandler = require('./src/backend/middleware/errorHandler')


// express router
// const expressApp = require(`express/lib/router`);
// instantiate express middleware
const app = express();

//By default, Express.js sends the X-Powered-By response header banner.
// This can be disabled using the app.disable() method
app.disable('x-powered-by')
// add middleware security for api
/**
 * Add security for application.
 * see: https://content-security-policy.com
 */
app.use(helmet());
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         /**
//          * You may not use unsafe-inline and nonces at the same time. As
//          * soon as a nonce is added to your CSP, the unsafe-inline directive
//          * will be ignored by the browser.
//          */
//         "default-src": [
//             "self"
//         ],
//         "base-uri": [
//             "self"
//         ],
//         "font-src": [
//             "'self'",
//             "https: data:"
//         ],
//         "form-action": [
//             "'self'"
//         ],
//         "frame-ancestors": [
//             "'self'"
//         ],
//         "frame-src": [
//             "'self'"
//         ],
//         "img-src": [
//             "'self'",
//             "data:"
//         ],
//         "object-src": [
//             "'none'",
//         ],
//         "script-src": [
//             "'self'",
//             "data:image/svg+xml",
//             "maps.gstatic.com",
//             "*.googleapis.com",
//             "*.ggpht.com",
//             "*.google.com"
//         ],
//         "script-src-attr": [
//             "'none'"
//         ],
//         "style-src": [
//             "'self'",
//             // "https: unsafe-inline"
//         ],
//         "child-src": [
//             "'self'",
//             "data:image/svg+xml",
//             "maps.gstatic.com",
//             "*.googleapis.com",
//             "*.ggpht.com",
//             "*.google.com"
//         ],
//         // "upgrade-insecure-requests": []
//     }
// }));


// // Sets the `script-src` directive to "'self' 'nonce-e33ccde670f149c1789b1e1e113b0916'" (or similar)
// app.use((req, res, next) => {
//     res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
//     next();
// });
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
//         },
//     })
// );

// assign the swig engine to parse .html file extensions
app.engine(`html`, require('ejs').renderFile);
// set view engine
app.set(`view engine`, `html`);
// CORS stands for Cross-Origin Resource Sharing. We enable CORS checking,
// a mechanism that uses additional HTTP headers to tell browsers to give
// a web application running at one origin, access to selected resources
// from a different origin
app.use(cors())
// set the view directory and .html as the default extension
app.set(`views`, path.join(__dirname, `src/frontend/views`));
app.use(logger('dev'));
// app.use(express.json({ limit: 10 }));
// app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json({mapParams: true, limit: 1000000}));
/**
 * Initialize server configuration
 */
try {

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
    // app.use('/js', express.static(path.join(__dirname, 'node_modules/php-email-form')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/html5shiv.min.js')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/webfont')))
    app.use('/js/jquery.min.js', express.static(path.join(__dirname, 'node_modules/jquery/dist/jquery.min.js')))

    // add assets directory static file paths
    app.use('/js', express.static(path.join(__dirname, 'assets/js')))
    app.use('/css', express.static(path.join(__dirname, 'assets/css')))
    app.use('/img', express.static(path.join(__dirname, 'assets/img')))
    app.use('/scss', express.static(path.join(__dirname, 'assets/scss')))
    app.use('/scss/bootstrap-icons.scss', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/bootstrap-icons.scss')))
    // fonts path for boxicons
    app.use('/fonts', express.static(path.join(__dirname, 'node_modules/boxicons/fonts')))
    app.use('/fonts', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/fonts')))


    // Setup Routes and API endpoints

    app.use(`/`, indexRouter);
    app.use(`/`, mailApiRouter);
    app.use(`/users`, usersRouter);
    /**
     * Error Handler must be last in the chain of handlers above.
     */
    app.use(errorHandler);
    /**
     * Set server port configuration options
     * @type {{hostname: string, port: (string|number), node_hostname: string}}
     */
    const cfg = {
        port: normalizePort(process.env.PORT || 8080),
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
     * @type {Server<typeof https_server.IncomingMessage, typeof https_server.ServerResponse>}
     */
    https_server.createServer(sslOptions, app)
        .listen(
            cfg.port,
             cfg.hostname,
             () => {
                    console.log(`Example app is listening on https://${cfg.hostname}:${cfg.port}`)
                    console.log(`To test server entrypoint Run: curl -k https://${cfg.hostname}:${cfg.port}`)
            })
        .on('error', errorHandler)


} catch (e) {
    console.error(e)
    process.exit(1)
}

// export our app
module.exports = app;


