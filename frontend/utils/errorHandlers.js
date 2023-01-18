const router = require('express').Router();

/**
 * Standard http callback function.
 * @type {Router} error callback response
 */
router.get('/error', async function (req, res, next) {
    console.error(`Error: ${req.stack}`);
    res.status(500).send('Something went wrong!');
})

module.exports = router;