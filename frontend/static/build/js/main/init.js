/**
 * ============================================================================
 * * ON DOM LOAD
 * ============================================================================
 */

'use strict';

(() => {

/**
 * * Initialize Select2's
 */

[].slice.call($('.select2'))?.forEach(element => {
    const e = $(element);

    // Initialize select2
    e.select2({
        placeholder: 'Select an option',
        allowClear: true
    });

    // Validate select2 when change
    e.on('change', () => $(element).valid());
});

/**
 * * Enable bootstrap tooltips
 */

$('[data-toggle="tooltip"]').tooltip(TOOLTIP_OPTIONS)

})();