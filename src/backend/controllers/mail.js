/**
 * Create a new attempt to post an email message.
 * @param req the request object
 * @param res the response object
 * @returns {Promise<void>}
 * @desc post mail message
 * @route POST /api/v1/mail/post
 * @access private
 *
 */
const postMail = async (req, res) => {
    //// Authorization is needed for secure response
    // // Or you can use `req.headers`
    // req.headers.authorization;
    // // Or you can use `req.get`
    // req.get('authorization'),
    if (
        req.body.name === undefined ||
        req.body.email === undefined ||
        req.body.subject === undefined ||
        req.body.message === undefined
        )
    {
        const msg = '\"Your Name\", \"Your Email\", \"Subject\", \"Message\" are required parameters! \n';
        console.error(msg);
        res.status(204).json({
            authorization: req.get('authorization'),
            message: new Error(msg)
        });
    }
    else
    {
        console.log(`Request Body: `);
        console.log(req.body);



        // use the authorization to send a response message to the client
        res.status(201).json({
            authorization: req.get('authorization'),
            message: req.body,
            response: "You message was sent successfully...\nSomeone will be in touch with you shortly.\n"
        });
        // res.status(201).json({message: req.body  || req.params});

    }

}

/**
 * Get a list of mail messages.
 * @param req the request object
 * @param res the response object
 * @returns {Promise<void>}
 * @desc GET mail message
 * @route GET /api/v1/mail
 * @access private
 */
const getMail = async (req, res) => {

    res.status(200);
    res.json(
        [
            {name: "Jone Doe", email: "jone@gmail.com", subject: "Interested in a Job...", message: "Jone Doe says hello!"},
        ]
    );
}


module.exports = {
    postMail,
    getMail
}