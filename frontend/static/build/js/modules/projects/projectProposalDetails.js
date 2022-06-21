/**
 * ==============================================
 * * PROJECT PROPOSAL DETAILS
 * ==============================================
 */

'use strict';


const ProjectDetails = (() => {

  /**
   * * Local Variables`
   */

  const header = $('#projectDetails_header');
  const body = $('#projectDetails_body');
  let initialized = 0;

  // Data Container
  let data;

  /**
   * * Private Functions
   */

  const loadActiveBreadcrumb = () => {
    $('#active_breadcrumb').html(() => {
      const title = data.title;
      if (title.length > 30) {
        return `${ title.substring(0, 30) } ...`
      } else {
        return title;
      }
    });
  }

  const loadHeaderDetails = () => {
    loadActiveBreadcrumb();

    if (header.length) {
      setHTMLContent({
        '#projectDetails_header_title': data.title,
        '#projectDetails_header_implementer': data.implementer,
        '#projectDetails_header_timeframe': () => `${formatDateTime(data.start_date, 'Date')} - ${formatDateTime(data.end_date, 'Date')}`,
        '#projectDetails_header_status': () => {
          const status = data.status;
          const { theme, icon } = PROJECT_PROPOSAL_STATUS_STYLES[status];
          return `
            <div class="badge badge-subtle-${theme} py-1 px-2">
              <i class="${icon} fa-fw mr-1"></i>
              <span>${status}</span>
            </div>
          `
        }
      });
    }
  }

  const loadBodyDetails = () => {
    if (body.length) {
      const {
        title,
        implementer,
        team_members: pt,
        target_groups: tg,
        partners: ca,
        start_date,
        end_date,
        impact_statement,
        summary,
        financial_requirements: fr,
        evaluation_plans: ep
      } = data;

      const noContentTemplate = (message) => `<div class="text-muted font-italic">${message}</div>`;

      setHTMLContent({
        '#projectDetails_body_title': title || noContentTemplate('No title has been set up'),
        '#projectDetails_body_implementer': implementer || noContentTemplate('No implementer has been set up.'),
        '#projectDetails_body_projectTeam': () => {
          if (pt.length) {
            let list = '<ul class="mb-0">';
            pt.forEach(p => list += `<li>${p}</li>`);
            list += '</ul>';
            return list;
          }
          return noContentTemplate('No project team been set up.');
        },
        '#projectDetails_body_targetGroups': () => {
          if (tg.length) {
            let list = '<ul class="mb-0">';
            tg.forEach(t => list += `<li>${t}</li>`);
            list += '</ul>';
            return list;
          }
          return noContentTemplate('No target groups have been set up.');
        },
        '#projectDetails_body_cooperatingAgencies': () => {
          if (ca.length) {
            let list = '<ul class="mb-0">';
            ca.forEach(c => list += `<li>${c.name}</li>`);
            list += '</ul>';
            return list;
          }
          return noContentTemplate('No cooperating agencies have been set up.');
        },
        '#projectDetails_body_timeFrame': () => {
          if (start_date && end_date) {
            return `
              <div>${formatDateTime(start_date, 'Date')} - ${formatDateTime(end_date, 'Date')}</div>
              <div class="small text-muted">Approximately ${moment(start_date).to(moment(end_date), true)}.</div>
            `
          } else return noContentTemplate('No dates have been set up.');
        },
        '#projectDetails_body_impactStatement': impact_statement || noContentTemplate('No impact statement has been set up.'),
        '#projectDetails_body_summary': summary || noContentTemplate('No summary has been set up.</div>'),
        '#projectDetails_body_evaluationPlans': () => {
          if (ep.length) {
            let evaluationPlanRows = '';
            ep.forEach(p => {
              evaluationPlanRows += `
                <tr>
                  <td>${p.outcome || noContentTemplate('--')}</td>
                  <td>${p.indicator || noContentTemplate('--')}</td>
                  <td>${p.data_collection_method || noContentTemplate('--')}</td>
                  <td>${p.frequency || noContentTemplate('--')}</td>
                </tr>
              `
            });
            return evaluationPlanRows;
          } else {
            return `
              <tr>
                <td colspan="4">
                  <div class="p-5 text-center">${noContentTemplate('No evaluation plan has been set up.')}</div>
                </td>
              </tr>
            `
          }
        },
        '#projectDetails_body_financialRequirements': () => {
          
          let financialRequirementRows = '';
          let overallAmount = 0;

          // Read the object for rendering in the DOM
          fr.forEach(category => {

            // Create the line item budget row
            financialRequirementRows += `
              <tr style="background-color: #f6f6f6">
                <td 
                  class="font-weight-bold"
                  colspan="5"
                >${ category.category }</td>
              </tr>
            `;

            // Create the budget item rows
            category.items.forEach(r => {
              const { budget_item, particulars, quantity, estimated_cost } = r;
              const totalAmount = quantity * estimated_cost;

              overallAmount += totalAmount;

              financialRequirementRows += `
                <tr>
                  <td>${ budget_item }</td>
                  <td>${ particulars }</td>
                  <td class="text-right">${ quantity }</td>
                  <td class="text-right">${ formatToPeso(estimated_cost) }</td>
                  <td class="text-right">${ formatToPeso(totalAmount) }</td>
                </tr>
              `
            });
          });

          financialRequirementRows += `
            <tr class="font-weight-bold">
              <td colspan="4" class="text-right">Overall Amount</td>
              <td class="text-right">${ formatToPeso(overallAmount) }</td>
            </tr>
          `;

          return financialRequirementRows;
        }
      });

      $('#projectDetails_navTabs').show();
    }
  }

  const removeLoaders = () => {
    $('#contentHeader_loader').remove();
    $('#contentHeader').show();

    $('#projectDetails_options_card_loader').remove();
    $('#projectDetails_options_card').show();

    $('#projectDetails_body_loader').remove();
    $('#projectDetails_body').show();
  }

  /**
   * * Public Functions
   */

  const loadDetails = (project_details_data) => {
    if (project_details_data) data = project_details_data;
    loadHeaderDetails();
    loadBodyDetails();
  }

  /**
   * * Init
   */

  const init = (projectDetailsData) => {
    if (!initialized) {
      initialized = 1;
      data = projectDetailsData;
      loadDetails();
      removeLoaders();
    }
  }

  /**
   * * Return Public Functions
   */

  return {
    init,
    loadDetails,
  }
})();


