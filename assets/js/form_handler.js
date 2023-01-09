window.onloadstart = () => {
    $('div.server-response-message.loading').replaceWith("loading.........")
    $('div.server-response-message.sent-message').replaceWith("")
};
window.onload = () => {
    $('div.server-response-message.loading').replaceWith("")
    $('div.server-response-message.sent-message').replaceWith("")
};
window.onsubmit = () => {
    $('div > form#contact-form').reset();
}
const sendMessage = function() {
    // Get the form and attach an event handler to the form element
    // const form = $("form#contact-form");
    // Stop the form from submitting normally
    // event.preventDefault();
    // Get the form data
    const data = {
        name: $(`div > input[name="_name"]`).val(),
        email: $(`div > input[name="_email"]`).val(),
        subject: $(`div > input[name="_subject"]`).val(),
        message: $(`div > textarea[name="_message"]`).val()
    }
    if (data.name === "" || data.email === "" || data.subject === "" || data.message === ""){
        alert('Please enter all required fields and try again...')
        return;
    } else {
        const url = "/api/v1/mail/post";
        // Send the form data using POST method
        $.post(url, data, function(params, status) {
            console.log(params, status)
            if (status === "success") {
                alert(params.response)
                window.location.reload();
            } else if (status === "nocontent") {
                console.log(params, status);
                alert('Please enter all required fields and try again...');
                window.location.reload();
            }
        });
    }

}