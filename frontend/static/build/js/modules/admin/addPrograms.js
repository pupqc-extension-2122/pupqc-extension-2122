/**
 * ==============================================
 * * ADD PROGRAM
 * ==============================================
 */

'use strict';

(() => {

  // * Local Variables

  const user_roles = JSON.parse(getCookie('roles'));
  const modal = $('#addProgram_modal')
  const formSelector = '#addProgram_form';
  const form = $(formSelector)[0];
  
  let validator;
  let initialized = false;
  let processing = false;

  // * Private Methods

  const initializations = () => {
    const branchCampusType_select = $('#addProgram_type_select');
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
      $('#addProgram_formGroups_loader').remove();
      $('#addProgram_formGroups').show();
    });

    modal.on('hidden.bs.modal', () => {
      form.reset();
    });

    modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });
  }

  const handleForm = () => {
    const isFullNameLonger = () => {
      const full_name = $('#addProgram_fullName').val();
      const short_name = $('#addProgram_shortName').val();
      return full_name.length > short_name.length;
    }

    validator = $app('#addProgram_form').handleForm({
      validators: {
        full_name: {
          required: "The full name of the program is required.",
          notEmpty: "This field cannot be blank.",
          notEqualTo: {
            rule: () => $('#addProgram_shortName').val(),
            message: 'The full name must not be the same as the short name.'
          },
          minlength: {
            rule: 3,
            message: 'Make sure you type the full name of the program.'
          },
          callback: {
            rule: () => isFullNameLonger(),
            message: 'The full name should be longer than the short name.'
          }
        },
        short_name: {
          required: "The abbreviation/short name is required.",
          notEmpty: "This field cannot be blank.",
          notEqualTo: {
            rule: () => $('#addProgram_fullName').val(),
            message: 'The short name must not be the same as the full name.'
          },
          callback: {
            rule: () => isFullNameLonger(),
            message: 'The short name should be shorter than the full name.'
          }
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }

  const onFormSubmit = async () => {
    processing = true;

    const fd = new FormData(form);
    const submitBtn = $('#submitProgram_btn'); 

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
      full_name: fd.get('full_name'),
      short_name: fd.get('short_name')
    }

    await $.ajax({
      url: `${ BASE_URL_API }/programs/create`,
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
          await Programs.reloadDataTable();
          enableElements();
          modal.modal('hide');
          toastr.success('A new program has been successfully added.');
        }
      },
      error: (xhr, status, error) => {
        processing = false;
        enableElements();
        ajaxErrorHandler({
          file: 'admin/addProgram.js',
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