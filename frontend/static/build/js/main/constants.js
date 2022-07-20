/**
 * ============================================================================
 * * CONSTANTS AND CONFIGURATIONS
 * ============================================================================
 */

'use strict';

// Developer Mode
const DEV_MODE = true;

// BASE URLs
const ORIGIN = location.origin;
const BASE_URL_WEB = ORIGIN;
const BASE_URL_API = ORIGIN + '/api';

const USER_DATA_KEY = 'user_data';

// DataTable Language
const DT_LANGUAGE = {
  emptyTable: `
    <div class="text-center p-5">
      <h3>No records yet</h3>
      <div class="text-secondary">Hey! We found no records here yet.</div>
    </div>
  `,
  loadingRecords: `
    <div class="p-5 my-5 text-center">
      <i class="fa-3x fa-solid fa-spinner fa-spin-pulse text-primary mb-3"></i>
    </div>
  `,
  processing: `Processing`,
  zeroRecords: `
    <div class="text-center p-5">
      <h3>No match found</h3>
      <div class="text-secondary">No records was found that matched to your request. Please check if the spelling is correct or try other keywords.</div>
    </div>
  `,
  paginate: {
    previous: `<i class="fas fa-caret-left mr-1"></i><span>Previous</span>`,
    next: `<span>Next</span><i class="fas fa-caret-right ml-1"></i>`,
  }
}

const TEMPLATE = {
  LABEL_ICON: (label, icon, iconType="s") => {
    return `
      <span>${label}<span>
      <i class="fa${iconType} fa-${icon} ml-1"></i>
    `
  },
}

// DataTable Default Configuration
const DT_CONFIG_DEFAULTS = {
  serverSide: true,
  responsive: true,
  order: [[0, 'desc']],
  language: {
    emptyTable: `
      <div class="text-center p-5">
        <h3>No records yet</h3>
        <div class="text-secondary">Hey! We found no records here yet.</div>
      </div>
    `,
    loadingRecords: `
      <div class="text-center py-5 wait">
        <div class="spinner-grow text-primary mb-3" role="status">
          <span class="sr-only">Loading ...</span>
        </div>
        <div class="text-secondary">Making it ready ...</div>
      </div>
    `, 
    processing: `
      <div class="text-center p-5 wait">
        <div class="spinner-grow text-primary mb-3" role="status">
          <span class="sr-only">Loading ...</span>
        </div>
        <div class="text-secondary">Processing, please wait ...</div>
      </div>
    `,
    zeroRecords: `
      <div class="text-center p-5">
        <h3>No match found</h3>
        <div class="text-secondary">No records was found that matched to your request. Please check if the spelling is correct or try other keywords.</div>
      </div>
    `,
    paginate: {
      previous: `<i class="fas fa-caret-left mr-1"></i><span>Previous</span>`,
      next: `<span>Next</span><i class="fas fa-caret-right ml-1"></i>`,
    }
  },
  columnDefs: [
    {
      targets: [-1],
      orderable: false,
    }, { 
      responsivePriority: 1, 
      targets: 0 
    }, { 
      responsivePriority: 2, 
      targets: -1 
    }
  ],
  autoWidth: false,
  // dom: `
	// 		<"row w-100"
	// 			<"col-md-2" l>
	// 			<"col-md-6" B>
	// 			<"col-md-4" f>
	// 		>
	// 		<t>
	// 		<"row"
	// 			<"col-md-6" i>
	// 			<"col-md-6" p>
	// 		>
  // `,
  // buttons: [
  //   {
  //     extend: "copy",
  //     text: TEMPLATE.LABEL_ICON("Copy", "copy"),
  //     className: "btn-sm btn-negative",
  //     // exportOptions: { columns: visibleCols }
  //   }, {
  //     extend: "csv",
  //     text: TEMPLATE.LABEL_ICON("CSV", "file-csv"),
  //     className: "btn-sm btn-negative",
  //     // exportOptions: { columns: visibleCols }
  //   }, {
  //     extend: "excel",
  //     text: TEMPLATE.LABEL_ICON("Excel", "file-excel"),
  //     className: "btn-sm btn-negative",
  //     // exportOptions: { columns: visibleCols }
  //   }, {
  //     extend: "pdf",
  //     text: TEMPLATE.LABEL_ICON("PDF", "file-pdf"),
  //     className: "btn-sm btn-negative",
  //     // exportOptions: { columns: visibleCols }
  //   }, {
  //     extend: "print",
  //     text: TEMPLATE.LABEL_ICON("Print", "print"),
  //     className: "btn-sm btn-negative",
  //     // exportOptions: { columns: visibleCols }
  //   }, {
  //     extend: "colvis",
  //     text: TEMPLATE.LABEL_ICON("Columns", "eye"),
  //     className: "btn-sm btn-negative",
  //     // columns: columnOpts
  //   }
  // ],
}

