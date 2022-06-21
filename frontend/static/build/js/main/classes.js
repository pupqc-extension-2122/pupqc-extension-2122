/**
 * ============================================================================
 * * CLASSES
 * ============================================================================
 */

'use strict';


// *** FOR AUTOMATED FORMS *** //


class ProjectTeamForm {
	constructor(selector, params = {
		buttons: {
			add: '',
		}
	}) {

		// *** Defaults *** //

		const FORM = `[data-form="projectTeam"]`;
		const BUTTONS = {
			ADD: `[data-team-member-btn="add"]`,
		}

		// *** Setting up properties *** //

		this.form = $(selector || FORM);
		this.projectTeam = [];

		const { buttons: btn } = params;

		this.btn = {
			add: this.form.find(btn.add || BUTTONS.ADD),
		}

		this.data = {

			// Form group id
			formGroupId: 'data-team-member-form-group-id',

			// Input(s)
			teamMemberInput: 'data-team-member-input',

			// Remove form group button
			removeFormGroupBtn: 'data-team-member-remove-form-group-btn',

			// Modal
			modal: 'data-team-member-modal'
		}

		this.#initializations();
	}

	/**
	 * * Template Literals
	 * o--/[=================>
	 */

	#addTeamMemberFormGroup = formGroupId => `
    <div class="form-group mb-2" ${this.data.formGroupId}="${formGroupId}">
			<div class="d-flex align-items-center">
				<div class="px-2 mr-2">●</div>
				<div class="w-100 mr-2">
					<input 
						type="text" 
						class="form-control" 
						name="team_member-${formGroupId}" 
						${this.data.teamMemberInput}="${formGroupId}"
						placeholder="Type the name of a team member here ..."
					/>
				</div>
				<div>
					<button 
            type="button" 
            class="btn btn-sm btn-negative text-danger"
            ${this.data.removeFormGroupBtn}="${formGroupId}"
						data-toggle="tooltip"
            title="Remove team member field"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  `

	#removeTeamMemberFieldModal = `
    <div class="modal" id="removeTeamMemberField_modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Confirmation</h4>
            <button type="button" class="btn btn-sm btn-negative" data-dismiss="modal" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="d-flex">
              <h1 class="mr-3 display-4">
                <i class="fas fa-exclamation-triangle text-warning"></i>
              </h1>
              <div>
                <div class="font-weight-bold mb-2">Remove team member field</div>
                <p>You've already entered some data here!<br>Are you sure you want to remove this team member field?<br>Your inputs can not be saved.</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-negative" data-dismiss="modal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-danger" 
              id="confirmRemoveTeamMemberField_btn"
              data-remove-target-group-field-id=""
            >Yes, I'm sure.</button>
          </div>
        </div>
      </div>
    </div>
  `

	/**
	 * * Private Methods
	 * o--/[=================>
	 */

	#initializations = () => {

		// *** Initialize the buttons *** //

		const { add: addBtn } = this.btn;

		// For add button
		addBtn.on('click', () => this.addTeamMember());

		// *** For Remove Team Member Field Modal *** //

		if (!$('#removeTeamMemberField_modal').length) {

			// Append the Remove Target Group Field Modal to the DOM
			$('body').append(this.#removeTeamMemberFieldModal);

			// Initialize the modal

			const confirmRemoveModal = $('#removeTeamMemberField_modal');
			const confirmRemoveBtn = $('#confirmRemoveTeamMemberField_btn');
			const confirmRemoveBtnData = 'data-remove-team-member-field-id';

			// When remove target group field modal will hide, reset the button attirbute value
			confirmRemoveModal.on('hide.bs.modal', () => confirmRemoveBtn.attr(confirmRemoveBtnData, ''));

			// When confirming to remove target group field
			confirmRemoveBtn.on('click', () => {

				// Get the form group id from the attribute and remove the team member
				this.removeTeamMember(confirmRemoveBtn.attr(confirmRemoveBtnData));

				// Hide the modal
				confirmRemoveModal.modal('hide');
			});
		}

		// *** Default settings *** //

		// Append a blank field
		this.addTeamMember();
	}

	#dataElement = (dataAttr, value) => this.form.find(`[${this.data[dataAttr]}="${value}"]`);

  #setAddBtnState = () => {
    this.btn.add.attr('disabled',
      this.projectTeam.some(e => {
        const val = this.#dataElement('teamMemberInput', e.id).val().trim();
        return !(val && val.length >= 5);  
      })
    );
  }

	/**
	 * * Public Methods
	 * o--/[=================>
	 */

	addTeamMember = (data = '') => {

		// *** Create and insert the row into the DOM *** //

		// Generate a unique id
		const formGroupId = uuid();

		// Push a target group object
		this.projectTeam.push({
			id: formGroupId,
			team_member: ''
		});

		// Append the form group before the last child (or add button)
		this.form.children().last().before(this.#addTeamMemberFormGroup(formGroupId));

		// *** Add the input validators *** //

		// Initiate the input
		const input = this.#dataElement('teamMemberInput', formGroupId);

		// Add validation to the input
		input.rules('add', {
			required: true,
      notEmpty: true,
			messages: { 
        required: 'A team member is required.',
        notEmpty: 'This field cannot be blank',
      }
		});

		// *** Initiate the inputs *** //

		// Get the team member if input changes
		input.on('keyup change', () => {
      this.projectTeam = this.projectTeam.map(t =>
				t.id == formGroupId ? { ...t, team_member: input.val() } : t
			);
      this.#setAddBtnState();
    });

		// *** Initiate the buttons *** //

    this.#setAddBtnState();

		const removeFormGroupBtn = this.#dataElement('removeFormGroupBtn', formGroupId);

		// Initiate the remove form group button
		removeFormGroupBtn.on('click', () => {
			if (input.val().trim()) {

				// Set the form group id in the data attribute of the modal
				$('#confirmRemoveTeamMemberField_btn').attr('data-remove-team-member-field-id', formGroupId);

				// Show the confirmation modal
				$('#removeTeamMemberField_modal').modal('show');

			}
			else if (this.projectTeam.length === 1) toastr.warning('You must input at least one team member.');
			else this.removeTeamMember(formGroupId);
		});

		// *** If has data *** //

		// Set the initial value of the input if it has
		data && input.val(data).trigger('change');
	}

	removeTeamMember = formGroupId => {

		// Immediately hide the tooltip from the remove button
		this.#dataElement('removeFormGroupBtn', formGroupId).tooltip('hide');

		// Remove the target group object based on id
		this.projectTeam = this.projectTeam.filter(x => x.id != formGroupId);

		// Remove the element from the DOM
		this.#dataElement('formGroupId', formGroupId).remove();

		// If there are no target group, add new field by default
		this.projectTeam.length === 0 && this.addTeamMember();

    this.#setAddBtnState();
	}

	setTeamMembers = (data, method = 'reset') => {
		if (data && data.length) {
			const fn = {
				'reset': () => {

					// Remove all preset form groups
					this.projectTeam.forEach(({ id }) => {

						// Immediately hide the tooltip from the remove button
						this.#dataElement('removeFormGroupBtn', id).tooltip('hide');

						// Remove the target group object based on id
						this.projectTeam = this.projectTeam.filter(x => x.id != id);

						// Remove the element from the DOM
						this.#dataElement('formGroupId', id).remove();
					});

					// Return a new form groups
					data.forEach(d => this.addTeamMember(d));
				},
				'append': () => data.forEach(d => this.addTeamMember(d)),
			}
			fn[method]();
		} else console.error('No data has been fetched');
	}

	getTeamMembers = () => [...this.projectTeam].map(x => x.team_member);
}


class TargetGroupsForm {
	constructor(selector, params = {
		buttons: {
			add: '',
		}
	}) {

		// *** Defaults *** //

		const FORM = `[data-form="targetGroups"]`;
		const BUTTONS = {
			ADD: `[data-target-groups-btn="add"]`,
		}

		// *** Setting up properties *** //

		this.form = $(selector || FORM);
		this.targetGroups = [];

		const { buttons: btn } = params;

		this.btn = {
			add: this.form.find(btn.add || BUTTONS.ADD),
		}

		this.data = {

			// Form group id
			formGroupId: 'data-target-group-form-group-id',

			// Input(s)
			targetGroupInput: 'data-target-group-input',

			// Remove form group button
			removeFormGroupBtn: 'data-target-group-remove-form-group-btn',

			// Modal
			modal: 'data-target-group-modal'
		}

		this.#initializations();
	}

	/**
	 * * Template Literals
	 * o--/[=================>
	 */

  #removeTargetGroupFieldModal = `
    <div class="modal" id="removeTargetGroupField_modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Confirmation</h4>
            <button type="button" class="btn btn-sm btn-negative" data-dismiss="modal" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="d-flex">
              <h1 class="mr-3 display-4">
                <i class="fas fa-exclamation-triangle text-warning"></i>
              </h1>
              <div>
                <div class="font-weight-bold mb-2">Remove target group field</div>
                <p>You've already entered some data here!<br>Are you sure you want to remove this target group
                  field?<br>Your inputs can not be saved.</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-negative" data-dismiss="modal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-danger" 
              id="confirmRemoveTargetGroupField_btn"
              data-remove-target-group-field-id=""
            >Yes, I'm sure.</button>
          </div>
        </div>
      </div>
    </div>
  `

	/**
	 * * Private Methods
	 * o--/[=================>
	 */

	#initializations = () => {

		// *** Initialize the buttons *** //

		const { add: addBtn, } = this.btn;

		// For add button
		addBtn.on('click', () => this.addTargetGroup());

		// *** For Remove Target Group Field Modal *** //

		if (!$('#removeTargetGroupField_modal').length) {

			// Append the Remove Target Group Field Modal to the DOM
			$('body').append(this.#removeTargetGroupFieldModal);

			const confirmRemoveModal = $('#removeTargetGroupField_modal');
			const confirmRemoveBtn = $('#confirmRemoveTargetGroupField_btn');

			// When remove target group field modal will hide, reset the button attirbute value
			confirmRemoveModal.on('hide.bs.modal', () => confirmRemoveBtn.attr('data-remove-target-group-field-id', ''));

			// When confirming to remove target group field
			confirmRemoveBtn.on('click', () => {

				// Get the form group id from the attribute and remove the target group
				this.removeTargetGroup(confirmRemoveBtn.attr('data-remove-target-group-field-id'));

				// Hide the modal
				confirmRemoveModal.modal('hide');
			});
		}

		// *** Default settings *** //

		// Append a blank field
		this.addTargetGroup();
	}

	#dataElement = (dataAttr, value) => this.form.find(`[${this.data[dataAttr]}="${value}"]`);

	#addTargetGroupFormGroup = formGroupId => `
    <div 
      class="form-group mb-2"
      ${this.data.formGroupId}="${formGroupId}"
    >
      <div class="d-flex align-items-center">
        <div class="px-2 mr-2">●</div>
        <div class="w-100 mr-2">
          <input 
            type="text" 
            class="form-control" 
            name="target_group-${formGroupId}" 
            ${this.data.targetGroupInput}="${formGroupId}"
            placeholder="Type the name of the target group here ..."
          />
        </div>
        <div>
          <button 
            type="button" 
            class="btn btn-sm btn-negative text-danger"
            ${this.data.removeFormGroupBtn}="${formGroupId}"
						data-toggle="tooltip"
            title="Remove target group field"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  `

  #setAddBtnState = () => {
    this.btn.add.attr('disabled',
      this.targetGroups.some(e => {
        const val = this.#dataElement('targetGroupInput', e.id).val().trim();
        return !(val && val.length >= 5);  
      })
    );
  }

	/**
	 * * Public Methods
	 * o--/[=================>
	 */

	addTargetGroup = (data = '') => {

		// *** Create and insert the row into the DOM *** //

		// Generate a unique id
		const formGroupId = uuid();

		// Push a target group object
		this.targetGroups.push({
			id: formGroupId,
			target_group: data
		});

		// Append the form group before the last child (or add button)
		this.form.children().last().before(this.#addTargetGroupFormGroup(formGroupId));

		// *** Add the input validators *** //

		// Initiate the input
		const input = this.#dataElement('targetGroupInput', formGroupId);

		// Add validation to the input
		input.rules('add', {
			required: true,
      notEmpty: true,
			messages: { 
        required: 'The name of the target group is required.',
        notEmpty: 'This field cannot be blank',
      }
		});

		// *** Initiate the inputs *** //

		// Get the target group name if input changes
		input.on('keyup change', () => {
      this.#setAddBtnState();
			this.targetGroups = this.targetGroups.map(t =>
				t.id == formGroupId ? { ...t, target_group: input.val() } : t
			);
    });

		// *** Initiate the buttons *** //

    this.#setAddBtnState();

		const removeFormGroupBtn = this.#dataElement('removeFormGroupBtn', formGroupId);

		// Initiate the remove form group button
		removeFormGroupBtn.on('click', () => {
			if (this.#dataElement('targetGroupInput', formGroupId).val().trim()) {

				// Set the form group id in the data attribute of the modal
				$('#confirmRemoveTargetGroupField_btn').attr('data-remove-target-group-field-id', formGroupId);

				// Show the confirmation modal
				$('#removeTargetGroupField_modal').modal('show');

			}
			else if (this.targetGroups.length === 1) toastr.warning('You must input at least one target group.');
			else this.removeTargetGroup(formGroupId);
		});

		// Set the initial value of the input if it has data
		data && input.val(data).trigger('change');

	}

	removeTargetGroup = formGroupId => {

		// Immediately hide the tooltip from the remove button
		this.#dataElement('removeFormGroupBtn', formGroupId).tooltip('hide');

		// Remove the target group object based on id
		this.targetGroups = this.targetGroups.filter(x => x.id != formGroupId);

		// Remove the element from the DOM
		this.#dataElement('formGroupId', formGroupId).remove();

		// If there are no target group, add new field by default
		this.targetGroups.length === 0 && this.addTargetGroup();

    this.#setAddBtnState();
	}

	setTargetGroups = (data, method = 'reset') => {
		if (data && data.length) {
			const fn = {
				'reset': () => {

					// Remove all preset form groups
					this.targetGroups.forEach(({ id }) => {

						// Immediately hide the tooltip from the remove button
						this.#dataElement('removeFormGroupBtn', id).tooltip('hide');

						// Remove the target group object based on id
						this.targetGroups = this.targetGroups.filter(x => x.id != id);

						// Remove the element from the DOM
						this.#dataElement('formGroupId', id).remove();
					});

					// Return a new form groups
					data.forEach(d => this.addTargetGroup(d));
				},
				'append': () => data.forEach(d => this.addTargetGroup(d)),
			}
			fn[method]();
		} else console.error('No data has been fetched');
	}

	getTargetGroups = () => [...this.targetGroups].map(x => x.target_group);
}


class CooperatingAgenciesForm {
	constructor(formGroup, selectElem) {
		this.formGroup = $(formGroup);
		this.selectElem = $(selectElem);

		this.CA_list = [];
		this.CA_selected = [];

		this.data = {
			formGroup: 'data-cooperating-agency-selected',
			removeBtn: 'data-remove-cooperating-agency',
			formElem: 'data-cooperating-agency-form'
		}

		this.#initializations();
	}

	/**
	 * * Template Literals
	 * o--/[=================>
	 */

	#empty = () => `
		<div class="py-5 text-muted text-center" ${ this.data.formElem }="emptyTemplate">
			Please select at least one cooperating agency. We are going to display them here.
		</div>
	`

	#selected = obj => `
		<div class="form-group mb-2" ${ this.data.formGroup }="${ obj.id }">
			<div class="d-flex align-items-center">
				<div class="px-2 mr-2">●</div>
				<div class="w-100 mr-2">
					<div class="border rounded user-select-none" style="padding: .375rem .75rem; background: #e9ecef">${ obj.name }</div>
				</div>
				<div>
					<button 
						type="button" 
						class="btn btn-sm btn-negative text-danger" 
						title="Remove cooperating agency"
						${ this.data.removeBtn }="${ obj.id }"
					>
						<i class="fas fa-times"></i>
					</button>
				</div>
			</div>	
		</div>
	`

	/**
	 * * Private Methods
	 * o--/[=================>
	 */

	#dataElement = (dataAttr, value) => this.formGroup.find(`[${this.data[dataAttr]}="${value}"]`);

	#initializations = () => {

		// Initialize empty selection
		this.formGroup.append(this.#empty);

		// Initialize on select
		this.selectElem.on('select2:select', () => this.selectCooperatingAgency());
	}

	#resetSelect = () => {
		this.selectElem.empty();
		this.selectElem.append(`<option value=""></option>`);
		this.CA_list.forEach(({ id, name, selected }) =>
			this.selectElem.append(`<option value="${ id }"${ selected ? ' disabled' : '' }>${ name }</option>`)
		);
	}

	#resetEmptyTemplate = () => {
		[...this.CA_list].filter(x => x.selected).length === 0
			? this.formGroup.append(this.#empty)
			:	this.#dataElement('formElem', 'emptyTemplate').remove()
	}

	/**
	 * * Public Methods
	 * o--/[=================>
	 */

	selectCooperatingAgency = (id) => {
		const selected = id || this.selectElem.val();
		this.CA_list = this.CA_list.map(c => c.id == selected ? {...c, selected: true} : c);

		this.#resetEmptyTemplate();
		this.#resetSelect();
		
		this.formGroup.children().last().after(this.#selected(this.CA_list.find(c => c.id == selected)));

		const removeBtn = this.#dataElement('removeBtn', selected);

		removeBtn.on('click', () => {
			removeBtn.tooltip('hide');
			this.#dataElement('formGroup', selected).remove();
			this.CA_list = this.CA_list.map(c => c.id == selected ? {...c, selected: false} : c);
			this.#resetEmptyTemplate();
			this.#resetSelect();
		});
		removeBtn.tooltip(TOOLTIP_OPTIONS);
		
		this.selectElem.val('').trigger('change');
	}

	setSelectedCooperatingAgencies = (data = []) => {
		data.forEach(d => this.selectCooperatingAgency(d.id))
	}

	setCooperatingAgenciesList = (data = [], method = 'reset') => {
		const fn = {
			'reset': () => {
				if(data.length) {
					this.CA_list = data.map(ca => ca = {...ca, selected: false });
					this.#resetSelect();
				}
			}
		}
		fn[method]();
	}

	getSelectedCooperatingAgencies = () => [...this.CA_list].filter(x => x.selected).map(x => {
		let y = {...x}
		delete y.selected;
		return y;
	});
}


class FinancialRequirementsForm {
	constructor(tableForm, lineItemBudgetSelect, params = {
		buttons: {
			add: ''
		}
	}) {

		// *** Defaults **** //

		const BUTTONS = {
			ADD: '[data-financial-requirements-btn="addLineItemBudget"]'
		}

		// *** Setting up the properties *** //

		this.table = $(tableForm);
		this.select = $(lineItemBudgetSelect);

		this.lineItemBudgetList = [];
		this.requirements = [];

		// Format
		// this.requirements = [
		//     {
		//         line_item_budget_id: 1,
		//         row_id: 'rowId',
		//         budget_item: '',
		//         particulars: '',
		//         quantity: 0,
		//         estimated_cost: 0
		//     }, ...
		// ]

		const { buttons } = params;

		this.buttons = {
			add: $(buttons.add || BUTTONS.ADD)
		}

		// Data Attributes
		this.data = {

			// To identify rows that are belong to a line item budget
			lineItemBudgetId: 'data-line-item-budget-id',

			// Unique row identifier for each row inputs
			lineItemBudgetRowId: 'data-line-item-budget-row-id',

			// Button for removing entire line itme budget
			removeLineItemBudgetBtn: 'data-remove-line-item-budget-btn',

			// Button for adding a single budget item row
			addBudgetItemBtn: 'data-add-budget-item-btn',

			// Button for removing a single budget item row
			removeBudgetItemBtn: 'data-remove-budget-item-btn',

			// Unique input identifiers
			budgetItemNameInput: 'data-budget-item-name-input',
			budgetItemParticularsInput: 'data-budget-item-particulars-input',
			budgetItemQtyInput: 'data-budget-item-qty-input',
			budgetItemCostInput: 'data-budget-item-cost-input',

			// Container for total amount
			budgetItemTotalAmount: 'data-budget-item-total-amount',
		}

		this.#initializations();
	}

	/**
	 * * Template Literals
	 * o--/[=================>
	 */

	#lineItemBudgetRow = (lineItemBudget) => `
    <tr 
      ${this.data.lineItemBudgetId}="${lineItemBudget.id}"
      style="background-color: #f6f6f6"
    >
      <td colspan="5" class="align-middle">
        <span class="font-weight-bolder">${lineItemBudget.name}</span>
      </td>
      <td class="text-center">
        <button
            type="button" 
            class="btn btn-sm btn-negative text-danger" 
            ${this.data.removeLineItemBudgetBtn}="${lineItemBudget.id}"
						data-toggle="tooltip"
            title="Remove line item budget rows"
        >
            <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `

	#budgetItemRow = (lineItemBudgetId, lineItemBudgetRowId) => `
    <tr 
      ${this.data.lineItemBudgetId}="${lineItemBudgetId}" 
      ${this.data.lineItemBudgetRowId}="${lineItemBudgetRowId}"
    > 
      <td>
        <div class="form-group">
          <input 
            type="text"
            class="form-control form-control-border"
            ${this.data.budgetItemNameInput}="${lineItemBudgetRowId}"
            name="name-${lineItemBudgetRowId}"
          />
        </div>
      </td>
      <td>
        <div class="form-group">
          <input 
            type="text" 
            class="form-control form-control-border"
            ${this.data.budgetItemParticularsInput}="${lineItemBudgetRowId}"
            name="particulars-${lineItemBudgetRowId}"
          />
        </div>
      </td>
      <td>
        <div class="form-group">
          <input 
            type="text" 
            class="form-control form-control-border"
            ${this.data.budgetItemQtyInput}="${lineItemBudgetRowId}"
            name="quantity-${lineItemBudgetRowId}"
          >
        </div>
      </td>
      <td>
        <div class="form-group">
          <input 
            type="text" 
            class="form-control form-control-border"
            ${this.data.budgetItemCostInput}="${lineItemBudgetRowId}"
            name="cost-${lineItemBudgetRowId}"
          />
        </div>
      </td>
      <td class="text-right">
        <span ${this.data.budgetItemTotalAmount}="${lineItemBudgetRowId}">&#8369;0.00</span>
      </td>
      <td class="text-center">
        <button
          type="button" 
          class="btn btn-sm btn-negative text-danger" 
          ${this.data.removeBudgetItemBtn}="${lineItemBudgetRowId}"
					data-toggle="tooltip"
          title="Remove budget item row"
        >
          <i class="fas fa-times"></i>
        </button>
      </td>
    </tr>
  `

	#addBudgetItemRow = (lineItemBudgetId) => `
    <tr ${this.data.lineItemBudgetId}="${lineItemBudgetId}">
      <td colspan="6" class="text-center">
        <button 
          type="button" 
          class="btn btn-sm btn-success" 
          ${this.data.addBudgetItemBtn}="${lineItemBudgetId}"
          data-toggle="tooltip"
          title="Add budget item row"
        >
          <i class="fas fa-plus mr-1"></i>
          <span>Add</span>
        </button>
      </td>
    </tr>
  `

	#removeLineItemBudgetModal = () => `
    <div class="modal" id="removeLineItemBudget_modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Confirmation</h4>
            <button type="button" class="btn btn-sm btn-negative" data-dismiss="modal" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="d-flex">
              <h1 class="mr-3 display-4">
                <i class="fas fa-exclamation-triangle text-warning"></i>
              </h1>
              <div>
                <div class="font-weight-bold mb-2">Remove line item budget</div>
                <p>Are you sure you want to remove the entire line item budget?<br>Your inputs can not be saved.</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-negative" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="confirmRemoveLineItemBudget_btn"
              data-remove-line-item-budget-confirm-button="">Yes, I'm sure.</button>
          </div>
        </div>
      </div>
    </div>
  `

	#removeBudgetItemModal = () => `
    <div class="modal" id="removeBudgetItem_modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Confirmation</h4>
            <button type="button" class="btn btn-sm btn-negative" data-dismiss="modal" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="d-flex">
              <h1 class="mr-3 display-4">
                <i class="fas fa-exclamation-triangle text-warning"></i>
              </h1>
              <div>
                <div class="font-weight-bold mb-2">Remove budget item</div>
                <p>You've already entered some data here!<br>Are you sure you want to remove this budget item?<br>Your
                  inputs can not be saved.</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-negative" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="confirmRemoveBudgetItem_btn" data-budget-item-id="">Yes, I'm
              sure.</button>
          </div>
        </div>
      </div>
    </div>
  `

	/**
	 * * Private Methods
	 * o--/[=================>
	 */

	#dataElement = (dataAttr, value) => {

		// If there are multiple attributes with same value
		if (typeof dataAttr === 'object') {
			let selectors = '';
			dataAttr.forEach((da, i) => {
				selectors += `[${this.data[da]}="${value}"]`;
				if (i < dataAttr.length - 1) selectors += ',';
			});
			return this.table.find(selectors);
		}

		// If there are single attribute
		return this.table.find(`[${this.data[dataAttr]}="${value}"]`);
	}

	#initializations = () => {

		// *** Initialize buttons *** //

		const { add: addBtn } = this.buttons;

		// When selecting line item budget
		addBtn.on('click', () => {

			// Get the selected line item budget
			const selected_lib = this.select.val();

			// If select2 has option
			if (selected_lib) {

				// Add line item budget rows
				this.addLineItemBudgetRows(this.lineItemBudgetList.find(l => l.id == selected_lib));

				// Reset the select2
				this.select.val("").trigger('change');
			} else toastr.warning('Please select a line item budget first.');
		});

		// *** For remove line item budget modal *** //

		if (!$('#removeLineItemBudget_modal').length) {

			// Append the modal in the body
			$('body').append(this.#removeLineItemBudgetModal());

			// Initialize the modal

			const removeLineItemBudgetModal = $('#removeLineItemBudget_modal');
			const confirmRemoveLineItemBudgetBtn = $('#confirmRemoveLineItemBudget_btn');
			const confirmRemoveLineItemBudgetBtnData = 'data-remove-line-item-budget-confirm-button';

			// When user confirm to remove line item budget
			confirmRemoveLineItemBudgetBtn.on('click', () => {

				// Remove the entire line item budget rows
				this.removeLineItemBudgetRows(confirmRemoveLineItemBudgetBtn.attr(confirmRemoveLineItemBudgetBtnData));

				// Hide the modal
				removeLineItemBudgetModal.modal('hide');
			});

			// When remove line item budget modal is hidden, set the data attribute value to none
			removeLineItemBudgetModal.on('hide.bs.modal', () => confirmRemoveLineItemBudgetBtn.attr(confirmRemoveLineItemBudgetBtnData, ''));
		}

		// *** For remove budget item modal *** //
		if (!$('#removeBudgetItem_modal').length) {

			// Append the modal in the body
			$('body').append(this.#removeBudgetItemModal());

			// Initialize the modal

			const removeBudgetItemModal = $('#removeBudgetItem_modal');
			const confirmRemoveBudgetItemBtn = $('#confirmRemoveBudgetItem_btn');
			const confirmRemoveBudgetItemBtnData = 'data-budget-item-id';

			// When user confirm to remove budget item 
			confirmRemoveBudgetItemBtn.on('click', () => {

				// Remove the budget item row
				this.removeBudgetItemRow(confirmRemoveBudgetItemBtn.attr(confirmRemoveBudgetItemBtnData));

				// Hide the modal
				removeBudgetItemModal.modal('hide');
			});

			// When remove budget item modal will hide
			removeBudgetItemModal.on('hide.bs.modal', () => confirmRemoveBudgetItemBtn.attr(confirmRemoveBudgetItemBtnData, ''));
		}

	}

	#resetSelect = () => {
		this.select.empty();
		this.select.append(`<option value=""></option>`);
	}

	#getOverallAmount = () => {

		// Get the overall amount element
		const overallAmountElem = $('#overallAmount');

		// Compute the overall amount
		let overallAmount = this.requirements.reduce((a, c) => a += c.quantity * c.estimated_cost, 0);

		// Change the overall amount in the DOM
		overallAmountElem.html(formatToPeso(overallAmount < MONEY_LIMIT ? overallAmount : MONEY_LIMIT));

		// Change the style of the overall amount if less than 0
		overallAmount < 0 || overallAmount > MONEY_LIMIT
			? overallAmountElem.addClass('text-danger')
			: overallAmountElem.removeClass('text-danger');

		return overallAmount;
	}

  #setAddBudgetItemBtn = (line_item_budget_id) => {
    this.#dataElement('addBudgetItemBtn', line_item_budget_id).attr('disabled',
      [...this.requirements]
        .filter(x => x.line_item_budget_id == line_item_budget_id)
        .some(({ row_id }) => {
          const name = this.#dataElement('budgetItemNameInput', row_id).val().trim();
          const particulars = this.#dataElement('budgetItemParticularsInput', row_id).val().trim();
          const qty = this.#dataElement('budgetItemQtyInput', row_id).val().trim();
          const cost = this.#dataElement('budgetItemCostInput', row_id).val().trim();

          return (
            !(name && name.length >= 5)
            || !(particulars && particulars.length >= 5)
            || !(qty && parseFloat(qty) > 0)
            || !(cost && parseFloat(cost) > 0)
          )
        })
    )
  }

	/**
	 * * Public Methods
	 * o--/[=================>
	 */

	setLineItemBudgetList = (data = []) => {

		// Create a copy of line item budget list
		data.forEach(d => this.lineItemBudgetList.push({ ...d, selected: false }));

		// Set the line item budget options
		this.#resetSelect();
		if (this.lineItemBudgetList.length)
			this.lineItemBudgetList.forEach(({ id, name, selected }) =>
				this.select.append(`<option value="${id}"${selected ? ' disabled' : ''}>${name}</option>`)
			);
		else this.select.append(`<option disabled>No list of line item budget yet.</option>`)
	}

	addLineItemBudgetRows(lineItemBudget, addInitialRow = true) {

		// *** Add pre-rows to the DOM *** //

		// Variables
		const { id } = lineItemBudget;

		// Update the line item budget list
		this.lineItemBudgetList = this.lineItemBudgetList.map(lib =>
			lib.id == id ? { ...lib, selected: true } : lib
		);

		// Re initialize the select2 options
		this.#resetSelect();
		this.lineItemBudgetList.forEach(({ id, name, selected }) =>
			this.select.append(`<option value="${id}"${selected ? ' disabled' : ''}>${name}</option>`)
		);

		// Hiden the Pre Add line item budget if shown
		if (this.requirements.length === 0) $('#preAddLineItemBudget').hide();

		// Append the rows before overall amount row
		const overallAmountRow = this.table.find('tbody').find('#overallAmount_row');

		// Append the line item budget row and add budget item row
		overallAmountRow.before(this.#lineItemBudgetRow(lineItemBudget));
		overallAmountRow.before(this.#addBudgetItemRow(id));

		// *** Initiate the buttons *** //

		// Get the buttons
		const addBudgetItemBtn = this.#dataElement('addBudgetItemBtn', id);
		const removeLineItemBudgetBtn = this.#dataElement('removeLineItemBudgetBtn', id);

		// Initiate the add budget item button
		addBudgetItemBtn.on('click', () => {
			this.addBudgetItemRow(id);
			addBudgetItemBtn.tooltip('hide');
		});

		// *** Add an initial budget item row *** //

		// Then add the budget item row after initiating the add button
		addInitialRow && this.addBudgetItemRow(id);

		// Initiate the remove line item budget button
		removeLineItemBudgetBtn.on('click', () => {

			// Immediately hide the tooltip if shown and button is triggered
			removeLineItemBudgetBtn.tooltip('hide');

			// Set the data value for the modal buttons
			$('#confirmRemoveLineItemBudget_btn').attr('data-remove-line-item-budget-confirm-button', id);

			// Show the modal for confirmation
			$('#removeLineItemBudget_modal').modal('show');
		});

		// Finally, scroll to the added rows for user experience
		addInitialRow && $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 0);
	}

	addBudgetItemRow(lineItemBudgetId, data = {}) {

		// *** Create and insert row into DOM *** //

		// Create a uuid for the budget item row id
		const budgetItemRowId = uuid();

		// Push an object requirement
		this.requirements.push({
			line_item_budget_id: lineItemBudgetId,
			row_id: budgetItemRowId,
			budget_item: '',
			particulars: '',
			quantity: 0,
			estimated_cost: 0
		});

		// Insert the budget item row before the last row of the line item budget
		this.#dataElement('lineItemBudgetId', lineItemBudgetId)
			.last()
			.before(this.#budgetItemRow(lineItemBudgetId, budgetItemRowId));

		// *** Add the validators for inputs *** //

		const nameInput = this.#dataElement('budgetItemNameInput', budgetItemRowId);
		const particularsInput = this.#dataElement('budgetItemParticularsInput', budgetItemRowId);
		const qtyInput = this.#dataElement('budgetItemQtyInput', budgetItemRowId);
		const costInput = this.#dataElement('budgetItemCostInput', budgetItemRowId);

		// For Budget Item Name & Particulars
		[nameInput, particularsInput].forEach(i =>
			i.rules('add', {
				required: true,
        notEmpty: true,
				messages: { 
          required: 'Required',
          notEmpty: 'Cannot be blank',
        } 
			})
		);

		// For Quantity & Estimated cost
		[qtyInput, costInput].forEach(i =>
			i.rules('add', {
				required: true,
				number: true,
				min: 1,
				max: MONEY_LIMIT,
				messages: {
					required: 'Required',
					number: 'Invalid value',
					min: 'Must be a positive value',
					max: 'Too much',
				}
			})
		);

		// *** Initiate inputs *** //

		// For budget item name
		nameInput.on('keyup change', () => {
      this.requirements = this.requirements.map(r =>
				r.row_id == budgetItemRowId && r.line_item_budget_id == lineItemBudgetId
					? { ...r, budget_item: nameInput.val() } : r
			);
      this.#setAddBudgetItemBtn(lineItemBudgetId);
    });

		// For budget item particulars
		particularsInput.on('keyup change', () => {
			this.requirements = this.requirements.map(r =>
				r.row_id == budgetItemRowId && r.line_item_budget_id == lineItemBudgetId
					? { ...r, particulars: particularsInput.val() } : r
			)
      this.#setAddBudgetItemBtn(lineItemBudgetId);
    });

		// For quantity and estimated cost
		this.#dataElement(['budgetItemQtyInput', 'budgetItemCostInput'], budgetItemRowId).on('keyup change', () => {

			// Get the quantity and estimated cost
			const qty = parseFloat(qtyInput.val()) || 0;
			const cost = parseFloat(costInput.val()) || 0;

			// Update the requirements object
			this.requirements = this.requirements.map(r =>
				r.row_id == budgetItemRowId && r.line_item_budget_id == lineItemBudgetId
					? { ...r, quantity: qty, estimated_cost: cost } : r
			);

			// Get the total amount
			const total = qty * cost;

			// Get the total amount element
			const totalAmountElement = this.#dataElement('budgetItemTotalAmount', budgetItemRowId);

			// Change the total amount in the DOM
			totalAmountElement.html(formatToPeso(total < MONEY_LIMIT ? total : MONEY_LIMIT));

			// Change the style if total amount is less than 0
			total < 0 || total > MONEY_LIMIT
				? totalAmountElement.addClass('text-danger')
				: totalAmountElement.removeClass('text-danger');

			// Get the overall amount
			this.#getOverallAmount();

      this.#setAddBudgetItemBtn(lineItemBudgetId);
		});

		// *** Initialize the buttons *** //

    this.#setAddBudgetItemBtn(lineItemBudgetId);

		// Get the remove budget item button
		const removeBudgetItemBtn = this.#dataElement('removeBudgetItemBtn', budgetItemRowId);

		// Initialize the remove budget item row button
		removeBudgetItemBtn.on('click', () => {

			// Hide the tooltip if triggered
			removeBudgetItemBtn.tooltip('hide');

			// If user already inserted some inputs, setup a confirmation

			// So check if inputs has value
			if (
        nameInput.val().trim()
        || particularsInput.val().trim()
        || qtyInput.val().trim()
        || costInput.val().trim()
      ) {

				// Set the budget item id in confirm remove button
				$('#confirmRemoveBudgetItem_btn').attr('data-budget-item-id', budgetItemRowId);

				// Show the confirmation modal
				$('#removeBudgetItem_modal').modal('show');
			} else {

				// Automatically remove the budget item row if inputs are empty
				this.removeBudgetItemRow(budgetItemRowId);
			}
		});

		// *** If has data *** //
		data.budget_item 
      && nameInput.val(data.budget_item)
      && nameInput.trigger('change');
		data.particulars 
      && particularsInput.val(data.particulars)
      && particularsInput.trigger('change');
		data.quantity 
      && qtyInput.val(data.quantity)
      && qtyInput.trigger('change');
		data.estimated_cost 
      && costInput.val(data.estimated_cost)
      && costInput.trigger('change');
	}

	removeBudgetItemRow(budgetItemRowId) {

		// Check the number of line item budget instance based on budget item row id
		const lib_id = this.requirements.find(lib => lib.row_id == budgetItemRowId).line_item_budget_id;
		const instance = this.requirements.filter(lib => lib.line_item_budget_id == lib_id).length;

		if (instance > 1) {

			// Remove the budget item row from DOM
			// if there are only 1 instance of the budget item on a line item budget
			this.#dataElement('lineItemBudgetRowId', budgetItemRowId).remove();

      // Remove the requirement object
      this.requirements = this.requirements.filter(x => x.row_id != budgetItemRowId);

      this.#setAddBudgetItemBtn(lib_id);
		} else {

			// Remove the entire line item budget rows from DOM
			this.removeLineItemBudgetRows(lib_id);
		}

		// Update the overall amount
		this.#getOverallAmount();
	}

	removeLineItemBudgetRows(lineItemBudgetId) {

		// Update the line item budget list
		this.lineItemBudgetList = this.lineItemBudgetList.map(lib =>
			lib.id == lineItemBudgetId ? { ...lib, selected: false } : lib
		);

		// Re initialize the select2 options
		this.#resetSelect();
		this.lineItemBudgetList.forEach(({ id, name, selected }) =>
			this.select.append(`<option value="${id}"${selected ? ' disabled' : ''}>${name}</option>`)
		);

		// Remove the requirement objects with the same line item budget id
		this.requirements = this.requirements.filter(x => x.line_item_budget_id != lineItemBudgetId);

		// Remove the entire rows with line item budget id
		this.#dataElement('lineItemBudgetId', lineItemBudgetId).remove();

		// Show the pre add line item budget if there are no requirements
		if (this.requirements.length === 0) $('#preAddLineItemBudget').show();

		// Update the overall amount
		this.#getOverallAmount();
	}

	setFinancialRequirements(data) {
		data.forEach(d => {
      
      let BI_category = this.lineItemBudgetList.find(x => x.name == d.category);
      this.addLineItemBudgetRows(BI_category, false);

      d.items.forEach(i => this.addBudgetItemRow(BI_category.id, i));
		});
	}

  getFinancialRequirements() {
    let requirements = [];
    this.requirements.forEach(r => {
      const category = this.lineItemBudgetList.find(x => x.id == r.line_item_budget_id);
      const r_category = requirements.find(x => x.id == category.id);
      if (!r_category) {
        requirements.push({
          id: category.id,
          category: category.name,
          items: []
        });
      }
      let item = {...r};
      delete item.row_id;
      delete item.line_item_budget_id;
      requirements.find(x => x.id == category.id).items.push(item);
    });
    return {
      requirements: requirements.map(x => {
        let y = {...x};
        delete y.id;
        return y;
      }),
      overallAmount: this.#getOverallAmount()
    };
  }
}


class EvaluationPlanForm {
	constructor(selector, params = {
		buttons: {
			add: '',
		}
	}) {

		// *** Defaults *** //

		const FORM = '[data-form="evaluationPlan"]';

		const BUTTONS = {
			ADD: '[data-evaluation-plan-btn="add"]',
		}

		// *** Setting up properties *** //

		this.form = $(selector || FORM);

		this.evaluationPlans = [];

		// Plan object
		// {
		//     row_id: '',
		//     outcome: '',
		//     indicator: '',
		//     data_collection_method: '',
		//     frequency: ''
		// }

		const { buttons } = params;

		this.btn = {
			add: $(buttons.add || BUTTONS.ADD),
		}

		this.data = {

			// Plan Row ID
			planRowId: 'data-plan-row-id',

			// Input
			outcomeInput: 'data-outcome-input',
			indicatorInput: 'data-indicator-input',
			collectionMethodInput: 'data-collection-method-input',
			frequencyInput: 'data-frequency-input',

			// Remove plan button
			removePlanBtn: 'data-remove-plan-btn'
		}

		this.#initializations();
	}

	/**
	 * * Template Literals
	 * o--/[=================>
	 */

	#planRow = planId => {
		const { planRowId, outcomeInput, indicatorInput, collectionMethodInput, frequencyInput, removePlanBtn } = this.data;
		return `
      <tr ${planRowId}="${planId}">
        <td>
          <div class="form-group">
              <input 
                type="text" 
                class="form-control form-control-border"
                autocomplete="false"
                name="outcome-${planId}"
                ${outcomeInput}="${planId}"
              />
          </div>
        </td>
        <td>
          <div class="form-group">
              <input 
                type="text" 
                class="form-control form-control-border"
                autocomplete="false"
                name="indicator-${planId}"
                ${indicatorInput}="${planId}"
              />
          </div>
        </td>
        <td>
          <div class="form-group">
              <input 
                type="text" 
                class="form-control form-control-border"
                autocomplete="false"
                name="data_collection_method-${planId}"
                ${collectionMethodInput}="${planId}"
              />
          </div>
        </td>
        <td>
          <div class="form-group">
              <input 
                type="text" 
                class="form-control form-control-border"
                autocomplete="false"
                name="frequency-${planId}"
                ${frequencyInput}="${planId}"
              />
          </div>
        </td>
        <td class="text-center">
          <button
            type="button"
            class="btn btn-sm btn-negative text-danger"
            ${removePlanBtn}="${planId}"
            title="Remove plan row"
          >
            <i class="fas fa-times"></i>
          </button>
        </td>
      </tr>
    `
	}

	#removeEvaluationPlanRowModal = `
		<div class="modal" id="removeEvaluationPlanRow_modal">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title">Confirmation</h4>
						<button type="button" class="btn btn-sm btn-negative" data-dismiss="modal" aria-label="Close">
							<i class="fas fa-times"></i>
						</button>
					</div>
					<div class="modal-body">
						<div class="d-flex">
							<h1 class="mr-3 display-4">
								<i class="fas fa-exclamation-triangle text-warning"></i>
							</h1>
							<div>
								<div class="font-weight-bold mb-2">Remove evaluation plan row</div>
								<p>You've already entered some data here!<br>Are you sure you want to remove this plan row?<br>Your inputs
									can not be saved.</p>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-negative" data-dismiss="modal">Cancel</button>
						<button type="button" class="btn btn-danger" id="confirmRemoveEvaluationPlanRow_btn" data-plan-row-id="">Yes,
							I'm sure.</button>
					</div>
				</div>
			</div>
		</div>
	`;

	/**
	 * * Private Methods
	 * o--/[=================>
	 */

	#dataElement = (dataAttr, value) => {

		// If there are multiple attributes with same value
		if (typeof dataAttr === 'object') {
			let selectors = '';
			dataAttr.forEach((da, i) => {
				selectors += `[${this.data[da]}="${value}"]`;
				if (i < dataAttr.length - 1) selectors += ',';
			});
			return this.form.find(selectors);
		}

		// If there are single attribute
		return this.form.find(`[${this.data[dataAttr]}="${value}"]`);
	}

	#initializations = () => {

		// *** Setting up buttons *** //

		const { add: addBtn } = this.btn;

		addBtn.on('click', () => this.addPlanRow());

		// *** Remove Evaluation Plan Row Modal *** //
		if(!$('#removeEvaluationPlanRow_modal').length) {

			$('body').append(this.#removeEvaluationPlanRowModal);

			const removePlanRowModal = $('#removeEvaluationPlanRow_modal');
			const removePlanRowBtn = $('#confirmRemoveEvaluationPlanRow_btn');

			removePlanRowBtn.on('click', () => {
				const planRowId = removePlanRowBtn.attr('data-plan-row-id');
				this.removePlanRow(planRowId);
				removePlanRowModal.modal('hide');
			});

			removePlanRowModal.on('hide.bs.modal', () => removePlanRowBtn.attr('data-plan-row-id', ''));
		}

		// *** Default settings *** //
		this.addPlanRow();
	}

  #setAddBtnState = () => {
    this.btn.add.attr('disabled', () => 
      this.evaluationPlans.some(({row_id}) => {
        const outcome = this.#dataElement('outcomeInput', row_id).val().trim();
        const indicator = this.#dataElement('indicatorInput', row_id).val().trim();
        const collectionMethod = this.#dataElement('collectionMethodInput', row_id).val().trim();
        const frequency = this.#dataElement('frequencyInput', row_id).val().trim();

        return (
          !(outcome && outcome.length >= 5)
          || !(indicator && outcome.length >= 5)
          || !(collectionMethod && outcome.length >= 5)
          || !(frequency && outcome.length >= 5)
        )
      })
    )
  }

	/**
	 * * Public Methods
	 * o--/[=================>
	 */

	addPlanRow = (data = {}) => {

		// *** Insert a plan row in the DOM *** //

		// Create a uuid for plan id
		const planId = uuid();

		// Append a plan object
		this.evaluationPlans.push({
			row_id: planId,
			outcome: '',
			indicator: '',
			data_collection_method: '',
			frequency: ''
		});

		// Insert the plan row in the DOM
		this.form.find('tbody').children().last().before(this.#planRow(planId));

		// *** Initiate the inputs *** //

		const outcomeInput = this.#dataElement('outcomeInput', planId);
		const indicatorInput = this.#dataElement('indicatorInput', planId);
		const collectionMethodInput = this.#dataElement('collectionMethodInput', planId);
		const frequencyInput = this.#dataElement('frequencyInput', planId);

		// *** Add the validators *** //

		[outcomeInput, indicatorInput, collectionMethodInput, frequencyInput].forEach(i =>
			i.rules('add', {
				required: true,
        notEmpty: true,
        messages: {
					required: 'Required',
          notEmpty: 'Cannot be blank',
				}
			})
		);

		// *** Inputs on keyup/change *** //

		// Get the outcome
		outcomeInput.on('keyup change', () => {
			this.evaluationPlans = this.evaluationPlans.map(p =>
				p.row_id == planId ? { ...p, outcome: outcomeInput.val() } : p
			)
      this.#setAddBtnState();
    });

		// Get the indicator
		indicatorInput.on('keyup change', () => {
			this.evaluationPlans = this.evaluationPlans.map(p =>
				p.row_id == planId ? { ...p, indicator: indicatorInput.val() } : p
			)
      this.#setAddBtnState();
    });

		// Get data collection collection method
		collectionMethodInput.on('keyup change', () => {
			this.evaluationPlans = this.evaluationPlans.map(p =>
				p.row_id == planId ? { ...p, data_collection_method: collectionMethodInput.val() } : p
			)
      this.#setAddBtnState();
    });

		// Get frequency
		frequencyInput.on('keyup change', () => {
			this.evaluationPlans = this.evaluationPlans.map(p =>
				p.row_id == planId ? { ...p, frequency: frequencyInput.val() } : p
			)
      this.#setAddBtnState();
    });

		// *** Initiate the buttons *** //

    this.#setAddBtnState();

		// Initiate the remove plan button
		const removePlanBtn = this.#dataElement('removePlanBtn', planId);

		removePlanBtn.on('click', () => {
			if (this.evaluationPlans.length == 1) {
				toastr.warning('You must have at least one record for the evaluation plan.')
			} else {

				// Check if the current row has value

				if (
          outcomeInput.val().trim() 
          || indicatorInput.val().trim() 
          || collectionMethodInput.val().trim() 
          || frequencyInput.val().trim() 
        ) {

					// Set the data attribute value in modal button
					$('#confirmRemoveEvaluationPlanRow_btn').attr('data-plan-row-id', planId);

					// Show modal
					$('#removeEvaluationPlanRow_modal').modal('show');
				} else {

					// Hide the tooltip if active
					removePlanBtn.tooltip('hide');

					// Remove the plan row
					this.removePlanRow(planId);
				}
			}
		});

		// Initiate the tooltip in remove plan button
		removePlanBtn.tooltip(TOOLTIP_OPTIONS);

		// *** If has data *** //

		data.outcome && outcomeInput.val(data.outcome).trigger('change');
		data.indicator && indicatorInput.val(data.indicator).trigger('change');
		data.data_collection_method && collectionMethodInput.val(data.data_collection_method).trigger('change');
		data.frequency && frequencyInput.val(data.frequency).trigger('change');
	}

	removePlanRow = planId => {
		
		// Remove the target group object based on id
		this.evaluationPlans = this.evaluationPlans.filter(x => x.row_id != planId);

		// Remove plan row from the DOM
		this.#dataElement('planRowId', planId).remove();

    this.#setAddBtnState();
	}

	setEvaluationPlans = (data, method = 'reset') => {
		const fn = {
			'reset': () => {

				// Remove all current rows
				this.evaluationPlans?.forEach(({ row_id }) => this.removePlanRow(row_id));

				// Add the data
				data.forEach(d => this.addPlanRow(d));
			}
		}
		fn[method]();
	}

	getEvaluationPlans = () => {
		let evaluationPlans = [];

		this.evaluationPlans.forEach(p => {

			// Create a copy of the object
			let plan = { ...p };

			// Remove the row_id
			delete plan.row_id;

			// Push the object to the array
			evaluationPlans.push(plan);
		});

		return evaluationPlans;
	}
}


class ProjectActivityForm {
	constructor(params = {
		topicsForm: {
			formGroup: '',
			buttons: {
				add: '',
			}
		},
		outcomesForm: {
			formGroup: '',
			buttons: {
				add: '',
			}
		}
	}) {
		
		this.topicsForm = params.topicsForm;
		this.outcomesForm = params.outcomesForm;
		
		this.BUTTONS = {
			topics: {
				add: $(this.topicsForm.buttons.add),
			},
			outcomes: {
				add: $(this.outcomesForm.buttons.add),
			}
		}

		this.FORM_GROUPS = {
			topics: $(this.topicsForm.formGroup),
			outcome: $(this.outcomesForm.formGroup),
		}

		this.topics = [];
		this.outcomes = [];
	
		this.data = {
			topics: {
				formGroupId: 'data-activity-topic-form-group',
				input: 'data-activity-topic-input',
				removeBtn: 'data-activity-topic-remove-btn'
			},
			outcomes: {
				formGroupId: 'data-activity-outcome-form-group',
				input: 'data-activity-outcome-input',
				removeBtn: 'data-activity-outcome-remove-btn'
			}
		}

		this.#initializations();
	}

	/**
	 * * Template Literals
	 * o--/[=================>
	 */

	#topicFormGroup = formGroupId => {
		const { formGroupId: fg, input, removeBtn } = this.data.topics;
		return `
			<div class="form-group mb-2" ${fg}="${formGroupId}">
				<div class="d-flex align-items-center">
					<div class="px-2 mr-2">●</div>
					<div class="w-100 mr-2">
						<input 
							type="text" 
							class="form-control" 
							name="topic-${formGroupId}" 
							${input}="${formGroupId}"
							placeholder="Type the topic here ..."
						/>
					</div>
					<div>
						<button 
							type="button" 
							class="btn btn-sm btn-negative text-danger"
							${removeBtn}="${formGroupId}"
							title="Remove topic field"
						>
							<i class="fas fa-times"></i>
						</button>
					</div>
				</div>
			</div>
		`
	}

	#outcomeFormGroup = formGroupId => {
		const { formGroupId: fg, input, removeBtn } = this.data.outcomes;
		return `
			<div class="form-group mb-2" ${fg}="${formGroupId}">
				<div class="d-flex align-items-center">
					<div class="px-2 mr-2">●</div>
					<div class="w-100 mr-2">
						<input 
							type="text" 
							class="form-control" 
							name="outcome-${formGroupId}" 
							${input}="${formGroupId}"
							placeholder="Type the outcome here ..."
						/>
					</div>
					<div>
						<button 
							type="button" 
							class="btn btn-sm btn-negative text-danger"
							${removeBtn}="${formGroupId}"
							title="Remove team member field"
						>
							<i class="fas fa-times"></i>
						</button>
					</div>
				</div>
			</div>
		`
	}

	#removeTopicFieldModal = `
    <div class="modal" id="removeTopicField_modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Confirmation</h4>
            <button type="button" class="btn btn-sm btn-negative" data-dismiss="modal" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="d-flex">
              <h1 class="mr-3 display-4">
                <i class="fas fa-exclamation-triangle text-warning"></i>
              </h1>
              <div>
                <div class="font-weight-bold mb-2">Remove topic field</div>
                <p>You've already entered some data here!<br>Are you sure you want to remove this topic field?<br>Your inputs can not be saved.</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-negative" data-dismiss="modal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-danger" 
              id="confirmRemoveTopicField_btn"
              data-remove-topic-field-id=""
            >Yes, I'm sure.</button>
          </div>
        </div>
      </div>
    </div>
  `
	
	/**
	 * * Private Methods
	 * o--/[=================>
	 */

	#dataElement = (obj, dataElem, value) => $(`[${ this.data[obj][dataElem] }="${ value }"]`);

	#initializations = () => {

		// *** Initialize Buttons *** //

		const { topics: topicBtn, outcomes: outcomeBtn } = this.BUTTONS;

		topicBtn.add.on('click', () => this.addTopicFormGroup());

		outcomeBtn.add.on('click', () => this.addOutcomeFormGroup());

		// *** Default Settings *** //

		this.addTopicFormGroup();
		this.addOutcomeFormGroup();

    
		// *** For Remove Topic Field Modal *** //

		if (!$('#removeTopicField_modal').length) {

			// Append the Remove Target Group Field Modal to the DOM
			$('body').append(this.#removeTopicFieldModal);

			// Initialize the modal

			const confirmRemoveModal = $('#removeTopicField_modal');
			const confirmRemoveBtn = $('#confirmRemoveTopicField_btn');
			const confirmRemoveBtnData = 'data-remove-topic-field-id';

			// When remove target group field modal will hide, reset the button attirbute value
			confirmRemoveModal.on('hide.bs.modal', () => confirmRemoveBtn.attr(confirmRemoveBtnData, ''));

			// When confirming to remove target group field
			confirmRemoveBtn.on('click', () => {

				// Get the form group id from the attribute and remove the team member
				this.removeTopicFormGroup(confirmRemoveBtn.attr(confirmRemoveBtnData));

				// Hide the modal
				confirmRemoveModal.modal('hide');
			});
		}

	}

  #setAddTopicBtnState = () => {
    this.BUTTONS.topics.add.attr('disabled', () =>
      this.topics.some(({id}) => { 
        const val = this.#dataElement('topics', 'input', id).val().trim();
        return !(val && val.length >= 5);
      })
    )
  }

  #setAddOutcomeBtnState = () => {
    this.BUTTONS.outcomes.add.attr('disabled', () =>
      this.outcomes.some(({id}) => {
        const val = this.#dataElement('outcomes', 'input', id).val().trim();
        return !(val && val.length >= 5);
      })
    )
  }

	/**
	 * * Public Methods
	 * o--/[=================>
	 */

	// *** ACTIVITY TOPICS *** //

	addTopicFormGroup = (data = '') => {

		// Create a uuid for the form group
		const formGroupId = uuid();
		
		// Push a topic object
		this.topics.push({
			id: formGroupId,
			topic: ''
		});

		// Create a form group
		this.FORM_GROUPS.topics.children().last().before(this.#topicFormGroup(formGroupId));

		// *** Initiate input *** //

		const input = this.#dataElement('topics', 'input', formGroupId);

		input.on('keyup change', () => {
			this.topics = this.topics.map(t => 
				t.id == formGroupId ? { ...t, topic: input.val() } : t
			)
      this.#setAddTopicBtnState();
		});

		// Add validation to the input
		input.rules('add', {
			required: true,
      notEmpty: true,
			messages: { 
        required: 'A topic is required.',
        notEmpty: 'This field cannot be blank',
      }
		});

		// *** Enable buttons *** //

    this.#setAddTopicBtnState();

		const removeBtn = this.#dataElement('topics', 'removeBtn', formGroupId);

		// When user has to remove field
		removeBtn.on('click', () => {
			if (input.val().trim()) {
        
				// Set the form group id in the data attribute of the modal
				$('#confirmRemoveTopicField_btn').attr('data-remove-topic-field-id', formGroupId);

				// Show the confirmation modal
				$('#removeTopicField_modal').modal('show');

			} else if (this.topics.length == 1) {
				toastr.warning('You must input at least one topic.');
			} else {
				this.removeTopicFormGroup(formGroupId);
			}
		});

		// *** If has data *** //
		data && input.val(data).trigger('change');
	}

	removeTopicFormGroup = (formGroupId) => {
		this.topics = this.topics.filter(t => t.id != formGroupId);
		this.#dataElement('topics', 'formGroupId', formGroupId).remove();
    
		// If there are no target group, add new field by default
		this.topics.length === 0 && this.addTopicFormGroup();

    this.#setAddTopicBtnState();
	}

	resetTopicsForm = () => {
		this.topics.forEach(t => this.removeTopicFormGroup(t.id));
		this.addTopicFormGroup();
	}

	setTopics = (data, method = 'reset') => {
		if (data && data.length) {
			const fn = {
				'reset': () => {

					// Remove all preset form groups
					this.topics.forEach(({ id }) => {

						// Immediately hide the tooltip from the remove button
						this.#dataElement('topics', 'removeBtn', id).tooltip('hide');

						// Remove the target group object based on id
						this.topics = this.topics.filter(x => x.id != id);

						// Remove the element from the DOM
						this.#dataElement('topics', 'formGroupId', id).remove();
					});

					// Return a new form groups
					data.forEach(d => this.addTopicFormGroup(d));
				},
				'append': () => data.forEach(d => this.addTopicFormGroup(d)),
			}
			fn[method]();
		} else console.error('No data has been fetched');
	}

	getTopics = () => {
		let topics = [];
		this.topics.forEach(t => topics.push(t.topic));
		return topics;
	}

	// *** ACTIVITY OUTCOMES *** //

	addOutcomeFormGroup = (data = '') => {

		// Create a uuid for the form group
		const formGroupId = uuid();
		
		// Push a topic object
		this.outcomes.push({
			id: formGroupId,
			outcome: ''
		});

		// Create a form group
		this.FORM_GROUPS.outcome.children().last().before(this.#outcomeFormGroup(formGroupId));

		// *** Initiate input *** //

		const input = this.#dataElement('outcomes', 'input', formGroupId);

		input.on('keyup change', () => {
			this.outcomes = this.outcomes.map(t => 
				t.id == formGroupId ? { ...t, outcome: input.val() } : t
			);
      this.#setAddOutcomeBtnState();
    });

		// Add validation to the input
		input.rules('add', {
			required: true,
			notEmpty: true,
      messages: { 
        required: 'An outcome statement is required.',
        notEmpty: 'This field cannot be blank',
      }
		});

		// *** Enable buttons *** //

    this.#setAddOutcomeBtnState();

		const removeBtn = this.#dataElement('outcomes', 'removeBtn', formGroupId);

		// When user has to remove field
		removeBtn.on('click', () => {
			if (input.val().trim) {
				toastr.warning('Has value');
			} else if (this.outcomes.length == 1) {
				toastr.warning('You must input at least one outcome.');
			} else {
				this.removeOutcomeFormGroup(formGroupId);
			}
		});

		// *** If has data *** //
		data && input.val(data).trigger('change');
	}

	removeOutcomeFormGroup = (formGroupId) => {
		this.outcomes = this.outcomes.filter(t => t.id != formGroupId);
		this.#dataElement('outcomes', 'formGroupId', formGroupId).remove();
    this.#setAddOutcomeBtnState();
	}

	resetOutcomesForm = () => {
		this.outcomes.forEach(t => this.removeOutcomeFormGroup(t.id));
		this.addOutcomeFormGroup();
	}

	setOutcomes = (data) => {
		this.outcomes.forEach(t => this.removeOutcomeFormGroup(t.id));
		data.forEach(d => this.addOutcomeFormGroup(d));
	}

	getOutcomes = () => {
		let outcomes = [];
		this.outcomes.forEach(o => outcomes.push(o.outcome));
		return outcomes;
	}

	// *** GENERAL *** //

	getActivityData = () => {
		return {
			topics: this.getTopics(),
			outcomes: this.getOutcomes()
		}
	}

	resetActivityForm = () => {
		this.resetTopicsForm();
		this.resetOutcomesForm();
	}
}