'use strict';

/**
 * ==============================================
 * * LOGIN
 * ==============================================
 */

(() => {

    const loginForm = '#login_form';

    const handleForm = () => {
        $app(loginForm).handleForm({
            validators: {
                email: {
                    required: 'Email address is required.',
                    email: 'The input is not a valid email address.'
                },
                password: {
                    required: 'Password is required.'
                }
            },
            onSubmit: () => {
                alert(loginForm);
            }
        })
    }

    return {
        load: () => {
            handleForm();
        }
    }
})().load();


