const forge = require('node-forge');

// Step 1: Create a private key for the CA
const caKeys = forge.pki.rsa.generateKeyPair(2048);
const caKey = caKeys.privateKey;

// Step 2: Create a X509 certificate for the CA
const caCert = forge.pki.createCertificate();
caCert.publicKey = caKeys.publicKey;
caCert.serialNumber = '01';
caCert.validity.notBefore = new Date();
caCert.validity.notAfter = new Date();
caCert.validity.notAfter.setFullYear(caCert.validity.notBefore.getFullYear() + 1);
const caAttrs = [{
    name: 'commonName',
    value: 'CA'
}];
caCert.setSubject(caAttrs);
caCert.setIssuer(caAttrs);

// Step 3: Sign the CA's certificate with its own private key
caCert.sign(caKey);

// Step 4: Create a private key for the server
const serverKeys = forge.pki.rsa.generateKeyPair(2048);
const serverKey = serverKeys.privateKey;

// Step 5: Create a X509 certificate for the server
const serverCert = forge.pki.createCertificate();
serverCert.publicKey = serverKeys.publicKey;
serverCert.serialNumber = '02';
serverCert.validity.notBefore = new Date();
serverCert.validity.notAfter = new Date();
serverCert.validity.notAfter.setFullYear(serverCert.validity.notBefore.getFullYear() + 1);
const serverAttrs = [{
    name: 'commonName',
    value: 'Server'
}];
serverCert.setSubject(serverAttrs);
serverCert.setIssuer(caAttrs);

// Step 6: Sign the server's certificate with the CA's private key
serverCert.sign(caKey);

// Convert CA cert and server cert to PEM format
const caCertPem = forge.pki.certificateToPem(caCert);
const serverCertPem = forge.pki.certificateToPem(serverCert);

console.log('CA Certificate:\n', caCertPem);
console.log('Server Certificate:\n', serverCertPem);