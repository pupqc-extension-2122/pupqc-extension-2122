/**
 * ==============================================
 * * EDIT PROJECT PROPOSAL
 * ==============================================
 */

'use strict';

(() => {

	/**
	 * * Local Variables
	 */
	const formSelector = '#editProject_form';
	let stepper;
	let PT_form; // Project Team Form
	let TG_form; // Target Group Form
	let CA_form; // Cooperating Agencies form
	let FR_form; // Financial Requirements form
	let EP_form; // Evaluation Plan form
	let lineItemBudget_list;
	let cooperatingAgencies_list;
  let project_id;

	/**
	 * * Functions
	 */

	const initializations = () => {

		// Initialize Start Date
		$app('#editProject_startDate').initDateInput({
			button: '#editProject_startDate_pickerBtn'
		});

		// Initialize End Date
		$app('#editProject_endDate').initDateInput({
			button: '#editProject_endDate_pickerBtn'
		});

		// Handle Date inputs on change
		$('#editProject_startDate, #editProject_endDate').on('change', () => {
			$('#editProject_startDate').valid();
			$('#editProject_endDate').valid();
		});

    project_id = location.pathname.split('/')[3];
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
			if($(formSelector).valid()) {
				if(currentStep == 0 && CA_form.getSelectedCooperatingAgencies().length == 0) {
					toastr.warning('Please add at least one cooperating agency');
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
		document.getElementById('editProject_stepper').addEventListener('shown.bs-stepper', (event) => {

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

			if (currentStep == 3) loadProjectDetails();
		});
	}

	const initProjectTeamForm = () => {
		PT_form = new ProjectTeamForm();
	}

	const initTargetGroupForm = () => {
		TG_form = new TargetGroupsForm('#editProject_targetGroups_grp', {
			buttons: {
				add: '#addTargetGroup_btn',
			}
		});
	}

	const initCooperatingAgenciesGroupForm = async () => {
    await $.ajax({
      url: `${ BASE_URL_API }/partners`,
      type: 'GET',
      success: res => {
        if (res.error) {
          ajaxErrorHandler(res.message);
        } else {
          cooperatingAgencies_list = res.data;
        }
      },
      error: () => {
        ajaxErrorHandler({
          file: 'projects/createPropsal.js',
          fn: 'onDOMLoad.getPartners()',
          details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
        });
      }
    });

		CA_form = new CooperatingAgenciesForm(
			'#addProject_cooperatingAgencies_grp',
			'#addProject_cooperatingAgencies_select'
		);

		CA_form.setCooperatingAgenciesList(cooperatingAgencies_list);
	}

	const initFinancialRequirementsForm = () => {

		// Get the line item budget
		const lineItemBudget = [
			{
				id: 1,
				name: 'Operating Cost',
			}, {
				id: 2,
				name: 'Supplies',
			}, {
				id: 3,
				name: 'Communication',
			}, {
				id: 4,
				name: 'Documentation',
			}, {
				id: 5,
				name: 'Travel Cost'
			}, {
				id: 6,
				name: 'Food Expenses'
			}, {
				id: 7,
				name: 'Others'
			},
		];

		lineItemBudget_list = [...lineItemBudget];

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

		FR_form.setLineItemBudgetList(lineItemBudget_list);
	}

	const initEvaluationPlanForm = () => {

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
						rule: '#editProject_endDate',
						message: 'The start date must be earlier that the end date.'
					}
				},
				end_date: {
					required: "Please select a date when the project will end.",
          dateISO: 'Your input is not a valid date.',
					afterDateTimeSelector: {
						rule: '#editProject_startDate',
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
				}
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

        await $.ajax({
          url: `${ BASE_URL_API }/projects/${ project_id }`,
          type: 'PUT',
          data: data,
          success: result => {
            if (result.error) {
              ajaxErrorHandler(result.message);
              enableElements();
            } else {
              
              // Set session alert
              setSessionAlert(`${ BASE_URL_WEB }/p/proposals/${ project_id }`, {
                theme: 'success',
                message: 'A new proposal has been successfully updated.'
              });
            }
          },
          error: (xhr, status, error) => {
            ajaxErrorHandler({
              file: 'projects/editProposal.js',
              fn: 'onDOMLoad.handleForm()',
              details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
            });
            enableElements();
          }
        });
      }
		});
	}

	const getProjectDetailsData = () => {
		const fd = new FormData($(formSelector)[0]);
		return {
			title: fd.get('title'),
			implementer: fd.get('implementer'),
			team_members: PT_form.getTeamMembers(),
			target_groups: TG_form.getTargetGroups(),
			cooperating_agencies: CA_form.getSelectedCooperatingAgencies(),
			start_date: '' || fd.get('start_date'),
			end_date: '' || fd.get('end_date'),
			impact_statement: fd.get('impact_statement'),
			summary: fd.get('summary'),
			financial_requirements: FR_form.getFinancialRequirements().requirements,
			evaluation_plans: EP_form.getEvaluationPlans()
		}
	}

	const loadProjectDetails = () => {
		const {
			title,
			implementer,
			team_members: pt,
			target_groups: tg,
			cooperating_agencies: ca,
			start_date,
			end_date,
			impact_statement,
			summary,
			financial_requirements: fr,
			evaluation_plans: ep
		} = getProjectDetailsData();

		const noContentTemplate = (message) => `<div class="text-muted font-italic">${ message }</div>`;

		setHTMLContent({
			'#projectDetailsConfirm_title': title || noContentTemplate('No title has been set up'),
			'#projectDetailsConfirm_implementer': implementer || noContentTemplate('No implementer has been set up.'),
			'#projectDetailsConfirm_projectTeam': () => {
				if (pt.length) {
					let list = '<ul class="mb-0">';
          pt.forEach(p => list += `<li>${p.name}${ p.role ? ` - ${ p.role }` : '' }</li>`);
					list += '</ul>';
					return list;
				}
				return noContentTemplate('No project team been set up.');
			},
			'#projectDetailsConfirm_targetGroups': () => {
				if (tg.length) {
					let list = '<ul class="mb-0">';
					tg.forEach(t => list += `<li>${t}</li>`);
					list += '</ul>';
					return list;
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
      success: result => {
        if (result.error) {
          ajaxErrorHandler(result.message);
        } else {
          const data = result.data;

          setInputValue({
            '#editProject_projectTitle': data.title,
            '#editProject_implementer': data.implementer,
            '#editProject_startDate': new Date(data.start_date),
            '#editProject_endDate': new Date(data.end_date),
            '#editProject_impactStatement': data.impact_statement,
            '#editProject_summary': data.summary,
          });

          ['#editProject_startDate', '#editProject_endDate'].forEach(s => $(s).trigger('change'));

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
          details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
        }, 1);
      }
    });
  }

  const removeLoaders = () => {
    $('#contentHeader_loader').remove();
    $('#contentHeader').show();

    $('#content_loader').remove();
    $('#editProject_form').show();
  }

	/**
	 * * On DOM load
	 */
	return {
		load: async () => {
			if($(formSelector).length) {
				initializations();
				handleStepper();
				handleForm();
				initProjectTeamForm();
				initTargetGroupForm();
				await initCooperatingAgenciesGroupForm();
				initFinancialRequirementsForm();
				initEvaluationPlanForm();
        await setInputValues();
        removeLoaders();
			}
		},
	}
})().load();
