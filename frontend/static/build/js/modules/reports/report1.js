/**
 * ==============================================
 * * Status of Submitted Extension Project Proposal for Institutional Funding
 * ==============================================
 */

'use strict';

const Report1 = (() => {

  // * Local Variables

  let dt;
  const dtElem = $('#report1_dt');
  let initialized = false;

  const noContentTemplate = message => `<div class="font-italic text-muted">${ message }</div>`;

  const initDataTable = async () => {
    let exportConfigs = {...DT_CONFIG_EXPORTS};

    exportConfigs.buttons.buttons = DT.setExportButtonsObject(exportConfigs.buttons.buttons, {
      title: 'Report on Status of Submitted Extension Project Proposal for Institutional Funding - PUPQC-EPMS',
      message: 'List of reports generated',
    });

    const dateTemplate = date => `
      <div class="text-nowrap">${ formatDateTime(date, 'Short Date') }</div>
      <div class="text-nowrap small text-muted">${ fromNow(date) }</div>
    `

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
            funding_endorsement_date: 'date',
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
        
        // [3] Date Submitted
        {
          data: 'created_at',
          width: '20%',
          render: (data, type, row) => {
            
            // For export
            if (type === 'export') return formatDateTime(data, 'Date')
            
            // For display
            return dateTemplate(data);
          }
        }, 
        
        // [4] Date of conducted technical evaluation
        {
          data: null,
          width: '20%',
          sortable: false,
          render: (data, type, row) => {

            // For export
            if (type === 'export') return formatDateTime(data, 'Date')

            // For display
            return dateTemplate(data);
          }
        }, 
        
        // [5] Date of EPPEC evaluation
        {
          data: null,
          sortable: false,
          searchable: false,
          render: (data, type, row) => {
            
            // For export
            if (type === 'export') return formatDateTime(data, 'Date')

            // For display
            const { evaluation: e } = data;
            return e 
              ? dateTemplate(e.eppec_evaluation_date)
              : noContentTemplate('Evaluation is missing.')
            
          }
        }, 
        
        // [6] Release Date of EPPEC evaluation result
        {
          data: null,
          sortable: false,
          searchable: false,
          render: (data, type, row) => {
            
            // For export
            if (type === 'export') return formatDateTime(data, 'Date')

            // For display
            const { evaluation: e } = data;
            return e 
              ? dateTemplate(e.release_date)
              : noContentTemplate('Evaluation is missing.')
            
          }
        }, 
        
        // [7] Final Rating of EPPEC on Extension Project
        {
          data: null,
          searchable: false,
          sortable: false,
          render: (data, type, row) => {

            // For display
            const { evaluation: e } = data;
            if (e) {
              const { average_points: a } = e;
            
              if (a) {
                // For Export
                if (type === 'export') return `${a}%`;

                const { theme, remarks } = (() => {
                  return a >= 70 
                    ? { theme: 'success', remarks : 'PASSED' } 
                    : { theme: 'danger', remarks: 'FAILED' } 
                })();
  
                return `
                  <div class="font-weight-bold">${ a }%</div>
                  <div class="small font-weight-bold text-${ theme }">${ remarks }</div>
                `
              }
              // For Export
              if (type === 'export') return '';
              return noContentTemplate('Average point is missing.')
            }
            // For Export
            if (type === 'export') return '';
            return noContentTemplate('Evaluation is missing.')
          },
        }, 
        
        // [8] Recommendations
        {
          data: null,
          searchable: false,
          sortable: false,
          render: (data, type, row) => {

            // For display
            const { evaluation: e } = data;

            // For Export
            if (type === 'export') return e ? `${e.recommendations}` : '';

            return e ? `${ e.recommendations }` : noContentTemplate('Evaluation is missing.');
          },
        },

        // [9] Date of Endorsement of Project Proposal for Funding
        {
          data: 'funding_endorsement_date',
          render: (data, type, row) => {
            
            // For export
            if (type === 'export') 
              return data ? formatDateTime(data, 'Date') : '';

            // For display
            return data
              ? dateTemplate(data)
              : noContentTemplate('Date of Endorsement for Funding is missing.')
          }
        }, 
        
        // [10] Release date of Special Order
        {
          data: 'SO_release_date',
          render: (data, type, row) => {
            
            // For export
            if (type === 'export') 
              return data ? formatDateTime(data, 'Date') : '';

            // For display
            return data
              ? dateTemplate(data)
              : noContentTemplate('Release date of SO is missing.')
          }
        }, 
        
        // [10] Release date of Cash Advance
        {
          data: 'cash_release_date',
          render: (data, type, row) => {
            
            // For export
            if (type === 'export') 
              return data ? formatDateTime(data, 'Date') : '';

            //For display
            return data
              ? dateTemplate(data)
              : noContentTemplate('Release date of Cash Advance is missing.')
          }
        }, 
        
        // [11] Release date of Notice to Proceed
        {
          data: 'notice_release_date',
          render:(data, type, row) => {
            
            // For export
            if (type === 'export') 
              return data
                ? formatDateTime(data, 'Date')
                : ''

            // For display
            return data
              ? `
                <div>${ formatDateTime(data, 'Date') }</div>
                <div class="small text-muted">${ fromNow(data) }</div>
              `
              : noContentTemplate('Release date of Notice to Proceed is missing.')
          }
        }, 
        
        // [12] Options
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
                  <a href="${ BASE_URL_WEB }/r/report1/${ data.id }" class="dropdown-item">
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

Report1.init();