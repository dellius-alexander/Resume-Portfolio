const {getResumeDataFromYAMLFile} = require("../utils/resumeParser");

/**
 * @description ResumeFromYaml class to parse resume from yaml file
 * @class
 * @param {string} filePath - path to the yaml file
 * @property {string} filePath - path to the yaml file
 * @property {object} resumeData - resume data
 */
class ResumeFromYaml {
    filePath;
    resumeData;

    constructor(filePath) {
        this.filePath = filePath
        this.resumeData = getResumeDataFromYAMLFile(filePath);

    }
}


module.exports = {
    ResumeFromYaml
};