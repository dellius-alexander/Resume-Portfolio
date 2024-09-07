const {ResumeFromYaml} = require("../utils/resume");

;(function(){
    const resume = new ResumeFromYaml("../assets/docs/resume-data.yaml");
    console.log("Resume built!");
    console.dir(resume);
})();
