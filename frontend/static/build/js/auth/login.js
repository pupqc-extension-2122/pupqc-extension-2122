/**
 * ==============================================
 * * LOGIN
 * ==============================================
 */

'use strict';

(() => {
  const loginForm = '#login_form';
  const emailInput = $('#loginForm_email');
  const passwordInput = $('#loginForm_password');
  const submitBtn = $('#loginForm_submitBtn');

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

  const disableElements = () => {
    emailInput.attr('disabled', true);
    passwordInput.attr('disabled', true);
    submitBtn.attr('disabled', true);
  }

  const enableElements = () => {
    emailInput.attr('disabled', false);
    passwordInput.attr('disabled', false);
    passwordInput.val('');
    submitBtn.attr('disabled', false);
  }

  const onLoginFormSubmit = () => {

    const formData = new FormData($(loginForm)[0]);

    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      // remember: formData.get('remember_me')
    }
    
    disableElements();

    $.ajax({
      url: `${ BASE_URL_API }/auth/login`,
      type: 'POST',
      data: data,
      success: res => {
        if(res.error) {
          
          enableElements();

          // Alert invalid user details
          toastr.warning('Invalid combination of email and password', null, {
            "positionClass": "toast-top-center mt-3"
          });
          console.error(`[ERR]: ${ res.message }`)
        } else {        
          toastr.success('Success!', null, {"positionClass": "toast-top-center mt-3"});
          setTimeout(() => location.assign('/p'), 500);
        }
      },
      error: () => {
        enableElements();
        toastr.error('Something went wrong. Please reload the page.', null, {
          "positionClass": "toast-top-center mt-3"
        });
        console.error(`[ERR]: Failed to call ajax.`);
      }
    });
  }

	return {
		init: () => {
			handleForm();
		}
	}
})().init();


