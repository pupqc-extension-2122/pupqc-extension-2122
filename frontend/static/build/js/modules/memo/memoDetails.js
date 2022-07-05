/**
 * ==============================================
 * * MEMO DETAILS
 * ==============================================
 */

'use strict';

const MemoDetails = (() => {

  /**
   * * Local Variables
   */

  const formSelector = '#editMOA_form';

  let dt;
  let memo;
  let initialized = false;

  /**
   * * Private Methods
   */

  const noContentTemplate = (message) => `<div class="text-muted font-italic">${message}</div>`;

  const loadDocumentTitle = () => {
    const memoName = memo.partner.name;
    const documentTitle = memoName.length > 75 
      ? memoName.substring(0, 75) + ' ...' 
      : memoName;

    setDocumentTitle(`${ documentTitle } - MOA/MOU Details`);
  }

  const loadActiveBreadcrumb = () => {
    const memoName = memo.partner.name;
    $('#active_breadcrumb').html(() => memoName.length > 33 ? `${ memoName.substring(0, 30) } ...` : memoName);
  }

  const loadHeaderDetails = () => {
    loadActiveBreadcrumb();

    const { 
      representative_partner,
      validity_date,
      end_date,
      partner: p, 
      organization: o 
    } = memo;

    setHTMLContent({
      '#memoDetails_header_partnerName': p.name,
      '#memoDetails_header_address': p.address,
      '#memoDetails_header_representative': representative_partner,
      '#memoDetails_header_organization': `${ o.name } <span class="mx-1">&bull;</span> ${ o.type }`,
      '#memoDetails_header_validity': `${ moment(validity_date).format('MMMM DD, YYYY') } - ${ moment(end_date).format('MMMM DD, YYYY') }`,
      '#memoDetails_header_status': () => {
        const status = moment().isBetween(moment(validity_date), moment(end_date)) ? 'Active' : 'Inactive';
        const { theme, icon } = MEMO_STATUS_STYLES[status];
          return `
            <div class="badge badge-subtle-${ theme } px-2 py-1">
              <i class="${ icon } fa-fw mr-1"></i>
              <span>${ status }</span>
            </div>
          `;
      }
    });
  }

  const loadBodyDetails = () => {
    const {
      representative_partner,
      representative_pup,
      notarized_date,
      validity_date,
      end_date,
      partner: p, 
      organization: o 
    } = memo;

    setHTMLContent({
      '#memoDetails_body_partnerName': () => {
        return `
          <a href="${ BASE_URL_WEB }/m/partners/${ p.id }">${ p.name }</a>
        `
      },
      '#memoDetails_body_partnerAddress': p.address,
      '#memoDetails_body_representative': representative_partner,
      '#memoDetails_body_pupREPDRepresentative': representative_pup,
      '#memoDetails_body_organization': `${ o.name } <span class="mx-1">&bull;</span> ${ o.type }`,
      '#memoDetails_body_notarySignedDate': () => {
        return `
          <div>${ moment(notarized_date).format('MMMM DD, YYYY (dddd)') }</div>
          <div class="small text-muted">${ fromNow(notarized_date) }</div>
        `
      },
      '#memoDetails_body_validity': () => {
        if (validity_date && end_date) {
          const getDuration = () => {
            return moment(validity_date).isSame(moment(end_date))
              ? 'in the whole day'
              : moment(validity_date).to(moment(end_date), true)
          }

          const getStatus = () => {
            const status = moment().isBetween(moment(validity_date), moment(end_date)) ? 'Active' : 'Inactive';
            const { theme, icon } = MEMO_STATUS_STYLES[status];
              return `
                <div class="badge badge-subtle-${ theme } px-2 py-1">
                  <i class="${ icon } fa-fw mr-1"></i>
                  <span>${ status }</span>
                </div>
              `;
          }

          return `
            <div class="ml-4 ml-lg-0 row">
              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">Effective on:</div>
              </div>
              <div class="col-8 col-lg-10">
                <div>${ moment(validity_date).format('MMMM D, YYYY (dddd)') }</div>
                <div class="small text-muted">${ fromNow(validity_date) }</div>
              </div>

              <div class="col-12"><div class="mt-2"></div></div>

              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">Until:</div>
              </div>
              <div class="col-8 col-lg-10">
                <div>${ moment(end_date).format('MMMM D, YYYY (dddd)') }</div>
                <div class="small text-muted">${ fromNow(end_date) }</div>
              </div>

              <div class="col-12"><div class="mt-2"></div></div>

              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">Duration:</div>
              </div>
              <div class="col-8 col-lg-10">
                <div>Approximately ${ getDuration() }</div>
              </div>

              <div class="col-12"><div class="mt-2"></div></div>

              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">Status:</div>
              </div>
              <div class="col-8 col-lg-10">
                <div>${ getStatus() }</div>
              </div>
            </div>
          `
        } else return noContentTemplate('No dates have been set up.');
      }
    });
  }

  const loadDetails = () => {
    loadHeaderDetails();
    loadBodyDetails();
  }

  const initializations = () => {
    // Notary Signed Date
    $app('#editMOA_notarySignedDate').initDateInput({
      button: '#editMOA_notarySignedDate_pickerBtn'
    });

    // Validity Date
    $app('#editMOA_validityDate').initDateInput({
      button: '#editMOA_validityDate_pickerBtn'
    });
  }

  const handleForm = () => {
    $app(formSelector).handleForm({
      validators: {
        name: {
          required: "The partner name is required.",
          notEmpty: "This field cannot be empty",
        },
        address: {
          required: "The partner address is required.",
          notEmpty: "This field cannot be empty",
        },
        representative: {
          required: "The name of representative is required.",
          notEmpty: "This field cannot be empty",
        },
        organization:  {
          required: "The organization is required.",
          notEmpty: "This field cannot be empty",
        },
        pup_REPD: {
          required: "The name of PUP REPD Representative is required.",
          notEmpty: "This field cannot be empty",
        },
        notary_date: {
          required: "Please select the notary signed date.",
          notEmpty: "This field cannot be empty",
          afterDateTime: {
						rule: moment().subtract(1, 'days'),
						message: 'Notary Signed date must be current or onwards.'
					}
        },
        validity_date: {
          required: "Please select the validity date.",
          notEmpty: "This field cannot be empty",
          afterDateTime: {
						rule: moment().subtract(1, 'days'),
						message: 'Validity date must be current or onwards.'
					}
        },
        uploadDocument: {
          required: "MOA/MOU attachment is required.",
        }
      },
      onSubmit: () => {
        toastr.success("MOA/MOU has been updated successfully!");
      }
    });
  }

  const initDataTable = async () => {
    dt = await $('#documents_dt').DataTable({
      columns: [
        { 
          data: 'file_name' 
        },
        { 
          data: 'file_type' 
        },
        {
          data: null,
          render: data => {
            const uploadDate = data.upload_date;
            return moment(uploadDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
          }
        },
        { 
          data: 'file_size' 
        },
        {
          data: null, 
          render: ({ status }) => {
            const { theme, icon } = PARTNER_STATUS_STYLES[status];
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
                
                <div class="btn btn-sm btn-negative" data-toggle="dropdown">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
                
                  <div class="dropdown-menu dropdown-menu-right">
                    <div class="dropdown-header">Options</div>
                    <a href="" class="dropdown-item">
                        <span>View document</span>
                    </a>
                    <a href="" class="dropdown-item">
                        <span>Remove</span>
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

    $('#memoDetails_header_loader').remove();
    $('#memoDetails_header').show();
    
    $('#memoDetails_body_loader').remove();
    $('#memoDetails_body').show();

    $('#options_loader').remove();
    $('#options').show();
    $('#options').removeAttr('id');
  }

  /**
   * * Public Methods
   */

  /**
   * * Init
   */

  const init = async (memoData) => {
    if (!initialized) {
      initialized = true;
      memo = memoData;
      loadDocumentTitle();
      initializations();
      // initDataTable();
      handleForm();
      loadDetails();
      removeLoaders();
    }
  }

  /**
   * * Return public methods
   */

  return {
    init
  }

})();

(() => {
  const memo_id = location.pathname.split('/')[3];

  $.ajax({
    url: `${ BASE_URL_API }/memos/${ memo_id }`,
    type: 'GET',
    success: res => {
      if (res.error) {
        ajaxErrorHandler(res.message, 1);
      } else {
        const { data } = res;
        
        console.log(data);
        MemoDetails.init(data);
      }
    },
    error: (xhr, status, error) => {
      ajaxErrorHandler({
        file: 'memo/memoDetails.js',
        fn: 'onDOMLoad.$.ajax',
        details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
      }, true);
    } 
  });
})();