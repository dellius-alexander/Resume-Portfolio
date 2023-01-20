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
const fs = require("fs");
const path = require("path");

/**
 * Creates a sha256 base64 encoded hash string from the given
 * input string
 * @param {String} string input string
 * @return {*}
 */
function sha256(string= "default") {
    return crypto.createHash('sha256').update(string).digest('base64');
}

/**
 * SSL certificate options for https connections.
 * Print the certificate and public key fingerprints of all certs in the
 * chain. It's common to pin the public key of the issuer on the public
 * internet, while pinning the public key of the service in sensitive
 * environments.
 * @type {{cert: string, ca: string, key: string}}
 */
const sslOptions = Object.assign(
    {},
    {
        // ca <string> | <string[]> | <Buffer> | <Buffer[]> Optionally override the trusted CA certificates. Default is to trust the well-known CAs curated by Mozilla. Mozilla's CAs are completely replaced when CAs are explicitly specified using this option. The value can be a string or Buffer, or an Array of strings and/or Buffers. Any string or Buffer can contain multiple PEM CAs concatenated together. The peer's certificate must be chainable to a CA trusted by the server for the connection to be authenticated. When using certificates that are not chainable to a well-known CA, the certificate's CA must be explicitly specified as a trusted or the connection will fail to authenticate. If the peer uses a certificate that doesn't match or chain to one of the default CAs, use the ca option to provide a CA certificate that the peer's certificate can match or chain to. For self-signed certificates, the certificate is its own CA, and must be provided. For PEM encoded certificates, supported types are "TRUSTED CERTIFICATE", "X509 CERTIFICATE", and "CERTIFICATE". See also tls.rootCertificates.
        ca: fs.readFileSync(path.resolve(process.env.SSL_CA_FILE), {encoding: 'utf-8'}),
        // cert <string> | <string[]> | <Buffer> | <Buffer[]> Cert chains in PEM format. One cert chain should be provided per private key. Each cert chain should consist of the PEM formatted certificate for a provided private key, followed by the PEM formatted intermediate certificates (if any), in order, and not including the root CA (the root CA must be pre-known to the peer, see ca). When providing multiple cert chains, they do not have to be in the same order as their private keys in key. If the intermediate certificates are not provided, the peer will not be able to validate the certificate, and the handshake will fail.
        cert: fs.readFileSync(path.resolve(process.env.SSL_CERT_FILE), {encoding: 'utf-8'}),
        // sigalgs <string> Colon-separated list of supported signature algorithms. The list can contain digest algorithms (SHA256, MD5 etc.), public key algorithms (RSA-PSS, ECDSA etc.), combination of both (e.g 'RSA+SHA384') or TLS v1.3 scheme names (e.g. rsa_pss_pss_sha512). See OpenSSL man pages for more info.
        // ciphers <string> Cipher suite specification, replacing the default. For more information, see Modifying the default TLS cipher suite. Permitted ciphers can be obtained via tls.getCiphers(). Cipher names must be uppercased in order for OpenSSL to accept them.
        // clientCertEngine <string> Name of an OpenSSL engine which can provide the client certificate.
        // crl <string> | <string[]> | <Buffer> | <Buffer[]> PEM formatted CRLs (Certificate Revocation Lists).
        // dhparam <string> | <Buffer> Diffie-Hellman parameters, required for perfect forward secrecy. Use openssl dhparam to create the parameters. The key length must be greater than or equal to 1024 bits or else an error will be thrown. Although 1024 bits is permissible, use 2048 bits or larger for stronger security. If omitted or invalid, the parameters are silently discarded and DHE ciphers will not be available.
        // ecdhCurve <string> A string describing a named curve or a colon separated list of curve NIDs or names, for example P-521:P-384:P-256, to use for ECDH key agreement. Set to auto to select the curve automatically. Use crypto.getCurves() to obtain a list of available curve names. On recent releases, openssl ecparam -list_curves will also display the name and description of each available elliptic curve. Default: tls.DEFAULT_ECDH_CURVE.
        // honorCipherOrder <boolean> Attempt to use the server's cipher suite preferences instead of the client's. When true, causes SSL_OP_CIPHER_SERVER_PREFERENCE to be set in secureOptions, see OpenSSL Options for more information.
        // key <string> | <string[]> | <Buffer> | <Buffer[]> | <Object[]> Private keys in PEM format. PEM allows the option of private keys being encrypted. Encrypted keys will be decrypted with options.passphrase. Multiple keys using different algorithms can be provided either as an array of unencrypted key strings or buffers, or an array of objects in the form {pem: <string|buffer>[, passphrase: <string>]}. The object form can only occur in an array. object.passphrase is optional. Encrypted keys will be decrypted with object.passphrase if provided, or options.passphrase if it is not.
        key: fs.readFileSync(path.resolve(process.env.PRIVATE_KEY_FILE), {encoding: 'utf-8'}),
        // privateKeyEngine <string> Name of an OpenSSL engine to get private key from. Should be used together with privateKeyIdentifier.
        // privateKeyIdentifier <string> Identifier of a private key managed by an OpenSSL engine. Should be used together with privateKeyEngine. Should not be set together with key, because both options define a private key in different ways.
        // maxVersion <string> Optionally set the maximum TLS version to allow. One of 'TLSv1.3', 'TLSv1.2', 'TLSv1.1', or 'TLSv1'. Cannot be specified along with the secureProtocol option; use one or the other. Default: tls.DEFAULT_MAX_VERSION.
        // minVersion <string> Optionally set the minimum TLS version to allow. One of 'TLSv1.3', 'TLSv1.2', 'TLSv1.1', or 'TLSv1'. Cannot be specified along with the secureProtocol option; use one or the other. Avoid setting to less than TLSv1.2, but it may be required for interoperability. Default: tls.DEFAULT_MIN_VERSION.
        // passphrase <string> Shared passphrase used for a single private key and/or a PFX.
        // pfx <string> | <string[]> | <Buffer> | <Buffer[]> | <Object[]> PFX or PKCS12 encoded private key and certificate chain. pfx is an alternative to providing key and cert individually. PFX is usually encrypted, if it is, passphrase will be used to decrypt it. Multiple PFX can be provided either as an array of unencrypted PFX buffers, or an array of objects in the form {buf: <string|buffer>[, passphrase: <string>]}. The object form can only occur in an array. object.passphrase is optional. Encrypted PFX will be decrypted with object.passphrase if provided, or options.passphrase if it is not.
        // secureOptions <number> Optionally affect the OpenSSL protocol behavior, which is not usually necessary. This should be used carefully if at all! Value is a numeric bitmask of the SSL_OP_* options from OpenSSL Options.
        // secureProtocol <string> Legacy mechanism to select the TLS protocol version to use, it does not support independent control of the minimum and maximum version, and does not support limiting the protocol to TLSv1.3. Use minVersion and maxVersion instead. The possible values are listed as SSL_METHODS, use the function names as strings. For example, use 'TLSv1_1_method' to force TLS version 1.1, or 'TLS_method' to allow any TLS protocol version up to TLSv1.3. It is not recommended to use TLS versions less than 1.2, but it may be required for interoperability. Default: none, see minVersion.
        // sessionIdContext <string> Opaque identifier used by servers to ensure session state is not shared between applications. Unused by clients.
        // ticketKeys: <Buffer> 48-bytes of cryptographically strong pseudorandom data. See Session Resumption for more information.
        // sessionTimeout <number> The number of seconds after which a TLS session created by the server will no longer be resumable. See Session Resumption for more information. Default: 300.
    })
/**
 * Set server port and hostname configuration options
 * @type {{hostname: *, port: (*|number)}}
 */
const cfg = Object.assign(
    {},
    {
        port: process.env.PORT || 8080,
        hostname: process.env.HOSTNAME || process.env.NODEHOSTNAME
    })

module.exports = {sslOptions, cfg};