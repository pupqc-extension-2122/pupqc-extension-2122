/**
 * ==============================================
 * * Users
 * ==============================================
 */

  'use strict';

  const Users = (() => {
  /**
    * * Local Variables
    */
  let dt;
  const dtElem = $('#users_dt');
  let initialized = false;

  /**
   * * Private Methods
   */

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
            status: 'string'
          }
        },
        beforeSend: () => {
          dtElem.find('tbody').html(`
            <tr>
              <td colspan="6">${ DT_LANGUAGE.loadingRecords }</td>
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
          width: '30%',
          render: (data, type, row) => {
            const userName = (format = 'F M. L, S') => {
              return formatName(format, {
                firstName: data.first_name,
                middleName: data.middle_name,
                lastName: data.last_name,
                suffixName: data.suffix_name
              });
            }
            
            userName.length > 100
              ? `<span title="${ userName }" data-toggle="tooltip">${ userName.substring(0, 100) } ...</span>`
              : userName
          }
				}, {
          data: 'email',
          width: '25%',
        }, {
          data: null,
          width: '25%',
          sortable: false,
          render: data => {
            const roles = data.roles;
            const length = roles.length;
            if (length > 1) {
              return `
                <div>${ roles[0]}</div>
                <div class="small text-muted">and ${ length - 1 } more.</div>
              `
            } else if (length == 1) {
              return roles[0]
            } else {
              return `<div class="text-muted font-italic">No roles.</div>`
            }
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
          sortable: false,
          render: (data) => {
            const status = moment().isBetween(moment(data.validity_date), moment(data.end_date)) ? 'Active' : 'Inactive';
            const { theme, icon } = PARTNER_STATUS_STYLES[status];
            return `
              <div class="text-center">
                <div class="badge badge-subtle-${ theme } px-2 py-1">
                  <i class="${ icon } fa-fw mr-1"></i>
                  <span>${ status }</span>
                </div>
              </div>
            `;
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

  /**
   * * Public Methods
   */


  /**
   * * Init
   */
  const init = () => {
    if (!initialized) {
      initialized = 1;
      initDataTable();
      handleForm();
    }
  }

  return {
    init
  }

})();

Users.init();