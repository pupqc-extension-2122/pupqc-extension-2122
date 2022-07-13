/**
 * ==============================================
 * * USER PROFILE
 * ==============================================
*/

'use strict';

(() => {

  const user_id = getCookie('user');

  const loadUserData = async () => {
    await $.ajax({
      url: `${ BASE_URL_API }/users/${ user_id }`,
      type: 'GET',
      success: (res) => {
        if (res.error) {
          ajaxErrorHandler(res.message);
        } else {
          const { data } = res;
          console.log(data);

          // For User Profile Card
          setHTMLContent({
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
          setInputValue({
            '#editUserInfo_firstName': data.first_name,
            '#editUserInfo_middleName': data.middle_name,
            '#editUserInfo_lastName': data.last_name,
            '#editUserInfo_suffixName': data.suffix_name,
            '#editUserInfo_email': data.email,
          });
        }
      }
    })
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

  return {
    init: () => {
      loadUserData();
      handleForm();
    }
  }
})().init();