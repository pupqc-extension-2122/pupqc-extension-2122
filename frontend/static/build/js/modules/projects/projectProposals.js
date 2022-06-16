/**
 * ==============================================
 * * PROJECT PROPOSALS
 * ==============================================
 */

'use strict';

const ProjectProposals = (() => {
  
  /**
   * * Local Variables
	 */
  
  let initialized = 0;
  let dt;

	/**
	 * * Private Methods
	 */

	const initDataTable = async () => {
		dt = await $('#projectProposals_dt').DataTable({
			...DT_CONFIG_DEFAULTS,
      ajax: {
        url: `${ BASE_URL_API }/projects/datatables`,
        // success: result => {
        //   console.log(result)
        // },
        error: () => {
          ajaxErrorHandler({
            file: 'projects/projectProposals.js',
            fn: 'ProjectProposals.initDataTable()',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          }, 1)
        }
      },
			columns: [
        {
          data: 'createdAt',
          visible: false,
        }, {
					data: 'title',
          width: '25%',
          render: title => {
            if (title.length > 100) {
              return `<span title="${ title }" data-toggle="tooltip">${ title.substring(0, 100) } ...</span>`
            } else {
              return title;
            }
          }
				}, {
					data: null,
          width: '25%',
          sortable: false,
					render: data => {
            const { target_groups } = data;
						if(target_groups.length > 1) {
							return `
								<div>${ target_groups[0] }</div> 
								<div class="small text-muted">and ${ target_groups.length - 1 } more.</div>
							`
						} else if(target_groups.length === 1) {
							return target_groups[0];
						} else {
							return `<div class="font-italic text-muted">No target groups have been set.</div>`
						}
					}
				}, {
					data: 'start_date',
					render: (data, type, row) => {
						return `
              <div class="text-nowrap">${ formatDateTime(data, 'Date') }</div>
              <div class="small text-muted">${ fromNow(data) }</div>
            `
					}
				}, {
					data: 'end_date',
					render: end_date => {
            return `
              <div class="text-nowrap">${ formatDateTime(end_date, 'Date') }</div>
              <div class="small text-muted">${ fromNow(end_date) }</div>
            `
					}
				}, {
					data: 'status',
					render: status => {
						const { theme, icon } = PROJECT_PROPOSAL_STATUS_STYLES[status];
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
										href="${ BASE_URL_WEB }/p/proposals/${ data.id }" 
									>
										<span>View details</span>
									</a>
									<a 
										class="dropdown-item"
										href="${ BASE_URL_WEB }/p/proposals/${ data.id }/activities" 
									>
										<span>Manage activities</span>
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

  const init = async () => {
    if (!initialized) {
      initialized = 1;
      await initDataTable();
    }
  }

	/**
	 * * Return Public Methods
	 */
	
  return {
		init
	}
})();

ProjectProposals.init();