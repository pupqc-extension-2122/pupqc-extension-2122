/**
 * ==============================================
 * * MOA/MOU's
 * ==============================================
 */

'use strict';

const Memos = (() => {

  // * Local Variables

  let dt;
  const dtElem = $('#projectMOA_dt');
  let initialized = false;

  const initDataTable = async () => {
    let exportConfigs = {...DT_CONFIG_EXPORTS};

    exportConfigs.buttons.buttons = DT.setExportButtonsObject(exportConfigs.buttons.buttons, {
      title: 'List of MOA/MOU - PUPQC-EPMS',
      messageTop: 'List of Memorandum of Agreement/Understanding',
    });

    dt = await dtElem.DataTable({
			...DT_CONFIG_DEFAULTS,
      ...exportConfigs,
      ajax: {
        url: `${ BASE_URL_API }/memos/datatables`,
        // success: res => {
        //   console.log(res)
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'memo/partners.js',
            fn: 'Partnerships.initDataTable()',
            xhr: xhr
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            partner_name: 'string',
            representative_partner: 'string',
            validity_date: 'date',
            end_date: 'date',
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
					data: 'partner_name',
          width: '30%',
          render: (data, type, row) => {

            // For export
            if (type === 'export') return data || '';
            
            // For display
            const partnerName = data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
            return `<a href="${ BASE_URL_WEB }/m/memo/${ row.id }">${ partnerName }</a>`
          }
				}, {
          data: 'representative_partner',
          width: '20%',
        }, {
          data: 'validity_date',
          width: '20%',
          render: (data, type, row) => {
            
            // For export
            if (type === 'export') return formatDateTime(data, 'Date') || '';
            
            // For display
            const getClass = () => 
              moment().isAfter(data) && moment().isAfter(row.end_date)
                ? 'text-danger' : 'text-muted';
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small ${ getClass() }">${ fromNow(data) }</div>
            `
          }
        }, {
          data: 'end_date',
          width: '20%',
          render: (data, type, row) => {
            
            // For export
            if (type === 'export') return formatDateTime(data, 'Date') || '';
            
            // For display
            const getClass = () =>
              moment().isAfter(data) && moment().isAfter(row.validity_date)
                ? 'text-danger' : 'text-muted';
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small ${ getClass() }">${ fromNow(data) }</div>
            `
          }
        }, {
          data: null, 
          sortable: false,
          render: (data, type, row) => {
            const status = moment().isBetween(moment(data.validity_date), moment(data.end_date)) ? 'Active' : 'Inactive';
            
            // For export
            if (type === 'export') return status;
            
            // For display
            const { theme, icon } = MEMO_STATUS_STYLES[status];
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

Memos.init();