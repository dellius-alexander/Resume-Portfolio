const express = require('express');
const path = require('path');
// const cons = require('consolidate')
// const serveIndex = require('serve-index');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// const expressApp = require("express/lib/router");

// instantiate express middleware
const app = express();
// set server port configuration options
const cfg = {
    port: process.env.PORT || 3000
}
// Use node_modules scripts
// CSS dependencies
app.use('/css', express.static(path.join(__dirname, 'node_modules/aos/')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/css/')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/boxicons/css/')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/glightbox/css/')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/swiper/')))
// app.use('/css', express.static(path.join(__dirname, '')))
// Javascript dependencies
app.use('/js', express.static(path.join(__dirname, 'node_modules/aos/aos.js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/purecounter/')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/js/')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/glightbox/js/')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/isotope-layout/')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/swiper/')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/typed.js/')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/waypoints/')))
// app.use('/js', express.static(path.join(__dirname, '')))

// assign the swig engine to parse .html file extensions
app.engine(`html`, require('ejs').renderFile);
// set the view directory and .html as the default extension
app.set(`views`, path.join(__dirname, `views`));
app.set(`view engine`, `html`);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(`/`,  express.static(path.join(__dirname, 'public')));
app.use(`/`, indexRouter);
app.use(`/users`, usersRouter);

app.listen(
    cfg.port, `localhost`, () => {
        console.log(`Example app is listening on http://localhost:${cfg.port}.`)
    }
);

module.exports = app;
