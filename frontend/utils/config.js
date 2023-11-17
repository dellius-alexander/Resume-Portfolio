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
const fs = require('fs')
// import environment variables
const dotenv = require('dotenv')

async function config(envFile, options){
    this.envFile = envFile || ".env";
    // walk up the directory tree recursively until we find the .env file
    while (!fs.existsSync(this.envFile)){
        this.envFile = '../' + this.envFile;
    }
    this.options = options === undefined || options === null || Object.keys(options).length === 0 ? Object.create({
        path: this.envFile,
        encoding: 'utf8',
        debug: true,
        override: true
    }) : Object.assign({}, options);
    // get environment file
    if (fs.existsSync(this.envFile)){
        const result = dotenv.config(
            this.options
        )
        if (result.error) {
            throw result.error
        } else {
            console.dir(result)
            return result;
        }
    } else {
        console.dir("No environment file found. Continuing with default runtime configuration.")
        console.dir(process.env)
    }
}

module.exports = {
    config
}