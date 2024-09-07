const {readFile} = require('fs').promises;
const existsSync = require('fs').existsSync;
const pdfParse = require('pdf-parse');
const path = require('path');
const traceback = require('stack-trace');
const {YAMLParser} = require('./yaml-parser.js')
const log = require('./logger').getLogger();

/**
 * @description Wrapper function to retrieve the resume data.
 * @param {string} filePath The resume data file path.
 * @return {Promise<{}>} The resume data object.
 */
function getResumeDataFromYAMLFile(filePath = `${process.env.RESUME_YAML_FILE}` || null) {
    try {
        if (filePath == null) {  // resume data has not been retrieved yet
            throw new Error('Resume data has not been retrieved yet. Please provide the correct file path.');
        } else { // resume data has already been retrieved
            let parser  = null;
            parser = new YAMLParser(
                filePath,
                {encoding: 'utf8', flag: 'r'});

            log.info('Resume data retrieved successfully.');
            log.info(`Version: ${parser.parsedData['version']}`);
            return parser.parsedData;
        }

    } catch (error) {
        log.error(
            'Error parsing PDF:\n',
            error
        )
        traceback.get().forEach((trace) => {
            log.error(trace.getFileName());
            log.error(trace.getFunctionName());
            log.error(trace.getLineNumber());
            log.error(trace.getColumnNumber());
            log.error(trace.getEvalOrigin());
            log.error(trace.getModuleName());
            log.error(trace.getTypeName());
            log.error(trace.getMethodName());
            log.error(trace.getThis());
            log.error(trace.isToplevel());
            log.error(trace.isEval());
            log.error(trace.isNative());
            log.error(trace.isConstructor());
            log.error(trace.isAsync());
            log.error(trace.isPromiseAll());
            log.error(trace.getPromiseIndex());
        })
        return error;
    }
}

/**
 * @description This function parses the raw text and returns the section data of the resume pdf.
 * @param rawText
 * @param sectionName
 * @param nextSectionName
 * @return {Promise<string>}
 */
async function parseSection(rawText, sectionName, nextSectionName) {
    const sectionRegex = new RegExp(`${sectionName}\\s*?([\\s\\S]*?)(?=\\n\\n${nextSectionName}|$)`,'g');
    const nextSectionRegex = new RegExp(`${nextSectionName}\\s*?([\\s\\S]*?)`);
    const pageNumberRegex = new RegExp(`(~\\s([0-9])\\s~)`, 'g')
    const bulletsRegex = new RegExp(`(\\s)?(●|\\*|•|\u2022|\u2023|\u2043|\u25E6|\u204C|\u204D)*?(\\s)?`, 'g')
    // read rawText line by line
    let matchedLines = [];
    let processSectionLines = false;
    for (const line of rawText.split('\n')) {
        if (nextSectionRegex.test(line) === true && processSectionLines === true) {
            // stop processing this section lines
            processSectionLines = false;
            break;
        }
        if (sectionRegex.test(line) === true && processSectionLines === false) {
            // start processing this section lines
            processSectionLines = true;
        }
        // check sentinel for processing instructions
        if (processSectionLines === true) {  // process this section lines
            // remove page numbers
            if (pageNumberRegex.test(line) === true) {
                continue;
            }
            // replace all types of bullets with space
            if (bulletsRegex.test(line) === true) {
                line.replace(bulletsRegex, '');
            }
            // add line to array
            matchedLines.push(line.trim());
        }

    }
    return Promise.resolve(matchedLines.map((match) => match.trim()).join('\n'));
};

/**
 * @description This function extracts the data from the PDF file and organizes the data.
 * @param pdfPath
 * @return {Promise<{academicData: string, skillsData: string, repositoriesData: string, experienceData: string}>}
 */
