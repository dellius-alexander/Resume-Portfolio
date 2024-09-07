const {generateKeyPair} = require('../utils/certs');

;(async () => {
    try {
        await generateKeyPair('../certs/.certs', 'delliusalexander')
    } catch (e) {
        console.error(e)
    }
})();