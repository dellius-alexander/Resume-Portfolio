/**
 * Error handler for application.
 * @param err error message
 * @param req request object
 * @param res response object
 * @param next next handler function
 * @returns {Promise<void>} a promise that will be resolved by the next handler or error handler
 */
const errorHandler = async (err, req, res, next) => {
    const statusCode = req.statusCode === undefined ? 500 : req.statusCode;
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
    next();
}

module.exports = errorHandler;