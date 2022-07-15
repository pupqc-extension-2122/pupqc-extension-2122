/**
 * ==============================================
 * * PROJECTS FOR ACTIVITY EVALUATION
 * ==============================================
*/

'use strict';

const ActivityEvaluation = (() => {

  // * Local Variables

  let dt;
  const dtElem = $('#activityEvaluation_dt');
  let initialized = 0;

  // * Private Methods

  const initDataTable = async () => {
    dt = await dtElem.DataTable({
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
            return `<a href="${ BASE_URL_WEB }/p/evaluation/${ row.id }">${ displayTitle }</a>`
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
          data: 'start_date',
          render: data => {
            const start_date = data.start_date
            return `
              <div>${ formatDateTime(start_date, 'Date') }</div>
              <div class="small text-muted">${ fromNow(start_date) }</div>
            `
          }
        }, {
          data: 'end_date',
          render: data => {
            const end_date = data.end_date
            return `
              <div>${ formatDateTime(end_date, 'Date') }</div>
              <div class="small text-muted">${ fromNow(end_date) }</div>
            `
          }
        }, {
          data: null,
          width: '15%',
          searchable: false,
          sortable: false,
          render: data => {
            const project_activities = data.activities;
            const total_project_activities = project_activities.length;
            
            const evaluated_activities = project_activities.reduce((total, activity) => {
              return total + (activity.evaluation ? 1 : 0);
            }, 0);

            console.log(evaluated_activities);

            const percent = parseFloat(((evaluated_activities / total_project_activities) * 100).toFixed(4))

            if (percent === 100) {
              return `
                <div>
                  <i class="fas fa-check-circle text-success fa-fw mr-1"></i>
                  <span>Completed</span>
                </div>
              `
            } else if (percent === 0) {
              return `<div class="text-muted font-italic">No activity has been evaluated yet.</div>`
            } else {
              return `
                <div class="progress">
                  <div 
                    class="progress-bar bg-success" 
                    role="progressbar" 
                    aria-valuenow="${ percent }" 
                    aria-valuemin="0" 
                    aria-valuemax="100" 
                    style="width: ${ percent }%"
                  ></div>
                </div>
                <div class="small">
                  <span>Evaluated: ${ evaluated_activities }/${ total_project_activities }</span>
                </div>
              `;
            }
          }
        }, {
          data: null,
          width: '5%',
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
                    href="${ BASE_URL_WEB }/p/evaluation/${ data.id }" 
                  >
                    <span>View details</span>
                  </a>
                  <a 
                    class="dropdown-item"
                    href="${ BASE_URL_WEB }/p/evaluation/${ data.id }/activities" 
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

  // * Public Methods
  
  const reloadDataTable = async () => await dt.ajax.reload();

  // * Init

  const init = () => {
    if (!initialized) {
      initialized = 1;
      initDataTable();
    }
  }

  // * Return Public Methods
  
  return {
    init,
    reloadDataTable
  }

})();

ActivityEvaluation.init();