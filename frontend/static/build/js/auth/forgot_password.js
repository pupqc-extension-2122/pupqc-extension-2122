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

    $.ajax({
      url: `${ BASE_URL_API }/auth/magic`,
      type: 'POST',
      data: data,
      success: res => {
        console.log(res);
        if (res.error) {
          toastr.warning('Email does not exist', null, {
            "positionClass": "toast-top-center mt-3"
          });
        } else {
          emailSent_modal.modal('show');
        }
      },
      error: xhr => {
        console.log(xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText);
        // toastr.error('Something went wrong. Please reload the page.', {
        //   "timeOut": "0",
        //   "extendedTimeOut": "0",
        // });
        // console.error(`[ERR]: Failed to call ajax.`);
      }
    });
  }

  return {
    init: () => {
      initializations();
      handleForm();
    }
  }
})().init();