/**
 * ==============================================
 * * EDIT MEMO
 * ==============================================
 */

const EditMemo = (() => {

  // * Local Variables

  let initialized = false;
  const user_roles = JSON.parse(getCookie('roles'));
  const modal = $('#editMemo_modal')
  const formSelector = '#editMemo_form';
  const form = $(formSelector)[0];
  let memo;
  let W_form; // Witnesses form
  let processing = false;

  // * Private Methods

  const initializations = () => {
    
    // *** For Date Inputs *** //

    // Initialize Notary Signed Date
    $app('#editMemo_notarySignedDate').initDateInput({
      button: '#editMemo_notarySignedDate_pickerBtn'
    });

    // Initialize Validity Date
    $app('#editMemo_validityDate').initDateInput({
      button: '#editMemo_validityDate_pickerBtn'
    });

    // *** For Add Memo Modal *** //
    
    modal.on('show.bs.modal', async () => {
      await $.ajax({
        url: `${ BASE_URL_API }/organizations`,
        type: 'GET',
        success: result => {
          if(result.error) {
            ajaxErrorHandler(result.message)
          } else {
            const { data } = result;
            const select = $('#editMemo_organization');

            select.empty();

            if (data.length) {
              select.append('<option value=""></option>');
              data.forEach(d => {
                select.append(`
                  <option value="${ d.id }">${ d.name } | ${ d.type }</option>
                `);

                $('#editMemo_formGroups_loader').hide();
                $('#editMemo_formGroups').show();
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
      await setInputValues();
    });

    modal.on('hidden.bs.modal', () => {
      $('#editMemo_formGroups_loader').show();
      $('#editMemo_formGroups').hide();
      form.reset();
      W_form.resetForm();
    });

    modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });

    // *** To get valid until *** //

    $('#editMemo_validityDate, #editMemo_duration').on('keyup change', () => {
      const effectivity_date = $('#editMemo_validityDate').val();
      const duration = parseInt($('#editMemo_duration').val());

      if (
        effectivity_date 
        && moment(effectivity_date).isValid()
        && duration 
        && duration > 0
      ) {
        const valid_until = moment(effectivity_date).add(duration, 'year');
        setHTMLContent('#editMemo_validUntil', formatDateTime(valid_until, 'Date'));
      } else {
        setHTMLContent('#editMemo_validUntil', `
          <span class="font-italic text-muted">Please select an effectivity date and duration.</span>
        `);
      }
    });
  }

  const setInputValues = async () => {
    const { partner } = memo;

    setInputValue({
      '#editMemo_partnerName': partner.name,
      '#editMemo_partnerAddress': partner.address,
      '#editMemo_partnerRepresentative': memo.representative_partner,
      '#editMemo_pupREPD': memo.representative_pup,
      '#editMemo_organization': memo.organization_id,
      '#editMemo_notarySignedDate': memo.notarized_date,
      '#editMemo_validityDate': memo.validity_date,
      '#editMemo_duration': memo.duration,
    });

    $('#editMemo_organization, #editMemo_validityDate, #editMemo_duration').trigger('change');

    W_form.setWitnesses(memo.witnesses);
  }

  const handleForm = () => {
    $app(formSelector).handleForm({
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
            rule: '#editMemo_validityDate',
            message: 'The notary date must be ealier than the effectivity date.' 
          }
        },
        validity_date: {
          required: "Please select the validity date.",
          notEmpty: "This field cannot be empty.",
          sameOrAfterDateTimeSelector: {
            rule: '#editMemo_notarySignedDate',
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
      url: `${ BASE_URL_API }/memos/${ memo.id }`,
      type: 'PUT',
      data: data,
      success: async res => {
        processing = false;
        if (res.error) {
          ajaxErrorHandler(res.message);
          enableElements();
        } else {
          memo = {...memo, ...data}
          await MemoDetails.loadDetails(memo);
          enableElements();
          $('#editMemo_modal').modal('hide');
          toastr.success('The details of the MOA/MOU has been successfully updated.');
        }
      },
      error: () => {
        processing = false;
        ajaxErrorHandler();
        enableElements();
      }
    });
  }

  // * Init

  const init = (memoData) => {
    if (user_roles.includes('Extensionist') && !initialized) {
      initialized = true;
      memo = memoData;
      console.log(memo);
      initializations();
      handleForm();
    }
  }

  // * Return Public Functions

  return {
    init
  }
})();