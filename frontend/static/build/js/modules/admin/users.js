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
  let initialized = 0;

  // ! Simulation
  let data;

  /**
   * * Private Methods
   */

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

  const initDataTable = async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {

        // Sample Data
        data = [
          {
            user_name: 'Edgardo Delmo',
            email: 'chief@pupqc.com',
            role: 'Chief',
            date_added: '07/05/2022',
            status: 'Active'
          }, {
            user_name: 'Alma C. Fernandez',
            email: 'extensionist@pupqc.com',
            role: 'Extensionist',
            date_added: '07/06/2022',
            status: 'Active'
          },
        ];
        resolve();
      }, 2500);
    });

    // Data Table
    $('#users_dt').DataTable({
      data: data,
      responsive: true,
      language: DT_LANGUAGE,
      columns: [
        { 
          data: 'user_name' 
        },
        {
          data: 'email'
        },
        {
          data: 'role'
        },
        {
          data: null,
          render: ({ date_added }) => {
            return `
              <div>${ formatDateTime(date_added, 'Date') }</div>
              <div class="small text-muted">${ fromNow(date_added) }</div>
            `
          }
        },
        {
          data: null, 
          render: ({ status }) => {
            const { theme, icon } = PARTNER_STATUS_STYLES[status];
            return `
              <div class="text-center">
                <div class="badge badge-subtle-${ theme } px-2 py-1">
                  <i class="${ icon } fa-fw mr-1"></i>
                  <span>${ status }</span>
                </div>
            `;
          }
        },
        {
          data: null,
          render: data => {
            return `
              <div class="dropdown text-center">
                <div class="btn btn-sm btn-negative" data-toggle="dropdown" data-dt-btn="options" title="Options">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
                <div class="dropdown-menu dropdown-menu-right">
                  <div class="dropdown-header">Options</div>
                  <a 
                    class="dropdown-item"
                    href="${ BASE_URL_WEB }/a/user/${ data.id }" 
                  >
                    <span>View details</span>
                  </a>
                  <a 
                    class="dropdown-item"
                    href="${ BASE_URL_WEB }/a/edit-user/${ data.id }" 
                  >
                    <span>Edit details</span>
                  </a>
                </div>
              </div>
            `;
          }
        }
      ]
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