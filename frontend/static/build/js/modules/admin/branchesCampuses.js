/**
 * ==============================================
 * * Budget Item Categories
 * ==============================================
 */

  'use strict';

  const BranchesCampuses = (() => {
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
    $app('#addBranchCampus_form').handleForm({
      validators: {
        branchCampus_name: {
          required: "Branch/Campus name is required.",
          notEmpty: "This field cannot be blank.",
        },
        type: {
          required: "Type is required.",
          notEmpty: "This field cannot be blank.",
        }
      },
      onSubmit: () => {
        toastr.success("Branch/Campus has been added successfully!");
      }
    });
  }

  const initDataTable = async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {

        // Sample Data
        data = [
          {
            branchCampus_name: 'Polytechnic University of the Philippines Quezon City',
            type:'Branch',
            date_added: '07/05/2022',
            status: 'Active'
          }, {
            branchCampus_name: 'Polytechnic University of the Philippines Pulilan, Bulacan',
            type:'Campus',
            date_added: '07/05/2022',
            status: 'Active'
          },
        ];
        resolve();
      }, 2500);
    });

    // Data Table
    $('#branches_campuses_dt').DataTable({
      data: data,
      responsive: true,
      language: DT_LANGUAGE,
      columns: [
        { 
          data: 'branchCampus_name' 
        },
        { 
          data: 'type' 
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
                    href="${ BASE_URL_WEB }/a/branches-campuses/${ data.id }" 
                  >
                    <span>View details</span>
                  </a>
                  <a 
                    class="dropdown-item"
                    href="${ BASE_URL_WEB }/a/edit-branches-campuses/${ data.id }" 
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

BranchesCampuses.init();