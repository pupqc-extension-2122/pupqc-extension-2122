/**
 * ==============================================
 * * EDIT PROJECT PROPOSAL
 * ==============================================
 */

'use strict';

(() => {

	/**
	 * * Local Variables
	 * o--/[=================>
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
			if($(formSelector).valid()) {
				if(currentStep == 0 && CA_form.getSelectedCooperatingAgencies().length == 0) {
					toastr.warning('Please add at least one cooperating agency');
				} else if(currentStep == 1 && FR_form.requirements.length == 0) {
					toastr.warning('Please add at least one line item budget');
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
		PT_form = new ProjectTeamForm('#editProject_projectTeam_grp', {
			buttons: {
				add: '#addTeamMember_btn',
				clear: '#clearProjectTeamEmptyFields_btn'
			}
		});
	}

	const initTargetGroupForm = () => {
		TG_form = new TargetGroupsForm('#editProject_targetGroups_grp', {
			buttons: {
				add: '#addTargetGroup_btn',
				clear: '#clearTargetGroupEmptyFields_btn'
			}
		});
	}

	const initCooperatingAgenciesGroupForm = () => {
		const cooperating_agencies_list = [
			{
				id: 1,
				name: 'coop_agency 1'
			}, {
				id: 2,
				name: 'coop_agency 2'
			}, {
				id: 3,
				name: 'coop_agency 3'
			}, {
				id: 4,
				name: 'coop_agency 4'
			}, {
				id: 5,
				name: 'coop_agency 5'
			},  {
				id: 6,
				name: 'coop_agency 6'
			},  {
				id: 7,
				name: 'coop_agency 7'
			},  {
				id: 8,
				name: 'coop_agency 8'
			},  {
				id: 9,
				name: 'coop_agency 9'
			},  {
				id: 10,
				name: 'coop_agency test 10'
			}, 
		];

		cooperatingAgencies_list = [...cooperating_agencies_list];

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
				clear: '#evaluationPlan_clearEmptyFields_btn'
			}
		});
	}

	const handleForm = () => {
		$app(formSelector).handleForm({
			validators: {
				title: {
					required: "The title of the project is required.",
				},
				implementer: {
					required: "The implementer is required.",
				},
				start_date: {
					required: "Please select a date when the project will start.",
					beforeDateTimeSelector: {
						rule: '#editProject_endDate',
						message: 'Start date must be before end date'
					}
				},
				end_date: {
					required: "Please select a date when the project will end.",
					afterDateTimeSelector: {
						rule: '#editProject_startDate',
						message: 'End date must be after start date'
					}
				},
				impact_statement: {
					required: "Please compose the impact statement here."
				},
				summary: {
					required: "Please compose the project summary here."
				}
			},
			onSubmit: () => {
				const data = getProjectDetailsData();
				console.log(data);

				toastr.success("Submitted successfully!");
			}
		});
	}

	const getProjectDetailsData = () => {
		const formData = new FormData($(formSelector)[0]);
		return {
			title: formData.get('title'),
			implementer: formData.get('implementer'),
			project_team: PT_form.getTeamMembers(),
			target_groups: TG_form.getTargetGroups(),
			cooperating_agencies: CA_form.getSelectedCooperatingAgencies(),
			start_date: '' || new Date(formData.get('start_date')),
			end_date: '' || new Date(formData.get('end_date')),
			impact_statement: formData.get('impact_statement'),
			summary: formData.get('summary'),
			financial_requirements: FR_form.getFinancialRequirements().requirements,
			evaluation_plans: EP_form.getEvaluationPlans()
		}
	}

	const loadProjectDetails = () => {
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
		} = getProjectDetailsData();

		const noContentTemplate = (message) => `<div class="text-muted font-italic">${ message }</div>`;

		setHTMLContent({
			'#projectDetailsConfirm_title': title || noContentTemplate('No title has been set up'),
			'#projectDetailsConfirm_implementer': implementer || noContentTemplate('No implementer has been set up.'),
			'#projectDetailsConfirm_projectTeam': () => {
				if (pt.length) {
					let list = '<ul class="mb-0">';
					pt.forEach(p => list += `<li>${p.team_member}</li>`);
					list += '</ul>';
					return list;
				}
				return noContentTemplate('No project team been set up.');
			},
			'#projectDetailsConfirm_targetGroups': () => {
				if (tg.length) {
					let list = '<ul class="mb-0">';
					tg.forEach(t => list += `<li>${t.name}</li>`);
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
					return `
						<div>${formatDateTime(start_date, 'Date')} - ${formatDateTime(end_date, 'Date')}</div>
						<div class="small">Approximately ${moment(start_date).to(moment(end_date), true)}.</div>
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

				// Create a new object that holds financial requirements grouped by line item budget
				let frObj = {};
				
				// Group the requirements according to line item budget
				fr.forEach(r => {

					// Create a copy of object
					let requirement = {...r};

					// Get the line item budget id
					const id = requirement.line_item_budget_id;
					
					// Create a key with empty array if line item budget key not yet exist
					if (!(id in frObj)) frObj[id] = [];
					
					// Remove the line_item_budget_id key in object
					delete requirement.line_item_budget_id;

					// Push the object according to key
					frObj[id].push(requirement);
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
							>${ lineItemBudget_list.find(x => x.id == key).name }</td>
						</tr>
					`;

					// Create the budget item rows
					frObj[key].forEach(r => {
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
	}

  const setInputValues = () => {

    // Sample Data
    const data = {
      title: 'Strengthening Resilience To Disasters and Be a Solution to Changing Environment',
      implementer: 'Polytechnic University of the Philippines, Quezon City Branch',
      start_date: "Tue May 03 2022 00:00:00 GMT+0800 (Taipei Standard Time)",
      end_date: "Tue May 04 2022 00:00:00 GMT+0800 (Taipei Standard Time)",
      impact_statement: "Consistent with the National Government Thrust, Quezon City Branch is determined to effect significant Human Development through consistent education.",
      summary: "Consistent with the National Government Thrust, Quezon City Branch is determined to effect significant Human Development through consistent education.",
      project_team: [
        { id: 1, team_member: 'team_member 1' },
        { id: 2, team_member: 'team_member 2' },
        { id: 3, team_member: 'team_member 3' },
        { id: 4, team_member: 'team_member 4' },
        { id: 5, team_member: 'team_member 5' },
      ],
      target_groups: [
        { id: 1, target_group: 'target_group 1' },
        { id: 2, target_group: 'target_group 2' },
        { id: 3, target_group: 'target_group 3' },
        { id: 4, target_group: 'target_group 4' },
        { id: 5, target_group: 'target_group 5' },
      ],
      cooperating_agencies: [
        { id: 1, cooperating_agency: 'cooperating_agencies 1' },
        { id: 2, cooperating_agency: 'cooperating_agencies 2' },
        { id: 3, cooperating_agency: 'cooperating_agencies 3' },
        { id: 4, cooperating_agency: 'cooperating_agencies 4' },
        { id: 5, cooperating_agency: 'cooperating_agencies 5' },
      ],
      // financialRequirements: [
      //   {
      //     id: 1,
      //     name: 'Operation Cost',
      //     items: [
      //       {
      //         budget_item: "test",
      //         particulars: "test",
      //         quantity: 10,
      //         estimated_cost: 20
      //       },
      //     ]
      //   },
      // ],
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

    setInputValue({
      '#editProject_projectTitle': data.title,
      '#editProject_implementer': data.implementer,
      '#editProject_startDate': new Date(data.start_date),
      '#editProject_endDate': new Date(data.end_date),
      '#editProject_impactStatement': data.impact_statement,
      '#editProject_summary': data.summary,
    });

    ['#editProject_startDate', '#editProject_endDate'].forEach(s => $(s).trigger('change'));

    PT_form.setTeamMembers(data.project_team);
    TG_form.setTargetGroups(data.target_groups);
    CA_form.setSelectedCooperatingAgencies(data.cooperating_agencies);
		FR_form.setFinancialRequirements(data.financial_requirements);
    EP_form.setEvaluationPlans(data.evaluation_plans);
  }

	/**
	 * * On DOM load
	 * o--/[=================>
	 */
	return {
		load: () => {
			if($(formSelector).length) {
				initializations();
				handleStepper();
				handleForm();
				initProjectTeamForm();
				initTargetGroupForm();
				initCooperatingAgenciesGroupForm();
				initFinancialRequirementsForm();
				initEvaluationPlanForm();
        setInputValues();
			}
		},
	}
})().load();
