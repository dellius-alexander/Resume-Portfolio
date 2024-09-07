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
const crypto = require('crypto');
// initialize SSL configuration using child process
const {execSync} = require("node:child_process");
const log = require('./logger').getLogger();

log.info(`Initializing SSL configuration...`);

/**
 * Callback function to execute on success or failure.
 * @param error the error message
 * @param stdout the standard output
 * @param stderr the standard error
 * @return {{stdout: *, stderr: *}} the standard output and standard error
 */
function Callback(error = null, stdout = null, stderr = null) {
    this.stdout = stdout;
    this.stderr = stderr;
    this.error = error;
    // log the callback object
    log.info(`Callback object: \n${this.toString()}`);
    // Analyze the properties of the callback object
    if (this.error !== null) {
        // log and return error message
        log.error(`Execution failed for [${this.stdout}], is invalid.`)
        log.error(this.stderr)
        log.error(this.error)
        return {stdout: this.stdout, stderr: this.stderr};
    } else {
        log.info(`Success executing: \n${this.stdout}`)
        log.info(`StdOut: \n${this.stdout}`)
        return {stdout: this.stdout, stderr: this.stderr};
    }
}

/**
 * Generate the public and private key pair.
 * @param certs_dir the directory to store the certificates
 * @param prefix the prefix to use for the certificate files
 * @returns {Promise<void>} a promise that will be fulfilled on the script or command execution
 */
function generateKeyPair(certs_dir, prefix) {
    const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,  // the length of your key in bits
        publicKeyEncoding: {
            type: 'spki',     // recommended to be 'spki'
            format: 'pem',     // recommended to be 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',    // recommended to be 'pkcs8'
            format: 'pem',     // recommended to be 'pem'

        }
    });

    // Create the public key file
    fs.writeFileSync(path.join(path.resolve(certs_dir), `${prefix}.public.key.pem`), publicKey);

    // Create the private key file
    fs.writeFileSync(path.join(path.resolve(certs_dir), `${prefix}.private.key.pem`), privateKey);


}

/**
 * Execute a shell command or script.
 * @param script the script to generate certificate and private key
 * @param callback callback function to execute on success or failure
 * @returns {*} a promise that will be fulfilled on the script or command execution
 */
function execShell(script, callback) {
// create the SSL Certificates
    try {
        return execSync(`${script}`, (error, stdout, stderr) => {
            log.info({
                label: execShell, message: `Executing script: ${script}`
            });
            if (error) {
                log.error(`error: ${error.message}`);
                if (callback) return callback(error, stdout, stderr);
                return {error, stdout, stderr};
            }
            if (stderr) {
                log.error(`stderr: ${stderr}`);
                if (callback) return callback(error, stdout, stderr);
                return {error, stdout, stderr};
            }
            log.info(`stdout: ${stdout}`);
            if (callback) return callback(error, stdout, stderr);
            return {error, stdout, stderr};
        });

    } catch (err) {
        log.error(err, `Error executing script: ${script}`);
        return {error: err, stdout: null, stderr: null};
    }
}

/**
 * Generate the SSL configuration file.
 * @param prefix the domain name
 * @param port the port number
 * @param hostname the main domain name
 * @param certs_dir the directory to store the certificates
 * @returns {string} the path to the SSL configuration file
 */
