const fs = require('fs')
// initialize SSL configuration using child process
const { exec } = require("node:child_process")
// import environment variables
const dotenv = require('dotenv')

async function config(options){
    this.envFile = __dirname.replace(`utils`, ``) + ".env";
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