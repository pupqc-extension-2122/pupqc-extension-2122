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

  let initialized = 0;

   // ! Simulation
  let data;

  /**
   * * Private Methods
   */

  const initDataTable = async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {

        // Sample Data
        data = [
          {
            partnership_name: 'Grain Foundation for PWDs Inc.',
            organization: 'Polytechnic University of the Philippines, Quezon City Branch',
            status: 'Active'
          }, {
            partnership_name: 'Kalinga Foundation',
            organization: 'IT Department',
            status: 'Inactive'
          },
        ];
        resolve();
      }, 2500);
    });

      // Data Table
      $('#partnerships_dt').DataTable({
        data: data,
        responsive: true,
        language: DT_LANGUAGE,
        columns: [
          { 
            data: 'partnership_name' 
          },
          {
            data: 'organization'
            
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
    init
  }

})();

Partnerships.init();