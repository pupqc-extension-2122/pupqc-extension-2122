/**
 * ==============================================
 * * PROJECT ACTIVITIES
 * ==============================================
 */

'use strict';

const ProjectActivities = (() => {

  /**
	 * * Local Variables
	 * o--/[=================>
	 */

  const dtElem = $('#activities_dt');
  const viewModal = $('#projectActivityDetails_modal');
  const editModal = $('#editProjectActivity_modal');
  let dt;
  let editValidator;
  let PA_form;
  let initialized = 0;

  // ! Simulation
  // Sample Data
  const activities = [
    {
      id: 1,
      name: 'Health Awareness and Office Productivity Tools',
      topics: [
        'Mental Health Awareness',
        'How to Cope up with the Pandemic',
        'Information Communication Technology',
      ],
      outcomes: [
        'Participants will be knowledgeable about proper mental health care',
        'Participant will know how to cope up with the pandemics',
      ]
    }, {
      id: 2,
      name: 'Media and Information Literacy and Google Apps',
      topics: [
        'Google Forms',
        'Google Docs',
        'Google Slides',
      ],
      outcomes: [
        'Lorem ipsum dolor',
        'Lorem ipsum dolor',
      ]
    }, 
  ];

  /**
	 * * Private Methods
	 */

  const handleEditForm = () => {
    editValidator = $app('#editProjectActivity_form').handleForm({
      validators: {
        title: {
          required: 'The title of the activity is required.'
        }
      },
      onSubmit: () => onEditFormSubmit()
    });
  }

  const preInitializations = () => {

    // *** Initialize Edit Activity Form *** //
    
    PA_form = new ProjectActivityForm({
      topicsForm: {
        formGroup: '#editProjectActivity_topics_grp',
        buttons: {
          add: '#editTopic_btn',
          clear: '#clearEditTopicEmptyFields_btn'
        }
      },
      outcomesForm: {
        formGroup: '#editProjectActivity_outcomes_grp',
        buttons: {
          add: '#editOutcome_btn',
          clear: '#clearEditOutcomeEmptyFields_btn'
        }
      }
    });

    // *** On Modals Hidden State *** //
    
    viewModal.on('hidden.bs.modal', () => {

      // Show the loaders
      $('#projectActivityDetails_loader').show();
      $('#projectActivityDetails').hide();
    });

    editModal.on('hidden.bs.modal', () => {

      // Reset the activity form
      PA_form.resetActivityForm();

      // Show the loaders
      $('#editProjectActivity_formGroups_loader').show();
      $('#editProjectActivity_formGroups').hide();

      // Disable buttons
      $('#editProjectActivity_form_saveBtn').attr('disabled', true);
    });
  }

  const initDataTable = async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (ProjectDetails.getId()) {
          dt = dtElem.DataTable({
            data: activities,
            responsive: true,
            language: DT_LANGUAGE,
            columns: [
              {
                data: 'name'
              }, {
                data: null,
                render: data => {
                  const topics = data.topics;
                  const length = topics.length;
                  if (length > 1) {
                    return `
                      <div>${ topics[0]}</div>
                      <div class="small">and ${ length - 1 } more.</div>
                    `
                  } else if (length == 1) {
                    return topics[0]
                  } else {
                    return `<div class="text-muted font-italic">No topics.</div>`
                  }
                }
              }, {
                data: null,
                render: data => {
                  return `
                    <div class="dropdown text-center">
                      <div class="btn btn-sm btn-negative" data-toggle="dropdown" data-dt-btn="options" title="Options">
                        <i class="fas fa-ellipsis-h"></i>
                      </div>
                      <div class="dropdown-menu dropdown-menu-right">
                        <div class="dropdown-header">Options</div>
                        <button
                          type="button"
                          class="dropdown-item"
                          onclick="ProjectActivities.initViewMode('${ data.id }')"
                        >
                          <span>View details</span>
                        </button>
                        <button
                          type="button"
                          class="dropdown-item"
                          onclick="ProjectActivities.initEditMode('${ data.id }')"
                        >
                          <span>Edit details</span>
                        </button>
                      </div>
                    </div>
                  `;
                }
              }
            ]
          });
          resolve();
        }
      }, 1500);
    });
  }

  const onEditFormSubmit = () => {
    const data = {
      ...PA_form.getActivityData()
    }
    console.log(data);
    editModal.modal('hide');
    toastr.success('A project activity has been successfully updated');
  }

  /**
	 * * Public Methods
	 */

  const reloadDataTable = () => {
    // dt.ajax.reload();
    console.log(dt);
    toastr.success('List of activities has been reloaded');
  }

  const initViewMode = async (activity_id) => {
    viewModal.modal('show');
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        const { name, topics, outcomes } = activities.find(a => a.id == activity_id);

        // Set Content
        setHTMLContent({
          '#projectActivityDetails_title': name,
          '#projectActivityDetails_topics': () => {
            if(topics.length) {
              let list = `<ul class="mb-0">`;
              topics.forEach(t => list += `<li>${ t }</li>`);
              list += `</ul>`;
              return list;
            }
          },
          '#projectActivityDetails_outcomes': () => {
            if(outcomes.length) {
              let list = `<ul class="mb-0">`;
              outcomes.forEach(o => list += `<li>${ o }</li>`);
              list += `</ul>`;
              return list;
            }
          },
        });

        // Hide the loaders
        $('#projectActivityDetails_loader').hide();
        $('#projectActivityDetails').show();
        resolve();
      }, 750)
    });
  }

  const initEditMode = async (activity_id) => {
    editModal.modal('show');
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        const { name, topics, outcomes } = activities.find(a => a.id == activity_id);
        
        // Set the input values
        setInputValue({'#editProjectActivity_title': name});

        // Set the topics and outcomes
        PA_form.setTopics(topics);
        PA_form.setOutcomes(outcomes);

        // Hide the loaders
        $('#editProjectActivity_formGroups_loader').hide();
        $('#editProjectActivity_formGroups').show();
        
        // Enable buttons
        $('#editProjectActivity_form_saveBtn').attr('disabled', false);

        resolve();
      }, 750);
    });
  }
  
  /**
	 * * Init
	 */

  const init = () => {
    if(!initialized) {
      initialized = 1;
      handleEditForm();
      preInitializations();
      initDataTable();
    };
  }

  /**
	 * * Return Public Functions
	 */

  return {
    init,
    reloadDataTable,
    initViewMode,
    initEditMode,
  }
})();

ProjectActivities.init();