'use strict';

const ProjectEvaluation = (() => {

  /**
   * * Local Variables
   */

  let initialized = 0;

  // ! Simulation
  let data;

  /**
   * * Private Methods
   */

  const initDataTable = async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {

        // Sample Data
        data = [
          {
            id: '1',
            title: 'Strengthening Resilience To Disasters and Be a Solution to Changing Environment',
            target_groups: [
              { id: 1, name: "target group 1" },
              { id: 2, name: "target group 2" },
              { id: 3, name: "target group 3" },
              { id: 3, name: "target group 3" },
              { id: 3, name: "target group 3" },
              { id: 3, name: "target group 3" },
              { id: 3, name: "target group 3" },
              { id: 3, name: "target group 3" },
              { id: 3, name: "target group 3" },
            ],
            date_started: '05/13/2022',
            date_ended: '05/14/2022',
            status: 'Evaluated'
          }, {
            id: '2',
            title: 'Health Awareness and Office Productivity Tools',
            target_groups: [
              { id: 1, name: "target group 1" },
              { id: 2, name: "target group 2" },
              { id: 3, name: "target group 3" },
            ],
            date_started: '05/13/2022',
            date_ended: '05/14/2022',
            status: 'In progress'
          },{
            id: '3',
            title: 'Covid-19 & Vaccine Education Drive',
            target_groups: [
              { id: 1, name: "target group 1" },
              { id: 2, name: "target group 2" },
              { id: 3, name: "target group 3" },
            ],
            date_started: '05/13/2022',
            date_ended: '05/14/2022',
            status: 'Not yet graded'
          },
        ];
        resolve();

      }, 2500);
    });

    // Data Table
    $('#projectEvaluation_dt').DataTable({
      data: data,
      responsive: true,
      language: DT_LANGUAGE,
      columns: [
        { 
          data: 'title' 
        },
        { 
          data: null,
          render: data => {
            const target_groups = data.target_groups;

            if(target_groups.length === 1) {
              return target_groups[0].name;
            } else {
              return `
                <div>${ target_groups[0].name }</div>
                <div class="small">and ${ target_groups.length - 1 } more.</div>
              `
            }
          }
        },
        {
          data: null,
          render: data => {
            const dateStarted = data.date_started;
            return moment(dateStarted).format("dddd, MMMM Do YYYY, h:mm:ss a");
          }
        },
        {
          data: 'date_ended'
        },
        {
          data: null, 
          render: ({ status }) => {
						const { theme, icon } = PROJECT_EVALUATION_STATUS_STYLES[status];
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
                    <a href="${ BASE_URL_WEB }/p/evaluation/${ data.id }" class="dropdown-item">
                        <span>View details</span>
                    </a>
                    <a href="${ BASE_URL_WEB }/p/evaluation/${ data.id }/activities" class="dropdown-item">
                        <span>Manage activities</span>
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
    }
  }

  /**
   * * Return public methods
   */

  return {
    init
  }
})();

ProjectEvaluation.init();