function generate_config_file(prefix, port, hostname, certs_dir) {
    const configFilePath = `${certs_dir}/${prefix}.cnf`;
    const configFileData = `
# OpenSSL configuration file for creating a CSR for a server certificate
[ req ]
default_bits        = 4096
default_keyfile     = ${prefix}.key
distinguished_name  = subject
req_extensions      = req_ext
x509_extensions     = x509_ext
string_mask         = utf8only
prompt              = no
port                = ${port}

[ subject ]
countryName         = US
stateOrProvinceName = GA
localityName        = Atlanta
organizationName    = Hyfi Solutions
organizationalUnitName = Hyfi Solutions
commonName          = ${hostname}
emailAddress        = admin@${hostname}

# Section x509_ext is used when generating a self-signed certificate.
[ x509_ext ]
subjectKeyIdentifier    = hash
authorityKeyIdentifier  = keyid,issuer
basicConstraints        = CA:FALSE
keyUsage                = digitalSignature, keyEncipherment
subjectAltName          = @alternate_names
nsComment               = "OpenSSL Generated Certificate"
extendedKeyUsage        = serverAuth, clientAuth

# Section req_ext is used when generating a certificate signing request.
[ req_ext ]
subjectKeyIdentifier = hash
basicConstraints     = CA:FALSE
keyUsage             = digitalSignature, keyEncipherment
subjectAltName       = @alternate_names
nsComment            = "OpenSSL Generated Certificate"
extendedKeyUsage     = serverAuth, clientAuth

# add additional DNS options for the server hostname lookup
[ alternate_names ]
DNS.1 = ${hostname}
DNS.2 = www.${hostname}
DNS.3 = https://${hostname}
DNS.4 = https://${hostname}:${port}
DNS.5 = https://www.${hostname}
DNS.6 = https://www.${hostname}:${port}
DNS.7 = http://${hostname}
DNS.8 = http://${hostname}:${port}
DNS.9 = http://www.${hostname}
DNS.10 = http://www.${hostname}:${port}
DNS.11 = localhost
DNS.12 = localhost:${port}
DNS.13 = https://127.0.0.1
DNS.14 = https://127.0.0.1:${port}
`;
    try {
        // check if the SSL configuration file exists
        if (fs.existsSync(`${configFilePath}`)) {
            log.info(`SSL configuration file found at: ${configFilePath}`);
            return configFilePath;  // return the path to the SSL configuration file
        }

        // else create the SSL configuration file
        log.info(`Creating SSL configuration file: ${configFilePath}`);
        fs.writeFileSync(`${configFilePath}`, configFileData, {encoding: 'utf8', flag: 'w'});
        log.info(`SSL configuration file created at: ${configFilePath}`);
        return configFilePath;  // return the path to the SSL configuration file
    } catch (err) {
        log.error(err);
    }
}

function generate_database_index_file(certs_dir, callback) {
    try {
        // generate the certificates and private key
        const script = `touch ${certs_dir}/index.txt`;
        log.info(script);
        return execShell(`${script}`, callback);
    } catch (err) {
        log.error(err);
    }
}

function verifyCertificates(certs_dir, prefix, algorithm, callback) {
    try {
        // Read the certificate, public key, private key and full chain
        const cert = fs.readFileSync(`${certs_dir}/${prefix}.x509.crt`);
        const publicKey = fs.readFileSync(`${certs_dir}/${prefix}.pub`);
        const privateKey = fs.readFileSync(`${certs_dir}/${prefix}.key.pem`);
        const fullChain = fs.readFileSync(`${certs_dir}/${prefix}.ca.pem`);

        // Create a verifier object
        const verifier = crypto.createVerify(`${algorithm}`);

        // Add data to the verifier
        verifier.update(cert);

        // Verify the data against the public key, private key and full chain
        const isCertValid = verifier.verify(publicKey, cert);
        const isPrivateKeyValid = verifier.verify(privateKey, cert);
        const isFullChainValid = verifier.verify(fullChain, cert);

        // Log the results
        log.info(`Certificate is valid: ${isCertValid}`);
        log.info(`Private key is valid: ${isPrivateKeyValid}`);
        log.info(`Full chain is valid: ${isFullChainValid}`);
        if (callback) return callback(
            {
                isCertValid, isPrivateKeyValid, isFullChainValid
            },
            null,
            null,
            null
        );
        return isFullChainValid;
        // return { cert: isCertValid, privateKey: isPrivateKeyValid, fullChain: isFullChainValid };
    } catch (error) {
        log.error(`Error verifying certificates: ${error}`);
    }
}