const ProjectOptions = (() => {

  /**
   * * Local Variables
   */

  const body = $('#projectDetails_body');
  const activitiesDT = $('#activities_dt');
  const options = '#projectDetails_options';
  const user_roles = JSON.parse(getCookie('roles'));
  let project_details;
  let initialized = 0;
  let processing = 0; // For submissions

  // Submission Modals
  const forApproval_modal = $('#confirmSubmitForApproval_modal');
  const setPresentationSchedule_modal = $('#setPresentationSchedule_modal');
  const approveProject_modal = $('#confirmApproveTheProject_modal');
  const cancelProposal_modal = $('#confirmCancelTheProposal_modal');

  /**
   * * Private Methods
   */

  const initForApproval = () => {

    const confirmBtn = $('#confirmSubmitForApproval_btn');
    
    confirmBtn.on('click', async () => {
      if (!(project_details.status == 'Created' || project_details.status == 'For Revision')) return;

      processing = 1;
      
      // Disable elements
      confirmBtn.attr('disabled', true);
      confirmBtn.html(`
        <span class="px-3">
          <span class="spinner-grow spinner-grow-sm m-0" role="status">
            <span class="sr-only">Loading...</span>
          </span>
        </span>
      `);
      
      // Enable elements function
      const enableElements = () => {
        confirmBtn.attr('disabled', false);
        confirmBtn.html('Yes, please!');
        processing = 0;
      }

      await $.ajax({
        url: `${ BASE_URL_API }/projects/review/${ project_details.id }`,
        type: 'PUT',
        success: async res => {
          enableElements();
          if (res.error) {
            forApproval_modal.modal('hide');
            toastr.warning(res.message);
          } else {
            await updateStatus();
            forApproval_modal.modal('hide');
            toastr.success('The proposal has been submitted successfully.');
          }
        }, 
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'projects/projectProposalDetails.js',
            fn: `ProjectOptions.initForApproval(): confirmBtn.on('click', ...)`,
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          });
          enableElements();
        }
      });
    });

    forApproval_modal.on('show.bs.modal', (e) => {
      if (!(project_details.status == 'Created' || project_details.status == 'For Revision')) e.preventDefault();
    });

    forApproval_modal.on('hide.bs.modal', (e) => processing && e.preventDefault());
    
  }

  const initForEvaluation = () => {

    // Initialize Date Input
    $app('#setPresentation_date').initDateInput({
      button: '#setPresentation_date_pickerBtn'
    });

    // Prevent showing the modal if status is not "For Review"
    setPresentationSchedule_modal.on('show.bs.modal', (e) => {
      if (project_details.status !== 'For Review') e.preventDefault();
    });

    $app('#setPresentationSchedule_form').handleForm({
      validators: {
        presentation_date: {
          required: 'Please select a date for the presentation of the project',
          afterToday: 'Date must be later than today'
        }
      },
      onSubmit: () => {
        if (project_details.status !== 'For Review') return;
        toastr.success('Submitted');
      }
    });
  }

  const initApproveProject = () => {

    const confirmBtn = $('#confirmApproveTheProject_btn');

    confirmBtn.on('click', async (e) => {
      if (project_details.status !== 'Pending') e.preventDefault();
      
      processing = 1;
      
      // Disable elements
      confirmBtn.attr('disabled', true);
      confirmBtn.html(`
        <span class="px-3">
          <span class="spinner-grow spinner-grow-sm m-0" role="status">
            <span class="sr-only">Loading...</span>
          </span>
        </span>
      `);
    
      // Enable elements function
      const enableElements = () => {
        confirmBtn.attr('disabled', false);
        confirmBtn.html('Yes, please!');
        processing = 0;
      }
      
      await $.ajax({
        url: `${ BASE_URL_API }/projects/approve/${ project_details.id }`,
        type: 'PUT',
        success: async res => {
          if (res.error) {
            ajaxErrorHandler(res.message);
            enableElements();
          } else {
            await updateStatus();
            enableElements();
            approveProject_modal.modal('hide');
            toastr.success('The proposal has been approved.');
          }
        },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'projects/projectProposalDetails.js',
            fn: `ProjectOptions.initApproveProject(): confirmBtn.on('click', ...)`,
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          });
          enableElements();
        }
      })
    });

    approveProject_modal.on('show.bs.modal', (e) => {
      if (project_details.status != 'Pending') e.preventDefault();
    });

    approveProject_modal.on('hide.bs.modal', (e) => processing && e.preventDefault())
  }

  const initCancelProposal = () => {

    const confirmBtn = $('#confirmCancelTheProposal_btn');

    confirmBtn.on('click', async () => {
      if (project_details.status !== 'Pending') return;

      processing = 1;

      // Disable elements
      confirmBtn.attr('disabled', true);
      confirmBtn.html(`
        <span class="px-3">
          <span class="spinner-grow spinner-grow-sm m-0" role="status">
            <span class="sr-only">Loading...</span>
          </span>
        </span>
      `);

      // Enable elements function
      const enableElements = () => {
        confirmBtn.attr('disabled', false);
        confirmBtn.html('Yes, please!');
        processing = 0;
      }

      await $.ajax({
        url: `${ BASE_URL_API }/projects/cancel/${ project_details.id }`,
        type: 'PUT',
        success: async res => {
          enableElements();
          if (res.error) {
            cancelProposal_modal.modal('hide');
            toastr.warning(res.message);
          } else {
            await updateStatus();
            cancelProposal_modal.modal('hide');
            toastr.success('The proposal has been submitted successfully.');
          }
        }, 
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'projects/projectProposalDetails.js',
            fn: `ProjectOptions.initCancelProposal(): confirmBtn.on('click', ...)`,
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          });
          enableElements();
        }
      });
    });

    cancelProposal_modal.on('show.bs.modal', (e) => {
      if (project_details.status !== 'Pending') e.preventDefault();
    });

    cancelProposal_modal.on('hide.bs.modal', (e) => processing && e.preventDefault());
  }

  const initSubmissions = () => {

    // * ======== FOR EXTENSIONIST ======== * //

    initForApproval();
    initForEvaluation();
    initCancelProposal();

    // * ======== FOR CHIEF ======== * //

    initApproveProject();
  }

  const updateStatus = async () => {
    await $.ajax({
      url: `${ BASE_URL_API }/projects/${ project_details.id }`,
      type: 'GET',
      success: result => {
        if (result.error) {
          ajaxErrorHandler(result.message);
        } else {
          const data = result.data;
  
          ProjectDetails.loadDetails(data);
          ProjectOptions.setOptions(data);
          if ($('#activities_dt').length) {
            AddProjectActivity.init(data);
            ProjectActivities.init(data);
          }
        }
      },
      error: (xhr, status, error) => {
        ajaxErrorHandler({
          file: 'projects/projectProposalDetails.js',
          fn: 'ProjectOptions.updateStatus()',
          details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
        });
      }
    });
  }

  /**
   * * Public Methods
   */

  const setOptions = (data) => {

    if (data) project_details = data;

    // Get the status
    const { id, status } = project_details;

    // Dictionary of options
    const optionsDict = [
      {
        id: 'Add project activity',
        category: 'Project Activities',
        template: `
          <button 
            type="button"
            class="btn btn-negative btn-block text-left" 
            data-toggle="modal"
            data-target="#addProjectActivity_modal"
          >
            <i class="fas fa-plus text-success fa-fw mr-1"></i>
            <span>Add project activity</span>
          </button>
        `
      }, {
        id: 'View activities',
        category: 'Project Activities',
        template: `
          <div
            role="button"
            class="btn btn-negative btn-block text-left" 
            onclick="location.replace('${BASE_URL_WEB}/p/proposals/${id}/activities')"
          >
            <i class="fas fa-list text-primary fa-fw mr-1"></i>
            <span>View activities</span>
          </div>
        `
      }, {
        id: 'View project details',
        category: 'Project Details',
        template: `
          <div
            role="button"
            class="btn btn-negative btn-block text-left" 
            onclick="location.replace('${BASE_URL_WEB}/p/proposals/${id}')"
          >
            <i class="fas fa-list text-primary fa-fw mr-1"></i>
            <span>View project details</span>
          </div>
        `
      }, {
        id: 'Edit project details',
        category: 'Project Details',
        template: `
          <div
            role="button"
            class="btn btn-negative btn-block text-left" 
            onclick="location.assign('${BASE_URL_WEB}/p/edit-proposal/${id}')"
          >
            <i class="fas fa-edit text-info fa-fw mr-1"></i>
            <span>Edit details</span>
          </div>
        `
      }, {
        id: 'Submit for approval',
        category: 'For Submission',
        template: `
          <button 
            type="button"
            class="btn btn-outline-success btn-block text-left" 
            onclick="ProjectOptions.triggerOption('submitForApproval')"
          >
            <i class="fas fa-hand-pointer fa-fw mr-1"></i>
            <span>Submit for approval</span>
          </button>
        `
      }, {
        id: 'Submit evaluation grade',
        category: 'For Submission',
        template: `
          <button 
            type="button"
            class="btn btn-outline-info btn-block text-left" 
            onclick="ProjectOptions.triggerOption('submitEvaluationGrade')"
          >
            <i class="fas fa-list-alt fa-fw mr-1"></i>
            <span>Submit evaluation grade</span>
          </button>
        `
      }, {
        id: 'Cancel the proposal',
        category: 'For Submission',
        template: `
          <button 
            type="button"
            class="btn btn-negative btn-block text-left" 
            onclick="ProjectOptions.triggerOption('cancelTheProposal')"
          >
            <i class="fas fa-times-circle fa-fw mr-1 text-warning"></i>
            <span>Cancel the proposal</span>
          </button>
        `
      }, {
        id: 'Set presentation schedule',
        category: 'For Submission',
        template: `
          <button 
            type="button"
            class="btn btn-outline-primary btn-block text-left" 
            onclick="ProjectOptions.triggerOption('approveTheProposal')"
          >
            <i class="fas fa-calendar-alt fa-fw mr-1"></i>
            <span>Set presentation schedule</span>
          </button>
        `
      }, {
        id: 'Request for revision',
        category: 'For Submission',
        template: `
          <button 
            type="button"
            class="btn btn-negative btn-block text-left" 
            onclick="ProjectOptions.triggerOption('rejectTheProposal')"
          >
            <i class="fas fa-file-pen fa-fw mr-1 text-warning"></i>
            <span>Request for revision</span>
          </button>
        `
      }, {
        id: 'Approve the project',
        category: 'For Submission',
        template: `
          <button 
            type="button"
            class="btn btn-outline-success btn-block text-left" 
            onclick="ProjectOptions.triggerOption('approveTheProject')"
          >
            <i class="fas fa-check fa-fw mr-1"></i>
            <span>Approve the project</span>
          </button>
        `
      }
    ];

    // Get Option List function
    const getOptionList = (optionArr = []) => {
      if(optionArr.length) {
        let optionList = '';
        let selectedOptions = {};
        optionArr.forEach(o => {
          const { id, category } = optionsDict.find(od => od.id == o);
          if (!selectedOptions.hasOwnProperty(category)) selectedOptions[category] = [];
          selectedOptions[category].push(id);
        });
        const entries = Object.entries(selectedOptions);
        entries.forEach((s, i) => {
          const [key, optionsArr] = s;
          optionList += `<div class="dropdown-header">${ key }</div>`;
          optionsArr.forEach(o => optionList += optionsDict.find(od => od.id == o).template);
          if (i < entries.length - 1) optionList += `<div class="dropdown-divider"></div>`
        });
        return optionList;
      }
    }

    // *** Set the options *** //

    let optionsTemplate;
    let optionList = [];

    if (body.length) {
      optionList.push('View activities');
    } else if (activitiesDT.length) {
      optionList.push('View project details');
    }

    if (user_roles.includes('Extensionist')) {
      const revisingOptions = () => {
        if (body.length) {
          optionList.push('Edit project details');
          optionList.push('Submit for approval');
        }
        if (activitiesDT.length) {
          optionList.unshift('Add project activity');
          optionList.push('Edit project details');
          optionList.push('Submit for approval');
        }
      }

      optionsTemplate = {
        'Created': () => revisingOptions(),
        'For Revision': () => revisingOptions(),
        'For Evaluation': () => {
          optionList.push('Submit evaluation grade');
        },
        'Pending': () => {
          optionList.push('Cancel the proposal');
        },
      }
      if (typeof optionsTemplate[status] !== "undefined") optionsTemplate[status]();
    }

    if (user_roles.includes('Chief')) {
      optionsTemplate = {
        'For Review': () => {
          optionList.push('Set presentation schedule');
          optionList.push('Request for revision');
        },
        'Pending': () => {
          optionList.push('Approve the project');
        }
      }
      if (typeof optionsTemplate[status] !== "undefined") optionsTemplate[status]();
    }

    // Set the options based on status
    setHTMLContent(options, getOptionList(optionList));
  }

  const triggerOption = (option) => {
    let optionFunc = {};
    
    if (user_roles.includes('Extensionist')) {
      
      optionFunc.submitForApproval = () => {
        forApproval_modal.modal('show');
      };
      
      optionFunc.submitEvaluationGrade = () => {
        alert('Pending');
      };

      optionFunc.cancelTheProposal = () => {
        cancelProposal_modal.modal('show');
      };

    }

    if (user_roles.includes('Chief')) {
      
      optionFunc.approveTheProposal = () => {
        setPresentationSchedule_modal.modal('show');
      }

      optionFunc.rejectTheProposal = () => {
        updateStatus('Created');
      }
      
      optionFunc.approveTheProject = () => {
        approveProject_modal.modal('show');
      }

    }

    if (typeof optionFunc[option] !== "undefined") optionFunc[option]();
  };

  /**
   * * Init
   */

  const init = (data) => {
    if (!initialized) {
      initialized = 1;
      initSubmissions();
      setOptions(data);
    }
  }
  
  /**
   * * Return Public Methods
   */

  return {
    init,
    setOptions,
    triggerOption
  }
})();


