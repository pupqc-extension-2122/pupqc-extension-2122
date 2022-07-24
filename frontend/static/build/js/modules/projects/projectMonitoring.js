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
    let exportConfigs = {...DT_CONFIG_EXPORTS};

    exportConfigs.buttons.buttons = DT.setExportButtonsObject(exportConfigs.buttons.buttons, {
      title: 'Project Monitoring - PUPQC-EPMS',
      messageTop: 'List of approved projects to be monitored',
    });

    dt = dtElem.DataTable({
      ...DT_CONFIG_DEFAULTS,
      ...exportConfigs,
      ajax: {
        url: `${ BASE_URL_API }/projects/approved/datatables`,
        // success: result => {
        //   console.log(result);
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'projects/projectMonitoring.js',
            fn: 'ProjectMonitoring.initDataTable()',
            xhr: xhr
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
          searchable: false,
          sortable: false,
					render: (data, type, row) => {
            const { target_groups: tg } = data;

            // For Export
            if (type === 'export') {
              if (tg.length) {
                let list = '';
                tg.forEach((t, i) => {
                  list += t.beneficiary_name;
                  if (i < tg.length-1) list += ', ';
                });
                return list
              } else return '';
            }

            // For display
						if (tg.length > 1) {
							return `
								<div>${ tg[0].beneficiary_name }</div> 
								<div class="small text-muted">and ${ tg.length - 1 } more.</div>
							`
						} else if(tg.length === 1) {
							return tg[0].beneficiary_name;
						} else {
							return `<div class="font-italic text-muted">No target groups have been set.</div>`
						}
					}
				}, {
          data: 'start_date',
          render: (data, type, row) => {

            // For Export
            if (type === 'export') return formatDateTime(data, 'Date');

            // For display
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small text-muted">${ fromNow(data) }</div>
            `
          }
        }, {
          data: 'end_date',
          render: (data, type, row) => {

            // For Export
            if (type === 'export') return formatDateTime(data, 'Date');

            // For display
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small text-muted">${ fromNow(data) }</div>
            `
          }
        }, {
          data: null,
          sortable: false,
          searchable: false,
          render: (data, type, row) => {
            const { start_date, end_date } = data;
            const today = moment();
            const status = (() => {
              if (today.isBefore(start_date) && today.isBefore(end_date)) {
                return 'Upcoming';
              } else if (today.isAfter(start_date) && today.isAfter(end_date)) {
                return 'Concluded';
              } else if (today.isBetween(start_date, end_date)) {
                return 'On going';
              } else {
                return 'No data';
              }
            })();

            // For export
            if (type === 'export') return status;

            // For display
            const { theme, icon } = PROJECT_MONITORING_STATUS_STYLES[status];
            return `
              <div class="text-sm-center">
                <div class="badge badge-subtle-${ theme } user-select-none px-2 py-1">
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