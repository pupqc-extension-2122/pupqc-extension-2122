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
				const formData = new FormData($(loginForm)[0]);

				const data = {
					email: formData.get('email'),
					password: formData.get('password'),
					remember: formData.get('remember_me')
				}

				console.log(data);
				alert('Check console')
			}
		})
	}

	return {
		load: () => {
			handleForm();
		}
	}
})().load();


