/**
 * ==============================================
 * * ADD User
 * ==============================================
 */

(() => {

  // * Local Variables

  let initialized = false;
  const user_roles = JSON.parse(getCookie('roles'));
  const modal = $('#addUser_modal')
  const formSelector = '#addUser_form';
  const form = $(formSelector)[0];
  let processing = false;

  // * Private Methods

  const initializations = () => {

    // *** For Add User Modal *** //

    // User Role
    const userRole_select = $('#addUser_role_select');
    const user_roles = [
      {
        id: 'Director',
        name: 'Director',
      }, {
        id: 'Chief',
        name: 'Chief',
      }, {
        id: 'Extensionist',
        name: 'Extensionist',
      }, {
        id: 'Admin',
        name: 'Admin',
      }
    ]

    userRole_select.empty();
    userRole_select.append(`<option></option>`);
    user_roles.forEach(t => {
      userRole_select.append(`
        <option value="${ t.id }">${ t.name }</option>
      `);
    });

    modal.on('hidden.bs.modal', () => {
      $('#addUser_formGroups_loader').show();
      $('#addUser_formGroups').hide();
      form.reset();
    });

    modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });
  }

  const handleForm = () => {
    $app('#addUser_form').handleForm({
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
        },
        role:  {
          required: "Role is required.",
          notEmpty: "This field cannot be blank.",
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }

  const onFormSubmit = async () => {
    processing = true;

    const fd = new FormData(form);
    const submitBtn = $('#submitUser_btn'); 

    // Set elements to loading state
    submitBtn.attr('disabled', true);
    submitBtn.html(`
      <span class="px-3">
        <i class="fas fa-spinner fa-spin-pulse"></i>
      </span>
    `);

    const enableElements = async () => {
      submitBtn.attr('disabled', false);
      submitBtn.html('Submit');
    }
    
    const data = {
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      middle_name: fd.get('middle_name'),
      suffix_name: fd.get('suffix_name'),
      email: fd.get('email'),
      roles: fd.get('roles'),
    }

    await $.ajax({
      url: `${ BASE_URL_API }/users/create`,
      type: 'POST',
      data: data,
      success: async result => {
        processing = false;
        if (result.error) {
          ajaxErrorHandler(result.message);
          enableElements();
        } else {
          await Users.reloadDataTable();
          enableElements();
          $('#addUser_modal').modal('hide');
          toastr.success('A new user has been successfully added.');
        }
      },
      error: () => {
        processing = false;
        ajaxErrorHandler();
        enableElements();
      }
    });
  }

  // * Return Public Functions

  return {
    init: () => {
      if (user_roles.includes('Admin') && !initialized) {
        initialized = true;
        initializations();
        handleForm();
      }
    }
  }
})().init();