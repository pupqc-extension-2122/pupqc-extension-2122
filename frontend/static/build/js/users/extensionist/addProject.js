'use strict';

/**
 * ==============================================
 * * ADD PROJECT
 * ==============================================
 */

(() => {

    /**
     * * Global Variables
     * ==============================================
     */
    const formSelector = '#addProject_form';
    var stepper;
    var TG_form; // Target Group Form
    var FR_form; // Financial Requirements form
    var CA_form; // Cooperating Agencies form
    var lineItemBudget_list = [];
    const addLineItemBudget_select = $('#financialRequirement_addLineItemBudget_select');

    /**
     * * Functions and Clases
     * ==============================================
     */

    const initializations = () => {
        
        // Initialize Start Date
        $app('#addProject_startDate').initDateInput({
            button: '#addProject_startDate_pickerBtn'
        });
        
        // Initialize End Date
        $app('#addProject_endDate').initDateInput({
            button: '#addProject_endDate_pickerBtn'
        });

        // Handle Date inputs on change
        $('#addProject_startDate, #addProject_endDate').on('change', () => {
            $('#addProject_startDate').valid();
            $('#addProject_endDate').valid();
        });

        // Initialize summernote
        // $('#addProject__impactStatement').summernote({
        //     height: 250,
        //     placeholder: "Compose the impact statement of the project here ...",
        // });

        // On before unload
        // window.onbeforeunload = function(e) {
        //     return "Data will be lost if you leave the page, are you sure?";
        // };
    }

    const handleStepper = () => {
        let currentStep = 0;
        
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
        $('#nextBtn').on('click', () => {
            if($(formSelector).valid()) {
                if(currentStep == 0) {
                    CA_form.clearEmptyFields();
                } if(currentStep == 1 && FR_form.requirements.length == 0) {
                    toastr.warning('Please add atleast one line item budget')
                } else {
                    stepper.next();
                }
            }
        });

        // When previous button has been clicked
        $('#prevBtn').on('click', () => stepper.previous());

        // Handle steps
        document.getElementById('addProject_stepper').addEventListener('shown.bs-stepper', (event) => {
            currentStep = event.detail.to;
            if(currentStep == 0) {
                $('#prevBtn').hide();
                $('#submitBtn').hide();

                $('#nextBtn').show();
            } else if(currentStep > 0 && currentStep < 2) {
                $('#prevBtn').show();
                $('#nextBtn').show();

                $('#submitBtn').hide();
            } else {
                $('#prevBtn').show();
                $('#submitBtn').show();

                $('#nextBtn').hide();
            }
        })
    }

    class TagetGroupsForm {

        constructor(selector) {
            this.form = $(selector);
            this.targetGroups = [];

            this.data = {

                // Form group id
                formGroupId: 'data-target-group-form-group-id',

                // Input
                targetGroupInput: 'data-target-group-input',

                // Remove form group button
                removeFormGroupBtn: 'data-target-group-remove-form-group-btn'
                
            }
        }

        /**
         * Private Methods
         */

        #dataElement = (dataAttr, value) => {

            // If there are multiple attributes with same value
            if(typeof dataAttr === 'object') {
                let selectors = '';
                dataAttr.forEach((da, i) => {
                    selectors += `[${this.data[da]}="${value}"]`;
                    if(i < dataAttr.length-1) selectors += ', ';
                });
                return this.form.find(selectors);
            }
            
            // If there are single attribute
            return this.form.find(`[${this.data[dataAttr]}="${value}"]`);
        }

        #addTargetGroupFormGroup = (formGroupId) => `
            <div 
                class="form-group mb-2"
                ${ this.data.formGroupId }="${ formGroupId }"
            >
                <div class="d-flex align-items-center">
                    <div class="px-2 mr-2">&bull;</div>
                    <div class="w-100 mr-2">
                        <input 
                            type="text" 
                            class="form-control" 
                            name="target_group-${ formGroupId }" 
                            ${ this.data.targetGroupInput }="${ formGroupId }"
                            placeholder="Type the name of the target group here ..."
                        />
                    </div>
                    <div>
                        <button 
                            type="button" 
                            class="btn btn-sm btn-danger"
                            ${ this.data.removeFormGroupBtn }="${ formGroupId }"
                        >
                            <i class="fas fa-trash-alt fa-fw"></i>
                        </button>
                    </div>
                </div>
            </div>
        `

        addTargetGroup = () => {

            // *** Create and insert the row into the DOM *** //

            // Generate a unique id
            const formGroupId = uuid();

            // Push a target group object
            this.targetGroups.push({
                id: formGroupId,
                target_group: ''
            });

            // Append the form group before the last child (or add button)
            this.form.children().last().before(this.#addTargetGroupFormGroup(formGroupId));

            // *** Add the input validators *** //

            // Initiate the input
            const input = this.#dataElement('targetGroupInput', formGroupId)

            // Add validation to the input
            input.rules('add', {
                required: true,
                messages: {
                    required: 'The name of the target group is required.'
                }
            });

            // *** Initiate the inputs *** //

            // Get the target group name if input changes
            const getTargetGroupName = () => {
                this.targetGroups = this.targetGroups.map(t =>
                    t.id == formGroupId ? { ...t, target_group: input.val() } : t
                );
            }

            input.on('keyup', () => getTargetGroupName());
            input.on('change', () => getTargetGroupName());

            // *** Initiate the buttons *** //

            // Initiate the remove form group button
            this.#dataElement('removeFormGroupBtn', formGroupId).on('click', () => {
                if(this.targetGroups.length == 1) {
                    alert('Stop')
                } else if(this.#dataElement('targetGroupInput', formGroupId).val()) {
                    alert('required')
                } else {
                    this.removeTargetGroup(formGroupId);
                }
            });
        }

        removeTargetGroup = (formGroupId) => {

            // Remove the target group object based on id
            this.targetGroups = this.targetGroups.filter(x => x.id != formGroupId);

            // Remove the element from the DOM
            this.#dataElement('formGroupId', formGroupId).remove();
        }

        clearEmptyFields = () => {
            this.targetGroups.forEach(({ id, name }) => {
                if(this.targetGroups.length > 1) {
                    const value = this.#dataElement('targetGroupInput', id).val();
                    if(!value) this.removeTargetGroup(id);
                }
            });
        }

        getTargetGroups = () => {
            let targetGroups = [];
            this.targetGroups.forEach(({ target_group }) => {
                if(target_group) targetGroups.push(target_group)
            });
            return targetGroups;
        }
    }

    const initTargetGroupForm = () => {

        // Create an instance of target group
        TG_form = new TagetGroupsForm('#addProject_targetGroups_grp');

        // Add a target group form group
        TG_form.addTargetGroup();

        // Initiate the add target group button
        $('#addTargetGroupBtn').on('click', () => {
            if(TG_form.targetGroups.length < 20) {
                TG_form.addTargetGroup();
            }
        });

        // Initiate the clear target group button
        $('#clearTargetGroupEmptyFields_btn').on('click', (e) => {
            e.preventDefault();
            TG_form.clearEmptyFields();
        });
    }
    
    class CooperatingAgenciesForm {

        constructor(selector) {
            this.form = $(selector);
            this.cooperatingAgencies = [];
        
            this.data = {

                // Unique form group id
                formGroupId: 'data-cooperating-agency-form-group-id',

                // Cooperating agency input
                cooperatingAgencyInput: 'data-cooperating-agency-input',

                // Remove form group button
                removeFormGroupBtn: 'data-remove-cooperating-agency-form-group-btn',
            }
        }

        #dataElement = (dataAttr, value) => {

            // If there are multiple attributes with same value
            if(typeof dataAttr === 'object') {
                let selectors = '';
                dataAttr.forEach((da, i) => {
                    selectors += `[${this.data[da]}="${value}"]`;
                    if(i < dataAttr.length-1) selectors += ', ';
                });
                return this.form.find(selectors);
            }
            
            // If there are single attribute
            return this.form.find(`[${this.data[dataAttr]}="${value}"]`);
        }

        #addCooperatingAgencyFormGroup = (formGroupId) => `
            <div 
                class="form-group mb-2"
                ${ this.data.formGroupId }="${ formGroupId }"
            >
                <div class="d-flex align-items-center">
                    <div class="px-2 mr-2">&bull;</div>
                    <div class="w-100 mr-2">
                        <input 
                            type="text" 
                            class="form-control" 
                            name="target_group-${ formGroupId }" 
                            ${ this.data.cooperatingAgencyInput }="${ formGroupId }"
                            placeholder="Type the name of the cooperating agency here ..."
                        />
                    </div>
                    <div>
                        <button 
                            type="button" 
                            class="btn btn-sm btn-danger"
                            ${ this.data.removeFormGroupBtn }="${ formGroupId }"
                        >
                            <i class="fas fa-trash-alt fa-fw"></i>
                        </button>
                    </div>
                </div>
            </div>
        `

        addCooperatingAgency = () => {
            
            // Create a unique id
            const formGroupId = uuid();

            // Push a cooperating agency object to the list
            this.cooperatingAgencies.push({
                id: formGroupId,
                cooperating_agency: ''
            });

            // Prepend the form group before the last child of the group
            this.form.children().last().before(this.#addCooperatingAgencyFormGroup(formGroupId));

            // *** Initiate the inputs *** //

            // Get the input
            const input = this.#dataElement('cooperatingAgencyInput', formGroupId);
            
            // Get the cooperating agency name if input changes
            const getCooperatingAgencyName = () => {
                this.cooperatingAgencies = this.cooperatingAgencies.map(t =>
                    t.id == formGroupId ? { ...t, cooperating_agency: input.val() } : t
                );
            }

            // Handle input changes
            input.on('keyup', () => getCooperatingAgencyName());
            input.on('change', () => getCooperatingAgencyName());


            // Initiate the remove form group button
            this.#dataElement('removeFormGroupBtn', formGroupId).on('click', (e) => {
                e.preventDefault();
                
                const hasValue = this.#dataElement('cooperatingAgencyInput', formGroupId).val();

                if(this.cooperatingAgencies.length == 1) {
                    alert('Stop')
                } else if(hasValue) {
                    alert('required')
                } else {
                    this.removeCooperatingAgency(formGroupId);
                }
            });
        }

        removeCooperatingAgency = (formGroupId) => {
            
            // Remove the cooperating agency object based on id
            this.cooperatingAgencies = this.cooperatingAgencies.filter(x => x.id != formGroupId);

            // Remove the element from the DOM
            this.#dataElement('formGroupId', formGroupId).remove();
        }

        clearEmptyFields = () => {
            this.cooperatingAgencies.forEach(({ id, name }) => {
                if(this.cooperatingAgencies.length > 1) {
                    const value = this.#dataElement('cooperatingAgencyInput', id).val();
                    if(!value) this.removeCooperatingAgency(id);
                }
            });
        }

        getCooperatingAgencies = () => {
            let cooperatingAgencies = [];
            this.cooperatingAgencies.forEach(({ cooperating_agency }) => {
                if(cooperating_agency) cooperatingAgencies.push(cooperating_agency)
            });
            return cooperatingAgencies;
        }
    }

    const initCooperatingAgenciesGroupForm = () => {
        
        // Create an instance of cooperating agencies form
        CA_form = new CooperatingAgenciesForm('#addProject_cooperatingAgencies_grp');
        
        // Add a cooperating agency form group upon DOM load
        CA_form.addCooperatingAgency();

        // Initate the add cooperating agency button
        $('#addCooperatingAgency_btn').on('click', () => {
            if(CA_form.cooperatingAgencies.length < 20) {
                CA_form.addCooperatingAgency();
            }
        });

        // Initiate the clear empty fields button
        $("#clearCooperatingAgenciesEmptyFields_btn").on('click', () => {
            CA_form.clearEmptyFields();
        });
    }

    class FinancialRequirementsForm {

        constructor(selector) {
            this.table = $(selector);
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
        }

        /**
         * Private Methods
         */

        #dataElement = (dataAttr, value) => {

            // If there are multiple attributes with same value
            if(typeof dataAttr === 'object') {
                let selectors = '';
                dataAttr.forEach((da, i) => {
                    selectors += `[${this.data[da]}="${value}"]`;
                    if(i < dataAttr.length-1) selectors += ', ';
                });
                return this.table.find(selectors);
            }
            
            // If there are single attribute
            return this.table.find(`[${this.data[dataAttr]}="${value}"]`);
        }

        #lineItemBudgetRow = (lineItemBudget) => `
            <tr 
                ${ this.data.lineItemBudgetId }="${ lineItemBudget.id }"
                style="background-color: #f6f6f6"
            >
                <td colspan="5" class="align-middle">
                    <span class="font-weight-bolder">${ lineItemBudget.name }</span>
                </td>
                <td class="text-center">
                    <button
                        type="button" 
                        class="btn btn-sm btn-danger" 
                        ${ this.data.removeLineItemBudgetBtn }="${ lineItemBudget.id }"
                        title="Remove line item budget rows"
                    >
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `

        #budgetItemRow = (lineItemBudgetId, lineItemBudgetRowId) => `
            <tr 
                ${ this.data.lineItemBudgetId }="${ lineItemBudgetId }" 
                ${ this.data.lineItemBudgetRowId }="${ lineItemBudgetRowId }"
            > 
                <td>
                    <div class="form-group">
                        <input 
                            type="text"
                            class="form-control form-control-border"
                            ${ this.data.budgetItemNameInput }="${ lineItemBudgetRowId }"
                            name="name-${ lineItemBudgetRowId }"
                        >
                    </div>
                </td>
                <td>
                    <div class="form-group">
                        <input 
                            type="text" 
                            class="form-control form-control-border"
                            ${ this.data.budgetItemParticularsInput }="${ lineItemBudgetRowId }"
                            name="particulars-${ lineItemBudgetRowId }"
                        >
                    </div>
                </td>
                <td>
                    <div class="form-group">
                        <input 
                            type="number" 
                            class="form-control form-control-border"
                            ${ this.data.budgetItemQtyInput }="${ lineItemBudgetRowId }"
                            name="quantity-${ lineItemBudgetRowId }"
                        >
                    </div>
                </td>
                <td>
                    <div class="form-group">
                        <input 
                            type="number" 
                            class="form-control form-control-border"
                            ${ this.data.budgetItemCostInput }="${ lineItemBudgetRowId }"
                            name="cost-${ lineItemBudgetRowId }"
                        >
                    </div>
                </td>
                <td class="text-right">
                    <span 
                        ${ this.data.budgetItemTotalAmount }="${ lineItemBudgetRowId }"
                    >&#8369;0.00</span>
                </td>
                <td class="text-center">
                    <button
                        type="button" 
                        class="btn btn-sm btn-danger" 
                        ${ this.data.removeBudgetItemBtn }="${ lineItemBudgetRowId }"
                        title="Remove budget item row"
                    >
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `

        #addBudgetItemRow = (lineItemBudgetId) => `
            <tr ${ this.data.lineItemBudgetId }="${ lineItemBudgetId }">
                <td colspan="6" class="text-center">
                    <button 
                        type="button" 
                        class="btn btn-sm btn-success" 
                        ${ this.data.addBudgetItemBtn }="${ lineItemBudgetId }"
                        data-toggle="tooltip"
                        title="Add budget item row"
                    >
                        <i class="fas fa-plus mr-1"></i>
                        <span>Add</span>
                    </button>
                </td>
            </tr>
        `

        #getOverallAmount = () => {
            const overallAmountElem = $('#overallAmount');
            let overallAmount = 0;
            this.requirements.forEach(r => overallAmount += r.quantity * r.estimated_cost);
            
            // Create a formatter for money
            const formatter = new Intl.NumberFormat('fil-PH', {
                style: 'currency',
                currency: 'PHP',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Change the overall amount DOM
            overallAmountElem.html(formatter.format(overallAmount));

            // Change the style of the overall amount if less than 0
            overallAmount < 0
                ? overallAmountElem.addClass('text-danger')
                : overallAmountElem.removeClass('text-danger');

            return overallAmount;
        }

        /**
         * Methods
         */

        addLineItemBudgetRows(lineItemBudget) {

            // Variables
            const { id } = lineItemBudget;

            // Update the line item budget list
            lineItemBudget_list = lineItemBudget_list.map(lib =>
                lib.id == id ? { ...lib, selected: true } : lib
            );

            // Re initialize the select2 options
            addLineItemBudget_select.empty();
            addLineItemBudget_select.append(`<option value=""></option>`);
            lineItemBudget_list.forEach(({id, name, selected}) => {
                selected 
                    ? addLineItemBudget_select.append(`<option value="${ id }" disabled>${ name }</option>`)
                    : addLineItemBudget_select.append(`<option value="${ id }">${ name }</option>`)
            });

            // Hiden the Pre Add line item budget if shown
            if(this.requirements.length === 0) $('#preAddLineItemBudget').hide();

            // Append the rows before overall amount row
            const overallAmountRow = this.table.find('tbody').find('#overallAmount_row');
            
            // Append the line item budget row and add budget item row
            overallAmountRow.before(this.#lineItemBudgetRow(lineItemBudget));
            overallAmountRow.before(this.#addBudgetItemRow(id));

            // Initiate the add budget item button
            this.#dataElement('addBudgetItemBtn', id).on('click', (e) => {
                e.preventDefault();
                this.addBudgetItemRow(id);
                this.#dataElement('addBudgetItemBtn', id).tooltip('hide');
            });
            this.#dataElement('addBudgetItemBtn', id).tooltip(TOOLTIP_OPTIONS);

            // Then add the budget item row after initiating the add button
            this.addBudgetItemRow(id);

            // Initiate the remove line item budget button
            this.#dataElement('removeLineItemBudgetBtn', id).on('click', () => {
                
                // Immediately hide the tooltip if shown and button is triggered
                this.#dataElement('removeLineItemBudgetBtn', id).tooltip('hide');

                // Set the data value for the modal buttons
                $('#confirmRemoveLineItemBudget_btn').attr('data-remove-line-item-budget-confirm-button', id);
                
                // Show the modal
                $('#removeLineItemBudget_modal').modal('show');
                // this.removeLineItemBudgetRows(id);
            });
            this.#dataElement('removeLineItemBudgetBtn', id).tooltip(TOOLTIP_OPTIONS);
        }

        addBudgetItemRow(lineItemBudgetId) {

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
            const costInput = this.#dataElement('budgetItemCostInput', budgetItemRowId)

            // For Budget Item Name
            nameInput.rules('add', {
                required: true,
                messages: {
                    required: 'Required'
                }
            });

            // For Particulars
            particularsInput.rules('add', {
                required: true,
                messages: {
                    required: 'Required'
                }
            });

            // For Quantity
            qtyInput.rules('add', {
                required: true,
                number: true,
                min: 1,
                messages: {
                    required: 'Required',
                    number: 'Invalid input',
                    min: 'Must be a positive value'
                }
            });

            // For Estimated Cost
            costInput.rules('add', {
                required: true,
                number: true,
                min: 1,
                messages: {
                    required: 'Required',
                    number: 'Invalid input',
                    min: 'Must be a positive value'
                }
            });

            // *** For initiating inputs *** //

            const getTotalAmount = () => {
                
                // Get the quantity and estimated cost
                const qty = parseFloat(qtyInput.val()) | 0;
                const cost = parseFloat(costInput.val()) | 0;
    
                // Create a formatter for money
                const formatter = new Intl.NumberFormat('fil-PH', {
                    style: 'currency',
                    currency: 'PHP',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                // Update the requirements object
                this.requirements = this.requirements.map(r =>
                    r.row_id == budgetItemRowId && r.line_item_budget_id == lineItemBudgetId
                        ? { ...r, quantity: qty, estimated_cost: cost }
                        : r
                );
                
                // Get the total amount
                const total = qty*cost;

                // Get the total amount element
                const totalAmountElement = this.#dataElement('budgetItemTotalAmount', budgetItemRowId);
                
                // Change the total amount in the DOM
                totalAmountElement.html(formatter.format(total));
                
                // Chnage the style if total amount is less than 0
                total < 0
                    ? totalAmountElement.addClass('text-danger')
                    : totalAmountElement.removeClass('text-danger');

                // Get the overall amount
                this.#getOverallAmount()
            }

            const getBudgetItemName = () => {
    
                // Update the requirements object
                this.requirements = this.requirements.map(r =>
                    r.row_id == budgetItemRowId && r.line_item_budget_id == lineItemBudgetId
                        ? { ...r, budget_item: nameInput.val() }
                        : r
                );
            }

            const getBudgetItemParticulars = () => {
                
                // Update the requirements object
                this.requirements = this.requirements.map(r =>
                    r.row_id == budgetItemRowId && r.line_item_budget_id == lineItemBudgetId
                        ? { ...r, particulars: particularsInput.val() }
                        : r
                );
            }

            // *** Initiate inputs *** //

            // For budget item name
            nameInput.on('keyup', () => getBudgetItemName());
            nameInput.on('change', () => getBudgetItemName());

            // For budget item particulars
            particularsInput.on('keyup', () => getBudgetItemParticulars());
            particularsInput.on('change', () => getBudgetItemParticulars());
            
            // For quantity and estimated cost
            const qtyAndCostInputs = this.#dataElement(['budgetItemQtyInput', 'budgetItemCostInput'], budgetItemRowId)
            qtyAndCostInputs.on('keyup', () => getTotalAmount());
            qtyAndCostInputs.on('change', () => getTotalAmount());

            // *** Initialize the buttons *** //
            
            // Initialize the remove budget item row button
            const removeBudgetItemBtn = this.#dataElement('removeBudgetItemBtn', budgetItemRowId);
            removeBudgetItemBtn.on('click', () => {

                // Hide the tooltip if triggered
                removeBudgetItemBtn.tooltip('hide');

                // If user already inserted some inputs,    
                // setup a confirmation

                // So check if inputs has value
                if(nameInput.val() || particularsInput.val() || qtyInput.val() || costInput.val()) {

                    // Set the budget item id in confirm remove button
                    $('#confirmRemoveBudgetItem_btn').attr('data-budget-item-id', budgetItemRowId);

                    // Show the confirmation modal
                    $('#removeBudgetItem_modal').modal('show');
                } else {
                    
                    // Automatically remove the budget item row if inputs are empty
                    this.removeBudgetItemRow(budgetItemRowId);
                }
            });
            removeBudgetItemBtn.tooltip(TOOLTIP_OPTIONS);
        }

        removeBudgetItemRow(budgetItemRowId) {

            // Check the number of line item budget instance based on budget item row id
            const lib_id = this.requirements.find(lib => lib.row_id == budgetItemRowId).line_item_budget_id;
            const instance = this.requirements.filter(lib => lib.line_item_budget_id == lib_id).length;

            if(instance > 1) {

                // Remove the budget item row from DOM
                // if there are only 1 instance of the budget item on a line item budget
                this.#dataElement('lineItemBudgetRowId', budgetItemRowId).remove();
            } else {

                // Remove the entire line item budget rows from DOM
                this.removeLineItemBudgetRows(lib_id);
            }

            // Remove the requirement object
            this.requirements = this.requirements.filter(x => x.row_id != budgetItemRowId);

            // Update the overall amount
            this.#getOverallAmount();
        }

        removeLineItemBudgetRows(lineItemBudgetId) {

            // Update the line item budget list
            lineItemBudget_list = lineItemBudget_list.map(lib =>
                lib.id == lineItemBudgetId ? { ...lib, selected: false } : lib
            );

            // Re initialize the select2 options
            addLineItemBudget_select.empty();
            addLineItemBudget_select.append(`<option value=""></option>`);
            lineItemBudget_list.forEach(({id, name, selected}) => {
                selected
                    ? addLineItemBudget_select.append(`<option value="${ id }" disabled>${ name }</option>`)
                    : addLineItemBudget_select.append(`<option value="${ id }">${ name }</option>`)
            });

            // Remove the requirement objects with the same line item budget id
            this.requirements = this.requirements.filter(x => x.line_item_budget_id != lineItemBudgetId);

            // Remove the entire rows with line item budget id
            this.#dataElement('lineItemBudgetId', lineItemBudgetId).remove();

            // Show the pre add line item budget if there are no requirements
            if(this.requirements.length === 0) $('#preAddLineItemBudget').show();

            // Update the overall amount
            this.#getOverallAmount();
        }

        getFinancialRequirements() {
            let requirements = [];
            this.requirements.forEach(r => {

                // Create a copy of requirement
                // This prevent the modification of the original object
                let requirement = {...r};

                // Delete the row_id key
                delete requirement.row_id;

                // Push the requirement to the requirements
                requirements.push(requirement);
            });

            return {
                requirements: requirements,
                overallAmount: this.#getOverallAmount()
            };
        }
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
            },
        ];

        // Get a copy of line item budget 
        // and append a selected key with default value as false
        lineItemBudget.forEach(lib => lineItemBudget_list.push({ ...lib, selected: false }));

        // Set the line item budget options
        addLineItemBudget_select.empty();
        addLineItemBudget_select.append(`<option value=""></option>`);
        lineItemBudget_list.forEach(({ id, name, selected }) => {
            selected
                ? addLineItemBudget_select.append(`<option value="${ id }" disabled>${ name }</option>`)
                : addLineItemBudget_select.append(`<option value="${ id }">${ name }</option>`)
        });

        // Create an instance of financial requirements form
        FR_form = new FinancialRequirementsForm('#financialRequirements_form');

        // When selecting line item budget
        $('#financialRequirement_addLineItemBudget_btn').on('click', () => {

            // Get the selected line item budget
            const selected_lib = addLineItemBudget_select.val();

            if(selected_lib == '') {
                toastr.warning('Please select a line item budget first');
            } else {
                const lib = lineItemBudget_list.find(l => l.id == selected_lib);
                
                // Add line item budget rows
                FR_form.addLineItemBudgetRows(lib);
                
                // Reset the select2
                addLineItemBudget_select.val("").trigger('change');
            }
        }); 

        // When remove line item budget modal is hidden, set the data attribute value to none
        $('#removeLineItemBudget_modal').on('hide.bs.modal', () => {
            $('#confirmRemoveLineItemBudget_btn').attr('data-remove-line-item-budget-confirm-button', '');
        });

        // When user confirm to remove line item budget
        $('#confirmRemoveLineItemBudget_btn').on('click', () => {

            // Get the line item budget id from the data attribute
            const lib_id = $('#confirmRemoveLineItemBudget_btn').attr('data-remove-line-item-budget-confirm-button');

            // Remove the entire line item budget rows
            FR_form.removeLineItemBudgetRows(lib_id);

            // Hide the modal
            $('#removeLineItemBudget_modal').modal('hide');
        });

        // When remove budget item modal will hide
        $('#removeBudgetItem_modal').on('hide.bs.modal', () => {
            $('#confirmRemoveBudgetItem_btn').attr('data-budget-item-id', '');
        });

        // When user confirm to remove budget item 
        $('#confirmRemoveBudgetItem_btn').on('click', () => {
            
            // Get the budget item id 
            const bi_id = $('#confirmRemoveBudgetItem_btn').attr('data-budget-item-id');

            // Remove the budget item row
            FR_form.removeBudgetItemRow(bi_id);

            // Hide the modal
            $('#removeBudgetItem_modal').modal('hide');
        });
    }

    const handleForm = () => {
        $app(formSelector).handleForm({
            validators: {
                title: {
                    required: "The title of the project is required.",
                },
                implementer: {
                    required: "Please select a project implementer.",
                },
                start_date: {
                    required: "Please select a date when the project will start.",
                    beforeDateTime: {
                        rule: '#addProject_endDate',
                        message: 'Start date must be before end date'
                    }
                },
                end_date: {
                    required: "Please select a date when the project will end.",
                    afterDateTime: {
                        rule: '#addProject_startDate',
                        message: 'End date must be after start date'
                    }
                },
                impact_statement: {
                    required: "Please compose the impact statement here."
                },
                summary: {
                    required: "Please compose the summary here."
                }
            },
            onSubmit: (event) => {
                const formData = new FormData($(formSelector)[0]);
    
                const data = {
                    title: formData.get('title'),
                    implementer: formData.get('implementer'),
                    target_groups: TG_form.getTargetGroups(),
                    cooperating_agencies: CA_form.getCooperatingAgencies(),
                    start_date: formatDateTime(formData.get('start_date'), "Date"),
                    end_date: formatDateTime(formData.get('end_date'), "Date"),
                    impact_statement: formData.get('impact_statement'),
                    summary: formData.get('summary'),
                    financial_requirements: FR_form.getFinancialRequirements().requirements,
                }

                console.log(data);

                toastr.success("Submitted successfully!");
            }
        });
    }

    /**
     * * Return on DOM load
     * ==============================================
     */
    return {
        load: () => {
            initializations();
            handleStepper();
            handleForm();
            initTargetGroupForm();
            initCooperatingAgenciesGroupForm();
            initFinancialRequirementsForm();
        },
    }
})().load();
