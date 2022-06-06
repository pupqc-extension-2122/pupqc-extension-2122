/**
 * ============================================================================
 * * ON DOM LOAD
 * ============================================================================
 */

'use strict';

(() => {

	/**
	 * * Resolve conflict in jquery tooltip and bootstrap tooltip
	 */
	$.widget?.bridge('uibutton', $.ui.button);

	/**
	 * * Initialize Select2's
	 */

	[].slice.call($('.select2'))?.forEach(elem => {
		const e = $(elem);

		// Initialize select2
		e.select2({
			placeholder: 'Select an option',
			allowClear: true
		});

		// Validate select2 when change
		e.on('change', () => e.valid());
	});

	/**
	 * * Enable bootstrap tooltips
	 */

	$('.content-wrapper').tooltip(TOOLTIP_OPTIONS);

	/**
	 * * Configure toastr options
	 */

	if(typeof toastr !== 'undefined') toastr.options = {
		preventDuplicates: true,
		closeDuration: 250,
	}

	/** 
	 * * jQuery Validation Methods
	 */

	// Set Custom Validations
	CUSTOM_VALIDATIONS?.forEach(({ ruleName, handler, defaultMessage }) => jQuery.validator?.addMethod(ruleName, handler, defaultMessage));

	/**
	 * * Auto resize text area
	 */
	$('[data-autoresize]').each(function () {
		this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
	}).on('input', function () {
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
	});

	/**
	 * * Go back 
	 */
	$('[data-card-widget="goback"]').on('click', () => history.back());

})();