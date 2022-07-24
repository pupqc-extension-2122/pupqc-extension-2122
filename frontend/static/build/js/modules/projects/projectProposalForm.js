/**
 * ==============================================
 * * PROJECT PROPOSAL FORM
 * ==============================================
 */

'use strict';

(() => {

  // * Local Variables

  const formSelector = '#projectProposal_form';
  
  const noCoopAgency_modal = $('#noCooperatingAgency_modal');
  
  const form_type = (() => {
    const path = location.pathname.split('/')[2];
    if (path === 'create-proposal') return 'create';
    if (path === 'edit-proposal') return 'edit';
  })();

  const project_id = (() => {
    if (form_type === 'edit') return location.pathname.split('/')[3];
  })();
  
  let stepper;
  let PT_form; // Project Team Form
  let TG_form; // Target Group Form
  let CA_form; // Cooperating Agencies form
  let FR_form; // Financial Requirements form
  let EP_form; // Evaluation Plan form
  let noCoopAgency_mode = false;

  // * Private Methods

  const initializations = () => {

    // Extension Project Type
    const extensionType = $('#projectProposal_extensionType');
    const extension_types = [
      {
        id: 'Livelihood',
        name: 'Livelihood',
      }, {
        id: 'Literacy/Knowledge Transfer',
        name: 'Literacy/Knowledge Transfer',
      }
    ]

    extensionType.autocomplete({
      source: extension_types.map(x => x.name),
    });

    // Implementer
    $('#projectProposal_implementer').autocomplete({
      source: ['Polytechnic University of the Philippines, Quezon City Branch'],
    });

    // Initialize Start Date
    $app('#projectProposal_startDate').initDateInput({
      button: '#projectProposal_startDate_pickerBtn'
    });

    // Initialize End Date
    $app('#projectProposal_endDate').initDateInput({
      button: '#projectProposal_endDate_pickerBtn'
    });

    // Handle Date inputs on change
    $('#projectProposal_startDate, #projectProposal_endDate').on('change', async () => {
      const start_date_elem = $('#projectProposal_startDate');
      const end_date_elem = $('#projectProposal_endDate');

      const start_date = $(start_date_elem).val();
      const end_date = $(end_date_elem).val();

      const start_date_moment = moment(start_date);
      const end_date_moment = moment(end_date);

      if (!start_date) end_date_elem.valid();
      if (!end_date) start_date_elem.valid();

      if (start_date_moment.isValid() && end_date_moment.isValid()) {
        start_date_elem.valid();
        end_date_elem.valid();
      }

      if (start_date && end_date && start_date_moment.isValid() && end_date_moment.isValid()) {
        await getPartners({ start_date, end_date });
      } else {
        const coopAgency_elem = $('#projectProposal_cooperatingAgencies_select');
        CA_form.setCooperatingAgenciesList([]);
        coopAgency_elem.empty();
        coopAgency_elem.append(`<option disabled>Please select a start and end date first.</option>`);
      }
    });

    // Monitoring Frequency
    const monitoring_frequencies = [
      // {
      //   id: 'Weekly',
      //   name: 'Weekly',
      // }, 
      {
        id: 'Quarterly',
        name: 'Quarterly',
      }, {
        id: 'Monthly',
        name: 'Monthly',
      }, {
        id: 'Semi-annually',
        name: 'Semi-annually',
      }, {
        id: 'Annually',
        name: 'Annually',
      }, 
    ];
    
    const monitoringFrequency_input = $('#projectProposal_monitoringFrequency');
    monitoringFrequency_input.empty();
    monitoringFrequency_input.append(`<option></option>`);
    monitoring_frequencies.forEach(f => monitoringFrequency_input.append(`<option value="${ f.id }">${ f.name }</option>`));


    // Monitoring Method
    const monitoring_methods = [
      'Site Visit',
      'Telephone Logs',
      'Interview',
      'Observation',
      'Survey'
    ]

    const monitoringMethod_input = $('#projectProposal_monitoringMethod');
    monitoringMethod_input.empty();
    monitoringMethod_input.append(`<option></option>`);
    monitoring_methods.forEach(m => monitoringMethod_input.append(`<option value="${ m }">${ m }</option>`));

    // $('#projectProposal_monitoringMethod').autocomplete({
    //   source: monitoring_methods,
    // });

    // If user not select coop agency

    const noCoopAgency_btn = noCoopAgency_modal.find(`[data-cooperating-agency-btn="addLater"]`);
    
    noCoopAgency_modal.on('show.bs.modal', (e) => {
      if (noCoopAgency_mode) e.preventDefault();
    });

    noCoopAgency_btn.on('click', () => {
      noCoopAgency_mode = true;
      noCoopAgency_modal.modal('hide');
      stepper.next();
    });
  }

  const handleStepper = () => {
    let currentStep = 0;
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    const submitBtn = $('#submitBtn');

    // Initialize Stepper
    stepper = new Stepper(document.querySelector('.bs-stepper'), {
      linear: true,
      animation: false,
      selectors: {
        steps: '.step',
        trigger: '.step-trigger',
        stepper: '.bs-stepper'
      }
    });

    // When next button has been clicked
    nextBtn.on('click', () => {
      // stepper.next();
      if ($(formSelector).valid()) {
        if (currentStep == 0 && CA_form.getSelectedCooperatingAgencies().length == 0) {
          !noCoopAgency_mode ? noCoopAgency_modal.modal('show') : stepper.next();
        } else if (currentStep == 1) {
          if (FR_form.requirements.length == 0)
            toastr.warning('Please add at least one line item budget');
          else if (FR_form.getFinancialRequirements().overallAmount > MONEY_LIMIT_LARGER)
            toastr.warning('The overall amount is too much');
          else 
            stepper.next();
        } else {
          stepper.next();
        }
      }
    });

    // When previous button has been clicked
    prevBtn.on('click', () => stepper.previous());

    // Handle steps
    document.getElementById('projectProposal_stepper').addEventListener('shown.bs-stepper', (event) => {

      // Update the current step
      currentStep = event.detail.to;

      // Show/Hide the buttons according to step
      if (currentStep == 0) {
        prevBtn.hide();
        submitBtn.hide();
        nextBtn.show();
      } else if (currentStep > 0 && currentStep < 3) {
        prevBtn.show();
        nextBtn.show();
        submitBtn.hide();
      } else {
        prevBtn.show();
        submitBtn.show();
        nextBtn.hide();
      }

      if (currentStep == 3) loadProjectDetailsToConfirm();
    });
  }

  const initProjectTeamForm = async () => {
    PT_form = new ProjectTeamForm();
  }

  const initTargetGroupForm = async () => {
    TG_form = new TargetGroupsForm();
  }

  const getPartners = async ({ start_date: s, end_date: e }) => {
    await $.ajax({
      url: `${ BASE_URL_API }/partners?start_date=${ s }&end_date=${ e }`,
      type: 'GET',
      success: async result => {
        if (result.error) {
          ajaxErrorHandler(result.message);
        } else {
          await CA_form.setCooperatingAgenciesList(result.data);
        }
      },
      error: (xhr, status, error) => {
        ajaxErrorHandler({
          file: 'projects/createPropsal.js',
          fn: 'onDOMLoad.getPartners()',
          details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
        });
      }
    });
  }

  const initCooperatingAgenciesGroupForm = async () => {
    // await $.ajax({
    //   url: `${ BASE_URL_API }/partners`,
    //   type: 'GET',
    //   success: res => {
    //     if (res.error) {
    //       ajaxErrorHandler(res.message);
    //     } else {
    //       cooperatingAgencies_list = res.data;
    //     }
    //   },
    //   error: () => {
    //     ajaxErrorHandler({
    //       file: 'projects/createPropsal.js',
    //       fn: 'onDOMLoad.getPartners()',
    //       xhr: xhr
    //     });
    //   }
    // });

    CA_form = await new CooperatingAgenciesForm(
      '#projectProposal_cooperatingAgencies_grp',
      '#projectProposal_cooperatingAgencies_select'
    );

    // CA_form.setCooperatingAgenciesList(cooperatingAgencies_list);
  }

  const initFinancialRequirementsForm = async () => {

    // Create an instance of financial requirements form
    FR_form = new FinancialRequirementsForm(
      '#financialRequirements_form', 
      '#financialRequirement_addLineItemBudget_select',
      {
        buttons: {
          add: '#financialRequirement_addLineItemBudget_btn'
        }
      }
    );

    await $.ajax({
      url: `${ BASE_URL_API }/budget_categories`,
      type: 'GET',
      success: res => {
        if (res.error) {
          ajaxErrorHandler(res.message);
        } else {
          FR_form.setLineItemBudgetList(res.data);
        }
      },
      error: (xhr, status, error) => {
        ajaxErrorHandler({
          file: 'projects/editProposal.js',
          fn: 'onDOMLoad.handleForm()',
          xhr: xhr
        });
      }
    });
  }

  const initEvaluationPlanForm = async () => {

    // Create a new instance of evaluation plan form
    EP_form = new EvaluationPlanForm('#evaluationPlan_form', {
      buttons: {
        add: '#evaluationPlan_addPlan_btn',
      }
    });
  }

  const handleForm = () => {
    $app(formSelector).handleForm({
      validators: {
        title: {
          required: "The title of the project is required.",
          notEmpty: "This field cannot be empty.",
          minlength: {
            rule: 5,
            message: 'Make sure you  enter the full title of the project.'
          }
        },
        extension_type: {
          required: "Please select an extension project type.",
        },
        implementer: {
          required: "The implementer is required.",
          notEmpty: "This field cannot be empty.",
          minlength: {
            rule: 5,
            message: 'Make sure you enter the full name of the implementer.'
          }
        },
        start_date: {
          required: "Please select a date when the project will start.",
          dateISO: 'Your input is not a valid date.',
          beforeDateTimeSelector: {
            rule: '#projectProposal_endDate',
            message: 'The start date must be earlier that the end date.'
          }
        },
        end_date: {
          required: "Please select a date when the project will end.",
          dateISO: 'Your input is not a valid date.',
          afterDateTimeSelector: {
            rule: '#projectProposal_startDate',
            message: 'The end date must be later than the start date.'
          }
        },
        impact_statement: {
          required: "Please compose the impact statement here.",
          notEmpty: "This field cannot be empty.",
          minlength: {
            rule: 5,
            message: 'Make sure you enter the full details for the impact statement.'
          }
        },
        summary: {
          required: "Please compose the project summary here.",
          notEmpty: "This field cannot be empty.",
          minlength: {
            rule: 5,
            message: 'Make sure you  enter the full summary of the project'
          }
        },
        monitoring_frequency: {
          required: 'Please select the frequency of project monitoring.',
        },
        monitoring_method: {
          required: 'The method of project monitoring is required.',
        },
      },
      onSubmit: async () => {
        const submitBtn = $('#submitBtn');
        const prevBtn = $('#prevBtn');

        // Set elements to loading state
        prevBtn.attr('disabled', true);
        submitBtn.attr('disabled', true);
        submitBtn.html(`
          <span class="px-3">
            <i class="fas fa-spinner fa-spin-pulse"></i>
          </span>
        `);

        // To enable elements
        const enableElements = () => {
          prevBtn.attr('disabled', false);
          submitBtn.attr('disabled', false);
          submitBtn.html('Submit');
        }

        // Get the data
        let data = getProjectDetailsData();

        // Create the partner_id array and delete the cooperating_agencies
        data.partner_id = data.cooperating_agencies.map(p => p.id);
        delete data.cooperating_agencies;

        if (data.partner_id.length === 0) data.partner_id = [].toString();

        await $.ajax({
          ...(() => {
            if (form_type === 'create') return {
              url: `${ BASE_URL_API }/projects/create`,
              type: 'POST'
            }

            if (form_type === 'edit') return {
              url: `${ BASE_URL_API }/projects/${ project_id }`,
              type: 'PUT'
            }
          })(),
          data: data,
          success: res => {
            if (res.error) {
              ajaxErrorHandler(res.message);
              enableElements();
            } else {

              // Set session alert
              
              if (form_type === 'create') {
                setSessionAlert(`${ BASE_URL_WEB }/p/proposals/${ res.data.id }`, {
                  theme: 'success',
                  message: 'A new proposal has been successfully created.'
                });
              }

              if (form_type === 'edit') {
                setSessionAlert(`${ BASE_URL_WEB }/p/proposals/${ project_id }`, {
                  theme: 'success',
                  message: `The project proposal has been successfully updated.`
                });
              }
            }
          },
          error: (xhr, status, error) => {
            enableElements();
            ajaxErrorHandler({
              file: 'projects/projectProposalForm.js',
              fn: 'onDOMLoad.handleForm()',
              xhr: xhr
            });
          }
        });
      }
    });
  }

  const getProjectDetailsData = () => {
    const fd = new FormData($(formSelector)[0]);
    return {
      title: fd.get('title'),
      project_type: fd.get('extension_type'),
      implementer: fd.get('implementer'),
      team_members: PT_form.getTeamMembers(),
      target_groups: TG_form.getTargetGroups(),
      cooperating_agencies: CA_form.getSelectedCooperatingAgencies(),
      start_date: '' || fd.get('start_date'),
      end_date: '' || fd.get('end_date'),
      impact_statement: fd.get('impact_statement'),
      summary: fd.get('summary'),
      monitoring_frequency: fd.get('monitoring_frequency'),
      monitoring_method: fd.get('monitoring_method'),
      financial_requirements: FR_form.getFinancialRequirements().requirements,
      evaluation_plans: EP_form.getEvaluationPlans()
    }
  }

  const loadProjectDetailsToConfirm = () => {
    const {
      title,
      project_type,
      implementer,
      team_members: pt,
      target_groups: tg,
      cooperating_agencies: ca,
      start_date,
      end_date,
      impact_statement,
      summary,
      monitoring_frequency,
      monitoring_method,
      financial_requirements: fr,
      evaluation_plans: ep
    } = getProjectDetailsData();

    const noContentTemplate = (message) => `<div class="text-muted font-italic">${ message }</div>`;

    setHTMLContent({
      '#projectDetailsConfirm_title': title || noContentTemplate('No title has been set up'),
      '#projectDetailsConfirm_extensionType': project_type || noContentTemplate('No project extension type has been set up.</div>'),
      '#projectDetailsConfirm_implementer': implementer || noContentTemplate('No implementer has been set up.'),
      '#projectDetailsConfirm_projectTeam': () => {
        if (pt.length) {
          let list = '<ul class="mb-0">';
          pt.forEach(({ name, role }) => {
            list += `<li>${ name ? name : noContentTemplate('Missing team member name.') }${ role ? ` - ${ role }` : '' }</li>`
          });
          list += '</ul>';
          return list;
        }
        return noContentTemplate('No project team been set up.');
      },
      '#projectDetailsConfirm_targetGroups': () => {
        if (tg.length) {
          let rows = '', total = 0;
          tg.forEach(t => {
            const { beneficiary_name: b, location: l, target: n } = t
            rows += `
              <tr>
                <td>${ b ? b : noContentTemplate('Missing beneficiary name.') }</td>
                <td>${ l ? l : noContentTemplate('The location has not been set up.') }</td>
                <td class="text-right">${ n ? n.toLocaleString(NUM_LOCALE_STRING) : noContentTemplate('--') }</td>
              </tr>
            `;
            total += n;
          });
          rows += `
            <tr class="font-weight-bold text-right" style="background-color: #f6f6f6">
              <td colspan="2">Total target beneficiaries</td>
              <td>${ total.toLocaleString(NUM_LOCALE_STRING) }</td>
            </tr>
          `
          return rows;
        }
        return noContentTemplate('No target groups have been set up.');
      },
      '#projectDetailsConfirm_cooperatingAgencies': () => {
        if (ca.length) {
          let list = '<ul class="mb-0">';
          ca.forEach(c => list += `<li>${c.name}</li>`);
          list += '</ul>';
          return list;
        }
        return noContentTemplate('No cooperating agencies have been set up.');
      },
      '#projectDetailsConfirm_timeFrame': () => {
        if (start_date && end_date) {
          const getDuration = () => {
            return moment(start_date).isSame(moment(end_date))
              ? 'in the whole day'
              : moment(start_date).to(moment(end_date), true)
          }
          return `
            <div class="ml-4 ml-lg-0 row">
              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">Start Date:</div>
              </div>
              <div class="col-8 col-lg-10">
                <div>${ moment(start_date).format('MMMM D, YYYY (dddd)') }</div>
                <div class="small text-muted">${ fromNow(start_date) }</div>
              </div>

              <div class="col-12"><div class="mt-2"></div></div>

              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">End Date:</div>
              </div>
              <div class="col-8 col-lg-10">
                <div>${ moment(end_date).format('MMMM D, YYYY (dddd)') }</div>
                <div class="small text-muted">${ fromNow(end_date) }</div>
              </div>

              <div class="col-12"><div class="mt-2"></div></div>

              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">Duration:</div>
              </div>
              <div class="col-8 col-lg-10">
                <div>Approximately ${ getDuration() }</div>
              </div>
            </div>
          `
        } else return noContentTemplate('No dates have been set up.');
      },
      '#projectDetailsConfirm_impactStatement': impact_statement || noContentTemplate('No impact statement has been set up.'),
      '#projectDetailsConfirm_summary': summary || noContentTemplate('No summary has been set up.</div>'),
      '#projectDetailsConfirm_monitoringFrequency': monitoring_frequency || noContentTemplate('No frequency of project monitoring has been set up.</div>'),
      '#projectDetailsConfirm_monitoringMethod': monitoring_method || noContentTemplate('No method of project monitoring has been set up.</div>'),
      '#projectDetailsConfirm_evaluationPlans': () => {
        if(ep.length) {
          let evaluationPlanRows = '';
          ep.forEach(p => {
            evaluationPlanRows += `
              <tr>
                <td>${ p.outcome || noContentTemplate('--') }</td>
                <td>${ p.indicator || noContentTemplate('--') }</td>
                <td>${ p.data_collection_method || noContentTemplate('--') }</td>
                <td>${ p.frequency || noContentTemplate('--') }</td>
              </tr>
            `
          });
          return evaluationPlanRows;
        } else {
          return `
            <tr>
              <td colspan="4">
                <div class="p-5 text-center">${ noContentTemplate('No evaluation plan has been set up.') }</div>
              </td>
            </tr>
          `
        }
      },
      '#projectDetailsConfirm_financialRequirements': () => {
        let financialRequirementRows = '';
        let overallAmount = 0;

        // Read the object for rendering in the DOM
        fr.forEach(requirement => {

          // Create the line item budget row
          financialRequirementRows += `
            <tr style="background-color: #f6f6f6">
              <td 
                class="font-weight-bold"
                colspan="5"
              >${ requirement.category }</td>
            </tr>
          `;

          // Create the budget item rows
          requirement.items.forEach(({ budget_item, particulars, quantity, estimated_cost }) => {
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
          <tr class="font-weight-bold" style="background-color: #f6f6f6">
            <td colspan="4" class="text-right">Overall Amount</td>
            <td class="text-right">${ formatToPeso(overallAmount) }</td>
          </tr>
        `;

        return financialRequirementRows;
      }
    });
  }

  const setInputValues = async () => {
    await $.ajax({
      url: `${ BASE_URL_API }/projects/${ project_id }`,
      type: 'GET',
      success: async result => {
        if (result.error) {
          ajaxErrorHandler(result.message);
        } else {
          const { data } = result;

          setInputValue({
            '#projectProposal_projectTitle': data.title,
            '#projectProposal_extensionType': data.project_type,
            '#projectProposal_implementer': data.implementer,
            '#projectProposal_startDate': data.start_date,
            '#projectProposal_endDate': data.end_date,
            '#projectProposal_impactStatement': data.impact_statement,
            '#projectProposal_summary': data.summary,
            '#projectProposal_monitoringFrequency': data.monitoring_frequency,
            '#projectProposal_monitoringMethod': data.monitoring_method,
          });

          [
            // '#projectProposal_startDate', 
            // '#projectProposal_endDate',
            '#projectProposal_monitoringFrequency',
            '#projectProposal_monitoringMethod',
          ].forEach(async s => await $(s).trigger('change'));

          await getPartners({
            start_date: data.start_date,
            end_date: data.end_date,
          });

          PT_form.setTeamMembers(data.team_members);
          TG_form.setTargetGroups(data.target_groups);
          CA_form.setSelectedCooperatingAgencies(data.partners);
          FR_form.setFinancialRequirements(data.financial_requirements);
          EP_form.setEvaluationPlans(data.evaluation_plans);
        }
      },
      error: (xhr, status, error) => {
        ajaxErrorHandler({
          file: 'projects/editProposal.js',
          fn: 'onDOMLoad.setInputValues()',
          xhr: xhr
        }, 1);
      }
    });
  }

  const removeLoaders = () => {
    $('#contentHeader_loader').remove();
    $('#contentHeader').show();

    $('#content_loader').remove();
    $('#projectProposal_form').show();
  }

  // * Return Public Methods

  return {
    init: async () => {
      if ($(formSelector).length) {
        initializations();
        handleStepper();
        handleForm();
        await initProjectTeamForm();
        await initTargetGroupForm();
        await initCooperatingAgenciesGroupForm();
        await initFinancialRequirementsForm();
        await initEvaluationPlanForm();
        if (form_type === 'edit') await setInputValues();
        removeLoaders();
      }
    },
  }
})().init();