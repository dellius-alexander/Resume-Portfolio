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
// filesystem
const fs = require('fs')
const path = require('path');
// initialize SSL configuration using child process
const { exec } = require("node:child_process")
// import environment variables
const dotenv = require('dotenv')
const result = dotenv.config({
                            path: path.join(__dirname, ".env"),
                            encoding: 'utf8',
                            debug: true,
                            override: true
                        }
                    )
// check the results for errors
if (result.error) {
    throw result.error
} else {
    console.log(result)
}


/**
 * Callback for script success.
 * @param cmd the command to execute
 * @param stdout the message returned from the command
 */
function successCallback(cmd, stdout){
    console.log(`Success executing: ${cmd}`)
    console.log(stdout)
}

/**
 * Callback for script failure.
 * @param cmd the command to execute
 * @param stderr the error returned from the command execution
 */
function errorCallback(cmd, stderr){
    console.error(`Execution failed for [${cmd}], is invalid.`)
    console.error(stderr)
}

/**
 * Execute a shell command or script.
 * @param script the script to generate certificate and private key
 * @param successCallback success callback
 * @param errorCallback error callback
 */
async function certs(script, successCallback, errorCallback) {
// create the SSL Certificates
    exec(`${fs.existsSync(script) ? script : script}`, function (error ,stdout, stderr) {
        if (error !== null) {
            // log and return error message
            errorCallback(script, error + " \n" +  stderr)
        } else {
            successCallback(script, stdout)
        }
    });
}

/**
 * Execute promise on script or command execution.
 * @param script shell script to execute or command to execute
 * @returns {Promise<void>} a promise that will be fulfilled on the script or command execution
 */
module.exports.exec = async function execShellRun(script){
    return await certs(
            script,
            successCallback,
            errorCallback
            );
}
/**
 * Generate certificates and private key
 */
fs.readdir(path.join(__dirname, `.certs`), (err, files) => {
    // const certs = {
    //     crt: `example.crt`,
    //     key: `example.key`,
    //     pem: `example.pem`,
    //     pub: `example.pub`,
    //     req: `example.req`
    // }
    try {
        console.log(`Certificate files: ${files}`);
        if (files === undefined) {
            console.log(`No certificate files found.\nGenerating new certificate files.\n`);
            exec(`sh  ${path.join(__dirname, 'certs.sh')}`)
        } else if (files.length !== 5) {
            console.log(`5 Certificate files expected but ${files.length} were found.
Due to missing files, new certificates will have to be generated.
Generating new certificate files for hostname: ${process.env.HOSTNAME}......\n`);
            exec(`sh  ${path.join(__dirname, 'certs.sh')}`)
        } else {
            console.log(`SSL Certificate already exists...\nReusing certificates...`)
        }
    } catch (e) {
        console.error(e);
    }
});