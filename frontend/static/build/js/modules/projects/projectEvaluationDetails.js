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
  let evaluation_status;

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
          status: 'Approved',
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
              budget_item_category: {
                id: '1',
                name: 'Operational Cost'
              },
              budget_item: "test",
              particulars: "test",
              quantity: 10,
              estimated_cost: 20
            }, {
              budget_item_category: {
                id: '2',
                name: 'Travel Cost'
              },
              budget_item: "test",
              particulars: "test",
              quantity: 5,
              estimated_cost: 2
            }, {
              budget_item_category: {
                id: '1',
                name: 'Operational Cost'
              },
              budget_item: "test",
              particulars: "test",
              quantity: 20,
              estimated_cost: 5
            }, {
              budget_item_category: {
                id: '1',
                name: 'Operational Cost'
              },
              budget_item: "test",
              particulars: "test",
              quantity: 20,
              estimated_cost: 5
            }, {
              budget_item_category: {
                id: '3',
                name: 'Supplies Cost'
              },
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

  const getEvaluationStatus = () => {
    // ! Simulation
    evaluation_status = 'Not yet graded';
  }

  const loadHeaderDetails = () => {
    if (header.length) {
      setHTMLContent({
        '#projectDetails_header_title': data.title,
        '#projectDetails_header_implementer': data.implementer,
        '#projectDetails_header_timeframe': () => `${formatDateTime(data.start_date, 'Date')} - ${formatDateTime(data.end_date, 'Date')}`,
        '#projectDetails_header_status': () => {

          const { theme, icon } = PROJECT_EVALUATION_STATUS_STYLES[evaluation_status];
          return `
            <div class="badge badge-subtle-${theme} py-1 px-2">
              <i class="${icon} fa-fw mr-1"></i>
              <span>${evaluation_status}</span>
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

          // Create a new object that holds financial requirements grouped by line item budget
          let frObj = {};
          let budgetItemCategoryList = [];

          // Group the requirements according to line item budget
          fr.forEach(r => {

            // Create a copy of object
            let requirement = { ...r };

            // Get the budget item category id
            const bic_id = requirement.budget_item_category.id;

            // Create a key with empty array if line item budget key not yet exist
            if (!(frObj[bic_id])) {
              frObj[bic_id] = [];
              budgetItemCategoryList.push(requirement.budget_item_category);
            }

            // Remove the budget_item_category in object
            delete requirement.budget_item_category;

            // Push the object according to key
            frObj[bic_id].push(requirement);
          });

          let financialRequirementRows = '';
          let overallAmount = 0;

          // Read the object for rendering in the DOM
          Object.keys(frObj).forEach(key => {

            // Create the line item budget row
            financialRequirementRows += `
              <tr style="background-color: #f6f6f6">
                <td 
                  class="font-weight-bold"
                  colspan="5"
                >${budgetItemCategoryList.find(x => x.id == key).name}</td>
              </tr>
            `;

            // Create the budget item rows
            frObj[key].forEach(r => {
              const { budget_item, particulars, quantity, estimated_cost } = r;
              const totalAmount = quantity * estimated_cost;

              overallAmount += totalAmount;

              financialRequirementRows += `
                <tr>
                  <td>${budget_item}</td>
                  <td>${particulars}</td>
                  <td class="text-right">${quantity}</td>
                  <td class="text-right">${formatToPeso(estimated_cost)}</td>
                  <td class="text-right">${formatToPeso(totalAmount)}</td>
                </tr>
              `
            });
          });

          financialRequirementRows += `
            <tr class="font-weight-bold">
              <td colspan="4" class="text-right">Overall Amount</td>
              <td class="text-right">${formatToPeso(overallAmount)}</td>
            </tr>
          `;

          return financialRequirementRows;
        }
      });

      $('#projectDetails_navTabs').show();
    }
  }

  const setOptions = () => {

    const optionCategories = [
      {
        id: 'Project Activities',
        header: `<div class="dropdown-header">Project Activities</div>`
      }, {
        id: 'Project Details',
        header: `<div class="dropdown-header">Project Details</div>`
      }, 
      // {
      //   id: 'For Project Evaluation',
      //   header: `<div class="dropdown-header">Project Evaluation</div>`
      // }, {
      //   id: 'Others',
      //   header: `<div class="dropdown-header">Others</div>`
      // }
    ]

    const optionsDict = [
      {
        id: 'View activities',
        category: 'Project Activities',
        template: `
          <button
            class="btn btn-negative btn-block text-left" 
            onclick="location.replace('${ BASE_URL_WEB }/p/project-evaluation/${ id }/activities')"
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
            onclick="location.replace('${ BASE_URL_WEB }/p/project-evaluation/${ id }')"
          >
            <i class="fas fa-list text-primary fa-fw mr-1"></i>
            <span>View project details</span>
          </button>
        `
      }, 
      // {
      //   id: 'Evaluate the project',
      //   category: 'For Project Evaluation',
      //   template: `
      //     <button 
      //     type="button"
      //     class="btn btn-outline-info btn-block text-left" 
      //     onclick=""
      //   >
      //     <i class="fas fa-list-alt fa-fw mr-1"></i>
      //     <span>Evaluation of project</span>
      //   </button>
      //   `
      // }
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
      'Not yet graded': () => {
        if (body.length) {
          setHTMLContent(options, getOptionList([
            'View activities',
            // 'Evaluate the project'
          ]));
        }
        if (activitiesDT.length) {
          setHTMLContent(options, getOptionList([
            'View project details',
            // 'Evaluate the project'
          ]));
        }
      }
    }

    // Set the options based on status
    optionsTemplate[evaluation_status] !== "undefined"
      ? optionsTemplate[evaluation_status]()
      : console.error('No key with the same status for optionsTemplate');
  }

  const triggerOption = (option) => {
    const optionFunc = {
      'EvaluateTheProject': () => {
        data.status = 'Not yet started';
        setOptions(); 
        loadHeaderDetails();
        loadDetails();
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
    getEvaluationStatus();
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
    // triggerOption
  }
})();

ProjectDetails.init();