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

  const initDataTable = async () => {
    dt = await dtElem.DataTable({
			...DT_CONFIG_DEFAULTS,
      ajax: {
        url: `${ BASE_URL_API }projects/datatables`,
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
            technical_evaluation_date: 'date',
            eppec_evaluation_date: 'date',
            release_date: 'date',
            average_points: 'float',
            funding_approval_date: 'date',
            recommendations: 'string',
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
        { 
          data: 'created_at',
          visible: false,
        }, {
					data: 'title',
          render: (data, type, row) => {
            const displayTitle = data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
            return `<a href="${ BASE_URL_WEB }/p/proposals/${ row.id }">${ displayTitle }</a>`
          }
				}, {
          data: 'implementer',
        }, {
          data: 'created_at',
          width: '25%',
          render: data => {
            const created_at = data.created_at
            return `
              <div>${ formatDateTime(created_at, 'Date') }</div>
              <div class="small text-muted">${ fromNow(created_at) }</div>
            `
          }
        }, {
          data: 'technical_evaluation_date',
          render: data => {
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small ${ getClass() }">${ fromNow(data) }</div>
            `
          }
        }, {
          data: 'eppec_evaluation_date',
          render: data => {
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small ${ getClass() }">${ fromNow(data) }</div>
            `
          }
        }, {
          data: 'release_date',
          render: data => {
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small ${ getClass() }">${ fromNow(data) }</div>
            `
          }
        }, {
          data: 'average_points',
        }, {
					data: 'recommendations',
          render: (data, type, row) => {
            return data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
          }
				},  {
          data: 'funding_approval_date',
          render: data => {
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small ${ getClass() }">${ fromNow(data) }</div>
            `
          }
        }, {
          data: 'SO_release_date',
          render: data => {
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small ${ getClass() }">${ fromNow(data) }</div>
            `
          }
        }, {
          data: 'cash_release_date',
          render: data => {
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small ${ getClass() }">${ fromNow(data) }</div>
            `
          }
        }, {
          data: 'notice_release_date',
          render: data => {
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small ${ getClass() }">${ fromNow(data) }</div>
            `
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

Report1.init();