// DateTime Formats
const DATETIME_FORMATS = {
	"Full DateTime": "dddd, MMMM D, YYYY; hh:mm A",
	"DateTime": "MMMM D, YYYY; hh:mm A",
	"Short DateTime": "MMM. D, YYYY; hh:mm A",
	"Full Date": "dddd, MMMM D, YYYY",
	"Date": "MMMM D, YYYY",
	"Short Date": "MMM. D, YYYY",
	"Time": "hh:mm A"
}

// jQuery Custom Validation
const CUSTOM_VALIDATIONS = [
  {
    ruleName: "notEmpty",
    handler: (value, element, params) => {
      if (value.length > 0)
        return value.replace(/\s+/g, '').length;
      return true;
    },
		defaultMessage: 'This field cannot be empty'
  }, {
		ruleName: "lessThan",
		handler: (value, element, params) => {
			if ($(params).length) {
				const c = $(params).val();
				return !c ? true : parseFloat(value) < parseFloat(c);
			}
			return true;
		},
		defaultMessage: 'It must be less than something'
	}, {
		ruleName: "greaterThan",
		handler: (value, element, params) => {
			if ($(params).length) {
				const c = $(params).val();
				return !c ? true : parseFloat(value) > parseFloat(c);
			}
			return true;
		},
		defaultMessage: 'It must be greater than something'
	}, {
		ruleName: "lessThanOrEqualTo",
		handler: (value, element, params) => {
			if ($(params).length) {
				const c = $(params).val();
				if (c) return parseFloat(value) <= parseFloat(c);
			}
			return true;
		},
		defaultMessage: 'It must be less than or equal to something'
	}, {
		ruleName: "greaterThanOrEqualTo",
		handler: (value, element, params) => {
			if ($(params).length) {
				const c = $(params).val();
				if (c) return parseFloat(value) >= parseFloat(c);
			}
			return true;
		},
		defaultMessage: 'It must be greater than or equal to something'
	}, {
		ruleName: "beforeToday",
		handler: (value, element, params) => isBeforeToday(moment(value)),
		defaultMessage: 'Date and/or time must be earlier than today'
	}, {
		ruleName: "afterToday",
		handler: (value, element, params) => isAfterToday(moment(value)),
		defaultMessage: 'Date and/or time must be later than today'
	}, {
		ruleName: "beforeTimeSelector",
		handler: (value, element, params) => {
			if ($(params).length) {
				const c = $(params).val();
				return !c ? true : moment(value, 'H:mm').isBefore(moment(c, 'H:mm'));
			}
			return true;
		},
		defaultMessage: 'It must before an indicated time'
	}, {
		ruleName: "afterTimeSelector",
		handler: (value, element, params) => {
			if ($(params).length) {
				const c = $(params).val();
				return !c ? true : moment(value, 'H:mm').isAfter(moment(c, 'H:mm'));
			}
			return true;
		},
		defaultMessage: 'It must after an indicated time'
	}, {
		ruleName: "beforeDateTimeSelector",
		handler: (value, element, params) => {
			if ($(params).length) {
				const c = $(params).val();
				return !c
					? true
					: moment(value).isBefore(moment(c));
			}
			return true;
		},
		defaultMessage: 'It must before an indicated date and time'
	}, {
		ruleName: "sameOrBeforeDateTimeSelector",
		handler: (value, element, params) => {
			if ($(params).length) {
				const c = $(params).val();
				return !c
					? true
					: moment(value).isSameOrBefore(moment(c));
			}
			return true;
		},
		defaultMessage: 'It must before an indicated date and time'
	}, {
		ruleName: "afterDateTimeSelector",
		handler: (value, element, params) => {
			if ($(params).length) {
				const c = $(params).val();
				return !c
					? true
					: moment(value).isAfter(moment(c));
			}
			return true;
		},
		defaultMessage: 'It must after an indicated date and time'
	}, {
		ruleName: "sameOrAfterDateTimeSelector",
		handler: (value, element, params) => {
			if ($(params).length) {
				const c = $(params).val();
				return !c
					? true
					: moment(value).isSameOrAfter(moment(c));
			}
			return true;
		},
		defaultMessage: 'It must after an indicated date and time'
	}, {
		ruleName: "beforeDateTime",
		handler: (value, element, params) => {
			return !params
				? true
				: moment(value).isBefore(moment(params));
		},
		defaultMessage: 'It must after an indicated date and time'
	}, {
		ruleName: "sameOrBeforeDateTime",
		handler: (value, element, params) => {
			return !params
				? true
				: moment(value).isSameOrBefore(moment(params));
		},
		defaultMessage: 'It must after an indicated date and time'
	}, {
		ruleName: "afterDateTime",
		handler: (value, element, params) => {
			return !params
				? true
				: moment(value).isAfter(moment(params));
		},
		defaultMessage: 'It must after an indicated date and time'
	}, {
		ruleName: "sameOrAfterDateTime",
		handler: (value, element, params) => {
			return !params
				? true
				: moment(value).isSameOrAfter(moment(params));
		},
		defaultMessage: 'It must after an indicated date and time'
	}, {
		ruleName: "notSameDate",
		handler: (value, element, params) => {
			return !params
				? true
				: !moment(value).isSame(moment(params));
		},
		defaultMessage: 'It must not be equal to a value'
	}, {
		ruleName: "notEqualTo",
		handler: (value, element, params) => {
      return value != params;
		},
		defaultMessage: 'It must not be equal to a value'
	}, {
		ruleName: "callback",
		handler: (value, element, params) => {
      return params;
		},
		defaultMessage: 'It must not be equal to a value'
	}
]

