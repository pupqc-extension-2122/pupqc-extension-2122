/**
 * ==============================================
 * * University Active Extension Partners and Adopted Communities
 * ==============================================
 */

'use strict';

const Report3 = (() => {

  // * Local Variables

  let dt;
  const dtElem = $('#report3_dt');
  let initialized = false;

  const noContentTemplate = message => `<div class="font-italic text-muted">${ message }</div>`;

  const initDataTable = async () => {
    let exportConfigs = {...DT_CONFIG_EXPORTS};

    exportConfigs.buttons.buttons = DT.setExportButtonsObject(exportConfigs.buttons.buttons, {
      title: 'Report on University Active Extension Partners and Adopted Communities - PUPQC-EPMS',
      message: 'List of reports generated',
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
            file: 'reports/report3.js',
            fn: 'Report3.initDataTable()',
            xhr: xhr
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            title:'string',
            implementer: 'string',
            funding_type:'string',
          }
        },
        beforeSend: () => {
          dtElem.find('tbody').html(`
            <tr>
              <td colspan="9">${ DT_LANGUAGE.loadingRecords }</td>
            </tr>
          `);
        },
      },
      columns: [

        // [0] Created at (Invisible)
        { 
          data: 'created_at',
          visible: false,
        }, 
        
        // [1] Project Title
        {
					data: 'title',
          width: '20%',
          render: (data, type, row) => {

            // For Export
            if (type === 'export') return data;

            // For display
            const displayTitle = data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
            return `<a href="${ BASE_URL_WEB }/p/proposals/${ row.id }">${ displayTitle }</a>`
          }
				}, 
        
        // [2] Project Proponent
        {
          data: 'implementer',
          width: '20%',
          render: (data, type, row) => {

            // For Export
            if (type === 'export') return data;
            
            // For display
            return data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
          }
        }, 
        
        // [3] Type of Funding
        {
          data: 'funding_type',
          width: '20%',
          render: (data, type, row) => {

            // For Export
            if (type === 'export') return data;
            
            // For display
            return data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
          }
        }, 
        
        // [4] Partner Community/Target Beneficiaries
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
        
        // [5] Location of Target Beneficiaries
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
        
        // [6] Date of Effectivity of MOU/MOA
        {
          data: null,
          render: (data, type, row) => {

            if (type === 'export') return ''
            return noContentTemplate('Date of Effectivity of MOU/MOA is missing.');
            
            // TODO: Date of Effectivity of MOU/MOA

            // For export
            // if (type === 'export') 
            //   return data 
            //     ? formatDateTime(data, 'Date')
            //     : ''

            //For display
            // return data
            //   ? `
            //     <div>${ formatDateTime(data, 'Date') }</div>
            //     <div class="small text-muted">${ fromNow(data) }</div>
            //   `
            //   : noContentTemplate('Date of Effectivity of MOU/MOA is missing.')
          }
        },

        // [7] Status of Project
        {
					data: 'status',
					render: (data, type, row) => {

            // For export
            if (type === 'export') return data;

            // For display
						const { theme, icon } = PROJECT_PROPOSAL_STATUS_STYLES[data];
						return `
							<div class="text-center">
								<div class="badge badge-subtle-${ theme } px-2 py-1 user-select-none">
									<i class="${ icon } fa-fw mr-1"></i>
									<span>${ data }</span>
								</div>
							</div>
						`;
					}
				},
        
        // [8] Options
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
                  <a href="${ BASE_URL_WEB }/r/report/${ data.id }" class="dropdown-item">
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

Report3.init();