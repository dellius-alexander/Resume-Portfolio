/**
 * Mail configuration
 * @type {{subject: string, name: string, message: string, email: string}}
 */
const mail_config = {
    name: `name`,
    email: `email`,
    subject: `subject`,
    message: `message`

}

// module.exports = mail_config


console.log(mail_config)
console.log("Starting...")
// clear messages and warnings on page load
window.onload = async (event) => {
    $("div.loading").replaceWith(``)
    $("div.sent-message").replaceWith(``)

}



function sendEmail() {
    const form = $("form.php-email-form");
    console.log(form.getData())
}
// function sendEmail() {
//
//     // Email.send({
//     //     Host: "smtp.gmail.com",
//     //     Username: "sender@email_address.com",
//     //     Password: "Enter your password",
//     //     To: 'receiver@email_address.com',
//     //     From: "sender@email_address.com",
//     //     Subject: "Sending Email using javascript",
//     //     Body: "Well that was easy!!",
//     //     Attachments: [
//     //         {
//     //             name: "File_Name_with_Extension",
//     //             path: "Full Path of the file"
//     //         }]
//     // })
//     //     .then(function (message) {
//     //         alert(`Mail has been sent successfully. ${message}`)
//     //     });
// }