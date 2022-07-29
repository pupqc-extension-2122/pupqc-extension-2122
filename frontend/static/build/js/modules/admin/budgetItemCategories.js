/**
 * ==============================================
 * * BUDGET ITEM CATEGORIES
 * ==============================================
 */

'use strict';

const BudgetItemCategories = (() => {
  
  // * Local Variables

  const dtElem_selector = '#budget_item_categories_dt';
  const dtElem = $(dtElem_selector);
  
  const editModal = $('#editBudgetItemCategory_modal');
  const editFormSelector = '#editBudgetItemCategory_form';
  const editForm = $(editFormSelector)[0];

  const deactivateModal = $('#deactivateBudgetItemCategory_modal');
  const deactivateFormSelector = '#deactivateBudgetItemCategory_form';
  const deactivateForm = $(deactivateFormSelector)[0];

  const reactivateModal = $('#reactivateBudgetItemCategory_modal');
  const reactivateFormSelector = '#reactivateBudgetItemCategory_form';
  const reactivateForm = $(reactivateFormSelector)[0];

  let dt;
  let editValidator;
  let deactivateValidator;
  let reactivateValidator;
  let initialized = false;
  let processing = false;

  // * Private Methods
    
  const initializations = () => {

    // *** For Add Budget Item Category Modal *** //

    editModal.on('show.bs.modal', () => {
      $('#editBudgetItemCategory_formGroups_loader').remove();
      $('#editBudgetItemCategory_formGroups').show();
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
          render: (data, type, row) => {
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small text-muted">${ fromNow(data) }</div>
            `
          }
        }, {
          data: null,
          sortable: false,
          width: '15%',
          render: (data) => {
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
    const saveBtn = $('#editBudgetItemCategory_saveBtn');
    const cancelBtn = $('#editBudgetItemCategory_cancelBtn');
    
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

  const initDeactivateMode = async (data) => {
    const { id, name } = data;
    setInputValue('#deactivateBudgetItemCategory_id', id);
    setHTMLContent('#deactivateBudgetItemCategory_category', name);
    deactivateModal.modal('show');
  }

  const handleDeactivateForm = () => {
    deactivateValidator = $app(deactivateFormSelector).handleForm({
      validators: {
        id: {
          required: 'Budget Item Category ID must exist here.'
        }
      },
      onSubmit: () => {
        processing = true;

        // Disable the elements
        const submitBtn = $('#deactivateBudgetItemCategory_submitBtn');
        const cancelBtn = $('#deactivateBudgetItemCategory_cancelBtn');
        
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
          url: `${ BASE_URL_API }/budget_categories/${ fd.get('id') }`,
          type: 'DELETE',
          success: async (res) => {
            processing = false;
            if (res.error) {
              ajaxErrorHandler(res.message);
            } else {
              await BudgetItemCategories.reloadDataTable();
              deactivateModal.modal('hide');
              enableElements();
              toastr.info('A budget item category has been successfully deactivated.');
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
    const { id, name } = data;
    setInputValue('#reactivateBudgetItemCategory_id', id);
    setHTMLContent('#reactivateBudgetItemCategory_category', name);
    reactivateModal.modal('show');
  }

  const handleReActivateMode = () => {
    reactivateValidator = $app(reactivateFormSelector).handleForm({
      validators: {
        id: {
          required: 'Budget Item Category ID must exist here.'
        }
      },
      onSubmit: () => {
        processing = true;

        // Disable the elements
        const submitBtn = $('#reactivateBudgetItemCategory_submitBtn');
        const cancelBtn = $('#reactivateBudgetItemCategory_cancelBtn');
        
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
          url: `${ BASE_URL_API }/budget_categories/${ fd.get('id') }/restore`,
          type: 'PUT',
          success: async (res) => {
            processing = false;
            if (res.error) {
              ajaxErrorHandler(res.message);
            } else {
              await BudgetItemCategories.reloadDataTable();
              reactivateModal.modal('hide');
              enableElements();
              toastr.success('A budget item category has been successfully re-activated.');
            }
          },
          error: (xhr, status, error) => {
            processing = false;
            enableElements();
            ajaxErrorHandler({
              file: 'admin/budgetItemCategories.js',
              fn: 'BudgetItemCategories.onEditFormSubmit()',
              data: data,
              xhr: xhr
            });
          }
        })
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
      handleDeactivateForm();
      handleReActivateMode();
    }
  }

  return {
    init,
    reloadDataTable,
  }
})();

BudgetItemCategories.init();