const AddProjectActivity = (() => {

  /**
   * * Local Variables
   */
  const formSelector = '#addProjectActivity_form';
  const form = $(formSelector)[0];
  const addActivityModal = $('#addProjectActivity_modal');
  let validator;
  let PA_form;
  let initiated = 0;
  let processing = 0;
  let project_details;

  /**
   * * Private Functions
   */

  const initProjectActivityForm = () => {
    
    // Initialize Start Date
    $app('#addProjectActivity_startDate').initDateInput({
      button: '#addProjectActivity_startDate_pickerBtn'
    });

    // Initialize End Date
    $app('#addProjectActivity_endDate').initDateInput({
      button: '#addProjectActivity_endDate_pickerBtn'
    });

    PA_form = new ProjectActivityForm({
      topicsForm: {
        formGroup: '#addProjectActivity_topics_grp',
        buttons: {
          add: '#addTopic_btn',
          clear: '#clearTopicEmptyFields_btn'
        }
      },
      outcomesForm: {
        formGroup: '#addProjectActivity_outcomes_grp',
        buttons: {
          add: '#addOutcome_btn',
          clear: '#clearOutcomeEmptyFields_btn'
        }
      }
    });
    
    // On modal hide
    addActivityModal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    })

    // On modal hidden
    addActivityModal.on('hidden.bs.modal', (e) => {
      processing ? e.preventDefault() : resetForm();
    });
  }

  const resetForm = () => {

    // Reset validation
    validator.resetForm();
    
    // Reset native inputs
    form.reset();

    // Reset Automated Forms
    PA_form.resetActivityForm();
  }

  const handleForm = () => {
    validator = $app(formSelector).handleForm({
      validators: {
        title: {
          required: 'The title of the activity is required.',
          notEmpty: 'This field cannot be blank'
        },
        start_date: {
          required: 'Please select a start date', 
          beforeDateTimeSelector: {
            rule: '#addProjectActivity_endDate',
            message: "Start date must be before end date"
          }
        },
        end_date: {
          required: 'Please select a end date', 
          afterDateTimeSelector: {
            rule: '#addProjectActivity_startDate',
            message: "End date must be after start date"
          }
        },
        details: {
          required: 'The summary/details of the activity is required',
          notEmpty: 'This field cannot be blank',
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }
  
  const onFormSubmit = async () => {
    if (!(project_details.status === 'Created' || project_details.status === 'For Revision')) return;

    processing = 1;

    // Disable the elements
    const saveBtn = $('#addProjectActivity_saveBtn');
    const cancelBtn = $('#addProjectActivity_cancelBtn');
    
    cancelBtn.attr('disabled', true);
    saveBtn.attr('disabled', true);
    saveBtn.html(`
      <span class="px-3">
        <span class="spinner-grow spinner-grow-sm m-0" role="status">
          <span class="sr-only">Loading...</span>
        </span>
      </span>
    `);

    // For enabling elements
    const enableElements = () => {

      // Enable buttons
      cancelBtn.attr('disabled', false);
      saveBtn.attr('disabled', false);
      saveBtn.html(`Submit`);

      processing = 0;
    }


    // Get the data
    const fd = new FormData(form);
    const data = {
      activity_name: fd.get('title'),
      ...PA_form.getActivityData(),
      start_date: moment(fd.get('start_date')).toISOString(),
      end_date: moment(fd.get('end_date')).toISOString(),
      details: fd.get('details'),
      status: 'Not evaluated'
    }

    // Save data to db
    await $.ajax({
      url: `${ BASE_URL_API }/projects/${ project_details.id }/activities/create`,
      type: 'POST',
      data: data,
      success: async res => {
        if (res.error) {
          ajaxErrorHandler(res.message);
          enableElements();
        } else {

          // Reload the datatable
          await ProjectActivities.reloadDataTable();
          
          // Enable Elements
          enableElements();

          // Hide the modal
          addActivityModal.modal('hide');
          
          // Reset the form
          resetForm();

          // Show a toast notification
          toastr.success('An activity has been successfully added.');
        }
      },
      error: (xhr, status, error) => {
        enableElements();
        ajaxErrorHandler({
          file: 'projects/projectProposalDetails.js',
          fn: 'AddProjectActivity.onFormSubmit()',
          data: data,
          details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
        });
      }
    });
  }

  /**
   * * Init
   */

  const init = (project_details_data) => {
    if (!initiated) {
      initiated = 1;
      project_details = project_details_data;
      if (JSON.parse(getCookie('roles')).includes('Extensionist')) {
        handleForm();
        initProjectActivityForm();
      }
    }
  }
  
  /**
   * * Return Public Functions
   */

  return {
    init,
  }
})();


const ProjectActivities = (() => {

  /**
	 * * Local Variables
	 */

  const dtElem = $('#activities_dt');
  const viewModal = $('#projectActivityDetails_modal');
  const editModal = $('#editProjectActivity_modal');
  const editFormSelector = '#editProjectActivity_form';
  const editForm = $(editFormSelector)[0];
  const user_roles = JSON.parse(getCookie('roles'));
  let project_details;
  let dt;
  let editValidator;
  let PA_form;
  let initialized = 0;
  let processing = 0; // For edit

  /**
	 * * Private Methods
	 */

  const initializations = () => {

    // *** Initialize Edit Activity Form *** //

    // Initialize Start Date
    $app('#editProjectActivity_startDate').initDateInput({
      button: '#editProjectActivity_startDate_pickerBtn'
    });

    // Initialize End Date
    $app('#editProjectActivity_endDate').initDateInput({
      button: '#editProjectActivity_endDate_pickerBtn'
    });
    
    PA_form = new ProjectActivityForm({
      topicsForm: {
        formGroup: '#editProjectActivity_topics_grp',
        buttons: {
          add: '#editTopic_btn',
          clear: '#clearEditTopicEmptyFields_btn'
        }
      },
      outcomesForm: {
        formGroup: '#editProjectActivity_outcomes_grp',
        buttons: {
          add: '#editOutcome_btn',
          clear: '#clearEditOutcomeEmptyFields_btn'
        }
      }
    });

    // *** On Modals Hidden State *** //
    
    viewModal.on('hidden.bs.modal', () => {

      // Show the loaders
      $('#projectActivityDetails_loader').show();
      $('#projectActivityDetails').hide();
    });

    editModal.on('show.bs.modal', () => {
      if (project_details.status !== 'Created') return;
    });

    editModal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });

    editModal.on('hidden.bs.modal', () => {

      // Reset the edit form
      editForm.reset();

      // Reset the activity form
      PA_form.resetActivityForm();

      // Reset the validator
      editValidator.resetForm();

      // Show the loaders
      $('#editProjectActivity_formGroups_loader').show();
      $('#editProjectActivity_formGroups').hide();

      // Disable buttons
      $('#editProjectActivity_form_saveBtn').attr('disabled', true);
    });
  }

  const initDataTable = async () => {
    dt = dtElem.DataTable({
      ...DT_CONFIG_DEFAULTS,
      ajax: {
        url: `${ BASE_URL_API }/projects/${ project_details.id }/activities`,
        // success: result => {
        //   console.log(result);
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'projects/PropojectProposalDetails.js',
            fn: 'ProjectActivities.initDataTable',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            activity_name: 'string'
          }
        }
      },
      columns: [
        {
          data: 'created_at',
          visible: false
        }, {
          data: 'activity_name',
          width: '30%'
        }, {
          data: null,
          searchable: false,
          sortable: false,
          width: '30%',
          render: data => {
            const topics = data.topics;
            const length = topics.length;
            if (length > 1) {
              return `
                <div>${ topics[0]}</div>
                <div class="small text-muted">and ${ length - 1 } more.</div>
              `
            } else if (length == 1) {
              return topics[0]
            } else {
              return `<div class="text-muted font-italic">No topics.</div>`
            }
          }
        }, {
          data: null,
          searchable: false,
          sortable: false,
          render: ({ start_date, end_date }) => {
            return `
              <div>${formatDateTime(start_date, 'Date')} - ${formatDateTime(end_date, 'Date')}</div>
              <div class="small text-muted">Approximately ${moment(start_date).to(moment(end_date), true)}.</div>
            `
          }
        }, {
          data: null,
          width: '10%',
          render: data => {

            const editOption = () => {
              return user_roles.includes('Extensionist') && project_details.status == 'Created'
                ? `
                  <button
                    type="button"
                    class="dropdown-item"
                    onclick="ProjectActivities.initEditMode('${ data.id }')"
                  >
                    <span>Edit details</span>
                  </button>
                `
                : ''
            }

            return `
              <div class="dropdown text-sm-center">
                <div class="btn btn-sm btn-negative" data-toggle="dropdown" data-dt-btn="options" title="Options">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
                <div class="dropdown-menu dropdown-menu-right">
                  <div class="dropdown-header">Options</div>
                  <button
                    type="button"
                    class="dropdown-item"
                    onclick="ProjectActivities.initViewMode('${ data.id }')"
                  >
                    <span>View details</span>
                  </button>
                  ${ editOption() }
                </div>
              </div>
            `;
          }
        }
      ]
    });
  }

  const handleEditForm = () => {
    editValidator = $app(editFormSelector).handleForm({
      validators: {
        title: {
          required: 'The title of the activity is required.',
          notEmpty: 'This field cannot be empty'
        },
        start_date: {
          required: 'Please select a start date', 
          beforeDateTimeSelector: {
            rule: '#addProjectActivity_endDate',
            message: "Start date must be before end date"
          }
        },
        end_date: {
          required: 'Please select a end date', 
          afterDateTimeSelector: {
            rule: '#addProjectActivity_startDate',
            message: "End date must be after start date"
          }
        },
        details: {
          required: 'The summary/details of the activity is required',
          notEmpty: 'This field cannot be blank',
        }
      },
      onSubmit: () => onEditFormSubmit()
    });
  }

  const onEditFormSubmit = async () => {
    if (!(project_details.status == 'Created' || project_details.status == 'For Revision')) return;

    processing = 1;

    // Disable the elements
    const saveBtn = $('#editProjectActivity_saveBtn');
    const cancelBtn = $('#editProjectActivity_cancelBtn');
    
    cancelBtn.attr('disabled', true);
    saveBtn.attr('disabled', true);
    saveBtn.html(`
      <span class="px-3">
        <span class="spinner-grow spinner-grow-sm m-0" role="status">
          <span class="sr-only">Loading...</span>
        </span>
      </span>
    `);

    // For enabling elements
    const enableElements = () => {

      // Enable buttons
      cancelBtn.attr('disabled', false);
      saveBtn.attr('disabled', false);
      saveBtn.html(`Submit`);

      processing = 0;
    }

    // Get the data
    const fd = new FormData(editForm);
    const data = {
      activity_name: fd.get('title'),
      ...PA_form.getActivityData(),
      start_date: moment(fd.get('start_date')).toISOString(),
      end_date: moment(fd.get('end_date')).toISOString(),
      details: fd.get('details')
    }
    
    await $.ajax({
      url: `${ BASE_URL_API }/projects/${ project_details.id }/activities/${ fd.get('activity_id') }`,
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
          toastr.success('A project activity has been successfully updated');
        }
      }, 
      error: (xhr, status, error) => {
        ajaxErrorHandler({
          file: 'projects/projectProposalDetails.js',
          fn: 'ProjectActivities.onEditFormSubmit()',
          data: data,
          details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
        });
        enableElements();
      }
    });

  }

  /**
	 * * Public Methods
	 */

  const reloadDataTable = async () => {
    await dt.ajax.reload();
  }

  const initViewMode = async (activity_id) => {
    
    // Show the modal
    viewModal.modal('show');
    
    // Get the project activity details
    await $.ajax({
      url: `${ BASE_URL_API }/projects/${ project_details.id }/activities/${ activity_id }`,
      type: 'GET',
      success: result => {
        if (result.error) {
          ajaxErrorHandler(result.message)
        } else {
          const { 
            activity_name, 
            topics, 
            outcomes,
            start_date,
            end_date,
            details 
          } = result.data;

          // Set Content
          setHTMLContent({
            '#projectActivityDetails_title': activity_name,
            '#projectActivityDetails_topics': () => {
              if(topics.length) {
                let list = `<ul class="mb-0">`;
                topics.forEach(t => list += `<li>${ t }</li>`);
                list += `</ul>`;
                return list;
              }
            },
            '#projectActivityDetails_outcomes': () => {
              if(outcomes.length) {
                let list = `<ul class="mb-0">`;
                outcomes.forEach(o => list += `<li>${ o }</li>`);
                list += `</ul>`;
                return list;
              }
            },
            '#projectActivityDetails_timeframe': () => {
              if (start_date && end_date) {
                return `
                  <div>${formatDateTime(start_date, 'Date')} - ${formatDateTime(end_date, 'Date')}</div>
                  <div class="small text-muted">Approximately ${moment(start_date).to(moment(end_date), true)}.</div>
                `
              } else return noContentTemplate('No dates have been set up.');
            },
            '#projectActivityDetails_details': details
          });
  
          // Hide the loaders
          $('#projectActivityDetails_loader').hide();
          $('#projectActivityDetails').show();
        }
      },
      error: (xhr, status, error) => {
        ajaxErrorHandler({
          file: 'projects/projectProposalDetails.js',
          fn: 'ProjectActivities.initViewMode()',
          details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
        });
      }
    });
  }

  const initEditMode = async (activity_id) => {
    if (!(project_details.status === 'Created' || project_details.status === 'For Revision')) return;
    
    // Show the modal
    editModal.modal('show');

    // Get the details of the project activity
    await $.ajax({
      url: `${ BASE_URL_API }/projects/${ project_details.id }/activities/${ activity_id }`,
      type: 'GET',
      success: result => {
        if (result.error) {
          ajaxErrorHandler(result.message)
        } else {
          const { 
            activity_name, 
            topics, 
            outcomes,
            start_date,
            end_date,
            details
          } = result.data;
        
          // Set the input values
          setInputValue({
            '#editProjectActivity_activityId': activity_id,
            '#editProjectActivity_title': activity_name,
            '#editProjectActivity_startDate': formatDateTime(start_date, 'MM/DD/YYYY'),
            '#editProjectActivity_endDate': formatDateTime(end_date, 'MM/DD/YYYY'),
            '#editProjectActivity_details': details,
          });

          // To make sure that input dates are updated
          $('#editProjectActivity_startDate').trigger('change');
          $('#editProjectActivity_endDate').trigger('change');

          // Set the topics and outcomes
          PA_form.setTopics(topics);
          PA_form.setOutcomes(outcomes);

          // Hide the loaders
          $('#editProjectActivity_formGroups_loader').hide();
          $('#editProjectActivity_formGroups').show();
          
          // Enable buttons
          $('#editProjectActivity_form_saveBtn').attr('disabled', false);
        }
      },
      error: (xhr, status, error) => {
        ajaxErrorHandler({
          file: 'projects/projectProposalDetails.js',
          fn: 'ProjectActivities.initEditMode()',
          details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
        });
      }
    });
  }
  
  /**
	 * * Init
	 */

  const init = (data) => {
    if (!initialized) {
      initialized = 1;
      project_details = data;
      handleEditForm();
      initializations();
      initDataTable();
    };
  }

  /**
	 * * Return Public Functions
	 */

  return {
    init,
    reloadDataTable,
    initViewMode,
    initEditMode,
  }
})();


(() => {
  const project_id = location.pathname.split('/')[3];

  $.ajax({
    url: `${ BASE_URL_API }/projects/${ project_id }`,
    type: 'GET',
    success: res => {
      if (res.error) {
        ajaxErrorHandler(res.message);
      } else {
        const data = res.data;

        ProjectDetails.init(data);
        ProjectOptions.init(data);

        const documentTitle = data.title.length > 75 
          ? data.title.substring(0, 75) + ' ...' 
          : data.title;

        if ($('#activities_dt').length) {
          AddProjectActivity.init(data);
          ProjectActivities.init(data);
          setDocumentTitle(`${ documentTitle } - Project Activities`);
        } else {
          setDocumentTitle(`${ documentTitle } - Project Details`);
        }
      }
    },
    error: (xhr, status, error) => {
      ajaxErrorHandler({
        file: 'projects/projectProposalDetails.js',
        fn: 'onDOMLoad.$.ajax',
        details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
      }, 1);
    }
  });
})();