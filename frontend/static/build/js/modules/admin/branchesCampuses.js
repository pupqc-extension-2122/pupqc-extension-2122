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
  let dt;
  let editValidator;
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
            return !row.deleted_at 
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
    }
  }

  return {
    init,
    reloadDataTable
  }
})();

BranchesCampuses.init();