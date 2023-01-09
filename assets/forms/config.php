<?php
if (!function_exists('__config')){
    function __config(){
        $_config = [
            'subject' => [
                'prefix' => '[Contact Form]'
            ],
            'emails' => [
                'to'   => '', // Email address to receive emails via the form.
                'from' => '' // A valid email address - the domain should be the same as where the form is hosted.
            ],
            'messages' => [
                'error'   => 'There was an error sending, please try again later.',
                'success' => 'Your message has been sent successfully.'
            ],
            'fields' => [
                'name'     => 'Name',
                'email'    => 'Email',
                'phone'    => 'Phone',
                'subject'  => 'Subject',
                'message'  => 'Message',
                'btn-send' => 'Send'
            ]
        ]);
        return $_config;
    }
}

print_r(__config();