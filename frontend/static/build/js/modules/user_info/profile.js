/**
 * ==============================================
 * * USER PROFILE
 * ==============================================
*/

'use strict';

(() => {

  const loadUserData = async () => {

    const data = await User.getData();

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
      '#userProfile_email': data.email,
    });

    // For Edit form
    await setInputValue({
      '#editUserInfo_firstName': data.first_name,
      '#editUserInfo_middleName': data.middle_name,
      '#editUserInfo_lastName': data.last_name,
      '#editUserInfo_suffixName': data.suffix_name,
      '#editUserInfo_email': data.email,
    });
  }

  const handleForm = () => {
    $app('#editUser_form').handleForm({
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
      onSubmit: () => onFormSubmit()
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
      handleForm();
      removeLoaders();
    }
  }
})().init();