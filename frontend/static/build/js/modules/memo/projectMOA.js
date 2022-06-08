'use strict';

/**
 * ==============================================
 * * PROJECT MOA
 * ==============================================
 */

const ProjectMoa = (() => {

  /**
   * * Local Variables
   */

  let initialized = 0;

   // ! Simulation
  let data;

  /**
   * * Private Methods
   */

  const initializations = () => {
    // Initialize Notary Signed Date
    $app('#addMOA_notarySignedDate').initDateInput({
      button: '#addMOA_notarySignedDate_pickerBtn'
    });

    // Initialize Validity Date
    $app('#addMOA_validityDate').initDateInput({
      button: '#addMOA_validityDate_pickerBtn'
    });
  }

  const initDataTable = async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        
        // Sample Data
        data = [
          {
            partnership_name: 'Grain Foundation for PWDs Inc.',
            partnership_representative: 'Executive Director Byung Min Lee',
            notary_signed_date: '05/14/2022',
            validity_date: '05/14/2023',
            status: 'Active'
          }, {
            partnership_name: 'Kalinga Foundation',
            partnership_representative: 'Executive Director Byung Min Lee',
            notary_signed_date: '05/14/2019',
            validity_date: '01/20/2021',
            status: 'Inactive'
          },
        ];
        resolve();
      }, 2500);
    });

    // Data Table
    $('#projectMOA_dt').DataTable({
      data: data,
      responsive: true,
      language: DT_LANGUAGE,
      columns: [
        { 
          data: 'partnership_name' 
        },
        {
          data: 'partnership_representative'
          
        },
        {
          data: null,
          render: data => {
            const notarySignedDate = data.notary_signed_date;
            return moment(notarySignedDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
          }
        },
        {
          data: null,
          render: data => {
            const validityDate = data.validity_date;
            return moment(validityDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
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
                    <a href="./view-moa-details.html" class="dropdown-item">
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
      initializations();
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

ProjectMoa.init();