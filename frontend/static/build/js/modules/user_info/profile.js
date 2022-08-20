/**
 * ==============================================
 * * USER PROFILE
 * ==============================================
*/

'use strict';

(() => {
  const editFormSelector = '#editUser_form';
  const editForm = $(editFormSelector)[0];
  let editValidator;

  const loadUserData = async () => {

    const data = await User.getData();

    const hiddenEmail = (() => {
      const [username, server_domain] = data.email.split('@');
      
      return username.charAt(0) 
        + username.substr(1, username.length - 2).replace(/[\S]/g, "*")
        + username.charAt(username.length - 1)
        + '@'
        + server_domain;
    })();
    
    // For User Profile Card
    await setHTMLContent({
      '#userProfile_name': formatName('F M. L, S', {
        firstName: data.first_name,
        middleName: data.middle_name,
        lastName: data.last_name,
        suffixName: data.suffix_name,
      }),
      '#userProfile_roles': () => {
        let roles = '';
        const user_roles = JSON.parse(getCookie('roles'));
        user_roles.forEach((role, i) => {
          roles += role;
          if (i < user_roles.length-1) roles += ', ';
        });
        return roles;
      },
      '#userProfile_email': hiddenEmail,
    });

    // For Edit form
    await setInputValue({
      '#editUserInfo_firstName': data.first_name,
      '#editUserInfo_middleName': data.middle_name,
      '#editUserInfo_lastName': data.last_name,
      '#editUserInfo_suffixName': data.suffix_name,
      '#editUserInfo_email': hiddenEmail,
    });
  }

  const handleEditForm = () => {
    editValidator = $app(editFormSelector).handleForm({
        validators: {
          first_name: {
            required: "First  name is required.",
            notEmpty: "This field cannot be blank.",
          },
          last_name: {
            required: "Last name is required.",
            notEmpty: "This field cannot be blank.",
          },
          email:  {
            required: "Email is required.",
            email: 'The input is not a valid email address.',
            notEmpty: "This field cannot be blank.",
          }
        },
      onSubmit: () => onEditFormSubmit()
    });
  }

  const onEditFormSubmit = async () => {

    // Disable the elements
    const saveBtn = $('#editUser_saveBtn');
    const cancelBtn = $('#editUser_cancelBtn');
    
    cancelBtn.attr('disabled', true);
    saveBtn.attr('disabled', true);
    saveBtn.html(`
      <span class="px-3">
        <i class="fas fa-spinner fa-spin-pulse"></i>
      </span>
    `);

    // For enabling elements
    const enableElements = () => {

      // Enable buttons
      cancelBtn.attr('disabled', false);
      saveBtn.attr('disabled', false);
      saveBtn.html(`Submit`);

    }

    // Get the data
    const fd = new FormData(editForm);
    const data = {
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      middle_name: fd.get('middle_name'),
      suffix_name: fd.get('suffix_name'),
      email: fd.get('email'),
    }

    await $.ajax({
      url: `${ BASE_URL_API }/users/${ fd.get('user_id') }`,
      type: 'PUT',
      data: data,
      success: async res => {
        if (res.error) {
          ajaxErrorHandler(res.message);
          enableElements();
        } else {
          await reloadDataTable();
          enableElements();
          toastr.success('A user has been successfully updated');
        }
      }, 
      error: (xhr, status, error) => {
        enableElements();
        ajaxErrorHandler({
          file: 'user_info/profile.js',
          fn: 'Users.onEditFormSubmit()',
          data: data,
          xhr: xhr
        });
      }
    });

  }

  const initEditMode = async (data) => {
    const { 
      id,
      first_name, 
      last_name, 
      middle_name,
      suffix_name
    } = data;
  
    // Set the input values
    setInputValue({
      '#editUser_userId': id,
      '#editUser_firstName': first_name,
      '#editUser_middleName': middle_name,
      '#editUser_lastName': last_name,
      '#editUser_suffixName': suffix_name
    });
  }

  const removeLoaders = () => {
    $('#userInfo_body_loader').remove();
    $('#userInfo_body').show();

    $('#profileCard_loader').remove();
    $('#profileCard').show();
  }

  return {
    init: async () => {
      await loadUserData();
      handleEditForm();
      removeLoaders();
    }
  }
})().init();