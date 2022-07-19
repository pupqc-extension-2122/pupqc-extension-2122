/**
 * ==============================================
 * * BUDGET ITEM CATEGORY
 * ==============================================
 */

(() => {

  // * Local Variables

  let initialized = false;
  const user_roles = JSON.parse(getCookie('roles'));
  const modal = $('#addBudgetItemCategory_modal')
  const formSelector = '#addBudgetItemCategory_form';
  const form = $(formSelector)[0];
  let loaded = false;
  let processing = false;

  // * Private Methods

  const initializations = () => {

    // *** For Add Budget Item Category Modal *** //

    modal.on('hidden.bs.modal', () => {
      $('#addBudgetItemCategory_formGroups_loader').remove();
      $('#addBudgetItemCategory_formGroups').show();
      form.reset();
    });

    modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });
  }

  const handleForm = () => {
    $app('#addBudgetItemCategory_form').handleForm({
      validators: {
        category_name: {
          required: "The budget item category name is required.",
          notEmpty: "This field cannot be blank.",
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }

  const onFormSubmit = async () => {
    processing = true;

    const fd = new FormData(form);
    const submitBtn = $('#submitBudgetItemCategory_btn'); 

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
    }

    await $.ajax({
      url: `${ BASE_URL_API }/budget_categories/create`,
      type: 'POST',
      data: data,
      success: async result => {
        processing = false;
        if (result.error) {
          ajaxErrorHandler(result.message);
          enableElements();
        } else {
          await BudgetItemCategories.reloadDataTable();
          enableElements();
          modal.modal('hide');
          toastr.success('A new budget item category has been successfully added.');
        }
      },
      error: (xhr, status, error) => {
        processing = false;
        enableElements();
        ajaxErrorHandler({
          file: 'admin/addBudgetItemCategory.js',
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