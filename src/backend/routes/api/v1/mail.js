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
// const fs = require('fs')
// const dotenv = require('dotenv');
const express = require('express')
const router = express.Router();
const { postMail, getMail } = require(path.join(process.env.APP_HOME, 'src/backend/controllers/mail'))
// try {
//     if (fs.existsSync(path.join(process.env.APP_HOME, '.env'))) {
//         const result = dotenv.config({ // if we have environment file we use it, else default runtime environment
//                 path: path.join(process.env.APP_HOME, ".env"),
//                 encoding: 'utf8',
//                 debug: true,
//                 override: true
//             }
//         )
//         if (result.error) {
//             throw result.error
//         }
//         // else {
//         //     // console.log(result)
//         // }
//     }
// }
// catch (e) {
//     console.error(e)
//     console.error(`Startup will continue, defaulting to runtime environment.`)
// }

/**
 * mail error callback handler.
 * @param msg custom error message
 * @param err error message from server
 */
const mailErrorCallback = function(msg, err){
    console.error(msg, err)
}

/**
 * Get a list of mail messages.
 */
router.get('/api/v1/mail', getMail, mailErrorCallback);

/**
 * API endpoint for sending emails messages.
 * Create a new attempt to post an email message.
 */
router.post('/api/v1/mail/post', postMail, mailErrorCallback);

module.exports = router

