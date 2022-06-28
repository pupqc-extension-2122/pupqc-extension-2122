'use strict';

/**
 * ==============================================
 * * PARTNERS
 * ==============================================
 */

const Partners = (() => {

  /**
   * * Local Variables
   */
  let dt;
  let initialized = 0;

  /**
   * * Private Methods
   */

  const initDataTable = () => {
    dt = $('#partnerships_dt').DataTable({
      ...DT_CONFIG_DEFAULTS,
      ajax: {
        url: `${ BASE_URL_API }/partners/datatables`,
        // success: result => {
        //   console.log(result);
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'memo/partners.js',
            fn: 'Partnerships.initDataTable()',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            name: 'string',
            address: 'string',
          }
        }
      },
      columns: [
        {
          data: 'created_at', 
          visible: false
        }, { 
          data: 'name',
          width: '30%',
          render: (data, type, row) => {
            const partnerName = data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
            return `<a href="${ BASE_URL_WEB }/m/partners/${ row.id }">${ partnerName }</a>`
          }
        }, {
          data: 'address',
          width: '40%',
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
          width: '5%',
          render: data => {
            return `
              <div class="dropdown text-sm-center">
                
                <div class="btn btn-sm btn-negative" data-toggle="dropdown" data-dt-btn="options" title="Options">
                  <i class="fas fa-ellipsis-h"></i>
                </div>

                <div class="dropdown-menu dropdown-menu-right">
                  <div class="dropdown-header">Options</div>
                  <a href="${ BASE_URL_WEB }/m/partners/${ data.id }" class="dropdown-item">
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

  /**
   * * Public Methods
   */

  const reloadDataTable = async () => await dt.ajax.reload();

  /**
   * * Init
   */

  const init = () => {
    if (!initialized) {
      initialized = 1;
      initDataTable();
    }
  }

  /**
   * * Return public methods
   */

  return {
    init,
    reloadDataTable
  }

})();

Partners.init();