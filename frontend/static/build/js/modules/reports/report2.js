/**
 * ==============================================
 * * Status of University Extension Projects
 * ==============================================
 */

'use strict';

const Report2 = (() => {

  // * Local Variables

  let dt;
  const dtElem = $('#report2_dt');
  let initialized = false;

  const noContentTemplate = message => `<div class="font-italic text-muted">${ message }</div>`;

  const initDataTable = async () => {
    let exportConfigs = {...DT_CONFIG_EXPORTS};

    exportConfigs.buttons.buttons = DT.setExportButtonsObject(exportConfigs.buttons.buttons, {
      title: 'Report on Status of University Extension Projects - PUPQC-EPMS',
      messageTop: 'Report outputs',
    });

    dt = await dtElem.DataTable({
      ...DT_CONFIG_DEFAULTS,
      ...exportConfigs,
      ajax: {
        url: `${ BASE_URL_API }/projects/approved/datatables`,
        // success: res => {
        //   console.log(res)
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'reports/report2.js',
            fn: 'Report1.initDataTable()',
            xhr: xhr
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
          }
        },
        beforeSend: () => {
          dtElem.find('tbody').html(`
            <tr>
              <td colspan="14">${ DT_LANGUAGE.loadingRecords }</td>
            </tr>
          `);
        },
      },
      columns: [
        
        // [0] Date Created 
        {
          data: 'created_at',
          visible: false,
        },

        // [1] Project Title
        {
					data: 'title',
          width: '20%',
          render: (data, type, row) => {

            // For exports
            if (type === 'export') return data;

            // For display
            const displayTitle = data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
            return `<a href="${ BASE_URL_WEB }/p/proposals/${ row.id }">${ displayTitle }</a>`
          }
				}, 

        // [2] Type of Extension Project
        {
          data: 'project_type'
        },

        // [3] Objectives of the Project
        {
          data: 'impact_statement',
          render: (data, type, row) => {

            // For exports
            if (type === 'export') return data;

            // For display
            return data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
          }
        },

        // [4] Project Proponent
        {
          data: 'implementer',
          width: '20%',
          render: (data, type, row) => {
            return data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
          }
        },

        // [5] Type of funding
        {
          data: 'funding_type'
        },

        // [6] Duration of Project
        {
          data: null,
          render: (data, type, row) => {
            const { start_date, end_date } = data;
            if (start_date && end_date) {
              const start_end = `
                <span class="text-nowrap">${ formatDateTime(start_date, 'Short Date') }</span>
                <span class="text-nowrap">- ${ formatDateTime(end_date, 'Short Date') }</span>
              `;

              if (type === 'export') return start_end;

              const duration = (() => {
                return moment(start_date).isSame(moment(end_date))
                  ? 'in the whole day'
                  : moment(start_date).to(moment(end_date), true)
              })();
              return `
                <div>${ start_end }</div>
                <div class="small text-muted">${ duration }</div>
              `
            } else {
              if (type === 'export') return '';
              return noContentTemplate('No dates have been set up.');
            }
          }
        },

        // [7] Request amount of funding
        {
          data: null,
          render: (data, type, row) => {
            const { financial_requirements: fr } = data;

            let overallAmount = 0;
            fr.forEach(category => category.items.forEach(r => overallAmount += r.quantity * r.estimated_cost));
            const amount = formatToPeso(overallAmount);

            // For export
            if (type === 'export') return amount;

            // For display
            return `<div class="text-right">${ amount }</div>`;
          }
        },

        // [8] Partner Community/Target Beneficiaries
        {
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
				},

        // [9] Location of Target Beneficiaries
        {
          data: null,
          render: (data, type, row) => {
            const { target_groups: tg } = data;
            let locations = tg.filter(t => t.location).map(t => t.location);
            
            // For Export
            if (type === 'export') {
              if (locations) {
                let list = '';
                locations.forEach((l, i) => {
                  list += l;
                  if (i < locations.length-1) list += ', ';
                });
                return list
              } else return '';
            }

            // For display
						if (locations > 1) {
							return `
								<div>${ locations[0] }</div> 
								<div class="small text-muted">and ${ tg.length - 1 } more.</div>
							`
						} else if(locations.length === 1) {
							return locations[0];
						} else {
							return `<div class="font-italic text-muted">No target groups have been set.</div>`
						}
          }
        },

        // [10] Target Number of beneficiaries based on Community Needs Assessment
        {
          data: null,
          render: (data, type, row) => {
            const n = data.target_groups.length;

            if (type === 'export') return n;

            return `<div>${ n }</div>`;
          }
        },

        // [11] Total no. of trainees/beneficiaries participated in the survey on Evaluation of the Training
        {
          data: null,
          render: (data, type, row) => {
            if (type === 'export') return '';
            return noContentTemplate('This has not been set up yet.');
          }
        },

        // [12] Total no. of trainees/beneficiaries who rated the quality of extension service (Rate 1-5)
        {
          data: null,
          render: (data, type, row) => {
            if (type === 'export') return '';
            return noContentTemplate('This has not been set up yet.');
          }
        },

        // [13] Total no. of trainees/beneficiaries who rated the timeliness of extension service (Rate 1-5)
        {
          data: null,
          render: (data, type, row) => {
            if (type === 'export') return '';
            return noContentTemplate('This has not been set up yet.');
          }
        },

        // [14] Number of Technology Transfer of Knowledge training Adopted by the Partner Beneficiaries
        {
          data: null,
          render: (data, type, row) => {
            if (type === 'export') return '';
            return noContentTemplate('This has not been set up yet.');
          }
        },

        // [15] Status of Project
        // {
        //   data: null,
        //   render: (data, type, row) => {
        //     return `Test`
        //   }
        // },

        // [16] Status of Active Project
        {
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
              <div class="">
                <div class="badge badge-subtle-${ theme } user-select-none px-2 py-1">
                  <i class="${ icon } fa-fw mr-1"></i>
                  <span>${ status }</span>
                </div>
              </div>
            `;
          }
        },

        // [17] Options
        {
          data: null,
          width: '5%',
          render: data => {
            return `
              <div class="dropdown text-center">
                
                <div class="btn btn-sm btn-negative" data-toggle="dropdown" data-dt-btn="options" title="Options">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              
                <div class="dropdown-menu dropdown-menu-right fade">
                  <div class="dropdown-header">Options</div>
                  <div
                    role="button"
                    class="dropdown-item"
                    data-dt-btn="viewDetails" 
                  >
                    <span>Update fields</span>
                  </div>
                </div>
              </div>
            `
          }
        }
      ]
    });
  }

  // * Public Methods

  const reloadDataTable = async () => await dt.ajax.reload();

  // * Init

  const init = async () => {
    if (!initialized) {
      initialized = true;
      await initDataTable();
    }
  }

  // * Return Public Methods

  return {
    init,
    reloadDataTable
  }

})();

Report2.init();