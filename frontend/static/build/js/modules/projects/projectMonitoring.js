/**
 * ==============================================
 * * PROJECT MONITORING
 * ==============================================
*/

'use strict';

const ProjectMonitoring = (() => {

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
            id: 1,
            title: 'Strengthening Resilience To Disasters and Be a Solution to Changing Environment',
            implementer: 'Polytechnic University of the Philippines, Quezon City Branch',
            start_date: '07/01/2022',
            end_date: '07/15/2022',
            status: 'Approved',
            target_groups: [
              {
                id: 1,
                name: 'Staffs of Grain Foundation for PWDs Inc.'
              }, {
                id: 2,
                name: 'Staffs of Grain Foundation for PWDs Inc.'
              },
            ]
          }, {
            id: 1,
            title: 'Strengthening Resilience To Disasters and Be a Solution to Changing Environment',
            implementer: 'Polytechnic University of the Philippines, Quezon City Branch',
            start_date: '06/01/2022',
            end_date: '06/30/2022',
            status: 'Approved',
            target_groups: [
              {
                id: 1,
                name: 'Staffs of Grain Foundation for PWDs Inc.'
              }, {
                id: 2,
                name: 'Staffs of Grain Foundation for PWDs Inc.'
              },
            ]
          }, {
            id: 1,
            title: 'Strengthening Resilience To Disasters and Be a Solution to Changing Environment',
            implementer: 'Polytechnic University of the Philippines, Quezon City Branch',
            start_date: '05/03/2022',
            end_date: '05/04/2022',
            status: 'Approved',
            target_groups: [
              {
                id: 1,
                name: 'Staffs of Grain Foundation for PWDs Inc.'
              }, {
                id: 2,
                name: 'Staffs of Grain Foundation for PWDs Inc.'
              },
            ]
          }
        ];
        resolve();
      }, 2500);
    });

    // Data Table
    dt = $('#projectMonitoring_dt').DataTable({
      data: data,
      responsive: true,
      language: DT_LANGUAGE,
      columns: [
        {
          data: 'title'
        }, {
          data: null,
          render: ({ target_groups }) => {
            if(target_groups.length > 1) {
              return `
                <div>${ target_groups[0].name }</div> 
                <div class="small text-muted">and ${ target_groups.length - 1 } more.</div>
              `
            } else if(target_groups.length === 1) {
              return target_groups[0].name;
            } else {
              return `<div class="font-italic text-muted">No target groups have been set.</div>`
            }
          }
        }, {
          data: null,
          render: ({ start_date }) => {
            return `
              <div>${ formatDateTime(start_date, 'Date') }</div>
              <div class="small text-muted">${ fromNow(start_date) }</div>
            `
          }
        }, {
          data: null,
          render: ({ end_date }) => {
            return `
              <div>${ formatDateTime(end_date, 'Date') }</div>
              <div class="small text-muted">${ fromNow(end_date) }</div>
            `
          }
        }, {
          data: null,
          render: data => {
            const { start_date, end_date } = data;
            const today = moment();
            let status;
            if (today.isBefore(start_date) && today.isBefore(end_date)) {
              status = 'Not yet started';
            } else if (today.isAfter(start_date) && today.isAfter(end_date)) {
              status = 'Finished';
            } else if (today.isBetween(start_date, end_date)) {
              status = 'On going';
            } else {
              status = 'No data';
            }
            const { theme, icon } = PROJECT_MONITORING_STATUS_STYLES[status];
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
                <div class="btn btn-sm btn-negative" data-toggle="dropdown" data-dt-btn="options" title="Options">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
                <div class="dropdown-menu dropdown-menu-right">
                  <div class="dropdown-header">Options</div>
                  <a 
                    class="dropdown-item"
                    href="${ BASE_URL_WEB }/p/monitoring/${ data.id }" 
                  >
                    <span>View details</span>
                  </a>
                  <a 
                    class="dropdown-item"A
                    href="${ BASE_URL_WEB }/p/monitoring/${ data.id }/activities" 
                  >
                    <span>View activities</span>
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
    }
  }

  /**
 * * Return public methods
 */

  return {
    init
  }

})();

ProjectMonitoring.init();