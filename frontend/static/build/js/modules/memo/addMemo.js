/**
 * ==============================================
 * * ADD MEMO
 * ==============================================
 */

(() => {

  // * Local Variables

  let initialized = false;
  const user_roles = JSON.parse(getCookie('roles'));
  const modal = $('#addMemo_modal')
  const formSelector = '#addMemo_form';
  const form = $(formSelector)[0];
  let validator;
  let W_form; // Witnesses form
  let processing = false;

  // * Private Methods

  const initializations = () => {

    // *** For Date Inputs *** //

    // Initialize Notary Signed Date
    $app('#addMemo_notarySignedDate').initDateInput({
      button: '#addMemo_notarySignedDate_pickerBtn'
    });

    // Initialize Validity Date
    $app('#addMemo_validityDate').initDateInput({
      button: '#addMemo_validityDate_pickerBtn'
    });

    // *** For Add Memo Modal *** //
    
    modal.on('show.bs.modal', () => {
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

    modal.on('hidden.bs.modal', () => {
      $('#addMemo_formGroups_loader').show();
      $('#addMemo_formGroups').hide();
      form.reset();
      W_form.resetForm();
    });

    modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });

    // *** Validate Notarized Date & Validity Date *** //
    
    $('#addMemo_notarySignedDate, #addMemo_validityDate').on('change', () => {
      const notary_date_input = $('#addMemo_notarySignedDate');
      const validity_date_input = $('#addMemo_validityDate');

      const notary_date = notary_date_input.val();
      const validity_date = validity_date_input.val();

      const notarized_date_moment = moment(notary_date);
      const validity_date_moment = moment(validity_date);

      if (!notary_date) validity_date_input.valid();
      if (!validity_date) notary_date_input.valid();

      if (notarized_date_moment.isValid() && validity_date_moment.isValid()) {
        notary_date_input.valid();
        validity_date_input.valid();
      }
    });

    // *** To get valid until *** //

    $('#addMemo_validityDate, #addMemo_duration').on('keyup change', () => {
      const effectivity_date = $('#addMemo_validityDate').val();
      const duration = parseInt($('#addMemo_duration').val());

      if (
        effectivity_date 
        && moment(effectivity_date).isValid()
        && duration 
        && duration > 0
      ) {
        const valid_until = moment(effectivity_date).add(duration, 'year');
        setHTMLContent('#addMemo_validUntil', formatDateTime(valid_until, 'Date'));
      } else {
        setHTMLContent('#addMemo_validUntil', `
          <span class="font-italic text-muted">Please select an effectivity date and duration.</span>
        `);
      }
    });
  }

  const handleForm = () => {
    validator = $app(formSelector).handleForm({
      validators: {
        name: {
          required: "The partner name is required.",
          notEmpty: "This field cannot be empty.",
          minlength: {
            rule: 5,
            message: "Make sure you enter the full name of the partner."
          }
        },
        address: {
          required: "The partner address is required.",
          notEmpty: "This field cannot be empty.",
          minlength: {
            rule: 5,
            message: "Make sure you enter the full address."
          }
        },
        representative: {
          required: "The name of representative is required.",
          notEmpty: "This field cannot be empty.",
          minlength: {
            rule: 5,
            message: "Make sure you enter the name of the representative."
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
            message: "Make sure you enter the full name of the PUP REPD representative."
          }
        },
        notary_date: {
          required: "Please select the notary signed date.",
          notEmpty: "This field cannot be empty.",
          sameOrBeforeDateTimeSelector: {
            rule: '#addMemo_validityDate',
            message: 'The notary date must be ealier than the effectivity date.' 
          }
        },
        validity_date: {
          required: "Please select the validity date.",
          notEmpty: "This field cannot be empty.",
          sameOrAfterDateTimeSelector: {
            rule: '#addMemo_notarySignedDate',
            message: 'The validity date must be same or later than the notary date.' 
          }
        },
        duration: {
          required: "Please select a duration.",
          number: "Input must be a valid number.",
          digits: "Input should contain only digit numbers.",
          range: {
            rule: [1, 3],
            message: "Duration must between 1 to 3 years only"
          },
        }
      },
      onSubmit: () => onFormSubmit()
    });

    W_form = new WitnessesForm();
  }

  const onFormSubmit = async () => {
    processing = true;

    const fd = new FormData(form);
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
      witnesses: W_form.getWitnesses(),
      validity_date: fd.get('validity_date'),
      duration: fd.get('duration'),
    }

    await $.ajax({
      url: `${ BASE_URL_API }/partners/create`,
      type: 'POST',
      data: data,
      success: async result => {
        processing = false;
        if (result.error) {
          ajaxErrorHandler(result.message);
          enableElements();
        } else {
          await Memos.reloadDataTable();
          enableElements();
          $('#addMemo_modal').modal('hide');
          toastr.success('A new MOA/MOU has been successfully added.');
        }
      },
      error: (xhr, status, error) => {
        processing = false;
        ajaxErrorHandler({
          file: 'memo/addMemo.js',
          fn: 'onFormSubmit().$.ajax',
          xhr: xhr
        }, 1);
        enableElements();
      }
    });
  }

  // * Return Public Functions

  return {
    init: () => {
      if (user_roles.includes('Extensionist') && !initialized) {
        initialized = true;
        initializations();
        handleForm();
      }
    }
  }
})().init();