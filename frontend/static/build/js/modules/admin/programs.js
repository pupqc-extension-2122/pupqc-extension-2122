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
  let dt;
  let editValidator;
  let initialized = false;
  let processing = false;

  // * Private Methods
    
  const initializations = () => {

    // *** For Add Budget Item Category Modal *** //

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
              <div class="text-sm-center">
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
                  <div
                    role="button"
                    class="dropdown-item"
                    data-dt-btn="initDeactivateMode"
                  >
                    <span>Deactivate</span>
                  </div>
                </div>
              </div>
            `
          }
        }
      ]
    });

    $(dtElem_selector).on('click', `[data-dt-btn="initEditMode"]`, (e) => {
      const row = $(e.currentTarget).closest('tr');
      const data = dt.row(row).data();
      initEditMode(data);
    });

    $(dtElem_selector).on('click', `[data-dt-btn="initDeactivateMode"]`, (e) => {
      const row = $(e.currentTarget).closest('tr');
      const data = dt.row(row).data();
      initDeactivateMode(data);
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
    editValidator = $app(editFormSelector).handleForm({
      validators: {
        category_name: {
          required: "The budget item category name is required.",
          notEmpty: "This field cannot be blank.",
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
    
    const { id } = data;

    alert(id);

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
    }
  }

  return {
    init,
    reloadDataTable,
  }
})();

Programs.init();