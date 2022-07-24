/**
 * ==============================================
 * * Report on Project Monitoring
 * ==============================================
 */

'use strict';

const Report5 = (() => {

  // * Local Variables

  let dt;
  const dtElem = $('#report5_dt');
  let initialized = false;

  const noContentTemplate = message => `<div class="font-italic text-muted">${ message }</div>`;

  const initDataTable = async () => {
    let exportConfigs = {...DT_CONFIG_EXPORTS};

    exportConfigs.buttons = DT.setExportButtonsObject(exportConfigs.buttons, {
      title: 'Report on Project Monitoring - PUPQC-EPMS',
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
            file: 'reports/report1.js',
            fn: 'Report1.initDataTable()',
            xhr: xhr
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            title:'string',
            implementer: 'string',
            // technical_evaluation_date: 'date',
            // eppec_evaluation_date: 'date',
            // release_date: 'date',
            // average_points: 'float',
            funding_approval_date: 'date',
            // recommendations: 'string',
            SO_release_date: 'date',
            cash_release_date: 'date',
            notice_release_date: 'date'
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
            return data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
          }
        }, 
        
        // [3] Duration of Project
        {
          data: null,
          render: (data, type, row) => {
            const { start_date, end_date } = data;
            if (start_date && end_date) {
              const start_end = `${ formatDateTime(start_date, 'Date') } - ${ formatDateTime(end_date, 'Date') }`;

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
        
        // [4] Type of Extension Project
        {
          data: 'project_type'
        },

        // [5] Frequency of Project Monitoring
        {
          data: 'monitoring_frequency',
        },

        // [6] Number of Extension workers who monitored the project
        {
          data: null,
          render: (data, type, row) => {
            if (type === 'export') return '';
            return noContentTemplate('This has not been set up yet.');
          }
        },

        // [7] Method of Project Monitoring
        {
          data: 'monitoring_method',
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
                  <a href="${ BASE_URL_WEB }/m/memo/${ data.id }" class="dropdown-item">
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

Report5.init();