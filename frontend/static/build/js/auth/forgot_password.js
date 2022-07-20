/**
 * ==============================================
 * * FORGOT PASSWORD
 * ==============================================
 */

'use strict';

(() => {

  // * Local Variables

  const formSelector = '#forgotPassword_form';
  const form = $(formSelector)[0];
  const emailSent_modal = $('#emailSent_modal');

  const submit_btn = $('#forgotPassword_submitBtn');
  const goBack_btn = $('#forgotPassword_goBackBtn');
  const email_input = $('#forgotPassword_email');

  let processing = false;

  // * Private Methods

  const initializations = () => {
    emailSent_modal.on('hide.bs.modal', (e) => {
      e.preventDefault();
      location.replace('/login');
    });

    goBack_btn.on('click', (e) => {
      if (processing) e.preventDefault();
    });
  }

  const handleForm = () => {
    $app(formSelector).handleForm({
      validators: {
        email: {
          required: 'Your email is required',
          email: 'Your input is not a valid email address'
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }

  const setElementsToLoadingState = () => {
    submit_btn.attr('disabled', true);
    submit_btn.html(`<i class="fas fa-spinner fa-spin-pulse"></i>`);

    email_input.attr('disabled', true);
  }

  const setElementsToUnloadState = () => {
    submit_btn.attr('disabled', false);
    submit_btn.html(`
      <span>Send</span>
      <i class="fas fa-sign-in-alt ml-1"></i>
    `);

    email_input.attr('disabled', false);
  }

  const onFormSubmit = () => {
    processing = true;

    const fd = new FormData(form);

    const data = {
      email: fd.get('email'),
    }

    setElementsToLoadingState();

    $.ajax({
      url: `${ BASE_URL_API }/auth/magic`,
      type: 'POST',
      data: data,
      success: res => {
        if (res.error) {
          processing = false;
          setElementsToUnloadState();
          toastr.warning('Email does not exist', null, {
            "positionClass": "toast-top-center mt-3"
          });
        } else {
          processing = false;
          emailSent_modal.modal('show');
        }
      },
      error: (xhr, status, error) => {
        processing = false;
        setElementsToUnloadState();
        if (xhr.status === 500) {
          toastr.error('Something went wrong. Please reload the page.', null, {
            "positionClass": "toast-top-center mt-3",
            "timeOut": "0",
            "extendedTimeOut": "0",
          });
          console.error({
            file: 'auth/forgot_password.js',
            fn: 'onFormSubmit().$.ajax',
            data: data,
            xhr: xhr,
          });
        } else {
          toastr.warning(xhr.responseJSON.message, null, {
            "positionClass": "toast-top-center mt-3",
            "timeOut": "0",
            "extendedTimeOut": "0",
          });
        }
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