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
  const rememberInput = $('#loginForm_rememberMe');
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
    rememberInput.attr('disabled', true);
    submitBtn.attr('disabled', true);
    submitBtn.html(`<i class="fas fa-spinner fa-spin-pulse"></i>`);
  }

  const enableElements = () => {
    emailInput.attr('disabled', false);
    passwordInput.attr('disabled', false);
    rememberInput.attr('disabled', false);
    passwordInput.val('');
    submitBtn.attr('disabled', false);
    submitBtn.html(`
      <span>Log in</span>
      <i class="fas fa-sign-in-alt ml-1"></i>
    `);
  }

  const onLoginFormSubmit = () => {

    const fd = new FormData($(loginForm)[0]);

    const data = {
      email: fd.get('email'),
      password: fd.get('password'),
      remember: rememberInput.is(":checked")
    }
    
    disableElements();

    $.ajax({
      url: `${ BASE_URL_API }/auth/login`,
      type: 'POST',
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify(data),
      success: res => {
        if(res.error) {
          
          enableElements();

          // Alert invalid user details
          toastr.warning('Invalid combination of email and password', null, {
            "positionClass": "toast-top-center mt-3"
          });
        } else {
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(res.data));
          toastr.success('Success!', null, {"positionClass": "toast-top-center mt-3"});
          submitBtn.html(`<i class="fas fa-check"></i>`);
          submitBtn.removeClass('btn-primary').addClass('btn-success');

          const user_roles = JSON.parse(getCookie('roles'));

          if (user_roles.includes('Admin')) {
            setTimeout(() => location.assign('/a'), 250);
          } else {
            setTimeout(() => location.assign('/p'), 250);
          }

        }
      },
      error: (xhr, status, error) => {
        enableElements();
        toastr.error('Something went wrong. Please reload the page.', null, {
          "positionClass": "toast-top-center mt-3",
          "timeOut": "0",
          "extendedTimeOut": "0",
        });
        ajaxErrorHandler({
          file: 'auth/login.js',
          fn: 'onDOMLoad.$.ajax',
          data: data,
          details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
        });
      }
    });
  }

  return {
    init: () => {
      handleForm(); 
    }
  }
})().init();


