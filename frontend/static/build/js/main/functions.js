/**
 * ============================================================================
 * * FUNCTIONS
 * ============================================================================
 */

'use strict';

/**
 * ? Main Functions
 * =================================
 */

/**
 * Generate and returns a short universal unique id 
 * @returns {string} Returns a uuid
 */
const uuid = () => {
	const id = () => ("000" + ((Math.random() * 46656) | 0).toString(36)).slice(-3);
	return Date.now().toString(36) + id() + id();
}

/**
 * Set the html content
 * @param {*} param1 
 * @param {*} param2 
 */
const setHTMLContent = (param1, param2) => {
	typeof param1 === 'object' && Object.entries(param1).forEach(([k, v]) => $(k).html(v));
	typeof param1 === 'string' && $(param1).html(param2);
}

/**
 * Format the value into peso
 * @param {float} value 
 * @returns 
 */
const formatToPeso = (value) => {
	const formatter = new Intl.NumberFormat('fil-PH', {
		style: 'currency',
		currency: 'PHP',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
	return formatter.format(value);
}
/**
 * Set the value of input elements
 * @param {*} param1 
 * @param {*} param2 
 */
const setInputValue = (param1, param2) => {
	if(typeof param1 === 'object') {
		Object.entries(param1).forEach(([k, v]) => $(k).val(v));
	} 
	if(typeof param1 === 'string') {
		$(param1).val(param2);
	}
}

/**
 * Get Cookie Value
 */
const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}


/**
 * Ajax Error handler
 */
const ajaxErrorHandler = (errMsg = '', onDOMLoad = 0) => {
  if (!onDOMLoad) {
    toastr.error('Something went wrong. Please reload the page.', null, {
      timeOut: 0,
      extendedTimeOut: 0,
    });
  } else {
    const body = $('body');
    $('.wrapper').remove();
    body.removeClass();
    body.prepend(`
    <div class="d-flex flex-column align-items-center justify-content-center vh-100 w-100 user-select-none">
      <div>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-6 d-flex justify-content-center">
            <img class="w-100" src="${ BASE_URL_WEB }/img/app/load_error.svg" alt="Maintenance" draggable="false">
          </div>
        </div>
      </div>
      <div class="text-center mt-5">
        <h3 class="d-inline-block text-nowrap">Oww snap!</h3>
        <h3 class="d-inline-block text-nowrap">Something went wrong</h3>
        <p>Don't worry, it is not your fault. You can try again by reloading this page.</p>
        <button type="button" class="btn btn-negative" onclick="history.back()">
          <i class="fas fa-arrow-left mr-1"></i>
          <span>Go back</span>
        </button>
        <button type="button" class="btn btn-primary" onclick="location.reload()">
          <i class="fas fa-sync-alt mr-1"></i>
          <span>Reload the page</span>
        </button>
      </div>
    </div>
    `);
  }
  if (DEV_MODE) {
    if (typeof errMsg === 'object') errMsg = JSON.stringify({ details: errMsg });
    console.error(`[ERR]: ${errMsg}` || 'Failed to call ajax.');
  }
}


/**
 * Set Session Alert
 */
const setSessionAlert = (redirectURL, alert = { theme: "", message: "" }) => {
	localStorage.setItem('sessionAlert', JSON.stringify({
    theme: alert.theme,
    message: alert.message
  }));
	location.assign(redirectURL);
}


/** 
 * ? Moments Custom Functions 
 * =================================
 */

// *** Humanize DateTime *** //

/**
 * Returns a humanized details of date from now
 * @param {string} datetime Datetime to be humanized
 */
const fromNow = (datetime) => moment(datetime).fromNow();

/**
 * Returns a humanized details of date to now
 * @param datetime Datetime to be humanized
 */
const toNow = (datetime) => moment(datetime).toNow();


// *** Comparison of date: before/after today *** //

const isBeforeToday = (datetime) => moment(datetime).isBefore(moment());
const isBeforeOrToday = (datetime) => moment(datetime).isSameOrBefore(moment());
const isAfterToday = (datetime) => moment(datetime).isAfter(moment());
const isAfterOrToday = (datetime) => moment(datetime).isSameOrAfter(moment());

/**
 * Formats the datetime into readable ones
 * @param {string} datetime The datetime to be formatted
 * @param {string} format Type of format
 * @returns String of readable datetime format
 */
const formatDateTime = (datetime, format = "") => format
	? moment(datetime).format(format in DATETIME_FORMATS ? DATETIME_FORMATS[format] : format)
	: moment(datetime).format();


/** 
 * ? App Functions 
 * =================================
 */

const $app = (selector) => {

	/**
	 * * App Object
	 */
	let app = {}

	/**
	 * * Private Variables
	 */

	/**
	 * * App Properties
	 */
	app.element = $(selector)

	/**
	 * * App Methods
	 */

	// Handle Form
	app.handleForm = ({ validators, onSubmit }) => {

		let validationRules = {}, validationMessages = {}

		const ruleObjects = ['rule', 'message']

		Object.entries(validators).forEach(([name, objRules]) => {
			let _rules = {}
			let _messages = {}

			const rules = Object.entries(objRules);
			rules.forEach(([ruleKey, rule]) => {
				if (typeof rule === "string") {
					_rules[ruleKey] = true;
					_messages[ruleKey] = rule
				} else if (typeof rule === "object") {
					Object.keys(rule).forEach(key => {
						if (!ruleObjects.includes(key)) {
							console.error(`"${key}" is an invalid validation parameter`)
						} else {
							_rules[ruleKey] = rule.rule;
							_messages[ruleKey] = rule.message
						}
					})
				}
			});

			validationRules[name] = _rules;
			validationMessages[name] = _messages;
		});

		return app.element.validate({
			rules: validationRules,
			messages: validationMessages,
			errorElement: 'div',
			errorClass: 'invalid-feedback font-weight-bold font-italic',
			errorPlacement: (error, element) => {
				if (element.parent('.input-group').length) { // For checkbox/radio
					error
						.insertAfter(element.parent());
				} else if (element.hasClass('select2')) { // For select2
					error
						.insertAfter(element.next('span'));
				} else { // For Default   
					element.closest('.form-group').append(error)
				}
			},
			highlight: (element, errorClass, validClass) => {
				if ($(element).hasClass('select2')) {
					$(element)
						.siblings('span.select2-container')
						.children('.selection')
						.children('.select2-selection')
						.addClass('is-invalid');
				} else {
					$(element).addClass('is-invalid')
				}
			},
			unhighlight: (element, errorClass, validClass) => {
				if ($(element).hasClass('select2')) {
					$(element)
						.siblings('span.select2-container')
						.children('.selection')
						.children('.select2-selection')
						.removeClass('is-invalid');
				} else {
					$(element).removeClass('is-invalid')
				}
			},
			submitHandler: () => {
				onSubmit();
				return false
			}
		});
	}

	// Initialize Date Range Picker
	app.initDateInput = ({
		button = null,
		mode = 'single',
		daterangepicker = {},
		inputmask = {},
	}) => {

		/**
		 * For Date Range Picker
		 */

		// Initialize default options
		let _daterangepicker = {
      parentEl: 'body',
			singleDatePicker: true,
			autoUpdateInput: false,
			autoApply: true,
			showDropdowns: false,
			opens: 'left',
			drops: 'auto',
			// locale: {
			// 	cancelLabel: 'Clear',
			// 	applyLabel: 'Select'
			// }
		}

		// Configure Single Date Picker
		if (mode === 'single') _daterangepicker.singleDatePicker = true;
		if (mode === 'range') _daterangepicker.singleDatePicker = false;

		// Reconfigure the options if set
		Object.entries(daterangepicker)?.forEach(([key, value]) => _daterangepicker[key] = value);

		/**
		 * For Input Mask
		 */

		// Initialize default options
		let _inputmask = {
			placeholder: 'mm/dd/yyyy',
		}

		// Reconfigure the options if set
		Object.entries(inputmask)?.forEach(([key, value]) => _inputmask[key] = value);

		/**
		 * Overall Setup
		 */

		if (button !== null) {
			const btn = $(button), input = $(selector);

			// Initialize Date Range Picker
			btn.daterangepicker(_daterangepicker);

			// Initialize Input Mask
			input.inputmask('mm/dd/yyyy', _inputmask);

			// On Button Apply
			btn.on('apply.daterangepicker', (ev, { startDate }) => {
				input.val(startDate.format('MM/DD/YYYY'));
				input.trigger('change');
				input.valid();
			});

			// On Button Cancel
			btn.on('cancel.daterangepicker', () => {
				input.val('');
				input.trigger('change');
				input.valid();
				const element = btn.data('daterangepicker');
				const dateToday = moment().format('MM/DD/YYYY');
				element.setStartDate(dateToday);
				element.setEndDate(dateToday);
			});

			// On Input Change
			input.on('change', () => {
				const value = input.val();
				const element = btn.data('daterangepicker');
				if (value) {
					element.setStartDate(value);
					element.setEndDate(value);
				} else {
					const dateToday = moment().format('MM/DD/YYYY');
					element.setStartDate(dateToday);
					element.setEndDate(dateToday);
				}
			});
		}
	}

	/**
	 * * Return the app object
	 */
	return app;
}