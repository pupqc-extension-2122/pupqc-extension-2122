/**
 * ==============================================
 * * Budget Item Categories
 * ==============================================
 */

  'use strict';

  const BudgetItemCategories = (() => {
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
    $app('#addBudgetItemCategory_form').handleForm({
      validators: {
        category_name: {
          required: "Budget item category  Name is required.",
          notEmpty: "This field cannot be blank.",
        }
      },
      onSubmit: () => {
        toastr.success("Budget item category has been added successfully!");
      }
    });
  }

  const initDataTable = async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {

        // Sample Data
        data = [
          {
            category_name: 'Utilities',
            date_added: '07/05/2022',
            status: 'Active'
          }, {
            category_name: 'Recreation and Entertainemnt',
            date_added: '07/05/2022',
            status: 'Inactive'
          },
        ];
        resolve();
      }, 2500);
    });

    // Data Table
    $('#budget_item_categories_dt').DataTable({
      data: data,
      responsive: true,
      language: DT_LANGUAGE,
      columns: [
        { 
          data: 'category_name' 
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
                    href="${ BASE_URL_WEB }/a/budget-item-categories/${ data.id }" 
                  >
                    <span>View details</span>
                  </a>
                  <a 
                    class="dropdown-item"
                    href="${ BASE_URL_WEB }/a/edit-budget-item-categories/${ data.id }" 
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

BudgetItemCategories.init();