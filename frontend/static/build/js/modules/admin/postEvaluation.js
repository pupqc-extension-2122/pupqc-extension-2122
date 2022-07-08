/**
 * ==============================================
 * * ADD POST EVALUATION
 * ==============================================
*/

'use strict';

const AddPostEvaluation = (() => {

  /**
 * * Local Variables
 */
  const formSelector = '#activityEvaluation_form';
  /**
 * * Private Methods
 */
  const handleForm = () => {
    $app(formSelector).handleForm({
      validators: {},
      onSubmit: () => {

        // Get data
        const data = { 
          evaluation: AE_form.getEvaluation()
        }

        console.log(data);
      }
    });

    AE_form = new ActivityEvaluationForm($('#activityEvaluation_form'));

    AE_form.resetForm();
    
  }

  /**
 * * Public Methods
 */


  /**
 * * Init
 */



  /**
 * * Return public methods
 */
  return {
    init: async () => {
      if ($(formSelector).length) {
        handleForm();
      }
    },
  }

})();

AddPostEvaluation.init();