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

  const loadHeaderDetails = () => {
    if (header.length) {
      setHTMLContent({
        '#projectDetails_header_title': data.title,
        '#projectDetails_header_implementer': data.implementer,
        '#projectDetails_header_timeframe': () => `${formatDateTime(data.start_date, 'Date')} - ${formatDateTime(data.end_date, 'Date')}`,
        '#projectDetails_header_status': () => {
          const { theme, icon } = PROJECT_STATUS_STYLES[data.status];
          return `
            <div class="badge badge-subtle-${theme} py-1 px-2">
              <i class="${icon} fa-fw mr-1"></i>
              <span>${data.status}</span>
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
        project_team: pt,
        target_groups: tg,
        cooperating_agencies: ca,
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
            pt.forEach(p => list += `<li>${p.team_member}</li>`);
            list += '</ul>';
            return list;
          }
          return noContentTemplate('No project team been set up.');
        },
        '#projectDetails_body_targetGroups': () => {
          if (tg.length) {
            let list = '<ul class="mb-0">';
            tg.forEach(t => list += `<li>${t.name}</li>`);
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
              <div class="small">Approximately ${moment(start_date).to(moment(end_date), true)}.</div>
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

          // // Create a new object that holds financial requirements grouped by line item budget
          // let frObj = {};
          // let budgetItemCategoryList = [];

          // // Group the requirements according to line item budget
          // fr.forEach(r => {

          //   // Create a copy of object
          //   let requirement = { ...r };

          //   // Get the budget item category id
          //   const bic_id = requirement.budget_item_category.id;

          //   // Create a key with empty array if line item budget key not yet exist
          //   if (!(frObj[bic_id])) {
          //     frObj[bic_id] = [];
          //     budgetItemCategoryList.push(requirement.budget_item_category);
          //   }

          //   // Remove the budget_item_category in object
          //   delete requirement.budget_item_category;

          //   // Push the object according to key
          //   frObj[bic_id].push(requirement);
          // });

          // let financialRequirementRows = '';
          // let overallAmount = 0;

          // // Read the object for rendering in the DOM
          // Object.keys(frObj).forEach(key => {

          //   // Create the line item budget row
          //   financialRequirementRows += `
          //     <tr style="background-color: #f6f6f6">
          //       <td 
          //         class="font-weight-bold"
          //         colspan="5"
          //       >${budgetItemCategoryList.find(x => x.id == key).name}</td>
          //     </tr>
          //   `;

          //   // Create the budget item rows
          //   frObj[key].forEach(r => {
          //     const { budget_item, particulars, quantity, estimated_cost } = r;
          //     const totalAmount = quantity * estimated_cost;

          //     overallAmount += totalAmount;

          //     financialRequirementRows += `
          //       <tr>
          //         <td>${budget_item}</td>
          //         <td>${particulars}</td>
          //         <td class="text-right">${quantity}</td>
          //         <td class="text-right">${formatToPeso(estimated_cost)}</td>
          //         <td class="text-right">${formatToPeso(totalAmount)}</td>
          //       </tr>
          //     `
          //   });
          // });

          // financialRequirementRows += `
          //   <tr class="font-weight-bold">
          //     <td colspan="4" class="text-right">Overall Amount</td>
          //     <td class="text-right">${formatToPeso(overallAmount)}</td>
          //   </tr>
          // `;

          // return financialRequirementRows;
          
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
                >${ category.name }</td>
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
  const body = $('#projectDetails_body');
  const activitiesDT = $('#activities_dt');
  const options = '#projectDetails_options';
  const user_roles = JSON.parse(getCookie('roles'));
  let project_details;

  const setOptions = (data) => {

    if (data) project_details = data;

    // Get the status
    const { id, status } = project_details;

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
            class="btn btn-outline-warning btn-block text-left" 
            onclick="ProjectOptions.triggerOption('cancelTheProposal')"
          >
            <i class="fas fa-times-circle fa-fw mr-1"></i>
            <span>Cancel the proposal</span>
          </button>
        `
      }, {
        id: 'Approve the proposal',
        category: 'For Submission',
        template: `
          <button 
            type="button"
            class="btn btn-outline-success btn-block text-left" 
            onclick="ProjectOptions.triggerOption('approveTheProposal')"
          >
            <i class="fas fa-check fa-fw mr-1"></i>
            <span>Approve the proposal</span>
          </button>
        `
      }, {
        id: 'Reject the proposal',
        category: 'For Submission',
        template: `
          <button 
            type="button"
            class="btn btn-outline-danger btn-block text-left" 
            onclick="ProjectOptions.triggerOption('rejectTheProposal')"
          >
            <i class="fas fa-times fa-fw mr-1"></i>
            <span>Reject the proposal</span>
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

    let optionsTemplate;
    let optionList = [];

    if (body.length) {
      optionList.push('View activities');
    } else if (activitiesDT.length) {
      optionList.push('View project details');
    }

    if (user_roles.includes('Extensionist')) {
      optionsTemplate = {
        'Created': () => {
          if (body.length) {
            optionList.push('Edit project details');
            optionList.push('Submit for approval');
          }
          if (activitiesDT.length) {
            optionList.unshift('Add project activity');
            optionList.push('Edit project details');
            optionList.push('Submit for approval');
          }
        },
        'For evaluation': () => {
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
        'For review': () => {
          optionList.push('Approve the proposal');
          optionList.push('Reject the proposal');
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
    let optionFunc;
    
    if (user_roles.includes('Extensionist')) {
      optionFunc = {
        'submitForApproval': () => {
          updateStatus('For review')
        },
        'submitEvaluationGrade': () => {
          updateStatus('Pending');
        },
        'cancelTheProposal': () => {
          updateStatus('Canceled');
        }
      }
      if (typeof optionFunc[option] !== "undefined") optionFunc[option]();
    }

    if (user_roles.includes('Chief')) {
      optionFunc = {
        'approveTheProposal': () => {
          updateStatus('For evaluation');
        },
        'rejectTheProposal': () => {
          updateStatus('Created');
        },
        'approveTheProject': () => {
          updateStatus('Approved');
        }
      }
      if (typeof optionFunc[option] !== "undefined") optionFunc[option]();
    }

  };

  return {
    setOptions,
    triggerOption
  }
})();


const AddProjectActivity = (() => {

  /**
   * * Local Variables
   */
  const addActivityModal = $('#addProjectActivity_modal');
  let validator;
  let PA_form;
  let initiated = 0;
  let project_details;

  /**
   * * Private Functions
   */

  const initProjectActivityForm = () => {
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
    addActivityModal.on('hidden.bs.modal', () => {
      PA_form.resetActivityForm();
      validator.resetForm();
    });
  }

  const handleForm = () => {
    validator = $app('#addProjectActivity_form').handleForm({
      validators: {
        title: {
          required: 'The title of the activity is required.'
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }
  
  const onFormSubmit = () => {
    const data = {
      title: 'Test',
      ...PA_form.getActivityData()
    }

    console.log(data);

    toastr.success('Submitted successfully!');
    
    addActivityModal.modal('hide');
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
  const user_roles = JSON.parse(getCookie('roles'));
  let project_details;
  let dt;
  let editValidator;
  let PA_form;
  let initialized = 0;

  // ! Simulation
  // Sample Data
  const activities = [
    {
      id: 1,
      name: 'Health Awareness and Office Productivity Tools',
      topics: [
        'Mental Health Awareness',
        'How to Cope up with the Pandemic',
        'Information Communication Technology',
      ],
      outcomes: [
        'Participants will be knowledgeable about proper mental health care',
        'Participant will know how to cope up with the pandemics',
      ]
    }, {
      id: 2,
      name: 'Media and Information Literacy and Google Apps',
      topics: [
        'Google Forms',
        'Google Docs',
        'Google Slides',
      ],
      outcomes: [
        'Lorem ipsum dolor',
        'Lorem ipsum dolor',
      ]
    }, 
  ];

  /**
	 * * Private Methods
	 */

  const handleEditForm = () => {
    editValidator = $app('#editProjectActivity_form').handleForm({
      validators: {
        title: {
          required: 'The title of the activity is required.'
        }
      },
      onSubmit: () => onEditFormSubmit()
    });
  }

  const preInitializations = () => {

    // *** Initialize Edit Activity Form *** //
    
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

    editModal.on('hidden.bs.modal', () => {

      // Reset the activity form
      PA_form.resetActivityForm();

      // Show the loaders
      $('#editProjectActivity_formGroups_loader').show();
      $('#editProjectActivity_formGroups').hide();

      // Disable buttons
      $('#editProjectActivity_form_saveBtn').attr('disabled', true);
    });
  }

  const initDataTable = async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (1) {
          dt = dtElem.DataTable({
            data: activities,
            responsive: true,
            language: DT_LANGUAGE,
            columns: [
              {
                data: 'name'
              }, {
                data: null,
                render: data => {
                  const topics = data.topics;
                  const length = topics.length;
                  if (length > 1) {
                    return `
                      <div>${ topics[0]}</div>
                      <div class="small">and ${ length - 1 } more.</div>
                    `
                  } else if (length == 1) {
                    return topics[0]
                  } else {
                    return `<div class="text-muted font-italic">No topics.</div>`
                  }
                }
              }, {
                data: null,
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
                    <div class="dropdown text-center">
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
          resolve();
        }
      }, 1500);
    });
  }

  const onEditFormSubmit = () => {
    const data = {
      ...PA_form.getActivityData()
    }
    console.log(data);
    editModal.modal('hide');
    toastr.success('A project activity has been successfully updated');
  }

  /**
	 * * Public Methods
	 */

  const reloadDataTable = () => {
    // dt.ajax.reload();
    console.log(dt);
    toastr.success('List of activities has been reloaded');
  }

  const initViewMode = async (activity_id) => {
    viewModal.modal('show');
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        const { name, topics, outcomes } = activities.find(a => a.id == activity_id);

        // Set Content
        setHTMLContent({
          '#projectActivityDetails_title': name,
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
        });

        // Hide the loaders
        $('#projectActivityDetails_loader').hide();
        $('#projectActivityDetails').show();
        resolve();
      }, 750)
    });
  }

  const initEditMode = async (activity_id) => {
    editModal.modal('show');
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        const { name, topics, outcomes } = activities.find(a => a.id == activity_id);
        
        // Set the input values
        setInputValue({'#editProjectActivity_title': name});

        // Set the topics and outcomes
        PA_form.setTopics(topics);
        PA_form.setOutcomes(outcomes);

        // Hide the loaders
        $('#editProjectActivity_formGroups_loader').hide();
        $('#editProjectActivity_formGroups').show();
        
        // Enable buttons
        $('#editProjectActivity_form_saveBtn').attr('disabled', false);

        resolve();
      }, 750);
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
      preInitializations();
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


let data;

setTimeout(() => {
  data = {
    id: 'project_id_1',
    title: 'Strengthening Resillience To Disasters and Be a Solution to Changing Environment',
    implementer: 'Polytechnic University of the Philippines, Quezon City Branch',
    start_date: "Tue May 03 2022 00:00:00 GMT+0800 (Taipei Standard Time)",
    end_date: "Tue May 04 2022 00:00:00 GMT+0800 (Taipei Standard Time)",
    impact_statement: "Consistent with the National Government Thrust, Quezon City Branch is determined to effect significant Human Development through consistent education.",
    summary: "Consistent with the National Government Thrust, Quezon City Branch is determined to effect significant Human Development through consistent education.",
    status: 'Created',
    project_team: [
      { id: 1, name: 'team_member 1' },
      { id: 2, name: 'team_member 2' },
      { id: 3, name: 'team_member 3' },
      { id: 4, name: 'team_member 4' },
      { id: 5, name: 'team_member 5' },
    ],
    target_groups: [
      { id: 1, name: 'target_group 1' },
      { id: 2, name: 'target_group 2' },
      { id: 3, name: 'target_group 3' },
      { id: 4, name: 'target_group 4' },
      { id: 5, name: 'target_group 5' },
    ],
    cooperating_agencies: [
      { id: 1, name: 'cooperating_agencies 1' },
      { id: 2, name: 'cooperating_agencies 2' },
      { id: 3, name: 'cooperating_agencies 3' },
      { id: 4, name: 'cooperating_agencies 4' },
      { id: 5, name: 'cooperating_agencies 5' },
    ],
    financial_requirements: [
      {
        id: '1',
        name: 'Operational Cost',
        items: [
          {
            budget_item: "test",
            particulars: "test",
            quantity: 10,
            estimated_cost: 20
          }, {
            budget_item: "test",
            particulars: "test",
            quantity: 20,
            estimated_cost: 5
          }, {
            budget_item: "test",
            particulars: "test",
            quantity: 20,
            estimated_cost: 5
          }, 
        ]
      }, {
          id: '2',
          name: 'Travel Cost',
          items: [
            {
              budget_item: "test",
              particulars: "test",
              quantity: 5,
              estimated_cost: 2
            }
          ]
      }, {
        id: '3',
        name: 'Supplies Cost',
        items: [
          {
            budget_item: "test",
            particulars: "test",
            quantity: 20,
            estimated_cost: 5
          }
        ]
      },
    ],
    evaluation_plans: [
      {
        outcome: 'Outcome 1',
        indicator: 'Indicator 1',
        data_collection_method: 'DCM 1',
        frequency: 'Frequency 1'
      }, {
        outcome: 'Outcome 1',
        indicator: 'Indicator 1',
        data_collection_method: 'DCM 1',
        frequency: 'Frequency 1'
      }, {
        outcome: 'Outcome 1',
        indicator: 'Indicator 1',
        data_collection_method: 'DCM 1',
        frequency: 'Frequency 1'
      }, {
        outcome: 'Outcome 1',
        indicator: 'Indicator 1',
        data_collection_method: 'DCM 1',
        frequency: 'Frequency 1'
      }
    ]
  }

  ProjectDetails.init(data);
  ProjectOptions.setOptions(data);

  if ($('#activities_dt').length) {
    AddProjectActivity.init(data);
    ProjectActivities.init(data);
  }
}, 1250);


const updateStatus = (status) => {
  data.status = status;
  ProjectDetails.loadDetails(data);
  ProjectOptions.setOptions(data);
  if ($('#activities_dt').length) {
    AddProjectActivity.init(data);
    ProjectActivities.init(data);
  }
}