function generate_private_key(keyFile, keySize, callback) {
    try {
        // generate the certificates and private key
        const script = `openssl genrsa  -passout pass:${process.env.KEYPASS} -out ${keyFile} ${keySize};`;
        log.info(script);
        return execShell(`${script}`, callback);
    } catch (err) {
        log.error(err);
    }
}

function generate_csr(csr, keyFile, keySize, configFile, callback) {
    try {
        // generate the certificates and private key
        const script = `openssl req -new -key "${keyFile}" -passin pass:${process.env.KEYPASS} -out "${csr}" -config "${configFile}";`;
        log.info(script);
        return execShell(`${script}`, callback);
    } catch (err) {
        log.error(err);
    }
}

function sign_ca_csr(csr, CAKeyFile, CACertFile, callback) {
    try {
        // generate the certificates and private key
        const script = `openssl x509 -req -in ${csr} -signkey "${CAKeyFile}" -passin pass:${process.env.KEYPASS} -out "${CACertFile}";`;
        log.info(script);
        return execShell(`${script}`, callback);
    } catch (err) {
        log.error(err);
        log.error(`Error signing CSR with PRIVATE KEY`);
    }
}

function sign_csr(csr, certificateCAFile, CAKeyFile, serverCertFile, configFile, callback) {
    try {
        // generate the full chain
        const script = `openssl x509 -req -in "${csr}" -CA "${certificateCAFile}" \\
            -CAkey "${CAKeyFile}" -CAcreateserial -out "${serverCertFile}" -days 365 -sha256;`;
        log.info(script);
        return execShell(`${script}`, callback);
    } catch (err) {
        log.error(err);
        log.error(`Error signing CSR with PRIVATE KEY`);
    }
}

function generate_fullChain(serverKeyFile, certificateFile, fullChainFile, callback) {
    try {
        // generate the full chain
        const script = `cat "${serverKeyFile}" "${certificateFile}" > "${fullChainFile}"`;
        log.info(script);
        return execShell(`${script}`, callback);
    } catch (err) {
        log.error(err);
    }
}

function generate_publicKey(certificateFile, publicKeyFile, callback) {
    try {
        // generate the full chain
        const script = `openssl x509 -pubkey -noout -in "${certificateFile}" > "${publicKeyFile}"`;
        log.info(script);
        return execShell(`${script}`, callback);
    } catch (err) {
        log.error(err);
    }
}
/**
 * Generate the SSL certificates.
 * @param certs_dir the directory to store the certificates
 * @param hostname the hostname
 * @param port the port number
 * @param callback callback function to execute on success or failure
 * @returns {Promise<void>} a promise that will be fulfilled on the script or command execution
 */
