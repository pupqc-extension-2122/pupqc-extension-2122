/**
 * ==============================================
 * * PROJECT MONITORING DETAILS / ACTIVITIES
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
          const { start_date, end_date } = data;
          const today = moment();
          
          let status;
          if (today.isBefore(start_date) && today.isBefore(end_date))
            status = 'Not yet started';
          else if (today.isAfter(start_date) && today.isAfter(end_date))
            status = 'Finished';
          else if (today.isBetween(start_date, end_date))
            status = 'On going';
          else
            status = 'No data';

          const { theme, icon } = PROJECT_MONITORING_STATUS_STYLES[status];
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
        id: 'View activities',
        category: 'Project Activities',
        template: `
          <div
            role="button"
            class="btn btn-negative btn-block text-left" 
            onclick="location.replace('${BASE_URL_WEB}/p/monitoring/${id}/activities')"
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
            onclick="location.replace('${BASE_URL_WEB}/p/monitoring/${id}')"
          >
            <i class="fas fa-list text-primary fa-fw mr-1"></i>
            <span>View project details</span>
          </div>
        `
      },
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

    // *** Set option list *** //

    let optionsTemplate;
    let optionList = [];

    if (body.length) {
      optionList.push('View activities');
    } else if (activitiesDT.length) {
      optionList.push('View project details');
    }

    // Set the options based on status
    setHTMLContent(options, getOptionList(optionList));
  }

  return {
    setOptions,
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
  let isSubmitting = 0; // For edit

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
            file: 'projects/PropojectMonitoringDetails.js',
            fn: 'ProjectActivities.initDataTable',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
          }, 1);
        }
      },
      columns: [
        {
          data: 'createdAt',
          visible: false
        }, {
          data: 'activity_name',
          width: '30%'
        }, {
          data: null,
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
    isSubmitting = 1;

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

      isSubmitting = 0;
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
      success: async result => {
        if (result.error) {
          ajaxErrorHandler(result.message);
        } else {
          await reloadDataTable();
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

    enableElements();
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
    if (project_details.status !== 'Created') return;
    
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
    success: result => {
      if (result.error) {
        ajaxErrorHandler(result.message);
      } else {
        const data = result.data;

        ProjectDetails.init(data);
        ProjectOptions.setOptions(data);

        if ($('#activities_dt').length) {
          ProjectActivities.init(data);
        } else {
          setDocumentTitle(`${ data.title } - Project Details`);
        }
      }
    },
    error: (xhr, status, error) => {
      ajaxErrorHandler({
        file: 'projects/projectMonitoringDetails.js',
        fn: 'onDOMLoad.$.ajax',
        details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
      }, 1);
    }
  });
})();