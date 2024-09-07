const { createLogger, format, transports, config } = require('winston');
const path = require('path');
const stackTrace = require('stack-trace');

const environment = process.env.NODE_ENV || 'development';

let loggerInstance = null;
console.dir({
    LOG_FILE_ERROR: process.env.LOG_FILE_ERROR,
    LOG_FILE_COMBINED: process.env.LOG_FILE_COMBINED,
    LOG_FILE_EXCEPTIONS: process.env.LOG_FILE_EXCEPTIONS
});

const rootDir = () => {
    return path.dirname(require.main.filename);
};

function getLogOrigin() {
    // Create a custom error to get the stack trace
    const err = new Error().stack;

    // Parse the stack trace
    const trace = stackTrace.parse(err);

    // Find the first trace that is not from any library
    const logOrigin = trace.filter(t => {
        return t.getFileName()
            && t.getFileName().indexOf('node_modules') === -1;
    })[1];

    // If no such trace is found, default to the first trace
    if (!logOrigin) {
        return {
            fileName: 'unknown',
            functionName: 'unknown',
            lineNumber: 'unknown'
        };
    }

    // Get the file name, function name, and line number
    const fileName = path.basename(logOrigin.getFileName());
    const functionName = logOrigin.getFunctionName();
    const lineNumber = logOrigin.getLineNumber();

    return { fileName, functionName, lineNumber };
}

const printFormat = format.printf((info) => {
    const origin = info.trace || getLogOrigin();
    const fileName = origin.fileName;
    const lineNumber = origin.lineNumber;
    const functionName = origin.functionName;
    // const label = `[${info.label}]` || 'Label'; // Add label to the log printout
    // return `[${info.level}] [${info.timestamp}] [${fileName}] [${functionName}] [${lineNumber}] - ${info.message}`;
    return `[${info.level}] [${info.timestamp}] - ${info.message}`;

});

function createLoggerInstance() {
    let logger = createLogger({
        level: 'info',
        levels: config.syslog.levels,
        format: format.combine(
            format.timestamp({
                format: 'DD-MMM-YYYY HH:mm:ss',
            }),
            format.errors({stack: true}),
            format.splat(),
            format.json(),
            printFormat
        ),
        defaultMeta: {service: 'resume-portfolio'},
        transports: [
            new transports.File({filename: path.resolve(`${process.env.LOG_FILE_ERROR}`), level: 'error'}),
            new transports.File({filename: path.resolve(`${process.env.LOG_FILE_COMBINED}`)})
        ],
        exceptionHandlers: [
            new transports.File({filename: path.resolve(`${process.env.LOG_FILE_EXCEPTIONS}`)})
        ],
        exitOnError: false
    });

    // If we're not in production then log to the `console`
    if (environment === 'development') {
        logger.add(new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp({
                    format: 'DD-MMM-YYYY HH:mm:ss',
                }),
                format.errors({stack: true}),
                format.splat(),
                format.json(),
                printFormat
            )
        }));
    }
    return logger;
}

module.exports = {
    getLogger: function() {
        if (!loggerInstance) {
            loggerInstance = createLoggerInstance();
        }
        return loggerInstance;
    }
};