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
  ]

  const password_input = $('#updatePassword_password');
  const confirmPassword_input = $('#confirmPassword_password');

  const save_btn = $('#updatePassword_saveBtn');
  const logout_btn = $('#updatePassword_logoutBtn');

  let processing = false;

  // * Private Variables

  const checkPasswordStrength = (password) => {
    let strength = 0;
    let interpretation = 'undefined';

    const incrementStrength = (pattern_instance) => strength += pattern_instance > 2 ? 2 : pattern_instance;

    password_patterns.map(o => o = o.pattern).forEach(p => {
      const matches = password.match(p);
      if (matches) incrementStrength(matches.length);
    });

    if (strength == 0) interpretation = 'Undefined';
    if (strength > 0) interpretation = 'Very weak';
    if (strength >= 2) interpretation = 'Weak';
    if (strength >= 4) interpretation = 'Good';
    if (strength >= 6) interpretation = 'Strong';
    if (strength >= 8) interpretation = 'Unpredictable';

    return {
      strength,
      interpretation
    }
  }

  const initializations = () => {

    // For Password Input
    password_input.on('keyup', (e) => {
      const password = $(e.currentTarget).val();
      const password_strength = checkPasswordStrength(password);
      const percent = password_strength.strength >= 8 ? 100 : ( password_strength.strength / 8 ) * 100;
      
      $('#passwordStrength_progressBar')
        .css({ width: `${ percent }%` })
        .removeClass('bg-danger bg-warning bg-info bg-success')
        .addClass(() => {
          if (percent <= 25) return 'bg-danger';
          if (percent <= 50) return 'bg-warning';
          if (percent <= 75) return 'bg-info';
          if (percent <= 100) return 'bg-success';
        });
      
      $('#passwordStrength_label').html(() => {
        return percent == 0
          ? `<div class="text-muted font-italic">We will check how strong your password is</div>`
          : `<div class="font-weight-bold">${ password_strength.interpretation }</div>`;
      });
    });

    // For logout button
    logout_btn.on('click', (e) => {
      if (processing) e.preventDefault();
    });
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
            rule: () => $('#updatePassword_confirmPassword').val() === $('#updatePassword_password').val(),
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
    setElementsToLoadingState();

    const fd = new FormData(form);

    const data = {
      old_password: fd.get('password'),
      new_password: fd.get('password'),
    }

    $.ajax({
      url: `${ BASE_URL_API }/users/change_password`,
      type: 'PUT',
      data: data,
      success: res => {
        if (res.error) {
          setElementsToUnloadState();
          ajaxErrorHandler(res.message);
        } else {
          setElementsToUnloadState();
          toastr.success('Success! You are now redirecting to your site...', null, {"positionClass": "toast-top-center mt-3"});

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