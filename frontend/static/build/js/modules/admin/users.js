/**
 * ==============================================
 * * Users
 * ==============================================
 */

  'use strict';

const Users = (() => {
  
  // * Local Variables

  let dt;
  const dtElem = $('#users_dt');
  let initialized = false;

  // * Private Methods 

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
          render: data => {
            const created_at = data.created_at
            return `
              <div>${ formatDateTime(created_at, 'Date') }</div>
              <div class="small text-muted">${ fromNow(created_at) }</div>
            `
          }
        }, {
          data: null,
          class: 'text-center', 
          sortable: false,
          render: (data) => {
            return data.verified 
              ? `
                <div class="text-center">
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
                  <a href="${ BASE_URL_WEB }/a/user/${ data.id }" class="dropdown-item">
                      <span>View details</span>
                  </a>
                </div>
              </div>
            `
          }
        }
      ]
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
      onSubmit: () => {
        toastr.success("User has been registered successfully!");
      }
    });
  }

  // * Public Methods

  const reloadDataTable = async () =>  await dt.ajax.reload();

  // * Init

  const init = () => {
    if (!initialized) {
      initialized = 1;
      initDataTable();
      handleForm();
    }
  }

  // * Return Public Methods

  return {
    init,
    reloadDataTable,
  }
})();

Users.init();