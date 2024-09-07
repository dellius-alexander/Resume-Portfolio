const {getResumeDataFromYAMLFile} = require("../utils/resumeParser");

;(function () {
    const  resumeData = getResumeDataFromYAMLFile("../assets/docs/resume-data.yaml");
    console.log("Resume Object Version: ")
    console.log(resumeData['version']);
})();

