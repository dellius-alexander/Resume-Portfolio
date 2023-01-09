
var _config = {
    subject: {
        prefix: `[Contact Form]`,
    },
    emails: {
        to: [], // Email addresses to receive emails via the form
        from: [], // A valid email address - the domain should be the same as where the form is hosted.
    },
    messages :{
    error  : `There was an error sending, please try again later.`,
    success : `Your message has been sent successfully.`
},
fields : {
    name     : `Name`,
    email    : `Email`,
    phone    : `Phone`,
    subject  : `Subject`,
    message  : `Message`,
    btn_send : `Send`
}
}
