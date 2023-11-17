const promises = require('fs').promises;
const existsSync = require('fs').existsSync;
const pdfParse = require('pdf-parse');

let resumeData = null;

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
        console.log(`PDF Path: ${pdfPath}`);
        if (!existsSync(pdfPath)) {
            console.error('The PDF file does not exist.');
            console.error('Current working directory:', process.cwd());
            // Exit code execution.
            process.exit(1);
        } else {
            console.log('The PDF file exists.');
            console.log('Extracting data from PDF...');

        }
        const pdfBuffer = await promises.readFile(pdfPath)
            .then((data) => {
                console.log(`PDF file read successfully. \nSize of Data: ${data.length} bytes.`);
                // console.dir(data);
                return data;
            })
        const data = await pdfParse(pdfBuffer);
        const rawText = data.text;
        const academicData = await parseSection(rawText, 'ACADEMICS', 'SKILLS & TOOLS')
            .then((data) => {
                console.log(`Size of Academic Data: ${data.length} bytes.`);
                return data;
            })
        const skillsData = await parseSection(rawText, 'SKILLS & TOOLS', 'REPOSITORIES:')
            .then((data) => {
                console.log(`Size of Skills Data: ${data.length} bytes.`);
                return data;
            })
        const repositoriesData = await parseSection(rawText, 'REPOSITORIES:', 'WORK EXPERIENCE')
            .then((data) => {
                console.log(`Size of Repository Data: ${data.length} bytes.`);
                return data;
            })
        const experienceData = await parseSection(rawText, 'WORK EXPERIENCE', '~ 4 ~')
            .then((data) => {
                console.log(`Size of Experience Data: ${data.length} bytes.`);
                return data;
            })

        return Object.assign({}, {
            academicData,
            skillsData,
            repositoriesData,
            experienceData,
        });
    } catch (error) {
        console.error('Error parsing PDF:', error);
    }
};


/**
 * @description Wrapper function to retrieve the resume data.
 * @return {Promise<{academicData: string, skillsData: string, repositoriesData: string, experienceData: string}>}
 */
async function retrieveResumeData() {
    try {
        if (resumeData === null) {  // resume data has not been retrieved yet
            resumeData = await extractDataFromPdf(`${process.cwd()}/${process.env.RESUME_PDF_FILE}`).then((data) => data);
        } else { // resume data has already been retrieved
            console.log('Resume data has already been retrieved.');
            return resumeData;
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description Wrapper function to retrieve the resume skills data.
 * @return {Promise<string[]>}
 */
async function getSkillsData(){
    const bulletsRegex = new RegExp(/(●|•|▪|▫|■|□|▲|▼|◆|◇)*?/g);
    const skillsRegex = new RegExp(/(\s?SKILLS\s*?\D?\s*?TOOLS\s?)+/g);
    const splitSkillsRegex = new  RegExp(/[,\n●•▪▫■□▲▼◆◇]/g);
    let sentinal = 0;
    try {
        if (resumeData == null) {  // resume data has not been retrieved yet
            resumeData = await extractDataFromPdf(`${process.cwd()}/${process.env.RESUME_PDF_FILE}`)
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
        } else { // resume data has already been retrieved
            console.log('Resume data has already been retrieved.');
        }
        return resumeData;
    } catch (error) {
        console.error(
            'Error parsing PDF:\n',
            error
        )
    }
}

module.exports = {getSkillsData};
