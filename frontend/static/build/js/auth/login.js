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
			onSubmit: () => onLoginFormSubmit()
		})
	}

  const onLoginFormSubmit = () => {
    
    // Get the input and submit button elements
    const emailInput = $('#loginForm_email');
    const passwordInput = $('#loginForm_password');
    const submitBtn = $('#loginForm_submitBtn');

    const formData = new FormData($(loginForm)[0]);

    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      // remember: formData.get('remember_me')
    }

    // Disable elements
    emailInput.attr('disabled', true);
    passwordInput.attr('disabled', true);
    submitBtn.attr('disabled', true);

    $.ajax({
      url: `${ BASE_URL_API }/auth/login`,
      type: 'POST',
      data: data,
      success: (res) => {
        if(res.error) {
          
          // Alert invalid user details
          toastr.warning('Invalid combination of email and password', null, {"positionClass": "toast-top-center mt-3"});
          
          // Enable the inputs
          emailInput.attr('disabled', false);
          passwordInput.attr('disabled', false);
          
          // Reset the password field
          passwordInput.val('');

          // Enable the button
          submitBtn.attr('disabled', false);
        } else {        
          toastr.success('Success!', null, {"positionClass": "toast-top-center mt-3"});
          setTimeout(() => location.assign('/p'), 500);
        }
      },
      error: () => {
        toastr.danger('Something went wrong.');
      }
    });
  }

	return {
		init: () => {
			handleForm();
		}
	}
})().init();