// Tooltip Options
const TOOLTIP_OPTIONS = {
	container: '.content-wrapper',
	delay: {
		show: 500,
		hide: 250
	},
	trigger: 'hover',
	selector: '[data-toggle="tooltip"], [data-dt-btn="options"]'
}

// Maximum empty fields for adding fields
const MAX_EMPTY_FIELDS = 10;

// Max. Limit for currency values
const MONEY_LIMIT = 9999999999;

const MONEY_LIMIT_LARGER = 9999999999999;

// Project Status Styles
const PROJECT_PROPOSAL_STATUS_STYLES = {
	'Created': {
		icon: 'fas fa-pen',
		theme: 'light'
	},
  'For Revision': {
		icon: 'fas fa-file-pen',
		theme: 'warning'
	},
	'For Review': {
		icon: 'fas fa-file-circle-question',
		theme: 'info'
	},
	'For Evaluation': {
		icon: 'fas fa-file-circle-exclamation',
		theme: 'info'
	},
	'Pending': {
		icon: 'fas fa-sync-alt',
		theme: 'warning'
	},
	'Approved': {
		icon: 'fas fa-check',
		theme: 'success'
	},
	'Cancelled': {
		icon: 'fas fa-times',
		theme: 'danger'
	},
}

const PROJECT_HISTORY_STYLES = {
  ...PROJECT_PROPOSAL_STATUS_STYLES,
  'Re-sched Presentation': {
    icon: 'fas fa-calendar-day',
		theme: 'warning'
  }
}

// Partner Status Styles
const PARTNER_STATUS_STYLES = {
	'Active': {
		icon: 'fas fa-check',
		theme: 'success'
	},
	'Inactive': {
		icon: 'fas fa-ban',
		theme: 'danger'
	},
}

// Memo Status Styles
const MEMO_STATUS_STYLES = {
	'Active': {
		icon: 'fas fa-check',
		theme: 'success'
	},
	'Inactive': {
		icon: 'fas fa-ban',
		theme: 'danger'
	},
}

// Project Evaluation Styles
const PROJECT_EVALUATION_STATUS_STYLES = {
	'Evaluated': {
		icon: 'fas fa-check',
		theme: 'success'
	},
	'In progress': {
		icon: 'fas fa-sync-alt',
		theme: 'warning'
	},
  'Not yet graded': {
		icon: 'fas fa-file-circle-exclamation',
		theme: 'info'
	},
}

// Project Monitoring Styles
const PROJECT_MONITORING_STATUS_STYLES = {
  'Concluded': {
    icon: 'fas fa-calendar-check',
    theme: 'danger'
  },
  'On going': {
    icon: 'fas fa-hourglass',
    theme: 'warning'
  },
  'Upcoming': {
    icon: 'fas fa-calendar-day',
    theme: 'light'
  },
  'No data': {
    icon: 'fas fa-question',
    theme: 'light'
  }
}