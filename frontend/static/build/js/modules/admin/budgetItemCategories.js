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
  let dt;
  const dtElem = $('#budget_item_categories_dt');
  let initialized = false;

  /**
   * * Private Methods
   */

  const initDataTable = async () => {
    dt = await dtElem.DataTable({
			...DT_CONFIG_DEFAULTS,
      ajax: {
        url: `${ BASE_URL_API }/budget_categories/datatables`,
        // success: result => {
        //   console.log(result);
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'admin/budgetItemCategories.js',
            fn: 'BudgetItemCategories.initDataTable()',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            name: 'string'
          }
        },
        beforeSend: () => {
          dtElem.find('tbody').html(`
            <tr>
              <td colspan="5">${ DT_LANGUAGE.loadingRecords }</td>
            </tr>
          `);
        },
      },
      columns: [
        { 
          data: 'created_at',
          visible: false,
        }, {
          data: 'name',
          width: '55%',
        }, {
          data: 'created_at',
          width: '25%',
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
          width: '15%',
          render: (data) => {
            return data.active 
              ? `
                <div class="text-sm-center">
                  <div class="badge badge-subtle-success px-2 py-1">
                    <i class="fas fa-check fa-fw mr-1"></i>
                    <span>Active</span>
                  </div>
                </div>
              `
              : `
                <div class="text-center">
                  <div class="badge badge-subtle-danger px-2 py-1">
                    <i class="fas fa-ban fa-fw mr-1"></i>
                    <span>Inactive</span>
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
                  <a href="${ BASE_URL_WEB }/a/budget-item-categories/${ data.id }" class="dropdown-item">
                      <span>Edit details</span>
                  </a>
                </div>
              </div>
            `
          }
        }
      ]
    });
  }

  /**
   * * Public Methods
   */
  const reloadDataTable = async () =>  await dt.ajax.reload();

  /**
   * * Init
   */
  const init = () => {
    if (!initialized) {
      initialized = 1;
      initDataTable();
    }
  }

  return {
    init,
    reloadDataTable,
  }

})();

BudgetItemCategories.init();