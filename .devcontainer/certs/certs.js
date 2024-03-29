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
// filesystem
const fs = require('fs')
const path = require('path');
// initialize SSL configuration using child process
const { exec } = require("node:child_process")

/**
 * Callback for script success.
 * @param cmd the command to execute
 * @param stdout the message returned from the command
 */
async function successCallback(cmd, stdout){
    console.log(`Success executing: ${cmd}`)
    console.log(stdout)
    return stdout;
}

/**
 * Callback for script failure.
 * @param cmd the command to execute
 * @param error the error returned from the command execution
 * @param stderr the error returned from the command execution
 */
async function errorCallback(cmd, error, stderr){
    console.error(`Execution failed for [${cmd}], is invalid.`)
    // console.error(stderr)
    console.error(error)
    return error;
}

/**
 * Execute a shell command or script.
 * @param script the script to generate certificate and private key
 * @param successCallback success callback
 * @param errorCallback error callback
 */
async function execShell(script, successCallback, errorCallback) {
// create the SSL Certificates
    exec(`${script}`, function (error ,stdout, stderr) {
        if (error !== null) {
            // log and return error message
            return errorCallback(script, error, stderr);
        } else {
            return successCallback(script, stdout);
        }
    });
}

/**
 * Execute promise on script or command execution.
 * @param script shell script to execute or command to execute
 * @returns {Promise<void>} a promise that will be fulfilled on the script or command execution
 */
const execShellCmd = async function execShellRun(script){
    return await execShell(
            script,
            successCallback,
            errorCallback
            );
}

/**
 * Generate certificates and private key
 */
function gen_rsa(shell){
    const certs_dir = path.resolve(process.env.CERTS_DIR)
    const hostname = process.env.HOSTNAME || "localhost"
    const prefix = hostname.toString().replace('.com', '') || "localhost"
    const port = process.env.PORT || 8080

    // generate if no .certs directory found
    if (!fs.existsSync(`${certs_dir}/.certs`))
    {
        console.log(`No certificate files found.\nGenerating new certificate files.\n`);
        console.log(`Generating certificate for hostname: ${hostname}:${port}`)
        shell(`mkdir -p "${certs_dir}/.certs"`)
        shell(`sh ${certs_dir} "-s" "${hostname}" "${certs_dir}/.certs"`)
    } else {
        // check the certs if they are found
        fs.readdir(`${certs_dir}/.certs`, (err, files) => {
            
            const certs = {
                crt: `${prefix}.x509.crt`,
                key: `${prefix}.key.pem`,
                pem: `${prefix}.ca.pem`,
                pub: `${prefix}.pub`,
                req: `${prefix}.req`
            }
            let count = 0;
            try {
                if (err) { // exit on errorCallback
                    console.error("No certificate files found.")
                    console.error(err);
                }
                else if (files){
                    for (let file of files) {
                        for (let key in certs) {
                            switch(`${file}`) {
                                case `${certs[key]}`:
                                    console.log(`SSL dependency found: ${file}`);
                                    count += 1;
                                    break;
                                default:
                            }
                        }
                    }
                }


                if (count !== 5)
                {
                    console.log(`Expected 5 Certificate files but ${files.length} were found.
Due to missing files, new certificates will have to be generated.
Generating new certificate files for hostname: ${hostname}......\n`);
                    shell(`rm -rf ${certs_dir}/.certs`);
                    shell(`sh ${certs_dir} "-s" "${hostname}" "${certs_dir}/.certs"`);
                } else {
                    console.log(`SSL Certificate already exists...\nReusing certificates...`)
                }
            } catch (e) {
                console.error(e);
            }
        });

    }

}

function certs() {
    gen_rsa(execShellCmd, (callback) => {
        console.dir(callback)
    });
}

module.exports = {
    certs: certs
}