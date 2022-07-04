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
      representative_pup,
      validity_date,
      end_date,
      partner: p, 
      organization: o 
    } = memo;

    setHTMLContent({
      '#memoDetails_partnerName': p.name,
      '#memoDetails_address': p.address,
      '#memoDetails_organization': `${ o.name } <span class="mx-1">&bull;</span> ${ o.type }`,
      '#memoDetails_representative': representative_partner,
      '#memoDetails_pupRepresentative': representative_pup,
      '#memoDetails_validity': `${ moment(validity_date).format('MMMM DD, YYYY') } - ${ moment(end_date).format('MMMM DD, YYYY') }`,
    });
  }

  const loadDetails = () => {
    loadHeaderDetails();
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