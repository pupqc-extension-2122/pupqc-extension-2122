'use strict';

/**
 * ==============================================
 * * PARTNERSHIPS
 * ==============================================
 */

const Partnerships = (() => {

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
        // }
      },
      columns: [
        {
          data: 'createdAt', visible: false
        },
        { 
          data: 'name' 
        },
        {
          data: null,
          render: () => `[ERR]: No organization`
        },
        {
          data: null, 
          render: data => {
            const status = 'Active';
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
          render: data => {
            return `
              <div class="dropdown text-center">
                
                <div class="btn btn-sm btn-negative" data-toggle="dropdown">
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

  const reloadDataTable = () => dt.ajax.reload();

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

Partnerships.init();