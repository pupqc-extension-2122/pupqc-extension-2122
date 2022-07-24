/**
 * ==============================================
 * * PROJECT PROPOSALS
 * ==============================================
 */

'use strict';

const ProjectProposals = (() => {
  
  // * Local Variables
  
  const user_roles = JSON.parse(getCookie('roles'));
  const dtElem = $('#projectProposals_dt');
  let dt;
  let initialized = 0;

	// * Private Methods

	const initDataTable = async () => {
    let exportConfigs = {...DT_CONFIG_EXPORTS};

    exportConfigs.buttons = DT.setExportButtonsObject(exportConfigs.buttons, {
      title: 'Project Proposals - PUPQC-EPMS',
      messageTop: 'List of project extension proposal',
    });

		dt = await dtElem.DataTable({
			...DT_CONFIG_DEFAULTS,
      ...exportConfigs,
      ajax: {
        url: `${ BASE_URL_API }/projects/datatables`,
        // success: res => {
        //   console.log(res)
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'projects/projectProposals.js',
            fn: 'ProjectProposals.initDataTable()',
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
          visible: false,
        }, {
					data: 'title',
          width: '25%',
          render: (data, type, row) => {

            // For Export
            if (type === 'export') return data;

            // For Display
            const displayTitle = data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
            return `<a href="${ BASE_URL_WEB }/p/proposals/${ row.id }">${ displayTitle }</a>`
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

            // For export
            if (type === 'export') return formatDateTime(data, 'Date')

            // For display
						return `
              <div class="text-nowrap">${ formatDateTime(data, 'Date') }</div>
              <div class="small text-muted">${ fromNow(data) }</div>
            `
					}
				}, {
					data: 'end_date',
					render: (data, type, row) => {

            // For export
            if (type === 'export') return formatDateTime(data, 'Date')

            // For display
            return `
              <div class="text-nowrap">${ formatDateTime(data, 'Date') }</div>
              <div class="small text-muted">${ fromNow(data) }</div>
            `
					}
				}, {
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
				}, {
					data: null,
          width: '5%',
					render: data => {
            const editable = 
              user_roles.includes('Extensionist') && (data.status == 'Created' || data.status == 'For Revision')
                ? `
                  <a 
                    class="dropdown-item"
                    href="${ BASE_URL_WEB }/p/edit-proposal/${ data.id }" 
                  >
                    <span>Edit details</span>
                  </a>
                `
                : ''

						return `
							<div class="dropdown text-center user-select-none">

								<div class="btn btn-sm btn-negative" data-toggle="dropdown" data-dt-btn="options" title="Options">
									<i class="fas fa-ellipsis-h"></i>
								</div>
								
                <div class="dropdown-menu dropdown-menu-right">
									<div class="dropdown-header">Options</div>
									<a 
										class="dropdown-item"
										href="${ BASE_URL_WEB }/p/proposals/${ data.id }" 
									>
										<span>View details</span>
									</a>
                  ${ editable }
									<a 
										class="dropdown-item"
										href="${ BASE_URL_WEB }/p/proposals/${ data.id }/activities" 
									>
										<span>${ user_roles.includes('Extensionist') && (data.status == 'Created' || data.status == 'For Revision') ? 'Manage' : 'View' } activities</span>
									</a>
								</div>
                
							</div>
						`;
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
      initialized = 1;
      await initDataTable();
    }
  }

	// * Return Public Methods
	
  return {
		init,
    reloadDataTable
	}
})();

ProjectProposals.init();