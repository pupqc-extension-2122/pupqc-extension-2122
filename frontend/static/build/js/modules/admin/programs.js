/**
 * ==============================================
 * * PROGRAMS
 * ==============================================
 */

'use strict';

const Programs = (() => {

  // * Local Variables

  const dtElem_selector = '#progams_dt';
  const dtElem = $(dtElem_selector);
  const editModal = $('#editPrograms_modal');
  const editFormSelector = '#editPrograms_form';
  const editForm = $(editFormSelector)[0];
  let dt;
  let editValidator;
  let initialized = false;
  let processing = false;

  // * Private Methods
    
  const initializations = () => {

    // *** For Add Budget Item Category Modal *** //

    editModal.on('show.bs.modal', () => {
      $('#editPrograms_formGroups_loader').remove();
      $('#editPrograms_formGroups').show();
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
        url: `${ BASE_URL_API }/budget_categories/datatables`,
        // success: result => {
        //   console.log(result);
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'admin/budgetItemCategories.js',
            fn: 'BudgetItemCategories.initDataTable()',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            name: 'string'
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
          data: 'name',
          width: '55%',
        }, {
          data: 'created_at',
          width: '25%',
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
          render: (data) => {
            return !data.deleted_at 
              ? `
                <div class="text-sm-center">
                  <div class="badge badge-subtle-success px-2 py-1">
                    <i class="fas fa-check fa-fw mr-1"></i>
                    <span>Active</span>
                  </div>
                </div>
              `
              : `
                <div class="text-center">
                  <div class="badge badge-subtle-danger px-2 py-1">
                    <i class="fas fa-ban fa-fw mr-1"></i>
                    <span>Inactive</span>
                  </div>
                </div>
              ` 
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
      name: fd.get('category_name'),
    }

    await $.ajax({
      url: `${ BASE_URL_API }/budget_categories/${ fd.get('category_id') }`,
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
          toastr.success('A budget item category has been successfully updated');
        }
      }, 
      error: (xhr, status, error) => {
        enableElements();
        ajaxErrorHandler({
          file: 'admin/budgetItemCategories.js',
          fn: 'BudgetItemCategories.onEditFormSubmit()',
          data: data,
          xhr: xhr
        });
      }
    });

  }

  // * Public Methods

  const reloadDataTable = async () =>  await dt.ajax.reload();
  const initEditMode = async (data) => {

    // Show the modal
    editModal.modal('show');

    const { id, name } = data;

    // Set the input values
    setInputValue({
      '#editBudgetItemCategory_categoryId': id,
      '#editBudgetItemCategory_categoryName': name,
    });
    
    // Enable buttons
    $('#editBudgetItemCategory_saveBtn').attr('disabled', false);
  }

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