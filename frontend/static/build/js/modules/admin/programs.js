/**
 * ==============================================
 * * PROGRAMS
 * ==============================================
 */

'use strict';

const Programs = (() => {

  // * Local Variables

  const dtElem_selector = '#programs_dt';
  const dtElem = $(dtElem_selector);
  
  const editModal = $('#editProgram_modal');
  const editFormSelector = '#editProgram_form';
  const editForm = $(editFormSelector)[0];

  const deactivateModal = $('#deactivateProgram_modal');
  const deactivateFormSelector = '#deactivateProgram_form';
  const deactivateForm = $(deactivateFormSelector)[0];

  const reactivateModal = $('#reactivateProgram_modal');
  const reactivateFormSelector = '#reactivateProgram_form';
  const reactivateForm = $(reactivateFormSelector)[0];

  let dt;
  let editValidator;
  let deactivateValidator;
  let reactivateValidator;
  let initialized = false;
  let processing = false;

  // * Private Methods
    
  const initializations = () => {

    // *** For Add Program Modal *** //

    editModal.on('show.bs.modal', () => {
      $('#editProgram_formGroups_loader').remove();
      $('#editProgram_formGroups').show();
    });

    editModal.on('hidden.bs.modal', () => {
      editForm.reset();
    });

    editModal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });

    // *** For Deactivate Program Modal *** //

    deactivateModal.on('show.bs.modal', (e) => {
      if (!$('#deactivateProgram_id').val()) e.preventDefault();
    });

    deactivateModal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });

    deactivateModal.on('hidden.bs.modal', () => deactivateForm.reset());

    // *** For Re-activate Program Modal *** //

    reactivateModal.on('show.bs.modal', (e) => {
      if (!$('#reactivateProgram_id').val()) e.preventDefault();
    });

    reactivateModal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });

    reactivateModal.on('hidden.bs.modal', () => reactivateForm.reset());
  }

  const initDataTable = async () => {
    dt = await dtElem.DataTable({
      ...DT_CONFIG_DEFAULTS,
      ajax: {
        url: `${ BASE_URL_API }/programs/datatables`,
        // success: result => {
        //   alert('TEST');
        //   console.log(result);
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'admin/programs.js',
            fn: 'Programs.initDataTable()',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            full_name: 'string',
            short_name: 'string',
          }
        },
        beforeSend: () => {
          dtElem.find('tbody').html(`
            <tr>
              <td colspan="5">${ DT_LANGUAGE.loadingRecords }</td>
            </tr>
          `);
        },
      },
      columns: [
        { 
          data: 'created_at',
          visible: false,
        }, {
          data: 'full_name',
          width: '55%',
        }, {
          data: 'short_name',
          width: '10%',
        }, {
          data: 'created_at',
          width: '15%',
          render: data => {
            const created_at = data.created_at
            return `
              <div>${ formatDateTime(created_at, 'Date') }</div>
              <div class="small text-muted">${ fromNow(created_at) }</div>
            `
          }
        }, {
          data: null,
          sortable: false,
          width: '15%',
          render: (data, type, row) => {
            const { theme, icon, label } = (() => !data.deleted_at 
              ? { theme: 'success', icon: 'fas fa-check', label: 'Active' }
              : { theme: 'danger', icon: 'fas fa-ban', label: 'Inactive' }
            )();
            return `
              <div class="text-sm-center user-select-none">
                <div class="badge badge-subtle-${ theme } px-2 py-1">
                  <i class="${ icon } fa-fw mr-1"></i>
                  <span>${ label }</span>
                </div>
              </div>
            `;
          }
        }, {
          data: null,
          width: '5%',
          render: data => {
            const reActivateDeactivateOption = (() => {
                const { mode, label } = (() => {
                  return !data.deleted_at
                    ? { mode: 'initDeactivateMode', label: 'Deactivate' }
                    : { mode: 'initReactivateMode', label: 'Reactivate' }
                })();
                return `
                  <div
                    role="button"
                    class="dropdown-item"
                    data-dt-btn="${ mode }"
                  >
                    <span>${ label }</span>
                  </div>
                `
            })();

            return `
              <div class="dropdown text-center">
                
                <div class="btn btn-sm btn-negative" data-toggle="dropdown" data-dt-btn="options" title="Options">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              
                <div class="dropdown-menu dropdown-menu-right">
                  <div class="dropdown-header">Options</div>
                  <div
                    role="button"
                    class="dropdown-item"
                    data-dt-btn="initEditMode"
                  >
                    <span>Edit details</span>
                  </div>
                  ${ reActivateDeactivateOption }
                </div>
              </div>
            `
          }
        }
      ]
    });

    // For edit option
    $(dtElem_selector).on('click', `[data-dt-btn="initEditMode"]`, (e) => {
      const row = $(e.currentTarget).closest('tr');
      const data = dt.row(row).data();
      initEditMode(data);
    });

    // For deactivate option
    $(dtElem_selector).on('click', `[data-dt-btn="initDeactivateMode"]`, (e) => {
      const row = $(e.currentTarget).closest('tr');
      const data = dt.row(row).data();
      initDeactivateMode(data);
    });
    
    // For reactivate option
    $(dtElem_selector).on('click', `[data-dt-btn="initReactivateMode"]`, (e) => {
      const row = $(e.currentTarget).closest('tr');
      const data = dt.row(row).data();
      initReactivateMode(data);
    });
  }

  const initEditMode = async (data) => {

    const { id, full_name, short_name } = data;

    // Set the input values
    setInputValue({
      '#editProgram_id': id,
      '#editProgram_fullName': full_name,
      '#editProgram_shortName': short_name,
    });
    
    // Enable buttons
    $('#editProgram_saveBtn').attr('disabled', false);

    // Show the modal
    editModal.modal('show');
  }

  const handleEditForm = () => {
    const isFullNameLonger = () => {
      const full_name = $('#editProgram_fullName').val();
      const short_name = $('#editProgram_shortName').val();

      return full_name.length > short_name.length;
    }

    editValidator = $app(editFormSelector).handleForm({
      validators: {
        id: {
          required: "The ID of the program must exist."
        },
        full_name: {
          required: "The full name of the program is required.",
          notEmpty: "This field cannot be blank.",
          notEqualTo: {
            rule: () => $('#editProgram_shortName').val(),
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
            rule: () => $('#editProgram_fullName').val(),
            message: 'The short name must not be the same as the full name.'
          },
          callback: {
            rule: () => isFullNameLonger(),
            message: 'The short name should be shorter than the full name.'
          }
        }
      },
      onSubmit: () => onEditFormSubmit()
    });
  }

  const onEditFormSubmit = async () => {

    processing = true;

    // Disable the elements
    const saveBtn = $('#editProgram_saveBtn');
    const cancelBtn = $('#editProgram_cancelBtn');
    
    cancelBtn.attr('disabled', true);
    saveBtn.attr('disabled', true);
    saveBtn.html(`
      <span class="px-3">
        <i class="fas fa-spinner fa-spin-pulse"></i>
      </span>
    `);

    // For enabling elements
    const enableElements = () => {

      // Enable buttons
      cancelBtn.attr('disabled', false);
      saveBtn.attr('disabled', false);
      saveBtn.html(`Submit`);

      processing = false;
    }

    // Get the data
    const fd = new FormData(editForm);
    
    const data = {
      full_name: fd.get('full_name'),
      short_name: fd.get('short_name'),
    }

    await $.ajax({
      url: `${ BASE_URL_API }/programs/${ fd.get('id') }`,
      type: 'PUT',
      data: data,
      success: async res => {
        if (res.error) {
          ajaxErrorHandler(res.message);
          enableElements();
        } else {
          await reloadDataTable();
          enableElements();
          editModal.modal('hide');
          toastr.success('A program has been successfully updated');
        }
      }, 
      error: (xhr, status, error) => {
        enableElements();
        ajaxErrorHandler({
          file: 'admin/programs.js',
          fn: 'Programs.onEditFormSubmit()',
          data: data,
          xhr: xhr
        });
      }
    });

  }

  const initDeactivateMode = async (data) => {
    const { id, full_name, short_name } = data;
    setInputValue('#deactivateProgram_id', id);
    setHTMLContent('#deactiveProgram_program', `${ full_name } (${ short_name })`);
    deactivateModal.modal('show');
  }

  const handleDeactivateForm = () => {
    deactivateValidator = $app(deactivateFormSelector).handleForm({
      validators: {
        id: {
          required: 'Program ID must exist here.'
        }
      },
      onSubmit: () => {
        processing = true;

        // Disable the elements
        const submitBtn = $('#deactivateProgram_submitBtn');
        const cancelBtn = $('#deactivateProgram_cancelBtn');
        
        cancelBtn.attr('disabled', true);
        submitBtn.attr('disabled', true);
        submitBtn.html(`
          <span class="px-3">
            <i class="fas fa-spinner fa-spin-pulse"></i>
          </span>
        `);

         // For enabling elements
        const enableElements = () => {

          // Enable buttons
          cancelBtn.attr('disabled', false);
          submitBtn.attr('disabled', false);
          submitBtn.html(`Deactivate`);
        }

        // Get the id
        const fd = new FormData(deactivateForm);

        $.ajax({
          url: `${ BASE_URL_API }/programs/${ fd.get('id') }`,
          type: 'DELETE',
          success: async (res) => {
            processing = false;
            if (res.error) {
              ajaxErrorHandler(res.message);
            } else {
              await Programs.reloadDataTable();
              deactivateModal.modal('hide');
              enableElements();
              toastr.info('A program has been successfully deactivated.');
            }
          },
          error: (xhr, status, error) => {
            processing = false;
            enableElements();
            ajaxErrorHandler({
              file: 'admin/programs.js',
              fn: 'Programs.onEditFormSubmit()',
              data: data,
              xhr: xhr
            });
          }
        })
      }
    });
  }

  const initReactivateMode = async (data) => {
    const { id, full_name, short_name } = data;
    setInputValue('#reactivateProgram_id', id);
    setHTMLContent('#reactivateProgram_program', `${ full_name } (${ short_name })`);
    reactivateModal.modal('show');
  }

  const handleReActivateMode = () => {
    reactivateValidator = $app(reactivateFormSelector).handleForm({
      validators: {
        id: {
          required: 'Program ID must exist here.'
        }
      },
      onSubmit: () => {
        processing = true;

        // Disable the elements
        const submitBtn = $('#reactivateProgram_submitBtn');
        const cancelBtn = $('#reactivateProgram_cancelBtn');
        
        cancelBtn.attr('disabled', true);
        submitBtn.attr('disabled', true);
        submitBtn.html(`
          <span class="px-3">
            <i class="fas fa-spinner fa-spin-pulse"></i>
          </span>
        `);

         // For enabling elements
        const enableElements = () => {

          // Enable buttons
          cancelBtn.attr('disabled', false);
          submitBtn.attr('disabled', false);
          submitBtn.html(`Reactivate`);
        }

        // Get the id
        const fd = new FormData(reactivateForm);

        $.ajax({
          url: `${ BASE_URL_API }/programs/${ fd.get('id') }/restore`,
          type: 'PUT',
          success: async (res) => {
            processing = false;
            if (res.error) {
              ajaxErrorHandler(res.message);
            } else {
              await Programs.reloadDataTable();
              reactivateModal.modal('hide');
              enableElements();
              toastr.success('A program has been successfully re-activated.');
            }
          },
          error: (xhr, status, error) => {
            processing = false;
            enableElements();
            ajaxErrorHandler({
              file: 'admin/programs.js',
              fn: 'Programs.onEditFormSubmit()',
              data: data,
              xhr: xhr
            });
          }
        })
      }
    });
  }

  // * Public Methods

  const reloadDataTable = async () => await dt.ajax.reload();

  // * Init

  const init = () => {
    if (!initialized) {
      initialized = true;
      initializations();
      initDataTable();
      handleEditForm();
      handleDeactivateForm();
      handleReActivateMode();
    }
  }

  return {
    init,
    reloadDataTable,
  }
})();

Programs.init();