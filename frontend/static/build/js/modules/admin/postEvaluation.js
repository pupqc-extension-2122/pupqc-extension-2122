/**
 * ==============================================
 * * CONFIGURE POST ACTIVITY EVALUATION
 * ==============================================
*/

'use strict';

const PostActivityEvaluation = (() => {

  // * Local Variables

  const formSelector = '#configurePostEval_form';
  const form = $(formSelector);
  const contentLoader = $('#content_loader');

  let validator, AE_form;

  let initialized = false;
  let processing = false;

  // * Private Methods

  const handleForm = async () => {
    validator = await $app(formSelector).handleForm({
      validators: {},
      onSubmit: () => onFormSubmit()
    });

    AE_form = new ActivityEvaluationForm($('#activityEvaluation_form'), {
      config: true
    });

    // AE_form.resetForm();
  }

  const onFormSubmit = async () => {
    if (processing) return;

    processing = true;

    await $.ajax({
      url: `${ BASE_URL_API }/activities_evaluation/store`,
      type: 'POST',
      data: { config: AE_form.getEvaluation() },
      success: res => {
        processing = false;
        if (res.error) {
          ajaxErrorHandler(res.message);
        } else {
          toastr.success('Defined categories has been successfully saved.');
        }
      },
      error: (xhr, status, error) => {
        processing = false;
        enableElements();
        ajaxErrorHandler({
          file: 'admin/postEvaluation.js',
          fn: 'PostActivityEvaluation.onFormSubmit()',
          xhr: xhr
        }, 1);
      }
    })
  }

  const getPredefinedValues = async () => {
    await $.ajax({
      url: `${ BASE_URL_API }/activities_evaluation/read`,
      type: 'GET',
      success: res => {
        AE_form.setEvaluation(res.data);
        contentLoader.hide();
        form.show();
      },
      error: (xhr, status, error) => {
        processing = false;
        enableElements();
        ajaxErrorHandler({
          file: 'admin/postEvaluation.js',
          fn: 'PostActivityEvaluation.getPredefinedValues()',
          xhr: xhr
        }, 1);
      }
    });
  }

  // * Public Methods

  const reloadForm = () => {
    alert('Reloaded');
  }
  
  // * Init
  const init = async () => {
    if (initialized) return;
    initialized = true;
    await handleForm();
    await getPredefinedValues();
  }

  // * Return public methods

  return {
    init,
    reloadForm
  }

})();

PostActivityEvaluation.init();