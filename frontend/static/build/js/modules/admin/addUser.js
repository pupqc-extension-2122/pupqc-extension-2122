/**
 * ==============================================
 * * REGISTER USER
 * ==============================================
 */

(() => {

  // * Local Variables

  let initialized = false;
  const user_roles = JSON.parse(getCookie('roles'));
  const modal = $('#registerUser_modal')
  const formSelector = '#registerUser_form';
  const form = $(formSelector)[0];
  let loaded = false;
  let processing = false;

  // * Private Methods

  const initializations = () => {

    // *** For Add User Modal *** //

    modal.on('show.bs.modal', async () => {
      await getRoles();
    });

    modal.on('hidden.bs.modal', () => {
      form.reset();
    });

    modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });
  }

  const handleForm = () => {
    $app(formSelector).handleForm({
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
        roles:  {
          required: "Please select at least one role.",
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
      user_roles: fd.getAll('roles').map(r => r = { role_id: r }),
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
          modal.modal('hide');
          toastr.success('A new user has been successfully added.');
        }
      },
      error: (xhr, status, error) => {
        processing = false;
        enableElements();
        ajaxErrorHandler({
          file: 'admin/addUser.js',
          fn: 'onDOMLoad.getRoles()',
          xhr: xhr
        });
      }
    });
  }

  const getRoles = async () => {
    if (loaded) return;
    processing = true;
    await $.ajax({
      url: `${ BASE_URL_API }/roles`,
      type: 'GET',
      success: res => {
        processing = false;
        if (res.error) {
          ajaxErrorHandler(res.message);
        } else {
          const { data } = res;
          const rolesList = $('#addUser_rolesList');

          rolesList.empty();

          data.forEach(role => {
            rolesList.append(`
              <div class="icheck-primary">
                <input type="checkbox" name="roles" value="${ role.id }" id="role-${ role.id }">
                <label for="role-${ role.id }">${ role.name }</label>
              </div>
            `);
          });
          
          removeLoaders();

          if (!loaded) loaded = true;
        }
      },
      error: (xhr, status, error) => {
        processing = false;
        ajaxErrorHandler({
          file: 'admin/addUser.js',
          fn: 'onDOMLoad.getRoles()',
          xhr: xhr
        });
      }
    });
  }

  const removeLoaders = () => {
    if (loaded) return;
    $('#addUser_formGroups_loader').remove();
    $('#addUser_formGroups').show();
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