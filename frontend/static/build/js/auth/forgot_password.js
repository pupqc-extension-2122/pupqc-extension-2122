/**
 * ==============================================
 * * FORGOT PASSWORD
 * ==============================================
 */

'use strict';

(() => {
  const form = '#forgotPassword_form';
  const emailSent_modal = $('#emailSent_modal');

  const initializations = () => {
    emailSent_modal.on('hide.bs.modal', (e) => {
      e.preventDefault();
      location.replace('/login');
    });
  }

  const handleForm = () => {
    $app(form).handleForm({
      validators: {
        email: {
          required: 'Your email is required',
          email: 'Your input is not a valid email address'
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }

  const onFormSubmit = () => {
    const fd = new FormData($(form)[0]);

    const data = {
      email: fd.get('email'),
    }

    console.log(data);

    emailSent_modal.modal('show');
  }

  return {
    init: () => {
      initializations();
      handleForm();
    }
  }
})().init();