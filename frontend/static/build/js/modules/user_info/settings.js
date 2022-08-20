/**
 * ==============================================
 * * USER SETTINGS
 * ==============================================
*/

'use strict';

// ACCOUNT SETTINGS / USER ACCOUNT

(() => {

  // * Local Variables

  const formSelector = '#accountSettings_form';
  const form = $(formSelector)[0];
  const password_patterns = [
    {
      id: 'lowercases',
      pattern: /[a-z]/g,
    }, {
      id: 'uppercases',
      pattern: /[A-Z]/g,
    }, {
      id: 'numeric',
      pattern: /[0-9]/g,
    }, {
      id: 'special',
      pattern: /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
    }, {
      id: 'spaces',
      pattern: /\s/g,
    }
  ];

  const oldPassword_input = $('#accountSetting_oldPassword');
  const newPassword_input = $('#accountSetting_newPassword');
  const confirmNewPassword_input = $('#accountSetting_confirmNewPassword');

  const passwordStrength_progressBar = $('#passwordStrength_progressBar');
  const passwordStrength_label = $('#passwordStrength_label');
  
  const save_btn = $('#accountSettings_saveBtn');
  
  let processing = false;

  // * Private Methods

  const checkPasswordStrength = (password) => {
    let strength = 0;

    const incrementStrength = (pattern_instance) => strength += pattern_instance > 2 ? 2 : pattern_instance;

    password_patterns.map(o => o = o.pattern).forEach(p => {
      const matches = password.match(p);
      if (matches) incrementStrength(matches.length);
    });

    const percent = strength >= 9 ? 100 : ( strength / 9 ) * 100;
    const interpretation = (() => {
      if (percent == 0) return 'Undefined';
      if (percent < 25) return 'Very weak';
      if (percent < 50) return 'Poor';
      if (percent < 75) return 'Good';
      if (percent < 100) return 'Strong';
      if (percent == 100) return 'Unpredictable';
    })();

    return {
      strength,
      percent,
      interpretation
    }
  }

  const initializations = () => {
    
    // For New Password Input
    newPassword_input.on('keyup change', (e) => {
      const password = $(e.currentTarget).val();
      const password_strength = checkPasswordStrength(password);
      const percent = password_strength.percent;

      const theme = (() => {
        if (percent < 25) return 'danger';
        if (percent < 50) return 'warning';
        if (percent < 75) return 'info';
        if (percent < 100) return 'success';
        if (percent == 100) return 'primary';
      })();
      
      passwordStrength_progressBar
        .css({ width: `${ percent }%` })
        .removeClass('bg-danger bg-warning bg-info bg-success bg-primary')
        .addClass(`bg-${ theme }`);
      
      passwordStrength_label.html(() => {
        return percent == 0
          ? `<div class="text-muted font-italic">We will check how strong your password is</div>`
          : `<div class="text-${ theme }">${ password_strength.interpretation }</div>`;
      });

      const new_password = newPassword_input.val();
      const confirm_password = confirmNewPassword_input.val();

      if (new_password) newPassword_input.valid();
      if (new_password === confirm_password) confirmNewPassword_input.valid();
    });
  }
  
  const handleForm = () => {
    $app(formSelector).handleForm({
      validators: {
        old_password: {
          required: 'Your old password is required.'
        },
        new_password: {
          required: 'Your new password is required.',
          notEqualTo: {
            rule: () => oldPassword_input.val(),
            message: 'Your new password must not be the same as the old one.'
          },
          callback: {
            rule: () => {
              return password_patterns
                .map(o => { if (o.id !== 'spaces') return o.pattern })
                .every(p => newPassword_input.val().match(p) ? true : false )
            },
            message: () => {
              const password = newPassword_input.val();

              const forLowerCases = () => {
                const pattern = password_patterns.find(o => o.id === 'lowercases').pattern;
                const match = password.match(pattern)
                return `
                  <div class="${ match ? 'text-success' : 'text-danger' }">
                    <i class="fas fa-${ match ? 'check' : 'times' } fa-fw mx-1"></i>
                    <span>one lowercase letter</span>
                  </div>
                `
              }

              const forUpperCases = () => {
                const pattern = password_patterns.find(o => o.id === 'uppercases').pattern;
                const match = password.match(pattern)
                return `
                  <div class="${ match ? 'text-success' : 'text-danger' }">
                    <i class="fas fa-${ match ? 'check' : 'times' } fa-fw mx-1"></i>
                    <span>one uppercase letter</span>
                  </div>
                `
              }

              const forNumeric = () => {
                const pattern = password_patterns.find(o => o.id === 'numeric').pattern;
                const match = password.match(pattern)
                return `
                  <div class="${ match ? 'text-success' : 'text-danger' }">
                    <i class="fas fa-${ match ? 'check' : 'times' } fa-fw mx-1"></i>
                    <span>one number</span>
                  </div>
                `
              }

              const forSpecial = () => {
                const pattern = password_patterns.find(o => o.id === 'special').pattern;
                const match = password.match(pattern)
                return `
                  <div class="${ match ? 'text-success' : 'text-danger' }">
                    <i class="fas fa-${ match ? 'check' : 'times' } fa-fw mx-1"></i>
                    <span>one special character</span>
                  </div>
                `
              }

              return `
                <div class="text-dark">Your password must contain at least:</div>
                ${ forLowerCases() }
                ${ forUpperCases() }
                ${ forNumeric() }
                ${ forSpecial() }
              `
            },
          },
          minlength: {
            rule: 8,
            message: 'It should be at least 8 characters.'
          },
        },
        confirm_password: {
          required: 'Please retype your new password to confirm.',
          callback: {
            rule: () => newPassword_input.val() === confirmNewPassword_input.val(),
            message: 'This is not matched with your password.'
          }
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }
  
  const setElementsToLoadingState = () => {
    save_btn.attr('disabled', true);
    save_btn.html(`<i class="fas fa-spinner fa-spin-pulse mx-3"></i>`);

    oldPassword_input.attr('disabled', true);
    newPassword_input.attr('disabled', true);
    confirmNewPassword_input.attr('disabled', true);
  }

  const setElementsToUnloadState = () => {
    save_btn.attr('disabled', false);
    save_btn.html(`
      <span>Save</span>
      <i class="fas fa-check ml-1"></i>
    `);

    oldPassword_input.attr('disabled', false);
    newPassword_input.attr('disabled', false);
    confirmNewPassword_input.attr('disabled', false);
  }

  const resetForm = () => {
    form.reset();
  }

  const onFormSubmit = () => {
    processing = true;

    const fd = new FormData(form);

    const data = {
      old_password: fd.get('old_password'),
      new_password: fd.get('new_password')
    }

    setElementsToLoadingState();

    $.ajax({
      url: `${ BASE_URL_API }/users/change_password`,
      type: 'PUT',
      data: data,
      success: res => {
        processing = false;
        if (res.error) {
          ajaxErrorHandler(res.message);
          setElementsToUnloadState();
        } else {
          setElementsToUnloadState();
          resetForm();
                
          passwordStrength_progressBar
            .css({ width: 0 })
            .removeClass('bg-danger bg-warning bg-info bg-success');
          
          passwordStrength_label.html(`
            <div class="text-muted font-italic">We will check how strong your password is</div>
          `);

          toastr.success(`Your password has been updated successfully.`);
        }
      },
      error: (xhr) => {
        processing = false;
        setElementsToUnloadState();
        if (xhr.status == 401) {
          toastr.warning('Your old password is incorrect. Please try again.');
        } else {
          ajaxErrorHandler({
            xhr: xhr
          });
        }
      }
    })
  }

  return {
    init: () => {
      initializations();
      handleForm();
    }
  }
})().init();


// FORGOT PASSWORD AND MAGIC LINK

(() => {
  const link = $('#settings_forgotPassword');
  const modal = $('#forgotPasswordSendEmail_modal');
  const email = User.getData().email;

  let processing = false;
  let sent = false;
  
  const initForgotPassword = () => {
    const hiddenEmail = (() => {
      const [username, server_domain] = email.split('@');
      
      return username.charAt(0) 
        + username.substr(1, username.length - 2).replace(/[\S]/g, "*")
        + username.charAt(username.length - 1)
        + '@'
        + server_domain;
    })();

    $('#forgotPasswordSendEmail_email').text(hiddenEmail);

    // When link has been clicked
    link.on('click', (e) => {
      e.preventDefault();
      !sent 
        ? modal.modal('show')
        : toastr.info('Magic link has already been sent, please check your email.');
    });

    // When form has been submitted
    $app('#sendMagicLink_form').handleForm({
      validators: {},
      onSubmit: () => sendMagicLink(),
    });

    // When modal is gonna show
    modal.on('show.bs.modal', (e) => {
      if (sent) e.preventDefault();
    });

    // When modal is gonna hidden
    modal.on('hide.bs.modal', (e) => {
      if (processing || sent) e.preventDefault();
    });
  }

  const sendMagicLink = async () => {
    if (processing || sent) return;

    processing = true;

    const submit_btn = $('#confirmSubmit_btn');
    const cancel_btn = $('#cancelSubmit_btn');

    const setElementsOnLoadingState = () => {
      submit_btn.attr('disabled', true);
      submit_btn.html(`<i class="fas fa-spinner fa-spin-pulse mx-3"></i>`);

      cancel_btn.attr('disabled', true);
    }

    const setElementsToUnloadState = () => {
      submit_btn.attr('disabled', false);
      submit_btn.html('Continue');

      cancel_btn.attr('disabled', false);
    }

    setElementsOnLoadingState();

    await $.ajax({
      url: `${ BASE_URL_API }/auth/magic`,
      type: 'POST',
      data: { email: email },
      success: res => {
        processing = false;
        setElementsToUnloadState();
        if (res.error) {
          toastr.warning('Email does not exist');
        } else {
          modal.modal('hide');
          sent = true;
          toastr.success('Magic link has been successfully sent! Please check your email.');
        }
      },
      error: (xhr, status, error) => {
        processing = false;
        setElementsToUnloadState();
        if (xhr.status === 500) {
          toastr.error('Something went wrong. Please reload the page.', null, {
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
            "timeOut": "0",
            "extendedTimeOut": "0",
          });
        }
      }
    });
  }

  return {
    init: () => {
      initForgotPassword();
    }
  }
})().init();