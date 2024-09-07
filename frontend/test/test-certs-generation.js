const {certs} = require('../utils/certs');
const log = require('../utils/logger').getLogger();
const stackTrace = require("stack-trace");

// import environment variables
try {
  ;(function(){
    log.info({message: 'Testing cert generation......', trace: stackTrace.get()});
    log.info({message: 'Importing server dependencies......', trace: stackTrace.get()});
    const result = require('../utils/config').config({pathEnv: '../../.env'});
    if (result) {
      log.info({message: 'Successfully imported server dependencies......',  trace: stackTrace.get()});
      console.dir(result);
    }
  })();
} catch (e) {
  console.error('Error loading environment variables.')
  console.dir(e)
}

;(function() {
  const results = certs();
  log.info(`Results: ${results}`);
  log.info('Done!!!');
  // process.exit(0);
})();

