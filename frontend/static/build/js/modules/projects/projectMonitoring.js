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
  const dtElem = $('#projectMonitoring_dt');
  let dt;
  let initialized = 0;

  /**
 * * Private Methods
 */

  const initDataTable = () => {
    dt = dtElem.DataTable({
      ...DT_CONFIG_DEFAULTS,
      ajax: {
        url: `${ BASE_URL_API }/projects/approved/datatables`,
        // success: result => {
        //   console.log(result);
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'projects/projectMonitoring.js',
            fn: 'ProjectMonitoring.initDataTable()',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            title: 'string',
            start_date: 'date',
            end_date: 'date',
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
          sortable: false,
          visible: false
        }, {
					data: 'title',
          width: '25%',
          render: (data, type, row) => {
            const displayTitle = data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
            return `<a href="${ BASE_URL_WEB }/p/monitoring/${ row.id }">${ displayTitle }</a>`
          }
				}, {
          data: null,
          width: '25%',
          sortable: false,
          render: data => {
            const target_groups = data.target_groups;
            const length = target_groups.length;
            if (length > 1) {
              return `
                <div>${ target_groups[0]}</div>
                <div class="small text-muted">and ${ length - 1 } more.</div>
              `
            } else if (length == 1) {
              return target_groups[0]
            } else {
              return `<div class="text-muted font-italic">No target groups.</div>`
            }
          }
        }, {
          data: null,
          render: data => {
            const start_date = data.start_date
            return `
              <div>${ formatDateTime(start_date, 'Date') }</div>
              <div class="small text-muted">${ fromNow(start_date) }</div>
            `
          }
        }, {
          data: null,
          render: data => {
            const end_date = data.end_date
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
              status = 'Upcoming';
            } else if (today.isAfter(start_date) && today.isAfter(end_date)) {
              status = 'Concluded';
            } else if (today.isBetween(start_date, end_date)) {
              status = 'On going';
            } else {
              status = 'No data';
            }
            const { theme, icon } = PROJECT_MONITORING_STATUS_STYLES[status];
            return `
              <div class="text-sm-center">
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
              <div class="dropdown textcenter">
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
                    class="dropdown-item"
                    href="${ BASE_URL_WEB }/p/monitoring/${ data.id }/activities" 
                  >
                    <span>View activities</span>
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

ProjectMonitoring.init();