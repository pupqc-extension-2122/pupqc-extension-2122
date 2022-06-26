/**
 * ==============================================
 * * MOA/MOU's
 * ==============================================
 */

'use strict';

const Memos = (() => {

  /**
   * * Local Variables
   */

  let dt;
  let initialized = false;

  /**
   * * Private Methods
   */

  const initializations = () => {
    
    // *** For Date Inputs *** //

    // Initialize Notary Signed Date
    $app('#addMOA_notarySignedDate').initDateInput({
      button: '#addMOA_notarySignedDate_pickerBtn'
    });

    // Initialize Validity Date
    $app('#addMOA_validityDate').initDateInput({
      button: '#addMOA_validityDate_pickerBtn'
    });

    // *** For Add Memo Modal *** //
    
    $('#addMemo_modal').on('show.bs.modal', () => {
      $.ajax({
        url: `${ BASE_URL_API }/organizations`,
        type: 'GET',
        success: result => {
          if(result.error) {
            ajaxErrorHandler(result.message)
          } else {
            const { data } = result;
            const select = $('#addMemo_organization_select');

            select.empty();

            if (data.length) {
              select.append('<option value=""></option>');
              data.forEach(d => {
                select.append(`
                  <option value="${ d.id }">${ d.name } | ${ d.type }</option>
                `);

                $('#addMemo_formGroups_loader').hide();
                $('#addMemo_formGroups').show();
              });
            } else {
              select.append('<option disabled>No organizations yet.</option>');
            }
          }
        },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'ProjectMOA.js',
            fn: 'ProjectMoa.initialization()',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText
          })
        }
      });
    });

    $('#addMemo_modal').on('hidden.bs.modal', () => {
      $('#addMemo_formGroups_loader').show();
      $('#addMemo_formGroups').hide();
    });
  }

  const handleForm = () => {
    $app('#addMemo_form').handleForm({
      validators: {
        name: {
          required: "The partner name is required.",
          notEmpty: "This field cannot be empty.",
          minlength: {
            rule: 5,
            message: "Make sure you type the full name of the partner."
          }
        },
        address: {
          required: "The partner address is required.",
          notEmpty: "This field cannot be empty.",
          minlength: {
            rule: 5,
            message: "Make sure you type the full address."
          }
        },
        representative: {
          required: "The name of representative is required.",
          notEmpty: "This field cannot be empty.",
          minlength: {
            rule: 5,
            message: "Make sure you type the name of the representative."
          }
        },
        organization:  {
          required: "The organization is required.",
          notEmpty: "This field cannot be empty.",
        },
        pup_REPD: {
          required: "The name of PUP REPD Representative is required.",
          notEmpty: "This field cannot be empty.",
          minlength: {
            rule: 5,
            message: "Make sure you type the full name of the PUP REPD representative."
          }
        },
        notary_date: {
          required: "Please select the notary signed date.",
          notEmpty: "This field cannot be empty.",
          beforeDateTimeSelector: {
            rule: '#addMOA_validityDate',
            message: 'The notary date must be ealier than the validity date.' 
          }
        },
        validity_date: {
          required: "Please select the validity date.",
          notEmpty: "This field cannot be empty.",
          afterDateTimeSelector: {
            rule: '#addMOA_notarySignedDate',
            message: 'The validity date must be later than the notary date.' 
          }
        },
        uploadDocument: {
          required: "MOA/MOU attachment is required.",
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }

  const onFormSubmit = async () => {
    const fd = new FormData($('#addMemo_form')[0]);
    const submitBtn = $('#submitMemo_btn'); 

    // Set elements to loading state
    submitBtn.attr('disabled', true);
    submitBtn.html(`
      <span class="px-3">
        <i class="fas fa-spinner fa-spin-pulse"></i>
      </span>
    `);

    const enableElements = async () => {
      submitBtn.attr('disabled', false);
      submitBtn.html('Submit');
    }
    
    const data = {
      name: fd.get('name'),
      address: fd.get('address'),
      representative_partner: fd.get('representative'),
      representative_pup: fd.get('pup_REPD'),
      organization_id: fd.get('organization'),
      notarized_date: fd.get('notary_date'),
      validity_date: fd.get('validity_date'),
      duration: 3
    }

    await $.ajax({
      url: `${ BASE_URL_API }/partners/create`,
      type: 'POST',
      data: data,
      success: async result => {
        if (result.error) {
          ajaxErrorHandler(result.message);
          enableElements();
        } else {
          await reloadDataTable();
          enableElements();
          $('#addMemo_modal').modal('hide');
          toastr.success('A new MOA/MOU has been successfully added.');
        }
      },
      error: () => {
        ajaxErrorHandler();
        enableElements();
      }
    });
  }

  const initDataTable = async () => {
    dt = $('#projectMOA_dt').DataTable({
      ...DT_CONFIG_DEFAULTS,
      ajax: {
        url: `${ BASE_URL_API }/memos/datatables`,
        // success: res => {
        //   console.log(res)
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'memo/partners.js',
            fn: 'Partnerships.initDataTable()',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            partner_name: 'string',
            representative_partner: 'string',
            notarized_date: 'date',
            end: 'date',
          }
        }
      },
      columns: [
        { 
          data: 'created_at',
          visible: false,
        }, {
					data: 'partner_name',
          width: '30%',
          render: (data, type, row) => {
            const partnerName = data.length > 100
              ? `<span title="${ data }" data-toggle="tooltip">${ data.substring(0, 100) } ...</span>`
              : data
            return `<a href="${ BASE_URL_WEB }/m/memo/${ row.id }">${ partnerName }</a>`
          }
				}, {
          data: 'representative_partner',
          width: '20%',
        }, {
          data: 'notarized_date',
          width: '20%',
          render: data => {
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small text-muted">${ fromNow(data) }</div>
            `
          }
        }, {
          data: 'end_date',
          width: '20%',
          render: data => {
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
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
          render: data => {
            return `
              <div class="dropdown text-sm-center">
                
                <div class="btn btn-sm btn-negative" data-toggle="dropdown">
                    <i class="fas fa-ellipsis-h"></i>
                    <span class="ml-1 ml-sm-0 d-sm-none">Options</span>
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

  /**
   * * Public Methods
   */

  const reloadDataTable = async () => await dt.ajax.reload();

  /**
   * * Init
   */

  const init = () => {
    if (!initialized) {
      initialized = true;
      initializations();
      initDataTable();
      handleForm();
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

Memos.init();