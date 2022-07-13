/**
 * ==============================================
 * * USER SETTINGS
 * ==============================================
*/

'use strict';

(() => {
  
  const handleForm = () => {
    $app('#settings_form').handleForm({
      validators: {
        old_password: {
          required: 'Old password is required.'
        },
        new_password: {
          required: 'New password is required.'
        },
        confirm_newPassword: {
          required: 'Confirmation of password is required.',
          equalTo:{
            rule:'#new_password',
            message:'Password does not match!'
          }
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }

  return {
    init: () => {
      handleForm();
    }
  }
})().init();