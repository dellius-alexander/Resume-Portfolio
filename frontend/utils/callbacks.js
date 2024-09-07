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

/**
 * Standard callback function
 * @param req
 * @param res
 * @param next
 * @return {Promise<{message: string}>}
 */
async function callback(req, res, next) {
    console.dir(res);
    console.dir(req);
    console.dir(next);
    if (res.statusCode === 200) {
        return {
            message: "Success",
            status: res.statusCode
        }
    }
    if (res.statusCode === 400) {
        return {
            message: "Bad Request",
            error: res.statusMessage,
            status: res.statusCode
        }
    }
    if (res.statusCode === 401) {
        return {
            message: "Unauthorized",
            error: res.statusMessage,
            status: res.statusCode
        }
    }
    if (res.statusCode === 403) {
        return {
            message: "Forbidden",
            error: res.statusMessage,
            status: res.statusCode
        }
    }
    if (res.statusCode === 404) {
        return {
            message: "Not Found",
            error: res.statusMessage,
            status: res.statusCode
        }
    }
    if (res.statusCode === 500) {
        return {
            message: "Internal Server Error",
            error: res.statusMessage,
            status: res.statusCode
        }
    }
    if (res.statusCode === 503) {
        return {
            message: "Service Unavailable",
            error: res.statusMessage,
            status: res.statusCode
        }
    }
    if (res.statusCode === 504) {
        return {
            message: "Gateway Timeout",
            error: res.statusMessage,
            status: res.statusCode
        }
    }
    return {
        message: "Unknown Error",
        error: res.statusMessage,
        status: res.statusCode
    }
}


module.exports = {
    callback: callback
}