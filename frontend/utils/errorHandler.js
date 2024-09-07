/**
 *    Copyright 2023 Dellius Alexander
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
const router = require('express').Router();

/**
 * Error Code to message resolver callback.
 * @param statusCode status code
 * @returns {{message: string, status: number}}
 */
const errorMessage = function (statusCode){
    switch (statusCode) {
        // Client error responses
        case 400: // Bad Request
            return { status: 400, message: "The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing)." }
        case 401: // Unauthorized
            return { status: 401, message: "Although the HTTP standard specifies \"unauthorized\", semantically this response means \"unauthenticated\". That is, the client must authenticate itself to get the requested response." }
        case 402: // Payment Required
            return { status: 402, message: "This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems, however this status code is used very rarely and no standard convention exists." }
        case 403: // Forbidden
            return { status: 403, message: "The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 403 Unauthorized, the client's identity is known to the server." }
        case 404: // Not Found
            return { status: 404, message: "The server can not find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web." }
        case 405: // Method Not Allowed
            return { status: 405, message: "The request method is known by the server but is not supported by the target resource. For example, an API may not allow calling DELETE to remove a resource." }
        case 406: // Not Acceptable
            return { status: 406, message: "This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent." }
        case 407: // Proxy Authentication Required
            return { status: 407, message: "This is similar to 407 Unauthorized but authentication is needed to be done by a proxy." }
        case 408: // Request Timeout
            return { status: 408, message: "This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message." }
        case 409: // Conflict
            return { status: 409, message: "This response is sent when a request conflicts with the current state of the server." }
        case 410: // Gone
            return { status: 410, message: "This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for \"limited-time, promotional services\". APIs should not feel compelled to indicate resources that have been deleted with this status code." }
        case 411: // Length Required
            return { status: 411, message: "Server rejected the request because the Content-Length header field is not defined and the server requires it." }
        case 412: // Precondition Failed
            return { status: 412, message: "The client has indicated preconditions in its headers which the server does not meet." }
        case 413: // Payload Too Large
            return { status: 413, message: "Request entity is larger than limits defined by server. The server might close the connection or return an Retry-After header field." }
        case 414: // URI Too Long
            return { status: 414, message: "The URI requested by the client is longer than the server is willing to interpret." }
        case 415: // Unsupported Media Type
            return { status: 415, message: "The media format of the requested data is not supported by the server, so the server is rejecting the request." }
        case 416: // Range Not Satisfiable
            return { status: 416, message: "The range specified by the Range header field in the request cannot be fulfilled. It's possible that the range is outside the size of the target URI's data." }
        case 417: // Expectation Failed
            return { status: 417, message: "This response code means the expectation indicated by the Expect request header field cannot be met by the server." }
        case 418: // I'm a teapot
            return { status: 418, message: "The server refuses the attempt to brew coffee with a teapot." }
        case 421: // Misdirected Request
            return { status: 421, message: "The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI." }
        case 422: // Unprocessable Entity (WebDAV)
            return { status: 422, message: "The request was well-formed but was unable to be followed due to semantic errors." }
        case 423: // Locked (WebDAV)
            return { status: 423, message: "The resource that is being accessed is locked." }
        case 424: // Failed Dependency (WebDAV)
            return { status: 424, message: "The request failed due to failure of a previous request." }
        case 425: // Too Early
            return { status: 425, message: "Indicates that the server is unwilling to risk processing a request that might be replayed." }
        case 426: // Upgrade Required
            return { status: 426, message: "The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s)." }
        case 428: // Precondition Required
            return { status: 428, message: "The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict." }
        case 429: // Too Many Requests
            return { status: 429, message: "The user has sent too many requests in a given amount of time (\"rate limiting\")." }
        case 431: // Request Header Fields Too Large
            return { status: 431, message: "The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields." }
        case 451: // Unavailable For Legal Reasons
            return { status: 451, message: "The user agent requested a resource that cannot legally be provided, such as a web page censored by a government." }
        // Server error responses
        case 500: // Internal Server Error
            return { status: 500, message: "The server has encountered a situation it does not know how to handle." }
        case 501: // Not Implemented
            return { status: 501, message: "The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD." }
        case 502: // Bad Gateway
            return { status: 502, message: "This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response." }
        case 503: // Service Unavailable
            return { status: 503, message: "The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached." }
        case 504: // Gateway Timeout
            return { status: 504, message: "This error response is given when the server is acting as a gateway and cannot get a response in time." }
        case 505: // HTTP Version Not Supported
            return { status: 505, message: "The HTTP version used in the request is not supported by the server." }
        case 506: // Variant Also Negotiates
            return { status: 506, message: "The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process." }
        case 507: // Insufficient Storage (WebDAV)
            return { status: 507, message: "The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request." }
        case 508: // Loop Detected (WebDAV)
            return { status: 508, message: "The server detected an infinite loop while processing the request." }
        case 510: // Not Extended
            return { status: 510, message: "Further extensions to the request are required for the server to fulfill it." }
        case 511: // Network Authentication Required
            return { status: 511, message: "Indicates that the client needs to authenticate to gain network access." }
        default: // default implementation
            return { status: 500, message: "The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing)." }
    }
}
/**
 * Error handler.
 * @param req the request object
 * @param res the response object
 */
async function errorHandler(req, res, next) {
    const statusCode = req.statusCode || req.status || 404;
    const resolved = errorMessage(statusCode);
    const data = {
        timestamp: new Date().toISOString(),
        url: req.url,
        status: resolved.status,
        errorMessage: resolved.message,
        body: req.body,
        headers: req.headers,
        params: req.params,
        query: req.query,
        secure: req.secure,
        route: req.route,
        title: "Error",
        stackTrace: process.env.NODE_ENV === 'production' ? null : req.stack,
    }

    return res
        .setHeader(
            'Content-Type',
            [
                'text/html; charset=utf-8',
            ]
        )
        .render('pages/error.ejs', {data});
}
/**
 * Standard http callback function to handle errors.
 * @type {Router} error callback response
 */
router.get('/error', errorHandler)

module.exports = {
    errorRouter: router,
    errorHandler: errorHandler};
