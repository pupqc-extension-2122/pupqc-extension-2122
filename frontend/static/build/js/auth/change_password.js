/**
 * ==============================================
 * * CHANGE PASSWORD
 * ==============================================
 */

'use strict';

(() => {
  
  // * Local Variables

  const formSelector = '#updatePassword_form';
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

  const password_input = $('#updatePassword_password');
  const confirmPassword_input = $('#updatePassword_confirmPassword');

  const save_btn = $('#updatePassword_saveBtn');
  const logout_btn = $('#updatePassword_logoutBtn');

  const confirmLogout_modal = $('#confirmLogout_modal');

  let processing = false;
  let request_for_logout = false;
  let logging_out = false;

  // * Private Variables

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

    // For Password Input
    password_input.on('keyup', (e) => {
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
      
      $('#passwordStrength_progressBar')
        .css({ width: `${ percent }%` })
        .removeClass('bg-danger bg-warning bg-info bg-success')
        .addClass(`bg-${ theme }`);
      
      $('#passwordStrength_label').html(() => {
        return percent == 0
          ? `<div class="text-muted font-italic">We will check how strong your password is</div>`
          : `<div class="text-${ theme }">${ password_strength.interpretation }</div>`;
      });

      if (password) password_input.valid();
      if (password === confirmPassword_input.val()) confirmPassword_input.valid();
    });

    // For logout button
    logout_btn.on('click', (e) => {
      if (processing) e.preventDefault();
      request_for_logout = true;
      confirmLogout_modal.modal('show');
    });

    // For confirm logout modal
    confirmLogout_modal.on('show.bs.modal', (e) => {
      if (!request_for_logout) e.preventDefault();
    });

    confirmLogout_modal.on('hide.bs.modal', (e) => {
      if (logging_out) e.preventDefault();
      request_for_logout = false;
    });

    $('#confirmLogout_btn').on('click', (e) => {
      logging_out = true;
      $(e.currentTarget).html(`<i class="fas fa-spinner fa-spin-pulse mx-3"></i>`);
      User.logout();
    });

    $('#cancelLogout_btn').on('click', () => confirmLogout_modal.modal('hide'));
  }

  const handleForm = () => {
    $app(formSelector).handleForm({
      validators: {
        password: {
          required: 'Please type your password.',
          callback: {
            rule: () => {
              const password = password_input.val();
              return password_patterns
                .map(o => { if (o.id !== 'spaces') return o.pattern })
                .every(p => password.match(p) ? true : false )
            },
            message: () => {
              const password = password_input.val();

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
          required: 'This field is required.',
          callback: {
            rule: () => confirmPassword_input.val() === password_input.val(),
            message: 'This is not matched with your password.'
          }
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }

  const setElementsToLoadingState = () => {
    save_btn.attr('disabled', true);
    save_btn.html(`<i class="fas fa-spinner fa-spin-pulse"></i>`);

    password_input.attr('disabled', true);
    confirmPassword_input.attr('disabled', true);
  }

  const setElementsToUnloadState = () => {
    save_btn.attr('disabled', false);
    save_btn.html(`<span>Save my password</span>`);

    password_input.attr('disabled', false);
    confirmPassword_input.attr('disabled', false);
  }


  const onFormSubmit = () => {
    processing = true;

    const fd = new FormData(form);

    const data = {
      old_password: fd.get('password'),
      new_password: fd.get('password'),
    }

    setElementsToLoadingState();

    $.ajax({
      url: `${ BASE_URL_API }/users/change_password`,
      type: 'PUT',
      data: data,
      success: res => {
        if (res.error) {
          setElementsToUnloadState();
          ajaxErrorHandler(res.message);
        } else {
          toastr.success('Success! You are now redirecting to your site...', null, {"positionClass": "toast-top-center mt-3"});

          save_btn
            .html(`<i class="fas fa-check mx-3"></i>`)
            .removeClass('btn-primary')
            .addClass('btn-success');

          let redirect_path;

          if (getCookie('verified') == '0') {
            redirect_path = '/change-password';
          } else {
            const user_roles = JSON.parse(getCookie('roles'));

            if (user_roles.includes('Admin')) {
              redirect_path = '/a';
            } else if (user_roles.length === 1 && user_roles.includes('Chief')) {
              redirect_path = '/p/proposals';
            } else {
              redirect_path = '/p';
            }
          }
          
          setTimeout(() => location.assign(redirect_path), 250);
        }
      },
      error: (xhr, status, error) => {
        ajaxErrorHandler({
          file: 'auth/login.js',
          fn: 'onDOMLoad.$.ajax',
          data: data,
          xhr: xhr,
        });
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