'use strict';

/**
 * ==============================================
 * * PARTNNERSHIP DETAILS
 * ==============================================
 */

const PartnershipDetails = (() => {

  /**
   * * Local Variables
   */
  
  const formSelector = '#editPartnership_form';

  let initialized = 0;

   // ! Simulation
  let data;

  /**
   * * Private Methods
   */

  const handleForm = () => {
    $app(formSelector).handleForm({
      validators: {
        name: {
          required: "The partner name is required.",
          notEmpty: "This field cannot be empty.",
        },
        address: {
          required: "The partner address is required.",
          notEmpty: "This field cannot be empty.",
        },
        organization:  {
          required: "The organization is required.",
          notEmpty: "This field cannot be empty.",
        }
      },
      onSubmit: () => {
        toastr.success("Partnership details has been updated successfully!");
      }
    });
  }

  const initDataTable = async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        
        // Sample Data
        data = [
          {
            file_name: 'MOA/MOU',
            file_type: 'PDF',
            upload_date: '05/14/2022',
            file_size: '749KB',
            status: 'Active'
          }, {
            file_name: 'MOA/MOU',
            file_type: 'DOC',
            upload_date: '01/20/2018',
            file_size: '749KB',
            status: 'Inactive'
          },
        ];
        resolve();
      }, 2500);
    });

    // Data Table
    $('#documents_dt').DataTable({
      data: data,
      responsive: true,
      language: DT_LANGUAGE,
      columns: [
        { 
          data: 'file_name' 
        },
        { 
          data: 'file_type' 
        },
        {
          data: null,
          render: data => {
            const uploadDate = data.upload_date;
            return moment(uploadDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
          }
        },
        { 
          data: 'file_size' 
        },
        {
          data: null, 
          render: ({ status }) => {
						const { theme, icon } = PARTNER_STATUS_STYLES[status];
						return `
							<div class="text-center">
								<div class="badge badge-subtle-${ theme } px-2 py-1">
									<i class="${ icon } fa-fw mr-1"></i>
									<span>${ status }</span>
								</div>
							</div>
						`;
					}
        }, {
          data: null,
          render: data => {
            return `
              <div class="dropdown text-center">
                
                <div class="btn btn-sm btn-negative" data-toggle="dropdown">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
                
                  <div class="dropdown-menu dropdown-menu-right">
                    <div class="dropdown-header">Options</div>
                    <a href="" class="dropdown-item">
                        <span>View document</span>
                    </a>
                </div>
              </div>
            `
          }
        }
      ]
    });
  }
  /**
   * * Public Methods
   */

  /**
   * * Init
   */

  const init = () => {
    if (!initialized) {
      initialized = 1;
      initDataTable();
      handleForm();
    }
  }

  /**
   * * Return public methods
   */

  return {
    init
  }

})();

PartnershipDetails.init();
