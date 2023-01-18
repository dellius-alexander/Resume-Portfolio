
/**
 * Standard callback function
 * @param req
 * @param res
 * @param next
 * @return {Promise<{message: string}>}
 */
async function callback(req, res, next) {
    console.dir(res);
    console.dir(req);
    console.dir(next);
    return {message: "Something went wrong..."};
}


module.exports = {
    callback
}