async function  extractDataFromPdf (pdfPath) {
    try {
        log.info(`PDF Path: ${pdfPath}`);
        if (!existsSync(pdfPath)) {
            log.error('The PDF file does not exist.');
            log.error('Current working directory:', process.cwd());
            // Exit code execution.
            process.exit(1);
        } else {
            log.info('The PDF file exists.');
            log.info('Extracting data from PDF...');

        }
        const pdfBuffer = await readFile(pdfPath)
            .then((data) => {
                log.info(`PDF file read successfully. \nSize of Data: ${data.length} bytes.`);
                // log.info(data);
                return data;
            })
        const data = await pdfParse(pdfBuffer);
        const rawText = data.text;
        const academicData = await parseSection(rawText, 'ACADEMICS', 'SKILLS & TOOLS')
            .then((data) => {
                log.info(`Size of Academic Data: ${data.length} bytes.`);
                return data;
            })
        const skillsData = await parseSection(rawText, 'SKILLS & TOOLS', 'REPOSITORIES:')
            .then((data) => {
                log.info(`Size of Skills Data: ${data.length} bytes.`);
                return data;
            })
        const repositoriesData = await parseSection(rawText, 'REPOSITORIES:', 'WORK EXPERIENCE')
            .then((data) => {
                log.info(`Size of Repository Data: ${data.length} bytes.`);
                return data;
            })
        const experienceData = await parseSection(rawText, 'WORK EXPERIENCE', '~ 4 ~')
            .then((data) => {
                log.info(`Size of Experience Data: ${data.length} bytes.`);
                return data;
            })

        return Object.assign({}, {
            academicData,
            skillsData,
            repositoriesData,
            experienceData,
        });
    } catch (error) {
        log.error('Error parsing PDF:', error);
    }
};

/**
 * @description Wrapper function to retrieve the resume skills data.
 * @param {string} resumeData The resume data or file path.
 * @return {Promise<*>} The resume skills data.
 */
async function getSkillsData(resumeData = `${process.env.RESUME_PDF_FILE}` || null){
    const bulletsRegex = new RegExp(/(●|•|▪|▫|■|□|▲|▼|◆|◇)*?/g);
    const skillsRegex = new RegExp(/(\s?SKILLS\s*?\D?\s*?TOOLS\s?)+/g);
    const splitSkillsRegex = new  RegExp(/[,\n●•▪▫■□▲▼◆◇]/g);
    let sentinal = 0;
    try {
        let skillsData = null;
        if (resumeData == null) {  // resume data has not been retrieved yet
            throw new Error('Resume data has not been retrieved yet. Please provide the correct file path.');
        } else { // resume data has already been retrieved
            skillsData = await extractDataFromPdf(path.resolve(resumeData))
                .then((data) => {
                    return [...data.skillsData
                        .split(splitSkillsRegex)
                        .filter((skill) => {
                            if (sentinal === 0) {  // remove the first element, the column header
                                sentinal++;
                                return false;
                            } else if (bulletsRegex.test(skill.trim())) {  // remove bullets only and keep the rest
                                return skill.length > 2;
                            } else return !skillsRegex.test(skill.trim());
                        })
                        .map((skill) => {
                            return skill.trim();
                        })];
                });
        }
        return skillsData;
    } catch (error) {
        log.error(
            'Error parsing PDF:\n',
            error
        )
        traceback.raw();
        return error;
    }
}

/**
 * @description Wrapper function to retrieve the resume introduction data.
 * @param {string} introFilePath The introduction file path.
 * @return {Promise<*>} The resume introduction data.
 */
async function getIntroduction(introFilePath = `${process.env.INTRODUCTION_FILE}` || null) {
    try {
        let introData = null;
        if (introFilePath == null) {  // intro data has not been retrieved yet
            throw new Error('Introduction data has not been retrieved yet. Please provide the correct file path.');
        } else { // intro data has already been retrieved
            introData = await readFile(path.resolve(introFilePath))
                .then((data) => {
                    return data.toString();
                });

        }
        return introData;
    } catch (error) {
        log.error(
            `Error parsing introduction text: ${introFilePath}\n`,
            error
        )
        traceback.raw();
        return error;
    }
}


module.exports = {
    getSkillsData,
    getIntroduction,
    getResumeDataFromYAMLFile
};

