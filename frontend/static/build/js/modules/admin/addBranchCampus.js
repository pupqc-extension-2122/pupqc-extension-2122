/**
 * ==============================================
 * * BRANCH/CAMPUS
 * ==============================================
 */

(() => {

  // * Local Variables

  let initialized = false;
  const user_roles = JSON.parse(getCookie('roles'));
  const modal = $('#addBranchCampus_modal')
  const formSelector = '#addBranchCampus_form';
  const form = $(formSelector)[0];
  let processing = false;

  // * Private Methods

  const initializations = () => {
    const branchCampusType_select = $('#addBranchCampus_type_select');
    const addBranchCampus_types = [
      {
        id: 'Branches',
        name: 'Branches',
      },{
        id: 'Campuses',
        name: 'Campuses',
      },{
        id: 'Colleges',
        name: 'Colleges',
      }
    ]

    branchCampusType_select.empty();
    branchCampusType_select.append(`<option></option>`);
    addBranchCampus_types.forEach(t => {
      branchCampusType_select.append(`
        <option value="${ t.id }">${ t.name }</option>
      `);
    });

    // *** For Add Branch/Campus Modal *** //

    modal.on('show.bs.modal', () => {
      $('#addBranchCampus_formGroups_loader').remove();
      $('#addBranchCampus_formGroups').show();
    });

    modal.on('hidden.bs.modal', () => {
      form.reset();
    });

    modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });
  }

  const handleForm = () => {
    $app('#addBranchCampus_form').handleForm({
      validators: {
        branchCampus_name: {
          required: "Branch/Campus name is required.",
          notEmpty: "This field cannot be blank.",
        },
        type: {
          required: "Type is required.",
          notEmpty: "This field cannot be blank.",
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }

  const onFormSubmit = async () => {
    processing = true;

    const fd = new FormData(form);
    const submitBtn = $('#submitBranchCampus_btn'); 

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
      name: fd.get('branchCampus_name'),
      type: fd.get('addBranchCampus_type')
    }

    await $.ajax({
      url: `${ BASE_URL_API }/organizations/create`,
      type: 'POST',
      data: data,
      // success: result => {
      //     console.log(result);
      // },
      success: async result => {
        processing = false;
        if (result.error) {
          ajaxErrorHandler(result.message);
          enableElements();
        } else {
          await BranchesCampuses.reloadDataTable();
          enableElements();
          modal.modal('hide');
          toastr.success('A new branch/campus has been successfully added.');
        }
      },
      error: (xhr, status, error) => {
        processing = false;
        enableElements();
        ajaxErrorHandler({
          file: 'admin/addBranchCampus.js',
          fn: onFormSubmit().$.ajax,
          xhr: xhr
        });
      }
    });
  }


  // * Return Public Functions

  return {
    init: () => {
      if (user_roles.includes('Admin') && !initialized) {
        initialized = true;
        initializations();
        handleForm();
      }
    }
  }
})().init();