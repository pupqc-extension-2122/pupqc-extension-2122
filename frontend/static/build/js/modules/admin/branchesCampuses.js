/**
 * ==============================================
 * * Budget Item Categories
 * ==============================================
 */

'use strict';

const BranchesCampuses = (() => {

  // * Local Variables
  
  const dtElem_selector = '#branches_campuses_dt';
  const dtElem = $(dtElem_selector);
  
  const editModal = $('#editBranchCampus_modal');
  const editFormSelector = '#editBranchCampus_form';
  const editForm = $(editFormSelector)[0];
  
  const deactivateModal = $('#deactivateBranchCampus_modal');
  const deactivateFormSelector = '#deactivateBranchCampus_form';
  const deactivateForm = $(deactivateFormSelector)[0];

  const reactivateModal = $('#reactivateBranchCampus_modal');
  const reactivateFormSelector = '#reactivateBranchCampus_form';
  const reactivateForm = $(reactivateFormSelector)[0];

  let dt;
  let editValidator;
  let deactivateValidator;
  let reactivateValidator;
  let initialized = false;
  let processing = false;

  // * Private Methods

  const initializations = () => {
    const branchCampusType_select = $('#editBranchCampus_type_select');
    const editBranchCampus_types = [
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
    editBranchCampus_types.forEach(t => {
      branchCampusType_select.append(`
        <option value="${ t.id }">${ t.name }</option>
      `);
    });

    // *** For Add Branch/Campus Modal *** //

    editModal.on('show.bs.modal', () => {
      $('#editBranchCampus_formGroups_loader').remove();
      $('#editBranchCampus_formGroups').show();

      editModal.on('hide.bs.modal', (e) => {
        if (processing) e.preventDefault();
      });
    });

    editModal.on('hidden.bs.modal', () => {
      editForm.reset();
    });
  }

  const initDataTable = async () => {
    dt = await dtElem.DataTable({
			...DT_CONFIG_DEFAULTS,
      ajax: {
        url: `${ BASE_URL_API }/organizations/datatables`,
        // success: result => {
        //   console.log(result);
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'admin/branchesCampuses.js',
            fn: 'BranchesCampuses.initDataTable()',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            name: 'string',
            type: 'string'
          }
        },
        beforeSend: () => {
          dtElem.find('tbody').html(`
            <tr>
              <td colspan="6">${ DT_LANGUAGE.loadingRecords }</td>
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
          width: '50%',
        },  {
          data: 'type',
          width: '15%',
        }, {
          data: 'created_at',
          width: '15%',
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

  const handleEditForm = () => {
    editValidator = $app(editFormSelector).handleForm({
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
      onSubmit: () => onEditFormSubmit()
    });
  }

  const onEditFormSubmit = async () => {

    processing = true;

    // Disable the elements
    const saveBtn = $('#editBranchCampus_saveBtn');
    const cancelBtn = $('#editBranchCampus_cancelBtn');
    
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
      name: fd.get('name'),
      type: fd.get('type')
    }

    await $.ajax({
      url: `${ BASE_URL_API }/organizations/${ fd.get('branch_campus_id') }`,
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
          toastr.success('A branch/campus has been successfully updated');
        }
      }, 
      error: (xhr, status, error) => {
        enableElements();
        ajaxErrorHandler({
          file: 'admin/branchesCampuses.js',
          fn: 'BranchesCampuses.onEditFormSubmit()',
          data: data,
          xhr: xhr
        });
      }
    });

  }

  const initDeactivateMode = async (data) => {
    const { id, name } = data;
    setInputValue('#deactivateBranchCampus_id', id);
    setHTMLContent('#deactivateBranchCampus_name', name);
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
        const submitBtn = $('#deactivateBranchCampus_submitBtn');
        const cancelBtn = $('#deactivateBranchCampus_cancelBtn');
        
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
          url: `${ BASE_URL_API }/organizations/${ fd.get('id') }`,
          type: 'DELETE',
          success: async (res) => {
            processing = false;
            if (res.error) {
              ajaxErrorHandler(res.message);
            } else {
              await BranchesCampuses.reloadDataTable();
              deactivateModal.modal('hide');
              enableElements();
              toastr.info('A branch/campus  has been successfully deactivated.');
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
    setInputValue('#reactivateBranchCampus_id', id);
    setHTMLContent('#reactivateBranchCampus_name', name);
    reactivateModal.modal('show');
  }

  const handleReactivateForm = () => {
    reactivateValidator = $app(reactivateFormSelector).handleForm({
      validators: {
        id: {
          required: 'Branch/Campus ID must exist here.'
        }
      },
      onSubmit: () => {
        processing = true;

        // Disable the elements
        const submitBtn = $('#reactivateBranchCampus_submitBtn');
        const cancelBtn = $('#reactivateBranchCampus_cancelBtn');
        
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
          url: `${ BASE_URL_API }/organzations/${ fd.get('id') }/restore`,
          type: 'PUT',
          success: async (res) => {
            processing = false;
            if (res.error) {
              ajaxErrorHandler(res.message);
            } else {
              await BranchesCampuses.reloadDataTable();
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

    const { 
      id,
      name,
      type
    } = data;
  
    // Set the input values
    setInputValue({
      '#editBranchCampus_branchCampusId': id,
      '#editBranchCampus_branchCampusName': name,
      'editBranchCampus_type_select':type
    });
    
    // Enable buttons
    $('#editBranchCampus_saveBtn').attr('disabled', false);

    $('#editBranchCampus_type_select')
          .val(() => type)
          .trigger('change');
  }

  // * Init

  const init = () => {
    if (!initialized) {
      initialized = true;
      initializations();
      initDataTable();
      handleEditForm();
      handleDeactivateForm();
      handleReactivateForm();
    }
  }

  return {
    init,
    reloadDataTable
  }
})();

BranchesCampuses.init();