/**
 * ==============================================
 * * PROJECT ACTIVITIES
 * ==============================================
 */

'use strict';

const ProjectDetails = (() => {

  /**
   * * Local Variables
   */

  const header = $('#projectDetails_header');
  const body = $('#projectDetails_body');
  const activitiesDT = $('#activities_dt');
  const options = '#projectDetails_options';
  let initialized = 0;
  let id;

  // Data Container
  let data;

  /**
   * * Private Functions
   */

  const getIdFromURL = async () => {
    id = location.pathname.split('/')[3];
  }

  const getData = async () => {

    // ! Simulation
    await new Promise((resolve, reject) => {
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
              line_item_budget_id: 1,
              budget_item: "test",
              particulars: "test",
              quantity: 10,
              estimated_cost: 20
            }, {
              line_item_budget_id: 2,
              budget_item: "test",
              particulars: "test",
              quantity: 5,
              estimated_cost: 2
            }, {
              line_item_budget_id: 1,
              budget_item: "test",
              particulars: "test",
              quantity: 20,
              estimated_cost: 5
            }, {
              line_item_budget_id: 1,
              budget_item: "test",
              particulars: "test",
              quantity: 20,
              estimated_cost: 5
            }, {
              line_item_budget_id: 3,
              budget_item: "test",
              particulars: "test",
              quantity: 20,
              estimated_cost: 5
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
        resolve();
      }, 1250);
    });
  }

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

          // // Group the requirements according to line item budget
          // fr.forEach(r => {

          //   // Create a copy of object
          //   let requirement = {...r};

          //   // Get the line item budget id
          //   const id = requirement.line_item_budget_id;

          //   // Create a key with empty array if line item budget key not yet exist
          //   if (!(id in frObj)) frObj[id] = [];

          //   // Remove the line_item_budget_id key in object
          //   delete requirement.line_item_budget_id;

          //   // Push the object according to key
          //   frObj[id].push(requirement);
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
          //       >${ lineItemBudget_list.find(x => x.id == key).name }</td>
          //     </tr>
          //   `;

          //   // Create the budget item rows
          //   frObj[key].forEach(r => {
          //     const { budget_item, particulars, quantity, estimated_cost } = r;
          //     const totalAmount = quantity * estimated_cost;

          //     overallAmount += totalAmount;

          //     financialRequirementRows += `
          //       <tr>
          //         <td>${ budget_item }</td>
          //         <td>${ particulars }</td>
          //         <td class="text-right">${ quantity }</td>
          //         <td class="text-right">${ formatToPeso(estimated_cost) }</td>
          //         <td class="text-right">${ formatToPeso(totalAmount) }</td>
          //       </tr>
          //     `
          //   });
          // });

          // financialRequirementRows += `
          //   <tr class="font-weight-bold">
          //     <td colspan="4" class="text-right">Overall Amount</td>
          //     <td class="text-right">${ formatToPeso(overallAmount) }</td>
          //   </tr>
          // `;

          return 'Test';
        }
      });

      $('#projectDetails_navTabs').show();
    }
  }

  const setOptions = () => {

    // Get the status
    const { status } = data;

    const optionCategories = [
      {
        id: 'Project Activities',
        header: `<div class="dropdown-header">Project Activities</div>`
      }, {
        id: 'Project Details',
        header: `<div class="dropdown-header">Project Details</div>`
      }, {
        id: 'For Submission',
        header: `<div class="dropdown-header">For Submission</div>`
      }, {
        id: 'Others',
        header: `<div class="dropdown-header">Others</div>`
      }
    ]

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
          <button
            class="btn btn-negative btn-block text-left" 
            onclick="location.replace('${ BASE_URL_WEB }/p/project-proposals/${ id }/activities')"
          >
            <i class="fas fa-list text-primary fa-fw mr-1"></i>
            <span>View activities</span>
          </button>
        `
      }, {
        id: 'View project details',
        category: 'Project Details',
        template: `
          <button
            class="btn btn-negative btn-block text-left" 
            onclick="location.replace('${ BASE_URL_WEB }/p/project-proposals/${ id }')"
          >
            <i class="fas fa-list text-primary fa-fw mr-1"></i>
            <span>View project details</span>
          </button>
        `
      }, {
        id: 'Edit project details',
        category: 'Project Details',
        template: `
          <a 
            class="btn btn-negative btn-block text-left" 
            href="${ BASE_URL_WEB }/p/edit-proposal/${ id }"
          >
            <i class="fas fa-edit text-info fa-fw mr-1"></i>
            <span>Edit details</span>
          </a>
        `
      }, {
        id: 'Submit for approval',
        category: 'For Submission',
        template: `
          <button 
            type="button"
            class="btn btn-outline-success btn-block text-left" 
            onclick="ProjectDetails.triggerOption('submitForApproval')"
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
            onclick="ProjectDetails.triggerOption('submitEvaluationGrade')"
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
            onclick="ProjectDetails.triggerOption('cancelTheProposal')"
          >
            <i class="fas fa-times-circle fa-fw mr-1"></i>
            <span>Cancel the proposal</span>
          </button>
        `
      }
    ];

    const getOptionList = (optionArr = []) => {
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
        optionList += optionCategories.find(oc => oc.id == key).header;
        optionsArr.forEach(o => optionList += optionsDict.find(od => od.id == o).template);
        if (i < entries.length-1) optionList += `<div class="dropdown-divider"></div>`
      });
      return optionList;
    }

    const optionsTemplate = {
      'Created': () => {
        if (body.length) {
          setHTMLContent(options, getOptionList([
            'View activities',
            'Edit project details',
            'Submit for approval'
          ]));
        } 
        if (activitiesDT.length) {
          setHTMLContent(options, getOptionList([
            'Add project activity',
            'View project details',
            'Edit project details',
            'Submit for approval'
          ]));
        }
      },
      'For review': () => {
        setHTMLContent(options, getOptionList([
          'View activities',
        ]));
      },
      'For evaluation': () => {
        if (body.length) {
          setHTMLContent(options, getOptionList([
            'View activities',
            'Submit evaluation grade',
          ]));
        }
        if (activitiesDT.length) {
          setHTMLContent(options, getOptionList([
            'View project details',
            'Submit evaluation grade',
          ]));
        }
      },
      'Pending': () => {
        if (body.length) {
          setHTMLContent(options, getOptionList([
            'View activities',
            'Cancel the proposal'
          ]));
        }
        if (activitiesDT.length) {
          setHTMLContent(options, getOptionList([
            'View project details',
            'Cancel the proposal'
          ]));
        }
      },
      'Canceled': () => {
        if (body.length) {
          setHTMLContent(options, getOptionList([
            'View activities',
          ]));
        }
        if (activitiesDT.length) {
          setHTMLContent(options, getOptionList([
            'View project details',
          ]));
        }
      }
    }

    // Set the options based on status
    optionsTemplate[status] !== "undefined"
      ? optionsTemplate[status]()
      : console.error('No key with the same status for optionsTemplate');
  }

  const triggerOption = (option) => {
    const optionFunc = {
      'submitForApproval': () => {
        data.status = 'For evaluation';
        setOptions(); 
        loadHeaderDetails();
        // loadDetails();
      },
      'submitEvaluationGrade': () => {
        data.status = 'Pending';
        setOptions(); 
        loadHeaderDetails();
        // loadDetails();
      },
      'cancelTheProposal': () => {
        data.status = 'Canceled';
        setOptions(); 
        loadHeaderDetails();
        // loadDetails();
      }
    }

    optionFunc[option] !== "undefined" 
      ? optionFunc[option]() 
      : console.error('No key with the same status for optionsFunc');
  };

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

  const getId = () => id;

  const loadDetails = async () => {
    await getData();
    loadHeaderDetails();
    loadBodyDetails();
    setOptions();
  }

  /**
   * * Init
   */

  const init = async () => {
    if (!initialized) {
      initialized = 1;
      getIdFromURL();
      await loadDetails();
      removeLoaders();
    }
  }

  /**
   * * Return Public Functions
   */

  return {
    init,
    getId,
    loadDetails,
    triggerOption
  }
})();

ProjectDetails.init();