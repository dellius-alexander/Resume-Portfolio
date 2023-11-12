
// Try mailslurp: https://www.npmjs.com/package/mailslurp-client
// Try emailjs: https://www.npmjs.com/package/emailjs

// Mailslurp
const smtp = require('smtp');
function sendEmail() {
    Email.send({
        Host : "smtp.mailslurp.com",
        Username : "<mailslurp username>",
        Password : "<mailslurp password>",
        To : 'recipient@example.com',
        From : "sender@example.com",
        Subject : "Test email",
        Body : "<html><h2>Header</h2><strong>Bold text</strong><br></br><em>Italic</em></html>"
    }).then(message => alert(message)
    );
}