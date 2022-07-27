/**
 * ==============================================
 * * Users
 * ==============================================
 */

  'use strict';

const Users = (() => {
  
  // * Local Variables
  const dtElem_selector = '#users_dt';
  const dtElem = $(dtElem_selector);
  const editModal = $('#editUser_modal');
  const editFormSelector = '#editUser_form';
  const editForm = $(editFormSelector)[0];
  let dt;
  let editValidator;
  let initialized = false;
  let loaded = false;
  let processing = false;

  // * Private Methods 

  const initializations = () => {

    // *** For Edit User Modal *** //

    // editModal.on('show.bs.modal', async () => {
    // });

    editModal.on('hidden.bs.modal', () => {
      editForm.reset();
    });

    editModal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });
  }

  const initDataTable = async () => {
    dt = await dtElem.DataTable({
			...DT_CONFIG_DEFAULTS,
      ajax: {
        url: `${ BASE_URL_API }/users/datatables`,
        // success: result => {
        //   console.log(result);
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'admin/users.js',
            fn: 'Users.initDataTable()',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            email: 'string',
          }
        },
        beforeSend: () => {
          dtElem.find('tbody').html(`
            <tr>
              <td colspan="7">${ DT_LANGUAGE.loadingRecords }</td>
            </tr>
          `);
        },
      },
      columns: [
        { 
          data: 'created_at',
          visible: false,
        }, {
					data: null,
          searchable: false,
          sortable: false,
          width: '25%',
          render: (data, type, row) => {
            const userName = (format = 'F M. L, S') => {
              return formatName(format, {
                firstName : data.first_name,
                middleName: data.middle_name,
                lastName  : data.last_name,
                suffixName: data.suffix_name
              });
            }
            
            return userName.length > 100
              ? `<span title="${ userName }" data-toggle="tooltip">${ userName.substring(0, 100) } ...</span>`
              : userName
          }
				}, {
          data: 'email',
          width: '25%',
        }, {
          data: null,
          width: '15%',
          sortable: false,
          render: data => {
            let roles = '';
            data.roles.forEach((role, i) => {
              roles += role.name;
              if(i < data.roles.length-1) roles += ', '; 
            });
            return roles;
          }
        }, {
          data: 'created_at',
          width: '15%',
          render: (data, type, row) => {
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small text-muted">${ fromNow(data) }</div>
            `
          }
        }, {
          data: null,
          width: '15%',
          sortable: false,
          render: (data) => {
            return data.verified 
              ? `
                <div class="text-sm-center">
                  <div class="badge badge-subtle-success px-2 py-1">
                    <i class="fas fa-check fa-fw mr-1"></i>
                    <span>Verified</span>
                  </div>
                </div>
              `
              : `
                <div class="text-center">
                  <div class="badge badge-subtle-danger px-2 py-1">
                    <i class="fas fa-ban fa-fw mr-1"></i>
                    <span>Not Verified</span>
                  </div>
                </div>
              ` 
          }
        }, {
          data: null,
          width: '5%',
          render: data => {
            return `
              <div class="dropdown text-center">
                
                <div class="btn btn-sm btn-negative" data-toggle="dropdown" data-dt-btn="options" title="Options">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              
                <div class="dropdown-menu dropdown-menu-right">
                  <div class="dropdown-header">Options</div>
                  <button
                    type="button"
                    class="dropdown-item"
                    data-dt-btn="initEditMode"
                  >
                    <span>Edit details</span>
                  </button>
                </div>
              </div>
            `
          }
        }
      ]
    });

    $(dtElem_selector).on('click', `[data-dt-btn="initEditMode"]`, async (e) => {
      await getRoles();
      const row = $(e.currentTarget).closest('tr');
      const data = dt.row(row).data();
      initEditMode(data);
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
        },
        roles:  {
          required: "Please select at least one role.",
          notEmpty: "This field cannot be blank.",
        }
      },
      onSubmit: () => onEditFormSubmit()
    });
  }

  const onEditFormSubmit = async () => {

    processing = true;

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

      processing = false;
    }

    // Get the data
    const fd = new FormData(editForm);
    const data = {
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      middle_name: fd.get('middle_name'),
      suffix_name: fd.get('suffix_name'),
      email: fd.get('email'),
      user_roles: fd.getAll('roles').map(r => r = { role_id: r }),
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
          editModal.modal('hide');
          toastr.success('A user has been successfully updated');
        }
      }, 
      error: (xhr, status, error) => {
        enableElements();
        ajaxErrorHandler({
          file: 'admin/users.js',
          fn: 'Users.onEditFormSubmit()',
          data: data,
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
          const rolesList = $('#editUser_rolesList');

          rolesList.empty();

          data.forEach(role => {
            rolesList.append(`
              <div class="icheck-primary">
                <input 
                  type="checkbox" 
                  name="roles" 
                  value="${ role.id }" 
                  disabled
                  readonly
                >
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
          file: 'admin/user.js',
          fn: 'onDOMLoad.getRoles()',
          xhr: xhr
        });
      }
    });
  }

  const removeLoaders = () => {
    if (loaded) return;
    $('#editUser_formGroups_loader').remove();
    $('#editUser_formGroups').show();
  }

  // * Public Methods

  const reloadDataTable = async () =>  await dt.ajax.reload();

  const initEditMode = async (data) => {
    const { 
      id,
      first_name, 
      last_name, 
      middle_name,
      suffix_name,
      email,
      roles
    } = data;
  
    // Set the input values
    setInputValue({
      '#editUser_userId': id,
      '#editUser_firstName': first_name,
      '#editUser_middleName': middle_name,
      '#editUser_lastName': last_name,
      '#editUser_suffixName': suffix_name,
      '#editUser_email': email,
    });

    roles.forEach(role => {
      $('#editUser_rolesList')
        .find(`input[type="checkbox"][value="${ role.id }"]`)
        .prop('checked', true);
    });
    
    // Enable buttons
    $('#editUser_saveBtn').attr('disabled', false);

    // Show the modal
    editModal.modal('show');
  }

  // * Init

  const init = () => {
    if (!initialized) {
      initialized = true;
      initializations();
      handleEditForm();
      initDataTable();
    }
  }

  // * Return Public Methods

  return {
    init,
    reloadDataTable,
  }
})();

Users.init();