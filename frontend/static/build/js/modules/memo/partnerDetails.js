/**
 * ==============================================
 * * PARTNER DETAILS
 * ==============================================
 */

'use strict';

const PartnerDetails = (() => {

  /**
   * * Local Variables
   */
  
  const formSelector = '#editPartnership_form';
  let dt;
  const dtElem = $('#partnerMemos_dt');
  let initialized = false;

  // Data Container
  let partner;

  /**
   * * Private Methods
   */

  const noContentTemplate = (message) => `<div class="text-muted font-italic">${message}</div>`;

  const loadDocumentTitle = () => {
    const partnerName = partner.name;
    const documentTitle = partnerName.length > 75 
      ? partnerName.substring(0, 75) + ' ...' 
      : partnerName;

    setDocumentTitle(`${ documentTitle } - Parner Details`);
  }

  const handleForm = () => {
    $app(formSelector).handleForm({
      validators: {
        name: {
          required: "The partner name is required.",
          notEmpty: "This field cannot be empty.",
        },
        address: {
          required: "The partner address is required.",
          notEmpty: "This field cannot be empty.",
        },
        organization:  {
          required: "The organization is required.",
          notEmpty: "This field cannot be empty.",
        }
      },
      onSubmit: () => {
        toastr.success("Partnership details has been updated successfully!");
      }
    });
  }

  const initDataTable = async () => {
    dt = await dtElem.DataTable({
			...DT_CONFIG_DEFAULTS,
      ajax: {
        url: `${ BASE_URL_API }/partners/${ partner.id }/memos`,
        // success: res => {
        //   console.log(res)
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'memo/partnerDetails.js',
            fn: 'PartnerDetails.initDataTable()',
            xhr: xhr
          }, true);
        },
        data: {
          types: {
            created_at: 'date',
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
          data: 'representative_partner', 
          width: '25%',
        }, { 
          data: null, 
          width: '25%',
          sortable: false, 
          searchable: false,
          render: (data, type, row) => {
            const projects = data.projects;

            const getShortProjectName = () => {
              const name = projects[0].title;
              return name.length > 100
                ? `<span title="${ name }" data-toggle="tooltip">${ name.substring(0, 100) } ...</span>`
                : name
            }

            if(projects.length > 1) {
							return `
								<div>${ getShortProjectName() }</div> 
								<div class="small text-muted">and ${ projects.length - 1 } more.</div>
							`
						} else if(projects.length === 1) {
							return getShortProjectName();
						} else {
							return `<div class="font-italic text-muted">No projects yet.</div>`
						}
          } 
        }, { 
          data: 'validity_date',
          width: '15%',
          render: data => {
            return `
              <div class="text-nowrap">${ formatDateTime(data, 'Date') }</div>
              <div class="small text-muted">${ fromNow(data) }</div>
            `
          }
        }, { 
          data: 'end_date',
          width: '15%',
          render: data => {
            return `
              <div class="text-nowrap">${ formatDateTime(data, 'Date') }</div>
              <div class="small text-muted">${ fromNow(data) }</div>
            `
          }
        }, {
          data: null, 
          sortable: false,
          render: (data) => {
            const validity_date = moment(data.end_date);
            let status = validity_date.isAfter(moment()) ? 'Active' : 'Inactive'
            const { theme, icon } = PARTNER_STATUS_STYLES[status];
            return `
              <div class="text-sm-center">
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
                
                <div class="btn btn-sm btn-negative" data-toggle="dropdown">
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

  const removeLoaders = () => {
    $('#contentHeader_loader').remove();
    $('.content-header').show();

    $('#partnerDetails_header_loader').remove();
    $('#partnerDetails_header').show();

    $('#options_loader').remove();
    $('#options').show();
    $('#options').removeAttr('id');
  }

  /**
   * * Public Methods
   */

  const reloadDataTable = async () => dt.ajax.reload();

  const loadHeaderDetails = () => {
    const { name, address } = partner;

    setHTMLContent({
      '#partnerDetails_header_name': name || noContentTemplate('The name of partner was not set.'),
      '#partnerDetails_header_address': address || noContentTemplate('The address was not set.'),
    });
  }

  const loadActiveBreadcrumb = () => {
    const name = partner.name;
    $('#active_breadcrumb').html(() => name.length > 33 ? `${ name.substring(0, 30) } ...` : name);
  }

  const loadDetails = () => {
    loadActiveBreadcrumb();
    loadHeaderDetails();
  }

  /**
   * * Init
   */

  const init = async (partnerData) => {
    if (!initialized) {
      initialized = true;
      partner = partnerData;
      loadDocumentTitle();
      loadDetails();
      handleForm();
      removeLoaders();
      await initDataTable();
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


(async () => {
  const partner_id = location.pathname.split('/')[3];
  
  await $.ajax({
    url: `${ BASE_URL_API }/partners/${ partner_id }`,
    type: 'GET',
    success: res => {
      if (res.error) {
        ajaxErrorHandler(res.message);
      } else {
        PartnerDetails.init(res.data);
      }
    },
    error: (xhr, status, error) => {
      ajaxErrorHandler({
        file: 'memo/partnerDetails.js',
        fn: 'onDOMLoad.$.ajax',
        xhr: xhr
      }, true);
    }
  });
})();
