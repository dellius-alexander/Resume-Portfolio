/**
 *    Copyright 2023 Dellius Alexander
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
const router = require('express').Router();
const {ResumeFromYaml} = require("../utils/resume")
const {writeFile} = require('fs');
let resumeData = null;

/**
 * Index route.
 * @desc Index route
 * @alias index
 * @memberOf module routes
 * @method GET /index
 * @path /
 * @type {Router}
 */
router.get('/',  async function (req, res, next) {
    // check if resume data is null
    if (resumeData === null) {
        resumeData = new ResumeFromYaml(`${process.env.RESUME_YAML_FILE}`).resumeData;
    }
    // create data object
    const data = Object.assign({},
        {
            resume: resumeData,
            title: "Portfolio Resume",
            name: resumeData['name'],
            skills: resumeData['skills'],
            introduction: resumeData['introduction'],
        });
    // render the html/ejs template file
    await res
        .status(200)
        .setHeader(
            'Content-Type',
            [
                'text/html; charset=utf-8',
            ]
        )
        .setHeader('Set-Cookie', {data: data})
        // parse the ejs templates and send html
        .render('pages/index.ejs', {data: data}, async (err, html) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return next();
            } else {
                try{
                    // Use fs to write new html to file
                    await  writeFile("views/pages/index.html", Buffer.from(html), async (err) => {
                        if (err) {
                            console.error('Error writing file.\n', err);
                        }

                    });
                    console.log('Successfully wrote file');
                } catch (e) {
                    console.error(e);
                }
            }
            res.send(html);
        });
});

module.exports = {
    indexRouter: router
};
