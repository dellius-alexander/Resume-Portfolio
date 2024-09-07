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
const path = require('path')

/**
 * Loads environment variables from a file into process.env
 * @param options - pathEnv: string, encoding: string, debug: boolean, override: boolean
 * @returns {{error: Error}|*}
 */
function config(
    options  = {
        pathEnv: '.env',
        encoding: 'utf8',
        debug: true,
        override: true
    }) {
    try {
        let pathEnv = options.pathEnv === undefined || options.pathEnv === null ? '.env' : options.pathEnv;
        console.log("Loading environment file: " + pathEnv);
        // check for absolute path
        if (path.isAbsolute(`${pathEnv}`) && fs.existsSync(`${pathEnv}`)) {
            pathEnv = path.resolve(`${pathEnv}`);
        } else {
            // check for relative path
            if (!fs.existsSync(pathEnv)) {
                // walk up the directory tree to find the file, a maximum of 3 levels
                let i = 0;
                let found = false;
                pathEnv = pathEnv.split(/\//g).slice(-1).join('/');
                // pathEnv =  process.cwd() + "/" + pathEnv;
                console.log(`Testing current env file path: ${pathEnv}`)

                let parentDir = ".";
                while (found === false && i < 5)
                {
                    const tempEnv = path.join(`${parentDir}`, `${pathEnv}`)
                    console.log("Checking directory: " + tempEnv)

                    if (fs.existsSync(`${tempEnv}`)) {
                        pathEnv = path.resolve(`${tempEnv}`);
                        console.log(`Found file: ${pathEnv}`)
                        found = true;
                        break;
                    }
                    i++;
                    parentDir = process.cwd().split('/').slice(0, -1).join('/');
                }
            }

        }
        console.log("Using environment file: " + pathEnv);
        // set options
        this.options = Object.assign({}, {
            path: pathEnv,
            encoding: options.encoding || 'utf8',
            debug: options.debug || true,
            override: options.override || true
        });
        console.log(Object.entries(this.options));
        // get environment file
        if (fs.existsSync(pathEnv)){
            const result = dotenv.config(this.options);
            if (result.error) {
                throw new Error(`Error loading environment file: ${pathEnv} \n
                Please ensure that the file exists and is valid.\n
                If you are using a custom file name, please ensure that the file is in the root directory of your project.\n
                ${result.error}
                `);
            } else {
                return result;
            }
        } else {
            console.log("No environment file found. Continuing with default runtime configuration.");
            console.log(process.env);
        }
    } catch (err) {
        console.error(err)
        return {error: err}
    }
}

module.exports = {
    config: config
}