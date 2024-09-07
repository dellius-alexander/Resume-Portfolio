const {readFileSync} = require('fs');
const yaml = require('yaml');
const log = require('./logger').getLogger();


/**
 * @class YAMLParser
 * @description A class to parse YAML files
 * @param {string} file - The file to parse
 * @param {function} callback - A callback function to call after parsing the file. If no
 * callback is provided, the parse function will return the parsed data. If a callback is
 * provided, the parse function will return null. The callback function should take two
 * arguments: the parsed data as first argument and an error as second argument or null.
 * @param {object} options - Options to pass to the readFile function
 */
class YAMLParser {
    file = null;
    options = null;
    parsedData = null;

    constructor (
        file = '../assets/docs/resume-data.yaml',
        options = {encoding: 'utf8', flag: 'r'}
    ){
        this.file = file;
        this.options = options;
        this.parsedData = this.parse(this.file, null, this.options);
    }

    parse(file = this.file || null, callback = null, options = this.options){
        log.info('Parsing YAML file...');
        log.info(`File: ${file}`);
        log.info(`Callback: ${callback}`);
        log.info(`Options: ${options}`);
        if (file === null) throw new Error('No file provided');
        try {
            let data = readFileSync(`${file}`, options);
            data = yaml.parse(data.toString());
            log.info(`Parsed YAML Data To Object Version: `);
            log.info(`Version: ${data['version']}`);
            if (callback === null) return data;
            else return callback(data, null);
        } catch (err) {
            log.error(`Error: ${err}`);
            if (callback === null) throw err;
            else return callback(null, err);
        }
    }

    toString(){
        return `YAMLParser: \n${this.file}`;
    }

    toJSON(){
        return JSON.stringify({
            file: this.file,
            options: this.options,
            parsedData: this.parsedData

        });
    }

}

module.exports = {
    YAMLParser
};