function gen_rsa(certs_dir = "certs", hostname = "localhost", port, callback) {
    const suffixRegex = /.com|.net|.org|.edu|.gov|.biz|.info|.io|.co|.uk|.ca|/gi;
    // split the hostname and remove the suffix
    const prefix = hostname.toString().replace(suffixRegex, '');

    // Create a sentinel to stop the execution
    let sentinel = false;

    // Create certificate directory if it does not exist
    if (!fs.existsSync(`${certs_dir}`)) {
        log.info(`No certificate directory found.`);
        log.info(`Creating certificate directory at: ${certs_dir}`);
        fs.mkdirSync(certs_dir, {recursive: true});
    }

    // check the certs if they are found
    fs.readdir(`${certs_dir}`, (err, files) => {

        const certs = {
            crt: `${prefix}.x509.crt`,
            key: `${prefix}.key.pem`,
            pem: `${prefix}.ca.pem`,
            pub: `${prefix}.pub`,
            req: `${prefix}.req`
        }
        // count the number of certificates found
        let count = 0;

        // log the error upon reading the certs directory
        if (err) { // exit on errorCallback
            log.error("No certificate files found.")
            log.error(err);
        } else if (files) {
            for (let file of files) {
                for (let key in certs) {
                    switch (`${file}`) {
                        case `${certs[key]}`:
                            log.info(`SSL dependency found: ${file}`);
                            count += 1;
                            break;
                        default:
                    }
                }
            }
        }

        // update the sentinel
        if (count >= 4) {
            sentinel = true;
        }

    });

    // define the certificate files and paths
    const caKeyFile = `${certs_dir}/ca.key`;
    const caCertFile = `${certs_dir}/ca.crt`;
    const caCsrFile = `${certs_dir}/ca.csr`;
    const serverKeyFile = `${certs_dir}/${prefix}.key`;
    const serverCertFile = `${certs_dir}/${prefix}.x509.crt`;
    const serverCsrFile = `${certs_dir}/${prefix}.csr`;
    const serverFullChain = `${certs_dir}/${prefix}.fullchain.pem`;
    const serverPublicKey = `${certs_dir}/${prefix}.pub`;

    // if the sentinal is false, generate the certificates
    if (sentinel === false) {
        log.info(`Generating SSL certificates...`);
        try {
            let results = null;


            // generate the database index file
            results = generate_database_index_file(`${certs_dir}`, callback);
            log.info(results);
            // generate the config file
            const configFile = generate_config_file(`${prefix}`, `${port}`, `${hostname}`, `${certs_dir}`);
            log.info(configFile);
            // Generate a private key for the CA
            results = generate_private_key(`${caKeyFile}`, 4096, callback);
            log.info(results);
            // Generate a CSR for the CA
            results = generate_csr(`${caCsrFile}`, `${caKeyFile}`, 4096, `${configFile}`,  callback);
            log.info(results);
            // Self-sign the CSR with the CA private key
            results = sign_ca_csr(`${caCsrFile}`, `${caKeyFile}`, `${caCertFile}`, callback);
            log.info(results);
            // Generate a private key for the server
            results = generate_private_key(`${serverKeyFile}`,  4096,  callback);
            log.info(results);
            // Generate a CSR for the server type -x509
            results = generate_csr(`${serverCsrFile}`, `${serverKeyFile}`, 4096, `${configFile}`, callback);
            log.info(results);
            // Sign the server CSR with the CA private key
            results = sign_csr(`${serverCsrFile}`, `${caCertFile}`, `${caKeyFile}`, `${serverCertFile}`, `${configFile}`, callback);
            log.info(results);
            // Generate the full chain
            results = generate_fullChain(`${serverKeyFile}`, `${serverCertFile}`,`${serverFullChain}`, callback);
            log.info(results);
            // Generate the public key
            results = generate_publicKey(`${serverCertFile}`, `${serverPublicKey}`, callback);
            log.info(results);
        } catch (err) {
            log.error(err);
        }

    } else {
        log.info(`SSL dependencies found. Verifying certificates...`)
    }
    // // Verify the certificates
    // const verify = `openssl verify -CAfile ${caCertFile} ${serverCertFile}`;
    // log.info(verify);
    // const result = execShell(verify, callback);
    // const validRegex = /OK/gi;
    // // return the result
    // if (validRegex.test(result)) {
    //     log.info(`SSL certificates are valid. \nStdOut: ${result}`);
    //     return result;
    // } else {
    //     log.error(`SSL certificates are invalid.`)
    //     log.error(`StdOut: ${result.forEach((item) => {return item})}`);
    //     process.exit(1);
    //     // return gen_rsa(certs_dir, hostname, port, callback);
    // }
}

function certs() {
    // generateKeyPair(process.env.CERTS_DIR, process.env.HOSTNAME)
    return gen_rsa(process.env.CERTS_DIR, process.env.HOSTNAME, process.env.PORT, Callback);
}

module.exports = {
    certs: certs,
    generateKeyPair: generateKeyPair
}