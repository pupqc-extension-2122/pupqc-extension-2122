/**
 * ==============================================
 * * PROJECT CLASSES
 * ==============================================
 */


'use strict';


const ProjectDetails = (() => {

  // * Local Variables

  const header = $('#projectDetails_header');
  const body = $('#projectDetails_body');
  let initialized = false;

  // Data Container
  let project;
  let mode;

  // * Private Methods

  const noContentTemplate = (message) => `<div class="text-muted font-italic">${message}</div>`;

  const loadActiveBreadcrumb = () => {
    const title = project.title;
    $('#active_breadcrumb').html(() => title.length > 33 ? `${ title.substring(0, 30) } ...` : title);
  }

  const loadDocumentTitle = () => {
    const projectTitle = project.title;
    const documentTitle = projectTitle.length > 78
      ? projectTitle.substring(0, 75) + ' ...' 
      : projectTitle;

    setDocumentTitle(`${ documentTitle } - ${ $('#activities_dt').length ? 'Project Activities' : 'Project Details' }`);
  }

  const loadHeaderDetails = () => {
    loadActiveBreadcrumb();
    
    if (!header.length) return;
    
    setHTMLContent({
      '#projectDetails_header_title': project.title,
      '#projectDetails_header_implementer': () => {
        return `
          <i class="fas fa-gears fa-fw mr-2 text-dark" data-toggle="tooltip" title="Implementer"></i>
          <span>${ project.implementer || noContentTemplate('No implementer has been set up.') }</span>
        `
      },
      '#projectDetails_header_timeframe': () => `
        <i class="fas fa-calendar-alt fa-fw mr-2 text-dark" data-toggle="tooltip" title="Time Frame"></i>
        <span>${formatDateTime(project.start_date, 'Date')} - ${formatDateTime(project.end_date, 'Date')}</span>
      `,
      '#projectDetails_header_status': () => {

        // * For proposal mode * //
        if (mode == 'Proposal') {
          const status = project.status;
          const { theme, icon } = PROJECT_PROPOSAL_STATUS_STYLES[status];
          return `
            <div class="badge badge-subtle-${theme} user-select-none py-1 px-2">
              <i class="${icon} fa-fw mr-1"></i>
              <span>${status}</span>
            </div>
          `
        } 
        
        // * For monitoring mode * //
        else if (mode === 'Monitoring') {
          const { start_date, end_date } = project;
          const today = moment();
          
          let status;
          if (today.isBefore(start_date) && today.isBefore(end_date))
            status = 'Upcoming';
          else if (today.isAfter(start_date) && today.isAfter(end_date))
            status = 'Concluded';
          else if (today.isBetween(start_date, end_date))
            status = 'On going';
          else
            status = 'No data';

          const { theme, icon } = PROJECT_MONITORING_STATUS_STYLES[status];
          return `
            <div class="badge badge-subtle-${theme} user-select-none py-1 px-2">
              <i class="${icon} fa-fw mr-1"></i>
              <span>${status}</span>
            </div>
          `
        }

        // * For evaluation mode * //
        else if (mode === 'Activity Evaluation') {
          return '';
          // const status = 'Not yet graded';
          // const { theme, icon } = PROJECT_EVALUATION_STATUS_STYLES[status];
          // return `
          //   <div class="badge badge-subtle-${theme} user-select-none py-1 px-2">
          //     <i class="${icon} fa-fw mr-1"></i>
          //     <span>${status}</span>
          //   </div>
          // `
        }

        else {
          return `
            <div class="badge badge-subtle-light user-select-none py-1 px-2">
              <i class="fas fa-question fa-fw mr-1"></i>
              <span>[ERR]: No data</span>
            </div>
          `
        }
      }
    });

    if (project.status == 'For Evaluation' && project.presentation_date) {
      if ($('#presentationDate_notif').length) $('#presentationDate_notif').remove();
      $('#projectDetails_header_status').after(() => {
        const presentationDate = moment(project.presentation_date);
        const formattedPresentationDate = presentationDate.format('MMMM D, YYYY (dddd)');
        const humanizedPresentationDate = presentationDate.fromNow();
        if (moment(presentationDate).isAfter(moment())) {
          return `
            <div id="presentationDate_notif" class="d-flex px-3 py-2 border border-info mt-3 rounded" style="background: #2b6cb022">
              <div class="mr-2">
                <i class="fas fa-calendar-alt fa-fw text-info"></i>
              </div>
              <div>
                <div>The presentation has been set on <span class="font-weight-bold">${ formattedPresentationDate }</span></div>
                <div class="small text-muted">${ humanizedPresentationDate }</div>
              </div>
            </div>
          `;
        } else {
          return `
            <div id="presentationDate_notif" class="d-flex px-3 py-2 border border-warning mt-3 rounded" style="background: #fff1ec">
              <div class="mr-2">
                <i class="fas fa-calendar-alt fa-fw text-warning"></i>
              </div>
              <div>
                <div>The presentation should have been completed on <span class="font-weight-bold">${ formattedPresentationDate }</span></div>
                <div class="small text-muted">${ humanizedPresentationDate }</div>
              </div>
            </div>
          `
        }
      });
    }

    if (project.status != 'For Evaluation' && project.evaluation) {
      if ($('#presentationDate_notif').length) $('#presentationDate_notif').remove();
    }

    if (project.SO_number) {
      $('#projectDetails_header_SONumber').show().html(`Special Order #: <span class="font-weight-bold">${ project.SO_number }</span>`)
    }
  }

  const loadBodyDetails = () => {
    if (body.length) {
      const {
        title,
        project_type,
        implementer,
        team_members: pt,
        target_groups: tg,
        memos: ca,
        start_date,
        end_date,
        impact_statement,
        summary,
        SO_number,
        monitoring_frequency,
        monitoring_method,
        financial_requirements: fr,
        evaluation_plans: ep
      } = project;

      // Set the overall details of the project
      setHTMLContent({
        '#projectDetails_body_title': title || noContentTemplate('No title has been set up'),
        '#projectDetails_body_extensionType': project_type || noContentTemplate('No extension project type has been set up.'),
        '#projectDetails_body_implementer': implementer || noContentTemplate('No implementer has been set up.'),
        '#projectDetails_body_projectTeam': () => {
          if (pt.length) {
            let list = '<ul class="mb-0">';
            pt.forEach(p => list += `<li>${p.name}${ p.role ? ` - ${ p.role }` : '' }</li>`);
            list += '</ul>';
            return list;
          }
          return noContentTemplate('No project team been set up.');
        },
        '#projectDetails_body_targetGroups': () => {
          if (tg.length) {
            let rows = '', total = 0;
            tg.forEach(t => {
              const { beneficiary_name: b, location: l, target_number: n } = t;
              rows += `
                <tr>
                  <td>${ b ? b : noContentTemplate('Missing beneficiary name.') }</td>
                  <td>${ l ? l : noContentTemplate('The location has not been set up.') }</td>
                  <td class="text-right">${ n ? parseInt(n).toLocaleString(NUM_LOCALE_STRING) : noContentTemplate('--') }</td>
                </tr>
              `;
              total += parseInt(n);
            });
            rows += `
              <tr class="font-weight-bold text-right" style="background-color: #f6f6f6">
                <td colspan="2">Total target beneficiaries</td>
                <td>${ total.toLocaleString(NUM_LOCALE_STRING) }</td>
              </tr>
            `
            return rows;
          }
          return `
            <tr>
              <td class="text-center py-4" colspan="3">${ noContentTemplate('No target groups have been set up.') }</td>
            </tr>
          `;
        },
        '#projectDetails_body_cooperatingAgencies': () => {
          if (ca.length) {
            let list = '<ul class="mb-0">';
            ca.forEach(c => list += `
              <li>
                <i 
                  class="fas fa-check-circle fa-fw mr-1 text-success" 
                  data-toggle="tooltip" 
                  title="This partner has currently active MOA/MOU"
                ></i>
                <a 
                  href="${ BASE_URL_WEB }/m/memo/${ c.id }"
                  target="_blank"
                >${c.partner_name}</a>
              </li>`);
            list += '</ul>';
            return list;
          }
          return noContentTemplate('No cooperating agencies have been set up.');
        },
        '#projectDetails_body_timeFrame': () => {
          if (start_date && end_date) {
            const getDuration = () => {
              return moment(start_date).isSame(moment(end_date))
                ? 'in the whole day'
                : moment(start_date).to(moment(end_date), true)
            }
            return `
              <div class="ml-4 ml-lg-0 row">
                <div class="pl-0 col-4 col-lg-2">
                  <div class="font-weight-bold">Start Date:</div>
                </div>
                <div class="col-8 col-lg-10">
                  <div>${ moment(start_date).format('MMMM D, YYYY (dddd)') }</div>
                  <div class="small text-muted">${ fromNow(start_date) }</div>
                </div>

                <div class="col-12"><div class="mt-2"></div></div>

                <div class="pl-0 col-4 col-lg-2">
                  <div class="font-weight-bold">End Date:</div>
                </div>
                <div class="col-8 col-lg-10">
                  <div>${ moment(end_date).format('MMMM D, YYYY (dddd)') }</div>
                  <div class="small text-muted">${ fromNow(end_date) }</div>
                </div>

                <div class="col-12"><div class="mt-2"></div></div>

                <div class="pl-0 col-4 col-lg-2">
                  <div class="font-weight-bold">Duration:</div>
                </div>
                <div class="col-8 col-lg-10">
                  <div>Approximately ${ getDuration() }</div>
                </div>
              </div>
            `
          } else return noContentTemplate('No dates have been set up.');
        },
        '#projectDetails_body_impactStatement': impact_statement || noContentTemplate('No impact statement has been set up.'),
        '#projectDetails_body_summary': summary || noContentTemplate('No summary has been set up.</div>'),
        '#projectDetails_body_SONumber': SO_number || noContentTemplate('No SO number has been set up.</div>'),
        '#projectDetails_body_monitoringFrequency': monitoring_frequency || noContentTemplate('No frequency of project monitoring has been set up.</div>'),
        '#projectDetails_body_monitoringMethod': monitoring_method || noContentTemplate('No method of project monitoring has been set up.</div>'),
        '#projectDetails_body_evaluationPlans': () => {
          if (ep.length) {
            let evaluationPlanRows = '';
            ep.forEach(p => {
              evaluationPlanRows += `
                <tr>
                  <td>${p.outcome || noContentTemplate('--')}</td>
                  <td>${p.indicator || noContentTemplate('--')}</td>
                  <td>${p.data_collection_method || noContentTemplate('--')}</td>
                  <td>${p.frequency || noContentTemplate('--')}</td>
                </tr>
              `
            });
            return evaluationPlanRows;
          } else {
            return `
              <tr>
                <td colspan="4">
                  <div class="p-5 text-center">${noContentTemplate('No evaluation plan has been set up.')}</div>
                </td>
              </tr>
            `
          }
        },
        '#projectDetails_body_financialRequirements': () => {
          
          let financialRequirementRows = '';
          let overallAmount = 0;

          // Read the object for rendering in the DOM
          fr.forEach(category => {

            // Create the line item budget row
            financialRequirementRows += `
              <tr style="background-color: #f6f6f6">
                <td 
                  class="font-weight-bold"
                  colspan="5"
                >${ category.category }</td>
              </tr>
            `;

            // Create the budget item rows
            category.items.forEach(r => {
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
            <tr class="font-weight-bold" style="background-color: #f6f6f6">
              <td colspan="4" class="text-right">Overall Amount</td>
              <td class="text-right">${ formatToPeso(overallAmount) }</td>
            </tr>
          `;

          return financialRequirementRows;
        }
      });

      // If Project Evaluation has been graded
      if (project.evaluation) {
        const { 
          technical_evaluation_date, 
          eppec_evaluation_date, 
          release_date, 
          evaluators,
          recommendations,
        } = project.evaluation;
        const presentation_date = project.presentation_date;

        setHTMLContent({
          '#projectDetails_body_presentationDate': () => {
            if (presentation_date) {
              return `
                <div>${ moment(presentation_date).format('MMMM DD, YYYY (dddd)') }</div>
                <div class="small text-muted">${ fromNow(presentation_date) }</div>
              `
            } else {
              return `<div class="font-italic text-muted">No date has been set.</div>`
            }
          },
          '#projectDetails_body_technicalEvaluationDate': () => {
            if (technical_evaluation_date) {
              return `
                <div>${ moment(technical_evaluation_date).format('MMMM DD, YYYY (dddd)') }</div>
                <div class="small text-muted">${ fromNow(technical_evaluation_date) }</div>
              `
            } else {
              return `<div class="font-italic text-muted">No date has been set.</div>`
            }
          },
          '#projectDetails_body_EPPECEvaluationDate': () => {
            if (eppec_evaluation_date) {
              return `
                <div>${ moment(eppec_evaluation_date).format('MMMM DD, YYYY (dddd)') }</div>
                <div class="small text-muted">${ fromNow(eppec_evaluation_date) }</div>
              `
            } else {
              return `<div class="font-italic text-muted">No date has been set.</div>`
            }
          },
          '#projectDetails_body_releaseDate': () => {
            if (release_date) {
              return `
                <div>${ moment(release_date).format('MMMM DD, YYYY (dddd)') }</div>
                <div class="small text-muted">${ fromNow(release_date) }</div>
              `
            } else {
              return `<div class="font-italic text-muted">No date has been set.</div>`
            }
          },
          '#projectDetails_body_evaluationSummary': () => {
            let rows = '';
            let sumPoints = 0;
            
            const getRemarks = (points) => {
              if (points >= 70 && points <= 100) {
                return `<span class="font-weight-bold text-success text-uppercase">PASSED</span>`;
              } else if (points < 70 && points >= 1) {
                return `<span class="font-weight-bold text-danger text-uppercase">FAILED</span>`;
              } else {
                return '--';
              }
            }

            evaluators.forEach(e => {
              const { name, points } = e;
              const realPoints = parseFloat(parseFloat(points).toFixed(2)) || 0;

              const getPoints = () => {
                return realPoints >= 1 && realPoints <= 100
                  ? `${ realPoints.toFixed(2) }%`
                  : '--'
              }

              rows += `
                <tr>
                  <td>${ name }</td>
                  <td class="text-right">${ getPoints() }</td>
                  <td class="text-center">${ getRemarks(realPoints) }</td>
                </tr>
              `

              sumPoints += realPoints;
            });

            const averagePoints = sumPoints/evaluators.length;

            const getAveragePoints = () => {
              return averagePoints >= 1 && averagePoints <= 100
                ? `${ averagePoints.toFixed(4) }%`
                : '--' 
            }

            rows += `
              <tr style="background: #f6f6f6">
                <td class="text-right font-weight-bold">Average Points</td>
                <td class="text-right font-weight-bold">${ getAveragePoints() }</td>
                <td class="text-center">${ getRemarks(averagePoints) }</td>
              </tr>
            `

            return rows;
          },
          '#projectDetails_body_recommendations': recommendations
        });

        $('#projectDetails_evaluationSummary_tabSpacer').show();
        $('#projectDetails_evaluationSummary_tab').show();
      } else {
        $('#projectDetails_evaluationSummary_tab').hide();
      }

      // Finally, show the navigation tabs
      $('#projectDetails_navTabs').show();
    }
  }

  const removeLoaders = () => {
    $('#contentHeader_loader').remove();
    $('.content-header').show();

    $('#projectDetails_options_card_loader').remove();
    $('#projectDetails_options_card').show();

    $('#projectDetails_body_loader').remove();
    $('#projectDetails_body').show();
  }

  // * Public Methods

  const loadDetails = (projectData) => {
    if (projectData) project = projectData;
    loadDocumentTitle();
    loadHeaderDetails();
    loadBodyDetails();
  }

  // * Init

  const init = (data) => {
    if (!initialized) {
      initialized = true;
      project = data.project;
      console.log(project);
      mode = data.mode;
      loadDetails();
      removeLoaders();
    }
  }

  // * Return Public Functions

  return {
    init,
    loadDetails,
  }
})();


const ProjectOptions = (() => {

  // * * * LOCAL VARIABLES * * * //
  
  const body = $('#projectDetails_body');
  const activitiesDT = $('#activities_dt');
  const options = '#projectDetails_options';
  const user_roles = JSON.parse(getCookie('roles'));
  let initialized = 0;
  let processing = false; // For submissions

  // Data Container
  let project;
  let mode;

  // Proposal Option Modals
  const forApproval_modal = $('#confirmSubmitForApproval_modal');
  const forRevision_modal = $('#confirmRequestForRevision_modal');
  const setPresentationSchedule_modal = $('#setPresentationSchedule_modal');
  const reschedPresentationSchedule_modal = $('#reschedPresentationSchedule_modal');
  const setProjectEvaluation_modal = $('#setProjectEvaluation_modal');
  const approveProject_modal = $('#confirmApproveTheProject_modal');
  const cancelProposal_modal = $('#confirmCancelTheProposal_modal');

  // Monitoring Option Modals
  const changeTimeFrame_modal = $('#changeTimeFrame_modal');
  
  // * * * PRIVATE METHODS * * * //

  const updateProjectDetails = async obj => {
    let updated = false;

    Object.entries(obj).forEach(([key, value]) => {
      if (project.hasOwnProperty(key)) {
        project[key] = value;
        if (!updated) updated = true;
      }
    });

    if (updated) {
      ProjectDetails.loadDetails(project);
      ProjectOptions.setOptions(project);

      if (activitiesDT.length) {
        AddProjectActivity.init(project);
        ProjectActivities.init(project);
      }
    }
  }

  // *** FOR SUBMISSIONS *** //

  const initForApproval = () => {
    const isBadAction = () => !(project.status == 'Created' || project.status == 'For Revision');
    const confirmBtn = $('#confirmSubmitForApproval_btn');
    
    confirmBtn.on('click', async () => {
      if (isBadAction()) return;

      processing = true;
      
      // Disable elements
      confirmBtn.attr('disabled', true);
      confirmBtn.html(`
        <span class="px-3">
          <i class="fas fa-spinner fa-spin-pulse"></i>
        </span>
      `);
      
      // Enable elements function
      const enableElements = () => {
        confirmBtn.attr('disabled', false);
        confirmBtn.html('Yes, please!');
      }

      await $.ajax({
        url: `${ BASE_URL_API }/projects/review/${ project.id }`,
        type: 'PUT',
        success: async res => {
          processing = false;

          if (res.error) {
            ajaxErrorHandler(res.message);
            enableElements();
          } else if (res.warning) {
            forApproval_modal.modal('hide');
            enableElements();
            toastr.warning(res.message);
          } else {
            forApproval_modal.modal('hide');
            updateProjectDetails({ status: 'For Review' });
            enableElements();
            ProjectHistory.addToTimeline(res.data);
            toastr.success('The proposal has been submitted successfully.');
          }
        }, 
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'projects/projectProposalDetails.js',
            fn: `ProjectOptions.initForApproval(): confirmBtn.on('click', ...)`,
            xhr: xhr
          });
          enableElements();
        }
      });
    });

    forApproval_modal.on('show.bs.modal', (e) => {
      if (isBadAction()) e.preventDefault();
    });

    forApproval_modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });
  }

  const initForRevision = () => {
    const isBadAction = () => !(
      project.status === 'For Review'
      || project.status === 'Pending'
    );
    
    $app('#requestForRevision_form').handleForm({
      validators: {
        remarks: {
          required: 'Please type your remarks.',
          notEmpty: 'This field cannot be blank.',
          minlength: {
            rule: 5,
            message: 'Make sure you type the full details of your remarks'
          }
        }
      },
      onSubmit: async () => {
        if (isBadAction()) return;
        processing = true;

        const confirmBtn = $('#confirmRequestForRevision_btn');
        
        // Disable elements
        confirmBtn.attr('disabled', true);
        confirmBtn.html(`
          <span class="px-3">
            <i class="fas fa-spinner fa-spin-pulse"></i>
          </span>
        `);
        
        // Enable elements function
        const enableElements = () => {
          confirmBtn.attr('disabled', false);
          confirmBtn.html('Yes, please!');
        }

        const fd = new FormData($('#requestForRevision_form')[0]);

        const data = {
          remarks: fd.get('remarks').trim()
        }
  
        await $.ajax({
          url: `${ BASE_URL_API }/projects/revise/${ project.id }`,
          type: 'PUT',
          data: data,
          success: async res => {
            processing = false;
  
            if (res.error) {
              enableElements();
              toastr.warning(res.message);
            } else {
              forRevision_modal.modal('hide');
              enableElements();
              updateProjectDetails({ status: 'For Revision' });
              ProjectHistory.addToTimeline(res.data);
              toastr.success('Your request of project revision has been successfully saved.');
            }
          }, 
          error: (xhr, status, error) => {
            ajaxErrorHandler({
              file: 'projects/projectProposalDetails.js',
              fn: `ProjectOptions.initForRevision(): confirmBtn.on('click', ...)`,
              xhr: xhr
            });
            enableElements();
          }
        });
      }
    });

    forRevision_modal.on('show.bs.modal', (e) => {
      if (isBadAction()) e.preventDefault();
    });

    forRevision_modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();

      $('#requestForRevision_form')[0].reset();
    });
  }

  const initForEvaluation = () => {
    const isBadAction = () => !(project.status === 'For Review' || project.status === 'For Evaluation');
    const formSelector = '#setPresentationSchedule_form';
    const form = $(formSelector);
    let validator;

    // Initialize Date Input
    $app('#setPresentation_date').initDateInput({
      button: '#setPresentation_date_pickerBtn'
    });

    // Prevent showing the modal if status is not "For Review"
    setPresentationSchedule_modal.on('show.bs.modal', (e) => {
      if (isBadAction()) e.preventDefault();
    });

    // Prevent hiding the modal if still processing
    setPresentationSchedule_modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });

    // Reset the form if modal has been hidden
    setPresentationSchedule_modal.on('hidden.bs.modal', () => {
      validator.resetForm();
      form.trigger('reset');
    });

    validator = $app(formSelector).handleForm({
      validators: {
        presentation_date: {
          required: 'Please select a date for the presentation of the project.',
          dateISO: 'Your input is not a valid date.',
          afterToday: 'The presentation date must be later than today.',
          beforeDateTime: {
            rule: project.end_date,
            message: 'The presentation date must be earlier than the end of the project timeline'
          }
        }
      },
      onSubmit: async () => {
        if (isBadAction()) return;

        processing = true;

        const confirmBtn = $('#setPresentationSchedule_btn');

        // Disable elements
        confirmBtn.attr('disabled', true);
        confirmBtn.html(`
          <span class="px-3">
            <i class="fas fa-spinner fa-spin-pulse"></i>
          </span>
        `);
        
        // Enable elements function
        const enableElements = () => {
          confirmBtn.attr('disabled', false);
          confirmBtn.html('Yes, please!');
        }

        // Get Data
        const fd = new FormData($('#setPresentationSchedule_form')[0]);
        const data = {
          presentation_date: fd.get('presentation_date')
        }

        await $.ajax({
          url: `${ BASE_URL_API }/projects/evaluation/${ project.id }`,
          type: 'PUT',
          data: data,
          success: async res => {
            processing = false;

            if (res.error) {
              ajaxErrorHandler(res.message);
              enableElements();
            } else {
              setPresentationSchedule_modal.modal('hide');
              enableElements();
              updateProjectDetails({ 
                status: 'For Evaluation',
                presentation_date: data.presentation_date 
              });
              ProjectHistory.addToTimeline(res.data)
              toastr.success('A presentation schedule has been set.');
            }
          },
          error: (xhr, status, error) => {
            ajaxErrorHandler({
              file: 'projects/projectProposalDetails.js',
              fn: `ProjectOptions.initForEvaluation(): confirmBtn.on('click', ...)`,
              xhr: xhr
            });
            enableElements();
          }
        });
      }
    });
  }

  const initReschedulePresentation = () => {
    const isBadAction = () => !(project.status === 'For Evaluation');

    const formSelector = '#reschedPresentationSchedule_form';
    const form = $(formSelector);
    let validator;

    // Initialize Date Input
    $app('#reschedPresentation_date').initDateInput({
      button: '#reschedPresentation_date_pickerBtn'
    });

    validator = $app(formSelector).handleForm({
      validators: {
        presentation_date: {
          required: 'Please select a date for the presentation of the project.',
          dateISO: 'Your input is not a valid date.',
          notSameDate: {
            rule: () => project.presentation_date,
            message: 'The presentation date is still the same.',
          },
          afterToday: 'The presentation date must be later than today.',
          beforeDateTime: {
            rule: project.end_date,
            message: 'The presentation date must be earlier than the end of the project timeline'
          }
        },
        remarks: {
          required: 'Please type your remarks.',
          notEmpty: 'This field cannot be blank.',
          minlength: {
            rule: 5,
            message: 'Make sure you type the full details of your remarks'
          }
        }
      },
      onSubmit: async () => {
        if (isBadAction()) return;

        processing = true;

        const confirmBtn = $('#reschedPresentationSchedule_btn');

        // Disable elements
        confirmBtn.attr('disabled', true);
        confirmBtn.html(`
          <span class="px-3">
            <i class="fas fa-spinner fa-spin-pulse"></i>
          </span>
        `);
        
        // Enable elements function
        const enableElements = () => {
          confirmBtn.attr('disabled', false);
          confirmBtn.html('Yes, please!');
        }

        // Get Data
        const fd = new FormData(form[0]);
        const data = {
          presentation_date: fd.get('presentation_date'),
          remarks: fd.get('remarks').trim().replace(/\s+/g, ' '),
        }

        await $.ajax({
          url: `${ BASE_URL_API }/projects/${ project.id }/reschedule`,
          type: 'PUT',
          data: data,
          success: async res => {
            processing = false;

            if (res.error) {
              ajaxErrorHandler(res.message);
              enableElements();
            } else {
              reschedPresentationSchedule_modal.modal('hide');
              enableElements();
              updateProjectDetails({ 
                status: 'For Evaluation',
                presentation_date: data.presentation_date 
              });
              ProjectHistory.addToTimeline(res.data)
              toastr.success('A presentation schedule has been set.');
            }
          },
          error: (xhr, status, error) => {
            ajaxErrorHandler({
              file: 'projects/projectProposalDetails.js',
              fn: `ProjectOptions.initForEvaluation(): confirmBtn.on('click', ...)`,
              xhr: xhr
            });
            enableElements();
          }
        });
      }
    });

    // Handle show modal
    reschedPresentationSchedule_modal.on('show.bs.modal', (e) => {
      
      // Prevent showing the modal if status is not "For Evaluation"
      if (isBadAction()) e.preventDefault();
      
      // Set the presentation schedule
      $('#reschedPresentation_date')
        .val(() => project.presentation_date)
        .trigger('change');
    });

    // Reset the form after hidden
    reschedPresentationSchedule_modal.on('hidden.bs.modal', () => {
      validator.resetForm();
      form[0].reset();
    });
  }

  const initProjectEvaluation = () => {
    const isBadAction = () => project.status !== 'For Evaluation';
    let PE_form;
    
    // Initialize Technical Evaluation Date
    $app('#setProjectEvaluation_technicalEvaluationDate').initDateInput({
      button: '#setProjectEvaluation_technicalEvaluationDate_pickerBtn'
    });

    // Initialize Evaluation Date
    $app('#setProjectEvaluation_evaluationDate').initDateInput({
      button: '#setProjectEvaluation_evaluationDate_pickerBtn'
    });

    // Initialize Release Date
    $app('#setProjectEvaluation_releaseDate').initDateInput({
      button: '#setProjectEvaluation_releaseDate_pickerBtn'
    });

    setProjectEvaluation_modal.on('show.bs.modal', (e) => {
      if (isBadAction()) e.preventDefault();
    });

    setProjectEvaluation_modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });

    // Handle Form
    $app('#setProjectEvaluation_form').handleForm({
      validators: {
        technical_evaluation_date: {
          required: 'Please select when the conducted technical evaluation occured.',
          dateISO: 'Your input is not a valid date.',
          sameOrBeforeDateTime: {
            rule: () => project.end_date,
            message: 'The evaluation date must be same or earlier than the end of the project timeline.'
          },
          sameOrAfterDateTime: {
            rule: () => project.presentation_date,
            message: 'The evaluation date must be same or later than the presentation date.'
          }
        },
        eppec_evaluation_date: {
          required: 'Please select when the EPPEC evaluation occured.',
          dateISO: 'Your input is not a valid date.',
          sameOrBeforeDateTime: {
            rule: () => project.end_date,
            message: 'The evaluation date must be same or earlier than the end of the project timeline.'
          },
          sameOrAfterDateTime: {
            rule: () => project.presentation_date,
            message: 'The evaluation date must be same or later than the presentation date.'
          }
        },
        release_date: {
          required: 'Please select when the results has been released.',
          dateISO: 'Your input is not a valid date.',
          sameOrBeforeDateTime: {
            rule: () => project.end_date,
            message: 'The evaluation date must be same or earlier than the end of the project timeline.'
          },
          sameOrAfterDateTime: {
            rule: () => project.presentation_date,
            message: 'The evaluation date must be same or later than the presentation date.'
          },
          sameOrAfterDateTimeSelector: {
            rule: '#setProjectEvaluation_evaluationDate',
            message: 'The release date must be same or later than the evaluation date.'
          }
        },
        recommendations: {
          required: 'The recommendations of the EPPEC is required.',
          notEmpty: 'This field cannot be blank',
          minlength: {
            rule: 5,
            message: 'Make sure you type the full details of the recommendation.'
          }
        }
      },
      onSubmit: async () => {
        if (isBadAction()) return;

        processing = true;

        const confirmBtn = $('#setProjectEvaluation_btn');

        // Disable elements
        confirmBtn.attr('disabled', true);
        confirmBtn.html(`
          <span class="px-3">
            <i class="fas fa-spinner fa-spin-pulse"></i>
          </span>
        `);
        
        // Enable elements function
        const enableElements = () => {
          confirmBtn.attr('disabled', false);
          confirmBtn.html('Yes, please!');
        }

        // Get the data
        const fd = new FormData($('#setProjectEvaluation_form')[0]);
        const evaluationData = PE_form.getEvaluationData();
        const data = {
          eppec_evaluation_date: fd.get('eppec_evaluation_date'),
          technical_evaluation_date: fd.get('technical_evaluation_date'),
          release_date: fd.get('eppec_evaluation_date'),
          evaluators: evaluationData.evaluation,
          average_points: evaluationData.average.points,
          recommendations: fd.get('recommendations'),
        }

        await $.ajax({
          url: `${ BASE_URL_API }/projects/${ project.id }/evaluate`,
          type: 'POST',
          data: data,
          success: async res => {
            processing = false;

            if (res.error) {
              ajaxErrorHandler(res.message);
              enableElements();
            } else {
              setProjectEvaluation_modal.modal('hide');
              enableElements();
              updateProjectDetails({ 
                status: 'Pending',
                evaluation: data 
              });
              toastr.success('An evaluation has been saved.');
            }
          },
          error: (xhr, status, error) => {
            ajaxErrorHandler({
              file: 'projects/projectProposalDetails.js',
              fn: `ProjectOptions.initProjectEvaluation(): confirmBtn.on('click', ...)`,
              xhr: xhr
            });
            enableElements();
          }
        });
      }
    });

    // Create an instance of project evaluation form
    PE_form = new ProjectEvaluationForm($('#setProjectEvaluation_evaluatorsForm'));
  }

  const initApproveProject = () => {
    const isBadAction = () => project.status !== 'Pending';
    const formSelector = '#approveProject_form';
    const form = $(formSelector)[0];
    const confirmBtn = $('#confirmApproveTheProject_btn');

    // Initialize Date Inputs
    [
      '#approveProject_fundingApprovalDate',
      '#approveProject_SOReleaseDate',
      '#approveProject_cashReleaseDate',
      '#approveProject_noticeReleaseDate',
    ].forEach(s => $app(s).initDateInput({ button: `${s}_pickerBtn` }));

    $app(formSelector).handleForm({
      validators: {
        SO_number: {
          required: 'The SO number is required.'
        },
        funding_approval_date: {
          required: 'The date of endorsement for funding is required.',
          dateISO: 'Your input is not a valid date.',
          beforeDateTime: {
            rule: () => project.end_date,
            message: 'This date must within the project timeline.'
          }
        },
        SO_release_date: {
          required: 'The release date of SO is required.',
          dateISO: 'Your input is not a valid date.',
          beforeDateTime: {
            rule: () => project.end_date,
            message: 'This date must within the project timeline.'
          }
        },
        cash_release_date: {
          required: 'The release date of cash advance is required.',
          dateISO: 'Your input is not a valid date.',
          beforeDateTime: {
            rule: () => project.end_date,
            message: 'This date must within the project timeline.'
          }
        },
        notice_release_date: {
          required: 'The release date of notice to proceed is required.',
          dateISO: 'Your input is not a valid date.',
          beforeDateTime: {
            rule: () => project.end_date,
            message: 'This date must within the project timeline.'
          }
        },
      },
      onSubmit: async () => {
        if (isBadAction()) return;
        
        processing = true;
        
        // Disable elements
        confirmBtn.attr('disabled', true);
        confirmBtn.html(`
          <span class="px-3">
            <i class="fas fa-spinner fa-spin-pulse"></i>
          </span>
        `);
      
        // Enable elements function
        const enableElements = () => {
          confirmBtn.attr('disabled', false);
          confirmBtn.html('Submit and approve');
        }

        const fd = new FormData(form);

        const data = {
          SO_number: fd.get('SO_number'),
          funding_approval_date: fd.get('funding_approval_date'),
          SO_release_date: fd.get('SO_release_date'),
          cash_release_date: fd.get('cash_release_date'),
          notice_release_date: fd.get('notice_release_date'),
        }
        
        await $.ajax({
          url: `${ BASE_URL_API }/projects/approve/${ project.id }`,
          type: 'PUT',
          data: data,
          success: async res => {
            processing = false;
  
            if (res.error) {
              ajaxErrorHandler(res.message);
              enableElements();
            } else {
              approveProject_modal.modal('hide');
              enableElements();
              updateProjectDetails({
                ...data,
                status: 'Approved'
              });
              ProjectHistory.addToTimeline(res.data);
              toastr.success('The proposal has been approved.');
            }
          },
          error: (xhr, status, error) => {
            ajaxErrorHandler({
              file: 'projects/projectProposalDetails.js',
              fn: `ProjectOptions.initApproveProject(): confirmBtn.on('click', ...)`,
              xhr: xhr
            });
            enableElements();
          }
        });
      }
    });

    approveProject_modal.on('show.bs.modal', (e) => {
      if (isBadAction()) e.preventDefault();
    });

    approveProject_modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });
  }

  const initCancelProposal = () => {
    const isBadAction = () => !(
      project.status === 'For Review'
      || project.status === 'For Evaluation'
      || project.status === 'Pending'
    );
    const confirmBtn = $('#confirmCancelTheProposal_btn');

    $app('#cancelProposal_form').handleForm({
      validators: {
        remarks: {
          required: 'Please type your remarks.',
          notEmpty: 'This field cannot be blank.',
          minlength: {
            rule: 5,
            message: 'Make sure you type the full details of your remarks'
          }
        }
      },
      onSubmit: async () => {
        if (isBadAction()) return;

        processing = true;

        // Disable elements
        confirmBtn.attr('disabled', true);
        confirmBtn.html(`
          <span class="px-3">
            <i class="fas fa-spinner fa-spin-pulse"></i>
          </span>
        `);

        // Enable elements function
        const enableElements = () => {
          confirmBtn.attr('disabled', false);
          confirmBtn.html('Yes, please!');
        }

        const fd = new FormData($('#cancelProposal_form')[0]);

        const data = {
          remarks: fd.get('remarks').trim().replace(/\s+/g, ' '),
        }

        await $.ajax({
          url: `${ BASE_URL_API }/projects/cancel/${ project.id }`,
          type: 'PUT',
          data: data,
          success: async res => {
            processing = false;
            
            if (res.error) {
              ajaxErrorHandler(res.message);
              enableElements();
            } else {
              cancelProposal_modal.modal('hide');
              enableElements();
              updateProjectDetails({ status: 'Cancelled' });
              ProjectHistory.addToTimeline(res.data)
              toastr.success('The proposal has been submitted successfully.');
            }
          }, 
          error: (xhr, status, error) => {
            ajaxErrorHandler({
              file: 'projects/projectProposalDetails.js',
              fn: `ProjectOptions.initCancelProposal(): confirmBtn.on('click', ...)`,
              xhr: xhr
            });
            enableElements();
          }
        });
      }
    });

    cancelProposal_modal.on('show.bs.modal', (e) => {
      if (isBadAction()) e.preventDefault();
    });

    cancelProposal_modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });
  }

  // *** INITIALIZE PROPOSAL OPTIONS *** //

  const initProposalOptions = () => {
    if (mode !== 'Proposal') return;

    // * ======== FOR EXTENSIONIST ======== * //

    if (user_roles.includes('Extensionist')) {
      initForApproval();
      initCancelProposal();
    }

    // * ======== FOR CHIEF ======== * //

    if (user_roles.includes('Chief')) {
      initForRevision();
      initForEvaluation();
      initReschedulePresentation();
      initProjectEvaluation();
      initApproveProject();
    }
  }

  // *** INITIALIZE MONITORING OPTIONS *** //

  const initChangeTimeFrame = () => {

    const startDate_selector = '#changeTimeFrame_startDate';
    const endDate_selector = '#changeTimeFrame_endDate';

    const startDate_input = $(startDate_selector);
    const endDate_input = $(endDate_selector);

    const formSelector = '#changeTimeFrame_form';
    const form = $(formSelector)[0];
    
    let validator;

    changeTimeFrame_modal.on('show.bs.modal', () => {
      startDate_input.val(project.start_date).trigger('change');
      endDate_input.val(project.end_date).trigger('change');
    });

    changeTimeFrame_modal.on('hidden.bs.modal', () => {
      form.reset();
    });
    
    // Initialize Start Date Input
    $app(startDate_selector).initDateInput({
      button: '#changeTimeFrame_startDate_pickerBtn'
    });
    
    // Initialize End Date Input
    $app(endDate_selector).initDateInput({
      button: '#changeTimeFrame_endDate_pickerBtn'
    });

    $(`${ startDate_selector }, ${ endDate_selector }`).on('change', () => {
      $('#changeTimeFrame_status').html(() => {
        const start_date = startDate_input.val();
        const end_date = endDate_input.val();

        if (moment(start_date).isSameOrBefore(moment(end_date))) {
          const today = moment();
            let status;
            if (today.isBefore(start_date) && today.isBefore(end_date)) {
              status = 'Upcoming';
            } else if (today.isAfter(start_date) && today.isAfter(end_date)) {
              status = 'Concluded';
            } else if (today.isBetween(start_date, end_date)) {
              status = 'On going';
            } else {
              status = 'No data';
            }
            const { theme, icon } = PROJECT_MONITORING_STATUS_STYLES[status];
            return `
              <span class="badge badge-subtle-${ theme } px-2 py-1">
                <i class="${ icon } fa-fw mr-1"></i>
                <span>${ status }</span>
              </span>
            `;
        } else {
          return `
            <span class="text-muted font-italic">Please select a valid start and end date</span>
          `
        }
      });
      startDate_input.valid();
      endDate_input.valid();
    });

    const checkInputForTimeFrame = () => {
      const selectedStartDate = startDate_input.val();
      const selectedEndDate = endDate_input.val();

      return !(
        moment(selectedStartDate).isSame(moment(project.start_date)) 
        && moment(selectedEndDate).isSame(moment(project.end_date))
      );
    }

    // Handle form
    validator = $app(formSelector).handleForm({
      validators: {
        start_date: {
          required: 'Please select a start date.',
          dateISO: 'Your input is not a valid date.',
          beforeDateTimeSelector: {
            rule: '#changeTimeFrame_endDate',
            message: 'The start date must be earlier than end date.'
          },
          callback: {
            rule: () => checkInputForTimeFrame(),
            message: 'The start and end dates are still the same within the project time frame.'
          } 
        },
        end_date: {
          required: 'Please select a start date.',
          dateISO: 'Your input is not a valid date.',
          afterDateTimeSelector: {
            rule: '#changeTimeFrame_startDate',
            message: 'The end date must be later than start date.'
          },
          callback: {
            rule: () => checkInputForTimeFrame(),
            message: 'The start and end dates are still the same within the project time frame.'
          } 
        },
        remarks: {
          required: 'Please type your remarks.',
          notEmpty: 'This field cannot be blank.',
          minlength: {
            rule: 5,
            message: 'Make sure you type the full details of your remarks'
          }
        }
      },
      onSubmit: () => {
        processing = true;

        const submit_btn = $('#changeTimeFrame_btn');

        // Disable elements
        submit_btn.attr('disabled', true);
        submit_btn.html(`
          <span class="px-3">
            <i class="fas fa-spinner fa-spin-pulse"></i>
          </span>
        `);
        
        // Enable elements function
        const enableElements = () => {
          submit_btn.attr('disabled', false);
          submit_btn.html('Save');
        }

        const fd = new FormData(form);

        const data = {
          start_date: fd.get('start_date'),
          end_date: fd.get('end_date'),
          remarks: fd.get('remarks'),
        }

        $.ajax({
          url: `${ BASE_URL_API }/projects/${ project.id }/change_monitoring`,
          type: 'PUT',
          data: data,
          success: res => {
            if (res.error) {
              ajaxErrorHandler(res.message);
            } else {
              enableElements();
              updateProjectDetails({ 
                start_date: data.start_date,
                end_date: data.end_date
              });
              changeTimeFrame_modal.modal('hide');
              toastr.success('The project time frame has been successfully updated.');
            }
          },
          error: (xhr, status, error) => {
            ajaxErrorHandler({
              file: 'projects/projectProposalDetails.js',
              fn: `ProjectOptions.initChangeTimeFrame(): confirmBtn.on('click', ...)`,
              xhr: xhr
            });
            enableElements();
          }
        });
      }
    });
    
  }

  const initMonitoringOptions = () => {
    initChangeTimeFrame();
  }

  // * * * PUBLIC METHODS * * * //

  const setOptions = (data) => {

    if (data) project = data;

    // Get the status
    const { id, status } = project;

    // Get Option List function
    const getOptionList = (optionArr = []) => {
      if(Array.isArray(optionArr) && optionArr.length) {
        let optionList = '';
        let selectedOptions = {};
        optionArr.filter(o => o).forEach(o => {
          const { id, category } = optionsDict.find(od => od.id == o);
          if (!selectedOptions.hasOwnProperty(category)) selectedOptions[category] = [];
          selectedOptions[category].push(id);
        });
        const entries = Object.entries(selectedOptions);
        entries.forEach((s, i) => {
          const [key, optionsArr] = s;
          optionList += `<div class="dropdown-header">${ key }</div>`;
          optionsArr.forEach(o => optionList += optionsDict.find(od => od.id == o).template);
          if (i < entries.length - 1) optionList += `<div class="dropdown-divider"></div>`
        });
        return optionList;
      }
    }

    // Container for dictionary of options
    // Index are equivalent to the level of priority/arrangement
    let optionsDict;

    // Raw list of options
    let optionList = [];

    // Get the added option and set to the index of itself in the dictionary for 
    // level of priority/arragement
    const addOption = (optionId) => optionList[optionsDict.findIndex(o => o.id === optionId)] = optionId;
    
    // * For Proposal Mode
    if (mode === 'Proposal') {

      optionsDict = [

        // ---> CATEGORY: PROJECT ACTIVITIES <--- //
        {
          id: 'Add project activity',
          category: 'Project Activities',
          template: `
            <button 
              type="button"
              class="btn btn-negative btn-block text-left" 
              data-toggle="modal"
              data-target="#addProjectActivity_modal"
            >
              <i class="fas fa-plus text-success fa-fw mr-1"></i>
              <span>Add project activity</span>
            </button>
          `
        }, {
          id: 'View activities',
          category: 'Project Activities',
          template: `
            <div
              role="button"
              class="btn btn-negative btn-block text-left" 
              onclick="location.replace('${BASE_URL_WEB}/p/proposals/${id}/activities')"
            >
              <i class="fas fa-list text-primary fa-fw mr-1"></i>
              <span>View activities</span>
            </div>
          `
        }, 
        
        // ---> CATEGORY: PROJECT DETAILS <--- //
        {
          id: 'View project details',
          category: 'Project Details',
          template: `
            <div
              role="button"
              class="btn btn-negative btn-block text-left" 
              onclick="location.replace('${BASE_URL_WEB}/p/proposals/${id}')"
            >
              <i class="fas fa-list text-primary fa-fw mr-1"></i>
              <span>View project details</span>
            </div>
          `
        }, {
          id: 'Edit project details',
          category: 'Project Details',
          template: `
            <div
              role="button"
              class="btn btn-negative btn-block text-left" 
              onclick="location.assign('${BASE_URL_WEB}/p/edit-proposal/${id}')"
            >
              <i class="fas fa-edit text-info fa-fw mr-1"></i>
              <span>Edit details</span>
            </div>
          `
        }, 
        
        // ---> CATEGORY: FOR SUBMISSION <--- //
        {
          id: 'Submit for approval',
          category: 'For Submission',
          template: `
            <button 
              type="button"
              class="btn btn-outline-success btn-block text-left" 
              onclick="ProjectOptions.triggerOption('submitForApproval')"
            >
              <i class="fas fa-hand-pointer fa-fw mr-1"></i>
              <span>Submit for approval</span>
            </button>
          `
        }, {
          id: 'Set presentation schedule',
          category: 'For Submission',
          template: `
            <button 
              type="button"
              class="btn btn-outline-primary btn-block text-left" 
              onclick="ProjectOptions.triggerOption('approveTheProposal')"
            >
              <i class="fas fa-calendar-alt fa-fw mr-1"></i>
              <span>Set presentation schedule</span>
            </button>
          `
        }, {
          id: 'Submit evaluation grade',
          category: 'For Submission',
          template: `
            <button 
              type="button"
              class="btn btn-outline-info btn-block text-left" 
              onclick="ProjectOptions.triggerOption('submitEvaluationGrade')"
            >
              <i class="fas fa-list-alt fa-fw mr-1"></i>
              <span>Submit evaluation grade</span>
            </button>
          `
        }, {
          id: 'Approve the project',
          category: 'For Submission',
          template: `
            <button 
              type="button"
              class="btn btn-outline-success btn-block text-left" 
              onclick="ProjectOptions.triggerOption('approveTheProject')"
            >
              <i class="fas fa-check fa-fw mr-1"></i>
              <span>Approve the project</span>
            </button>
          `
        }, {
          id: 'Undo submission',
          category: 'For Submission',
          template: `
            <button 
              type="button"
              class="btn btn-negative btn-block text-left" 
              onclick="ProjectOptions.triggerOption('undoSubmission')"
            >
              <i class="fas fa-undo fa-fw text-warning mr-1"></i>
              <span>Undo submission</span>
            </button>
          `
        }, {
          id: 'Re-sched presentation',
          category: 'For Submission',
          template: `
            <button 
              type="button"
              class="btn btn-negative btn-block text-left" 
              onclick="ProjectOptions.triggerOption('reschedulePresentation')"
            >
              <i class="fas fa-calendar-alt fa-fw mr-1 text-warning"></i>
              <span>Re-sched presentation</span>
            </button>
          `
        }, {
          id: 'Request for revision',
          category: 'For Submission',
          template: `
            <button 
              type="button"
              class="btn btn-negative btn-block text-left" 
              onclick="ProjectOptions.triggerOption('requestForRevision')"
            >
              <i class="fas fa-file-pen fa-fw mr-1 text-warning"></i>
              <span>Request for revision</span>
            </button>
          `
        }, {
          id: 'Cancel the proposal',
          category: 'For Submission',
          template: `
            <button 
              type="button"
              class="btn btn-negative btn-block text-left" 
              onclick="ProjectOptions.triggerOption('cancelTheProposal')"
            >
              <i class="fas fa-times-circle fa-fw mr-1 text-warning"></i>
              <span>Cancel the proposal</span>
            </button>
          `
        },
      ];

      let optionsTemplate;
  
      if (body.length) {
        addOption('View activities');
      } else if (activitiesDT.length) {
        addOption('View project details');
      }

      if (user_roles.includes('Extensionist')) {
        const revisingOptions = () => {
          if (body.length) {
            addOption('Edit project details');
            addOption('Submit for approval');
          }
          if (activitiesDT.length) {
            optionList.unshift('Add project activity');
            optionList.push('Edit project details');
            optionList.push('Submit for approval');
          }
        }
  
        optionsTemplate = {
          'Created': () => revisingOptions(),
          'For Revision': () => revisingOptions(),
          'For Review': () => {
            // addOption('Undo submission');
            addOption('Cancel the proposal');
          },
          'For Evaluation': () => {
            addOption('Cancel the proposal');
          },
          'Pending': () => {
            addOption('Cancel the proposal');
          },
        }
        if (typeof optionsTemplate[status] !== "undefined") optionsTemplate[status]();
      }
  
      if (user_roles.includes('Chief')) {
        optionsTemplate = {
          'For Review': () => {
            addOption('Set presentation schedule');
            addOption('Request for revision');
          },
          'For Evaluation': () => {
            addOption('Submit evaluation grade');
            addOption('Re-sched presentation');
          },
          'Pending': () => {
            addOption('Approve the project');
            addOption('Request for revision');
          }
        }
        if (typeof optionsTemplate[status] !== "undefined") optionsTemplate[status]();
      }

    } 
    
    // * For Monitoring Mode
    else if (mode === 'Monitoring') {

      optionsDict = [

        // ---> CATEGORY: PROJECT ACTIVITIES <--- //
        {
          id: 'View activities',
          category: 'Project Activities',
          template: `
            <div
              role="button"
              class="btn btn-negative btn-block text-left" 
              onclick="location.replace('${BASE_URL_WEB}/p/monitoring/${id}/activities')"
            >
              <i class="fas fa-list text-primary fa-fw mr-1"></i>
              <span>View activities</span>
            </div>
          `
        }, 
        
        // ---> CATEGORY: PROJECT DETAILS <--- //
        {
          id: 'View project details',
          category: 'Project Details',
          template: `
            <div
              role="button"
              class="btn btn-negative btn-block text-left" 
              onclick="location.replace('${BASE_URL_WEB}/p/monitoring/${id}')"
            >
              <i class="fas fa-list text-primary fa-fw mr-1"></i>
              <span>View project details</span>
            </div>
          `
        }, 
        
        // ---> CATEGORY: EDIT DETAILS <--- //
        {
          id: 'Change Time Frame',
          category: 'Edit Details',
          template: `
            <div
              role="button"
              class="btn btn-negative btn-block text-left" 
              onclick="ProjectOptions.triggerOption('changeTimeFrame')"
            >
              <i class="fas fa-calendar-week text-warning fa-fw mr-1"></i>
              <span>Change time frame</span>
            </div>
          `
        },
      ];

      if (body.length) {
        addOption('View activities');
      } else if (activitiesDT.length) {
        addOption('View project details');
      }

      if (user_roles.includes('Extensionist')) {
        addOption('Change Time Frame');
      }
    }

    // * For Activity Evaluation
    else if (mode === 'Activity Evaluation') {

      optionsDict = [

        // ---> CATEGORY: PROJECT ACTIVITIES <--- //
        {
          id: 'View activities',
          category: 'Project Activities',
          template: `
            <div
              role="button"
              class="btn btn-negative btn-block text-left" 
              onclick="location.replace('${BASE_URL_WEB}/p/evaluation/${id}/activities')"
            >
              <i class="fas fa-list text-primary fa-fw mr-1"></i>
              <span>View activities</span>
            </div>
          `
        }, 

        // ---> CATEGORY: PROJECT DETAILS <--- //
        {
          id: 'View project details',
          category: 'Project Details',
          template: `
            <div
              role="button"
              class="btn btn-negative btn-block text-left" 
              onclick="location.replace('${BASE_URL_WEB}/p/evaluation/${id}')"
            >
              <i class="fas fa-list text-primary fa-fw mr-1"></i>
              <span>View project details</span>
            </div>
          `
        },
      ];

      if (body.length) {
        addOption('View activities');
      } else if (activitiesDT.length) {
        addOption('View project details');
      }
    }

    // Set the options based on status
    setHTMLContent(options, getOptionList(optionList));
  }

  const triggerOption = (option) => {
    let optionFunc = {};
    
    if (user_roles.includes('Extensionist')) {
      optionFunc.submitForApproval = () => forApproval_modal.modal('show');
      optionFunc.cancelTheProposal = () => cancelProposal_modal.modal('show');
      optionFunc.changeTimeFrame = () => changeTimeFrame_modal.modal('show');
    }

    if (user_roles.includes('Chief')) {
      optionFunc.approveTheProposal = () => setPresentationSchedule_modal.modal('show');
      optionFunc.reschedulePresentation = () => reschedPresentationSchedule_modal.modal('show');
      optionFunc.requestForRevision = () => forRevision_modal.modal('show');
      optionFunc.submitEvaluationGrade = () => setProjectEvaluation_modal.modal('show');
      optionFunc.approveTheProject = () => approveProject_modal.modal('show');
    }

    if (typeof optionFunc[option] !== "undefined") optionFunc[option]();
  };

  // * * * INIT * * * //

  const init = (data) => {
    if (!initialized) {
      initialized = 1;
      mode = data.mode;
      setOptions(data.project);
      if (mode === 'Proposal') initProposalOptions();
      if (mode === 'Monitoring') initMonitoringOptions();
    }
  }

  // * * * RETURN INIT & PUBLIC METHODS * * * //

  return {
    init,
    setOptions,
    triggerOption
  }
})();


const ProjectComments = (() => {
  
  // * Local Methods

  const container = $('#projectComments_commentsList');
  const formSelector = '#projectComment_form';
  const form = $(formSelector)[0];
  const commentInput = $('#projectComment_comment');
  const user_id = getCookie('user');
  const noCommentDisplay = $('#projectComments_commentsList_noComment');
  let project;
  let comments = [];
  let initialized = false;
  let processing = false;

  // * Private Methods

  const resetForm = () => {
    commentInput.val('').trigger('input');
  }

  const handleForm = () => {
    $app(formSelector).handleForm({
      validators: {},
      onSubmit: () => onFormSubmit()
    });
  }

  const onFormSubmit = async () => {
    if (processing) return;
    processing = true;

    const fd = new FormData(form);
    const body = fd.get('comment').trim();

    if (body === '') {
      resetForm();
      processing = false;
      return;
    }

    const submitBtn = $('#projectComments_postComment_btn');
    submitBtn.attr('disabled', true);
    submitBtn.html('<i class="fas fa-spinner fa-spin-pulse"></i>');

    const enableElements = () => {
      submitBtn.attr('disabled', false);
      submitBtn.html('<i class="fas fa-share"></i>');
    }

    const data = { body: fd.get('comment') }

    const { blockId, commentBlock } = addComment({
      id: '',
      body: data.body,
      created_at: moment().toISOString(),
      user: User.getData(),
    });

    resetForm();
    enableElements();          
    if (comments.length > 0) noCommentDisplay.hide();

    await $.ajax({
      url: `${ BASE_URL_API }/projects/${ project.id }/comments/add`,
      type: 'POST',
      data: data,
      success: res => {
        processing = false;
        if (res.error) {
          ajaxErrorHandler(res.message);
          removeComment(blockId, commentBlock);
        } else {
          comments = comments.map(x => x.block_id == blockId 
            ? { ...res.data, block_id: blockId } : x);
        }
      },
      error: (xhr, status, error) => {
        processing = false;
        ajaxErrorHandler({
          file: 'projects/projectProposalDetails.js',
          fn: 'ProjectComments.handleForm().$.ajax',
          xhr: xhr
        });
        removeComment(blockId, commentBlock);
      }
    });
  }

  const loadComments = () => {
    const comments = project.comments;

    if (!comments.length) {
      noCommentDisplay.show();
    } else {
      // comments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      comments.forEach(c => addComment({ ...c }));
    }
  }

  const removeComment = async (blockId, commentBlock) => {
    if (processing) return;
    processing = true;

    const commentId = comments.find(x => x.block_id == blockId).id;
    if (!commentId) {
      processing = false;
      commentBlock.remove();
      return;
    }

    commentBlock.hide();

    await $.ajax({
      url: `${ BASE_URL_API }/projects/${ project.id }/comments/${ commentId }`,
      type: 'DELETE',
      success: res => {
        processing = false;
        if (res.error) {
          ajaxErrorHandler(res.message);
          commentBlock.show();
        } else {
          comments = comments.filter(x => x.id != commentId);
          commentBlock.remove();
          if (comments.length === 0) noCommentDisplay.show();
        }
      },
      error: (xhr, status, error) => {
        ajaxErrorHandler({
          file: 'projects/projectProposalDetails.js',
          fn: 'ProjectComments.removeComment().$.ajax',
          xhr: xhr
        });
        commentBlock.show();
        processing = false;
      }
    });
  }

  const initEditComment = (blockId, commentBlock) => {

    // Get the comment id
    const commentId = comments.find(x => x.block_id === blockId).id;
    if (!commentId) return;
    
    // Check if there are active edit blocks
    const activeEditBodySection = container.find(`[data-comment-section="editBody"]`);
    if (activeEditBodySection.length) {
      const activeEditBlockId = activeEditBodySection.closest('[data-comment-block]').attr('data-comment-block');
      const activeEditBlock = container.find(`[data-comment-block="${ activeEditBlockId }"]`);
      activeEditBlock.find(`[data-comment-section="editBody"`).remove();
      activeEditBlock.find(`[data-comment-section="displayBody"]`).show();
    }

    const bodySection = commentBlock.find(`[data-comment-section="body"]`);
    const displayBodySection = bodySection.find(`[data-comment-section="displayBody"]`);

    // Hide the display body section
    displayBodySection.hide();

    // Append the form
    bodySection.append(`
      <form class="mt-1" data-comment-section="editBody">
        <div class="form-group mr-3 mb-0 flex-grow-1">
          <input 
            type="text"
            class="form-control form-control-border comment" 
            name="comment" 
            data-comment-input="editBody"
            placeholder="Edit your comment here ..."
          />
        </div>
        <div class="mt-1">
          <button 
            type="submit"
            class="btn btn-sm btn-success" 
            data-comment-btn="saveEdit"
          >
            <i class="fas fa-check mr-1"></i>
            <span>Save</span>
          </button>
          <button 
            type="submit"
            class="btn btn-sm btn-negative" 
            data-comment-btn="cancelEdit"
          >
            <i class="fas fa-times mr-1"></i>
            <span>Cancel</span>
          </button>
        </div>
      </form>
    `);
    
    // * Initiate input * //

    const input = bodySection.find(`[data-comment-input="editBody"]`);

    // Get the old comment
    const oldBody = comments.find(x => x.id == commentId).body;

    // Set the value
    input.val(oldBody);

    // Set focus on input
    input.focus();

    // * Initiate buttons * //

    const saveBtn = bodySection.find(`[data-comment-btn="saveEdit"]`);
    const cancelBtn = bodySection.find(`[data-comment-btn="cancelEdit"]`);

    if (saveBtn.length) {
      saveBtn.on('click', async () => {
        if (processing) return;
        processing = true;

        saveBtn.attr('disabled', true);
        saveBtn.html(`
          <span class="px-2">
            <i class="fas fa-spinner fa-spin-pulse"></i>
          </span>
        `);

        const newBody = bodySection.find(`[data-comment-input="editBody"]`).val();
        
        saveBtn.tooltip('hide');
        bodySection.find(`[data-comment-section="editBody"]`).remove();
        displayBodySection.show();
        
        if (newBody === oldBody) {
          processing = false;
          return;
        }
        
        displayBodySection.find(`[data-comment-part="body"]`).html(newBody);

        await $.ajax({
          url: `${ BASE_URL_API }/projects/${ project.id }/comments/${ commentId }`,
          type: 'PUT',
          data: { body: newBody },
          success: res => {
            processing = false;
            if (res.error) {
              ajaxErrorHandler(res.message);
              displayBodySection.find(`[data-comment-part="body"]`).html(oldBody);
            } else {
              comments = comments.map(x => x.id == commentId ? { ...x, body: newBody} : x);
            }
          },
          error: (xhr, status, error) => {
            processing = false;
            ajaxErrorHandler({
              file: 'projects/projectProposalDetails.js',
              fn: 'ProjectComments.handleForm().$.ajax',
              xhr: xhr
            });
            displayBodySection.find(`[data-comment-part="body"]`).html(oldBody);
          }
        })
      });
    }

    if (cancelBtn.length) {
      cancelBtn.on('click', () => {
        if (processing) return;
        cancelBtn.tooltip('hide');
        bodySection.find(`[data-comment-section="editBody"]`).remove();
        displayBodySection.show();
      });
    }
  }

  const removeLoaders = () => {
    $('#commments_card').show();
  }

  // * Public Methods

  const addComment = (commentObj) => {
    const { body, created_at, user } = commentObj;
    const blockId = uuid();

    // Check if commented by user, if that's the case then add the buttons
    const isCommentedByUser = () => {
      return user.id == user_id 
        ? `
          <div class="mt-2">
            <span
              role="button" 
              class="btn border btn-negative btn-sm px-2 py-1"
              data-comment-btn="edit"
            >
              <i class="fas fa-edit mr-1 text-info"></i>
              <span>Edit</span>
            </span>
            <span
              role="button" 
              class="btn border btn-negative btn-sm px-2 py-1"
              data-comment-btn="delete"
            >
              <i class="fas fa-trash-alt mr-1 text-danger"></i>
              <span>Remove</span>
            </span>
          </div>
        `
        : ''
    }

    const getTime = () => {
      const months = moment().diff(moment(created_at), 'months');
      if (months >= 1) {
        return `${ moment(created_at).format('MMMM DD, YYYY') }`;
      }
      return `<span data-toggle="tooltip" title="${ moment(created_at).format('MMMM DD, YYYY') }">${ fromNow(created_at) }</span>`;
    }

    // Create the comment template
    const comment = `
      <div class="d-flex mt-3 mb-2" data-comment-block="${ blockId }">
        <div class="user-block mr-3">
          <div class="d-inline-block bg-light border rounded-circle" style="width: 34px; height: 34px"></div>
          <!-- <img class="img-circle" src="../../dist/img/user1-128x128.jpg" alt="user image"> -->
        </div>
        <div class="flex-grow-1" data-comment-section="body">
          <a href="${ BASE_URL_WEB }/profile/${ user.id }" class="font-weight-bold text-dark">${ user.first_name } ${ user.last_name }</a>
          <div class="small text-muted" data-comment-part="time">${ getTime() }</div>
          <div data-comment-section="displayBody">
            <div>
              <div class="mt-2" data-comment-part="body">${ body }</div>
            </div>
            ${ isCommentedByUser() }
          </div>
        </div>
      </div>
    `

    // Append the comment
    comments.push({ ...commentObj, block_id: blockId });
    container.prepend(comment);

    // * Initialize the buttons * //

    const commentBlock = $(`[data-comment-block="${ blockId }"]`);

    const editBtn = commentBlock.find(`[data-comment-btn="edit"]`);
    const deleteBtn = commentBlock.find(`[data-comment-btn="delete"]`);

    if (editBtn.length) {
      editBtn.on('click', () => initEditComment(blockId, commentBlock));
    }

    if (deleteBtn.length) {
      deleteBtn.on('click', () => {
        removeComment(blockId, commentBlock);
      });
    }

    // * Initialize the humanized time * //
    const timeDisplay = commentBlock.find(`[data-comment-part="time"]`);
    setInterval(() => {
      const newTime = getTime();
      if (timeDisplay.html() != newTime) timeDisplay.html(newTime);
    }, 200);

    return {
      blockId,
      commentBlock
    }
  }

  // * Init

  const init = (projectData) => {
    if (!initialized) {
      initialized = true;
      project = {
        id: projectData.id,
        comments: projectData.comments,
      };
      handleForm();
      loadComments();
      removeLoaders();
    }
  }

  // * Return Public Methods

  return {
    init,
    addComment
  }

})();


const ProjectActivities = (() => {

  // * Local Variables

  const dtElem_selector = '#activities_dt';
  const dtElem = $(dtElem_selector);
  const viewModal = $('#projectActivityDetails_modal');
  const editModal = $('#editProjectActivity_modal');
  const submitActivityEvaluation_modal = $('#submitActivityEvaluation_modal');
  const editFormSelector = '#editProjectActivity_form';
  const editForm = $(editFormSelector)[0];
  const user_roles = JSON.parse(getCookie('roles'));
  let dt;
  let editValidator;
  let PA_form;
  let AE_form;
  let initialized = false;
  let processing = false; // For edit

  // Data Containers
  let project;
  let mode;

  // * Private Methods

  const initializations = () => {

    // *** For View *** //

    viewModal.on('hidden.bs.modal', () => {

      // Show the loaders
      $('#projectActivityDetails_loader').show();
      $('#projectActivityDetails').hide();

      // Set the default tab
      if (mode === 'Activity Evaluation') $('#projectActivityDetails_details_tab').tab('show');
    });

    // *** For Edit *** //

    if (mode === 'Proposal') {

      // Initialize Start Date
      $app('#editProjectActivity_startDate').initDateInput({
        button: '#editProjectActivity_startDate_pickerBtn'
      });
  
      // Initialize End Date
      $app('#editProjectActivity_endDate').initDateInput({
        button: '#editProjectActivity_endDate_pickerBtn'
      });
      
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
  
      editModal.on('show.bs.modal', (e) => {
        if (!(project.status === 'Created' || project.status === 'For Revision')) e.preventDefault();
      });
  
      editModal.on('shown.bs.modal', () => $(editFormSelector).valid());
  
      editModal.on('hide.bs.modal', (e) => {
        if (processing) e.preventDefault();
      });
  
      editModal.on('hidden.bs.modal', () => {
  
        // Reset the edit form
        editForm.reset();
  
        // Reset the activity form
        PA_form.resetActivityForm();
  
        // Reset the validator
        editValidator.resetForm();
  
        // Show the loaders
        $('#editProjectActivity_formGroups_loader').show();
        $('#editProjectActivity_formGroups').hide();
  
        // Disable buttons
        $('#editProjectActivity_form_saveBtn').attr('disabled', true);
      });
    }

    // *** For Activity Evaluation *** //

    if (mode === 'Activity Evaluation') {
      initActivityEvaluation();
    }
  }

  const initDataTable = async () => {
    let exportConfigs = {/*...DT_CONFIG_EXPORTS*/};

    // exportConfigs.buttons = DT.setExportButtonsObject(exportConfigs.buttons, {
    //   title: 'Project Monitoring - PUPQC-EPMS',
    //   messageTop: 'List of approved projects to be monitored',
    // });

    let dtOptions;

    if (mode === 'Proposal') {
      dtOptions = {
        ...DT_CONFIG_DEFAULTS,
        ...exportConfigs,
        ajax: {
          url: `${ BASE_URL_API }/projects/${ project.id }/activities`,
          // success: result => {
          //   console.log(result);
          // },
          error: (xhr, status, error) => {
            ajaxErrorHandler({
              file: 'projects/PropojectProposalDetails.js',
              fn: 'ProjectActivities.initDataTable',
              xhr: xhr
            }, 1);
          },
          data: {
            types: {
              created_at: 'date',
              activity_name: 'string',
              start_date: 'date',
              end_date: 'date'
            }
          },
          beforeSend: () => {
            dtElem.find('tbody').html(`
              <tr>
                <td colspan="5">${ DT_LANGUAGE.loadingRecords }</td>
              </tr>
            `);
          },
        },
        columns: [
          {
            data: 'created_at',
            visible: false
          }, {
            data: 'activity_name',
            width: '25%',
            render: (data, type, row) => {
              return `
                <span 
                  role="button" 
                  class="text-primary" 
                  data-dt-btn="initViewMode"
                >${ data }</span>
              `
            }
          }, {
            data: null,
            searchable: false,
            sortable: false,
            width: '25%',
            render: data => {
              const topics = data.topics;
              const length = topics.length;
              if (length > 1) {
                return `
                  <div>${ topics[0]}</div>
                  <div class="small text-muted">and ${ length - 1 } more.</div>
                `
              } else if (length == 1) {
                return topics[0]
              } else {
                return `<div class="text-muted font-italic">No topics.</div>`
              }
            }
          }, {
            data: 'start_date',
            width: '22.5%',
            render: (data, type, row) => {
              const start_date = data;
              const needEdit = () => {
                return !moment(start_date).isBetween(
                  moment(project.start_date), 
                  moment(project.end_date),
                  undefined,
                  '[]'
                )
                  ? `
                    <i 
                      class="fas fa-exclamation-triangle fa-beat-fade text-warning mr-1" 
                      style="--fa-animation-duration: 1s;"
                      data-toggle="tooltip" 
                      title="The start date should be within the project timeline"
                    ></i>
                  ` : ''
              }
              return `
                <div>${ needEdit() }${formatDateTime(start_date, 'Date')}</div>
                <div class="small text-muted">${ fromNow(start_date) }</div>
              `
            }
          }, {
            data: 'end_date',
            width: '22.5%',
            render: (data, type, row) => {
              const end_date = data;
              const needEdit = () => {
                return !moment(end_date).isBetween(
                  moment(project.start_date), 
                  moment(project.end_date),
                  undefined,
                  '[]'
                )
                  ? `
                    <i 
                      class="fas fa-exclamation-triangle fa-beat-fade text-warning mr-1" 
                      style="--fa-animation-duration: 1s;"
                      data-toggle="tooltip" 
                      title="The end date should be within the project timeline"
                    ></i>
                  ` : ''
              }
              return `
                <div>${ needEdit() }${formatDateTime(end_date, 'Date')}</div>
                <div class="small text-muted">${ fromNow(end_date) }</div>
              `
            }
          }, {
            data: null,
            width: '5%',
            render: data => {
  
              const editOption = () => {
                return user_roles.includes('Extensionist') && (project.status == 'Created' || project.status == 'For Revision')
                  ? `
                    <button
                      type="button"
                      class="dropdown-item"
                      data-dt-btn="initEditMode"
                    >
                      <span>Edit details</span>
                    </button>
                  `
                  : ''
              }
  
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
                      data-dt-btn="initViewMode"
                    >
                      <span>View details</span>
                    </button>
                    ${ editOption() }
                  </div>
                </div>
              `;
            }
          }
        ]
      }
    } else if (mode === 'Monitoring') {
      dtOptions = {
        ...DT_CONFIG_DEFAULTS,
        ...exportConfigs,
        ajax: {
          url: `${ BASE_URL_API }/projects/${ project.id }/activities`,
          // success: result => {
          //   console.log(result);
          // },
          error: (xhr, status, error) => {
            ajaxErrorHandler({
              file: 'projects/PropojectMonitoringDetails.js',
              fn: 'ProjectActivities.initDataTable',
              xhr: xhr
            }, 1);
          },
          data: {
            types: {
              created_at: 'date',
              activity_name: 'string',
              start_date: 'date',
              end_date: 'date'
            }
          },
          beforeSend: () => {
            dtElem.find('tbody').html(`
              <tr>
                <td colspan="5">${ DT_LANGUAGE.loadingRecords }</td>
              </tr>
            `);
          },
        },
        columns: [
          {
            data: 'start_date',
            visible: false
          }, {
            data: 'activity_name',
            width: '25%',
            render: (data, type, row) => {
              return `
                <span 
                  role="button" 
                  class="text-primary" 
                  data-dt-btn="initViewMode"
                >${ data }</span>
              `
            }
          }, {
            data: null,
            sortable: false,
            width: '22.5%',
            render: data => {
              const topics = data.topics;
              const length = topics.length;
              if (length > 1) {
                return `
                  <div>${ topics[0]}</div>
                  <div class="small text-muted">and ${ length - 1 } more.</div>
                `
              } else if (length == 1) {
                return topics[0]
              } else {
                return `<div class="text-muted font-italic">No topics.</div>`
              }
            }
          }, {
            data: 'start_date',
            width: '22.5%',
            render: (data, type, row) => {
              const start_date = data;
              const needEdit = () => {
                return !moment(start_date).isBetween(
                  moment(project.start_date), 
                  moment(project.end_date),
                  undefined,
                  '[]'
                )
                  ? `
                    <i 
                      class="fas fa-exclamation-triangle fa-beat-fade text-warning mr-1" 
                      style="--fa-animation-duration: 1s;"
                      data-toggle="tooltip" 
                      title="The start date should be within the project timeline"
                    ></i>
                  ` : ''
              }
              return `
                <div>${ needEdit() }${formatDateTime(start_date, 'Date')}</div>
                <div class="small text-muted">${ fromNow(start_date) }</div>
              `
            }
          }, {
            data: 'end_date',
            width: '22.5%',
            render: (data, type, row) => {
              const end_date = data;
              const needEdit = () => {
                return !moment(end_date).isBetween(
                  moment(project.start_date), 
                  moment(project.end_date),
                  undefined,
                  '[]'
                )
                  ? `
                    <i 
                      class="fas fa-exclamation-triangle fa-beat-fade text-warning mr-1" 
                      style="--fa-animation-duration: 1s;"
                      data-toggle="tooltip" 
                      title="The end date should be within the project timeline"
                    ></i>
                  ` : ''
              }
              return `
                <div>${ needEdit() }${formatDateTime(end_date, 'Date')}</div>
                <div class="small text-muted">${ fromNow(end_date) }</div>
              `
            }
          }, {
            data: null,
            searchable: false,
            sortable: false,
            render: (data, type, row) => {
              const { start_date, end_date } = data;
              const today = moment();
              let status;
              if (today.isBefore(start_date) && today.isBefore(end_date)) {
                status = 'Upcoming';
              } else if (today.isAfter(start_date) && today.isAfter(end_date)) {
                status = 'Concluded';
              } else if (today.isBetween(start_date, end_date)) {
                status = 'On going';
              } else {
                status = 'No data';
              }
              const { theme, icon } = PROJECT_MONITORING_STATUS_STYLES[status];
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
            width: '5%',
            render: () => {
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
                      data-dt-btn="initViewMode"
                    >
                      <span>View details</span>
                    </button>
                  </div>
                </div>
              `;
            }
          }
        ]
      }
    } else if (mode === 'Activity Evaluation') {
      dtOptions = {
        ...DT_CONFIG_DEFAULTS,
        ...exportConfigs,
        ajax: {
          url: `${ BASE_URL_API }/projects/${ project.id }/activities`,
          // success: result => {
          //   console.log(result);
          // },
          error: (xhr, status, error) => {
            ajaxErrorHandler({
              file: 'projects/PropojectMonitoringDetails.js',
              fn: 'ProjectActivities.initDataTable',
              xhr: xhr
            }, 1);
          },
          data: {
            types: {
              created_at: 'date',
              activity_name: 'string',
              start_date: 'date',
              end_date: 'date'
            }
          },
          beforeSend: () => {
            dtElem.find('tbody').html(`
              <tr>
                <td colspan="5">${ DT_LANGUAGE.loadingRecords }</td>
              </tr>
            `);
          },
        },
        columns: [
          {
            data: 'start_date',
            visible: false
          }, {
            data: 'activity_name',
            width: '25%',
            render: (data, type, row) => {
              return `
              <span 
                role="button" 
                class="text-primary" 
                data-dt-btn="initViewMode"
              >${ data }</span>
            `
            }
          }, {
            data: null,
            sortable: false,
            width: '22.5%',
            render: data => {
              const topics = data.topics;
              const length = topics.length;
              if (length > 1) {
                return `
                  <div>${ topics[0]}</div>
                  <div class="small text-muted">and ${ length - 1 } more.</div>
                `
              } else if (length == 1) {
                return topics[0]
              } else {
                return `<div class="text-muted font-italic">No topics.</div>`
              }
            }
          }, {
            data: 'start_date',
            width: '22.5%',
            render: (data, type, row) => {
              const start_date = data;
              const needEdit = () => {
                return !moment(start_date).isBetween(
                  moment(project.start_date), 
                  moment(project.end_date),
                  undefined,
                  '[]'
                )
                  ? `
                    <i 
                      class="fas fa-exclamation-triangle fa-beat-fade text-warning mr-1" 
                      style="--fa-animation-duration: 1s;"
                      data-toggle="tooltip" 
                      title="The start date should be within the project timeline"
                    ></i>
                  ` : ''
              }
              return `
                <div>${ needEdit() }${formatDateTime(start_date, 'Date')}</div>
                <div class="small text-muted">${ fromNow(start_date) }</div>
              `
            }
          }, {
            data: 'end_date',
            width: '22.5%',
            render: (data, type, row) => {
              const end_date = data;
              const needEdit = () => {
                return !moment(end_date).isBetween(
                  moment(project.start_date), 
                  moment(project.end_date),
                  undefined,
                  '[]'
                )
                  ? `
                    <i 
                      class="fas fa-exclamation-triangle fa-beat-fade text-warning mr-1" 
                      style="--fa-animation-duration: 1s;"
                      data-toggle="tooltip" 
                      title="The end date should be within the project timeline"
                    ></i>
                  ` : ''
              }
              return `
                <div>${ needEdit() }${formatDateTime(end_date, 'Date')}</div>
                <div class="small text-muted">${ fromNow(end_date) }</div>
              `
            }
          }, {
            data: null,
            searchable: false,
            sortable: false,
            render: (data, type, row) => {
              const status = data.evaluation ? 'Evaluated' : 'Not yet graded';
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
            width: '5%',
            render: data => {
  
              const submitEvaluationGrade = () => {
                const status = data.evaluation ? 'Evaluated' : 'Not yet graded';
                return user_roles.includes('Extensionist') && status === 'Not yet graded'
                  ? `
                    <div
                      role="button"
                      class="dropdown-item"
                      onclick="ProjectActivities.submitPostEvaluation('${ data.id }')"
                    >
                      <span>Submit post evaluation</span>
                    </div>
                  `
                  : ''
                  // `
                  //   <div
                  //     role="button"
                  //     class="dropdown-item"
                  //     onclick="ProjectActivities.editPostEvaluation('${ data.id }')"
                  //   >
                  //     <span>Edit post evaluation</span>
                  //   </div>
                  // `
              }
  
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
                      data-dt-btn="initViewMode"
                    >
                      <span>View details</span>
                    </button>
                    ${ submitEvaluationGrade() }
                  </div>
                </div>
              `;
            }
          }
        ]
      }
    }

    if (dtOptions) dt = await dtElem.DataTable(dtOptions);

    $(dtElem_selector).on('click', `[data-dt-btn="initViewMode"]`, (e) => {
      const row = $(e.currentTarget).closest('tr');
      const data = dt.row(row).data();
      initViewMode(data);
    });

    $(dtElem_selector).on('click', `[data-dt-btn="initEditMode"]`, (e) => {
      const row = $(e.currentTarget).closest('tr');
      const data = dt.row(row).data();
      initEditMode(data);
    });
  }

  const handleEditForm = () => {
    editValidator = $app(editFormSelector).handleForm({
      validators: {
        title: {
          required: 'The title of the activity is required.',
          notEmpty: 'This field cannot be blank.',
          minlength: {
            rule: 5,
            message: 'Make sure you enter the full title of the activity.'
          }
        },
        start_date: {
          required: 'Please select a start date', 
          dateISO: 'Your input is an invalid date',
          sameOrAfterDateTime: {
            rule: () => project.start_date,
            message: 'The start date must be within the project timeline.'
          },
          sameOrBeforeDateTime: {
            rule: () => project.end_date,
            message: 'The start date must be within the project timeline.'
          },
          sameOrBeforeDateTimeSelector: {
            rule: '#editProjectActivity_endDate',
            message: "The start date must be earlier than the end date."
          }
        },
        end_date: {
          required: 'Please select a end date', 
          dateISO: 'Your input is an invalid date',
          sameOrAfterDateTime: {
            rule: () => project.start_date,
            message: 'The end date must be within the project timeline.'
          },
          sameOrBeforeDateTime: {
            rule: () => project.end_date,
            message: 'The end date must be within the project timeline.'
          },
          sameOrAfterDateTimeSelector: {
            rule: '#editProjectActivity_startDate',
            message: "The end date must be later than the end date."
          }
        },
        details: {
          required: 'The summary/details of the activity is required.',
          notEmpty: 'This field cannot be blank.',
          minlength: {
            rule: 5,
            message: 'Make sure you enter the full summary or details of the activity.'
          }
        }
      },
      onSubmit: () => onEditFormSubmit()
    });
  }

  const onEditFormSubmit = async () => {
    if (!(project.status == 'Created' || project.status == 'For Revision')) return;

    processing = true;

    // Disable the elements
    const saveBtn = $('#editProjectActivity_saveBtn');
    const cancelBtn = $('#editProjectActivity_cancelBtn');
    
    cancelBtn.attr('disabled', true);
    saveBtn.attr('disabled', true);
    saveBtn.html(`
      <span class="px-3">
        <i class="fas fa-spinner fa-spin-pulse"></i>
      </span>
    `);

    // For enabling elements
    const enableElements = () => {

      // Enable buttons
      cancelBtn.attr('disabled', false);
      saveBtn.attr('disabled', false);
      saveBtn.html(`Submit`);

      processing = false;
    }

    // Get the data
    const fd = new FormData(editForm);
    const data = {
      activity_name: fd.get('title'),
      ...PA_form.getActivityData(),
      start_date: fd.get('start_date'),
      end_date: fd.get('end_date'),
      details: fd.get('details')
    }

    await $.ajax({
      url: `${ BASE_URL_API }/projects/${ project.id }/activities/${ fd.get('activity_id') }`,
      type: 'PUT',
      data: data,
      success: async res => {
        if (res.error) {
          ajaxErrorHandler(res.message);
          enableElements();
        } else {
          await reloadDataTable();
          enableElements();
          editModal.modal('hide');
          toastr.success('A project activity has been successfully updated');
        }
      }, 
      error: (xhr, status, error) => {
        enableElements();
        ajaxErrorHandler({
          file: 'projects/projectProposalDetails.js',
          fn: 'ProjectActivities.onEditFormSubmit()',
          data: data,
          xhr: xhr
        });
      }
    });

  }

  const initActivityEvaluation = () => {
    $app('#activityEvaluation_form').handleForm({
      validators: {},
      onSubmit: async () => {

        processing = true;

        // Get data
        const data = { 
          evaluation: AE_form.getEvaluation()
        }

        const confirmBtn = $('#activityEvaluation_submitBtn');

        // Disable elements
        confirmBtn.attr('disabled', true);
        confirmBtn.html(`
          <span class="px-3">
            <i class="fas fa-spinner fa-spin-pulse"></i>
          </span>
        `);
        
        // Enable elements function
        const enableElements = () => {
          confirmBtn.attr('disabled', false);
          confirmBtn.html('Submit');
        }

        const fd = new FormData($('#activityEvaluation_form')[0]);

        await $.ajax({
          url: `${ BASE_URL_API }/projects/${ project.id }/activities/${ fd.get('activity_id') }/evaluate`,
          type: 'POST',
          data: data,
          success: async (res) => {
            processing = false;
            if (res.error) {
              ajaxErrorHandler(res.message);
            } else {
              enableElements();
              await ProjectActivities.reloadDataTable();
              submitActivityEvaluation_modal.modal('hide');
              toastr.success('An activity has been successfully evaluated');
            }
          },
          error: (xhr, status, error) => {
            processing = false;
            enableElements();
            ajaxErrorHandler({
              file: 'projects/projectMain.js',
              fn: 'ProjectActivities.initActivityEvaluation()',
              xhr: xhr
            });
          }
        });
      }
    });

    AE_form = new ActivityEvaluationForm($('#activityEvaluation_form'));

    submitActivityEvaluation_modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });

    submitActivityEvaluation_modal.on('hidden.bs.modal', () => {
      AE_form.resetForm();
    });
  }

  // * Public Methods

  const reloadDataTable = async () => {
    await dt.ajax.reload();
  }

  const initViewMode = async (data) => {

    // Show the modal
    viewModal.modal('show');
    
    const { 
      id,
      activity_name, 
      topics, 
      outcomes,
      start_date,
      end_date,
      details,
      evaluation
    } = data;

    // Set Content
    setHTMLContent({
      '#projectActivityDetails_title': activity_name,
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
      '#projectActivityDetails_timeframe': () => {
        if (start_date && end_date) {
          const needStartDateEdit = () => {
            return !moment(start_date).isBetween(
              moment(project.start_date), 
              moment(project.end_date),
              undefined,
              '[]'
            )
              ? `
                <i 
                  class="fas fa-exclamation-triangle fa-beat-fade text-warning mr-1" 
                  style="--fa-animation-duration: 1s;"
                  data-toggle="tooltip" 
                  title="The start date should be within the project timeline"
                ></i>
              ` : ''
          }
          const needEndDateEdit = () => {
            return !moment(end_date).isBetween(
              moment(project.start_date), 
              moment(project.end_date),
              undefined,
              '[]'
            )
              ? `
                <i 
                  class="fas fa-exclamation-triangle fa-beat-fade text-warning mr-1" 
                  style="--fa-animation-duration: 1s;"
                  data-toggle="tooltip" 
                  title="The end date should be within the project timeline"
                ></i>
              ` : ''
          }
          const getDuration = () => {
            return moment(start_date).isSame(moment(end_date))
              ? 'in the whole day'
              : moment(start_date).to(moment(end_date), true)
          }
          const forMonitoring = () => {
            if(mode === 'Monitoring') {
              const today = moment();
              let status;
              if (today.isBefore(start_date) && today.isBefore(end_date)) {
                status = 'Upcoming';
              } else if (today.isAfter(start_date) && today.isAfter(end_date)) {
                status = 'Concluded';
              } else if (today.isBetween(start_date, end_date)) {
                status = 'On going';
              } else {
                status = 'No data';
              }
              const { theme, icon } = PROJECT_MONITORING_STATUS_STYLES[status];
              const statusTemplate = `
                <div class="badge badge-subtle-${ theme } px-2 py-1">
                  <i class="${ icon } fa-fw mr-1"></i>
                  <span>${ status }</span>
                </div>
              `;
              return `
                <div class="col-12"><div class="mt-2"></div></div>

                <div class="pl-0 col-4 col-lg-2">
                  <div class="font-weight-bold">Status:</div>
                </div>
                <div class="col-8 col-lg-10">
                  ${ statusTemplate }
                </div>
              `
            }
            return '';
          }
          return `
            <div class="ml-4 ml-lg-0 row">
              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">Start Date:</div>
              </div>
              <div class="col-8 col-lg-10">
                <div>${ needStartDateEdit() }${ moment(start_date).format('MMMM D, YYYY (dddd)') }</div>
                <div class="small text-muted">${ fromNow(start_date) }</div>
              </div>

              <div class="col-12"><div class="mt-2"></div></div>

              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">End Date:</div>
              </div>
              <div class="col-8 col-lg-10">
                <div>${ needEndDateEdit() }${ moment(end_date).format('MMMM D, YYYY (dddd)') }</div>
                <div class="small text-muted">${ fromNow(end_date) }</div>
              </div>

              <div class="col-12"><div class="mt-2"></div></div>

              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">Duration:</div>
              </div>
              <div class="col-8 col-lg-10">
                <div>Approximately ${ getDuration() }</div>
              </div>

              ${ forMonitoring() }
            </div>
          `
        } else return noContentTemplate('No dates have been set up.');
      },
      '#projectActivityDetails_details': details
    });
    
    // Hide the loaders
    $('#projectActivityDetails_loader').hide();
    $('#projectActivityDetails').show();
    
    if (mode === "Activity Evaluation") {
      setHTMLContent('#projectActivityDetails_postEvaluation_pane', () => {
        if (evaluation) {
          let rows = '';
          evaluation.forEach(eval_group => {
            rows += `
              <tr>
                <td 
                  colspan="2" 
                  class="font-weight-bold" 
                  style="background: #f6f6f6"
                >${ eval_group.category }</td>
              </tr>
            `;

            eval_group.criteria.forEach(criterion_group => {
              rows += `
                <tr>
                  <td>${ criterion_group.criterion }</td>
                  <td class="text-right">${ parseFloat(criterion_group.rate).toFixed(2) }</td>
                </tr>
              `
            });
          })
          return `
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <th width="90%" class="align-middle">Criteria</th>
                  <th width="10%" class="align-middle text-right">Rate</th>
                </thead>
                <tbody>
                  ${ rows }
                </tbody>
              </table>
            </div>
          `
        } else {
          if (user_roles.includes('Extensionist')) {
            return `
              <div class="p-5 text-center">
                <div class="display-3 mb-2">
                  <i class="fas fa-circle-question text-secondary"></i>
                </div>
                <h3>No post evaluation yet.</h3>
                <p>This project activity is not yet graded. You can submit by clicking the button below.</p>
                <button 
                  class="btn btn-success" 
                  onclick="ProjectActivities.submitPostEvaluation('${ id }')"
                >
                  <i class="fas fa-file-import mr-1"></i>
                  <span>Submit Post Evaluation</span>
                </button>
              </div>
            `
          } else {
            return `
              <div class="p-5 text-center">
                <div class="display-3 mb-2">
                  <i class="fas fa-circle-question text-secondary"></i>
                </div>
                <h3>No post evaluation yet.</h3>
                <p>This project activity is not yet graded but expected to have soon.</p>
              </div>
            `
          }
        }
      });
    }

    if (mode === 'Activity Evaluation') $('#projectActivityDetails_tabs').show();
  }

  const initEditMode = async (data) => {
    if (
      mode !== 'Proposal'
      || !(project.status === 'Created' || project.status === 'For Revision')
    ) return;

    // Show the modal
    editModal.modal('show');

    const { 
      id,
      activity_name, 
      topics, 
      outcomes,
      start_date,
      end_date,
      details
    } = data;
  
    // Set the input vaDlues
    setInputValue({
      '#editProjectActivity_activityId': id,
      '#editProjectActivity_title': activity_name,
      '#editProjectActivity_startDate': formatDateTime(start_date, 'YYYY-MM-DD'),
      '#editProjectActivity_endDate': formatDateTime(end_date, 'YYYY-MM-DD'),
      '#editProjectActivity_details': details,
    });

    // To make sure that input dates are updated
    $('#editProjectActivity_startDate').trigger('change');
    $('#editProjectActivity_endDate').trigger('change');

    // Set the topics and outcomes
    PA_form.setTopics(topics);
    PA_form.setOutcomes(outcomes);

    // Hide the loaders
    $('#editProjectActivity_formGroups_loader').hide();
    $('#editProjectActivity_formGroups').show();
    
    // Enable buttons
    $('#editProjectActivity_form_saveBtn').attr('disabled', false);
  }
  
  const submitPostEvaluation = async (activity_id) => {
    if (mode !== 'Activity Evaluation') return;

    // Set the activity id
    $('#activityEvaluation_activityId').val(activity_id);
    
    // Hide the view modal if shown
    viewModal.modal('hide');

    // Show the activity evaluation modal
    submitActivityEvaluation_modal.modal('show');
  }

  // * Init

  const init = (data) => {
    if (!initialized) {
      initialized = true;
      project = data.project;
      mode = data.mode;
      handleEditForm();
      initializations();
      initDataTable();
    };
  }

  // * Return Public Functions

  return {
    init,
    reloadDataTable,
    submitPostEvaluation
  }
})();


const AddProjectActivity = (() => {

  /**
   * * Local Variables
   */
  const formSelector = '#addProjectActivity_form';
  const form = $(formSelector)[0];
  const addActivityModal = $('#addProjectActivity_modal');
  let validator;
  let PA_form;
  let initiated = 0;
  let processing = false;
  let project;

  /**
   * * Private Functions
   */

  const initProjectActivityForm = () => {
    
    // Initialize Start Date
    $app('#addProjectActivity_startDate').initDateInput({
      button: '#addProjectActivity_startDate_pickerBtn'
    });

    // Initialize End Date
    $app('#addProjectActivity_endDate').initDateInput({
      button: '#addProjectActivity_endDate_pickerBtn'
    });

    PA_form = new ProjectActivityForm({
      topicsForm: {
        formGroup: '#addProjectActivity_topics_grp',
        buttons: {
          add: '#addTopic_btn',
          clear: '#clearTopicEmptyFields_btn'
        }
      },
      outcomesForm: {
        formGroup: '#addProjectActivity_outcomes_grp',
        buttons: {
          add: '#addOutcome_btn',
          clear: '#clearOutcomeEmptyFields_btn'
        }
      }
    });
    
    // On modal hide
    addActivityModal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    })

    // On modal hidden
    addActivityModal.on('hidden.bs.modal', (e) => {
      processing ? e.preventDefault() : resetForm();
    });
  }

  const resetForm = () => {

    // Reset validation
    validator.resetForm();
    
    // Reset native inputs
    form.reset();

    // Reset Automated Forms
    PA_form.resetActivityForm();
  }

  const handleForm = () => {
    validator = $app(formSelector).handleForm({
      validators: {
        title: {
          required: 'The title of the activity is required.',
          notEmpty: 'This field cannot be blank.',
          minlength: {
            rule: 5,
            message: 'Make sure you enter the full title of the activity.'
          }
        },
        start_date: {
          required: 'Please select a start date',
          dateISO: 'Your input is not a valid date',
          sameOrAfterDateTime: {
            rule: () => project.start_date,
            message: 'The start date must be within the project timeline.'
          },
          sameOrBeforeDateTime: {
            rule: () => project.end_date,
            message: 'The start date must be within the project timeline.'
          },
          sameOrBeforeDateTimeSelector: {
            rule: '#addProjectActivity_endDate',
            message: "The start date must be earlier than the end date"
          }
        },
        end_date: {
          required: 'Please select a end date',
          dateISO: 'Your input is not a valid date',
          sameOrAfterDateTime: {
            rule: () => project.start_date,
            message: 'The end date must be within the project timeline.'
          },
          sameOrBeforeDateTime: {
            rule: () => project.end_date,
            message: 'The end date must be within the project timeline.'
          },
          sameOrAfterDateTimeSelector: {
            rule: '#addProjectActivity_startDate',
            message: "The end date must be later than the start date"
          }
        },
        details: {
          required: 'The summary/details of the activity is required.',
          notEmpty: 'This field cannot be blank.',
          minlength: {
            rule: 5,
            message: 'Make sure you enter the full summary or details of the activity.'
          }
        }
      },
      onSubmit: () => onFormSubmit()
    });
  }
  
  const onFormSubmit = async () => {
    if (!(project.status === 'Created' || project.status === 'For Revision')) return;

    processing = true;

    // Disable the elements
    const saveBtn = $('#addProjectActivity_saveBtn');
    const cancelBtn = $('#addProjectActivity_cancelBtn');
    
    cancelBtn.attr('disabled', true);
    saveBtn.attr('disabled', true);
    saveBtn.html(`
      <span class="px-3">
        <i class="fas fa-spinner fa-spin-pulse"></i>
      </span>
    `);

    // For enabling elements
    const enableElements = () => {

      // Enable buttons
      cancelBtn.attr('disabled', false);
      saveBtn.attr('disabled', false);
      saveBtn.html(`Submit`);

      processing = false;
    }


    // Get the data
    const fd = new FormData(form);
    const data = {
      activity_name: fd.get('title'),
      ...PA_form.getActivityData(),
      start_date: fd.get('start_date'),
      end_date: fd.get('end_date'),
      details: fd.get('details'),
      status: 'Not evaluated'
    }

    // Save data to db
    await $.ajax({
      url: `${ BASE_URL_API }/projects/${ project.id }/activities/create`,
      type: 'POST',
      data: data,
      success: async res => {
        if (res.error) {
          ajaxErrorHandler(res.message);
          enableElements();
        } else {

          // Reload the datatable
          await ProjectActivities.reloadDataTable();
          
          // Enable Elements
          enableElements();

          // Hide the modal
          addActivityModal.modal('hide');
          
          // Reset the form
          resetForm();

          // Show a toast notification
          toastr.success('An activity has been successfully added.');
        }
      },
      error: (xhr, status, error) => {
        enableElements();
        ajaxErrorHandler({
          file: 'projects/projectProposalDetails.js',
          fn: 'AddProjectActivity.onFormSubmit()',
          data: data,
          xhr: xhr
        });
      }
    });
  }

  /**
   * * Init
   */

  const init = (data) => {
    if (!initiated) {
      initiated = 1;
      if (data.mode = 'Proposal') {
        project = data.project;
        if (JSON.parse(getCookie('roles')).includes('Extensionist')) {
          handleForm();
          initProjectActivityForm();
        }
      }
    }
  }
  
  /**
   * * Return Public Functions
   */

  return {
    init,
  }
})();


const ProjectHistory = (()=>{

  // * Local variables

  const timeline = $('#timeline');
  const timeline_title = $('#timeline_title');
  let initialized = false;

  // * Private Methods

  const showTimeline = (history) => {
    const getAuthor = () => {
      let { author, author_id } = history;
      if (!author_id && !author) return '<span class="font-italic">Unknown</span>';
      if(author_id && !author && author_id === getCookie('user')) {
        author = User.getData();
      }
      const { first_name: F, middle_name: M, last_name: L, suffix_name: S } = author;
      return formatName('F M. L, S', {
        firstName: F,
        middleName: M,
        lastName: L,
        suffixName: S,
      });
    }

    const getRemarks = () => {
      const { remarks } = history;
      if (remarks) {
        return `
          <div class="mt-2">
            <div class="font-weight-bold">Remarks</div>
            <div>${ remarks }</div>
          </div>
        `
      }
      return '';
    }
    const { theme, icon } = PROJECT_HISTORY_STYLES[history.current_value]
    const previous = history.previous_value != null
      ? `
        <span>${ history.previous_value }</span>
        <i class="fa-solid fa-caret-right mx-1"></i>
      `
      : ''
    return `
      <div>
        <i class="${icon} bg-${theme}"></i>
        <div class="timeline-item">
          <div class="timeline-header">
            <div class="small font-weight-bold">
              ${previous}
              <span>${history.current_value}</span>
            </div>
          </div>
          <div class="timeline-body small">
            <div>${moment(history.created_at).format('MMMM D, YYYY (dddd)')}</div>
            <div>By: ${ getAuthor() }</div>
            ${ getRemarks() }
          </div>
        </div>
      </div>
    `
  }

  const removeLoaders = () => {
    timeline.show();
  }

  // * Public Methods
  
  const addToTimeline = (history) => {
    timeline_title.after(showTimeline(history))
  }

  // * Init

  const init = (history) => {
    if (!initialized) {
      initialized = true;
      history.forEach(el => addToTimeline(el));
      removeLoaders();
    }
  }

  return {
    init,
    addToTimeline
  }
})();


const ProjectDocuments = (() => {
  
  // * Local Variables
  
  const user_roles = JSON.parse(getCookie('roles'));

  const dtElem = $('#uploadedDocuments_dt');
  const uploadDocuments_modal = $('#uploadDocuments_modal');
  const totalProgress_elem = $("#total_progress");
  const totalProgressCount_elem = $("#total_progress_count");
  const startUpload_btn = $("#startUpload_btn");
  
  const renameFile_modal = $('#renameFile_modal');
  const deleteDocument_modal = $('#deleteDocument_modal');
  
  let project;
  let dt;
  let dz; // For dropzone
  let initialized = false;
  let processing = false;

  // * Private Methods

  const initializations = async () => {
    await initializeDropzone();
    handleSubmitDocumentForm();
    handleUploadDocumentsModal();
    handleRenameFileModal();
    handleDeletDocumentModal();
  }

  const initializeDropzone = async () => {

    // Get the template HTML and remove it from the doument.
    let previewNode = document.querySelector("#dropFiles_fileTemplate");
    previewNode.id = "";
    let previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);

    dz = await new Dropzone(document.querySelector('#dropFiles_container'), {
      url: `${ BASE_URL_API }/documents/project/${ project.id }`, // Set the url
      thumbnailWidth: 80,
      thumbnailHeight: 80,
      parallelUploads: 20,
      previewTemplate: previewTemplate,
      autoQueue: false, // Make sure the files aren't queued until manually added
      previewsContainer: "#dropFiles_previews", // Define the container to display the previews
      clickable: "#dropFiles_browse_btn" // Define the element that should be used as click trigger to select files.
    });

    const getBgColor = (progress) => {
      if (progress >= 0 && progress <= 33) return 'bg-danger';
      else if(progress > 33 && progress <= 66) return 'bg-warning';
      else if(progress > 66 && progress < 100) return 'bg-info';
      else if(progress === 100) return 'bg-success';
    }

    // * HANDLE GENERAL METHODS

    dz.on("addedfile", (file) => {
    });

    dz.on("removedfile", (file) => {
      // toastr.info(`The file "${ file.upload.filename }" has been removed.`);
    });

    dz.on("reset", () => {
      totalProgress_elem.css({ width: 0 }).html('');
      totalProgressCount_elem.html('0.00%');
    });

    // * HANDLE PER FILE

    // When a file has been uploading
    dz.on("uploadprogress", (file, progress, bytesSent) => {
      processing = true;

      $(file.previewElement)
        .find(`[data-dz-uploadprogress-count]`)
        .html(`${ progress.toFixed(2) }%`);

      $(file.previewElement)
        .find(`[data-dz-uploadprogress]`)
        .removeClass()
        .addClass(() => {
          return `progress-bar progress-bar-striped progress-bar-animated ${ getBgColor(progress) }`
        });
    });

    // When a file has been successfully uploaded
    dz.on("success", (file) => {
      $(file.previewElement)
        .find(`[data-dz-uploadprogress]`)
        .removeClass('progress-bar-striped progress-bar-animated bg-warning')
        .addClass('bg-success')
        .html(`<i class="fas fa-check"></i>`);

      $(file.previewElement)
        .find(`[data-dz-cancel-btn]`)
        .remove();

      const ok_btn = $(file.previewElement).find(`[data-dz-ok-btn]`)
      
      ok_btn.show();
      ok_btn.on('click', () => ok_btn.tooltip('hide'));
    });

    // When there's an error in uploading file
    dz.on("error", (file, message) => {
      console.trace(message)
    });

    dz.on("sending", () => {

      // Show the total progress bar when upload starts
      $("#total_progress_container").show();
      
      // And disable the start button
      startUpload_btn.attr("disabled", true);
      startUpload_btn.html(`
        <span class="px-3">
          <i class="fas fa-spinner fa-spin-pulse"></i>
        </span>
      `);
    });

    dz.on("canceled", (file) => {
      toastr.info(`The file "${ file.upload.filename }" has been cancelled for uploading.`);
    });

    // * FOR TOTAL PROGRESS

    // Update the total progress bar
    dz.on("totaluploadprogress", (progress) => {
      totalProgress_elem
        .css({ width: `${ progress }%` })
        .removeClass()
        .addClass(() => {
          return `progress-bar progress-bar-striped progress-bar-animated ${ getBgColor(progress) }`
        })
        .html('');
      totalProgressCount_elem.html(`${ progress.toFixed(2) }%`);
    });
    
    // Hide the total progress bar when nothing's uploading anymore
    dz.on("queuecomplete", async (progress) => {
      processing = false;

      toastr.success('Your files has been successfully uploaded.');

      totalProgress_elem
        .removeClass('progress-bar-striped progress-bar-animated bg-warning')
        .addClass('bg-success')
        .html(`<i class="fas fa-check"></i>`);
        
      startUpload_btn.attr("disabled", false);
      startUpload_btn.html(`
        <i class="fas fa-upload fa-fw mr-1"></i>
        <span>Start Upload</span>
      `);

      await reloadDataTable();
    });

  }

  const handleSubmitDocumentForm = () => {
    $app('#submitActivityEvaluation_form').handleForm({
      validators: {},
      onSubmit: () => {
        dz.enqueueFiles(dz.getFilesWithStatus(Dropzone.ADDED));
      }
    });
  }

  const handleUploadDocumentsModal = () => {
    uploadDocuments_modal.on('hide.bs.modal', (e) => {
      if (processing) e.preventDefault();
    });

    uploadDocuments_modal.on('hidden.bs.modal', (e) => {
      dz.removeAllFiles(true);
      
      $("#total_progress").css({ width: `0` });
      $("#total_progress_count").html(`0.00%`);
    });
  }

  const handleRenameFileModal = () => {
    $app('#renameFile_form').handleForm({
      validators: {
        file_name: {
          required: 'The file name is required',
          notEmpty: 'This field cannot be blank'
        }
      },
      onSubmit: () => {
        alert('Submitted');
      }
    });

    renameFile_modal.on('hidden.bs.modal', () => {
      $('#renameFile_form')[0].reset();
    });
  }

  const deleteFile = async (document_id) => {
    processing = true;

    const confirmBtn = deleteDocument_modal.find(`[data-delete-document-confirm-btn]`);

    confirmBtn.attr('disabled', true);
    confirmBtn.html(`
      <span class="px-3">
        <i class="fas fa-spinner fa-spin-pulse"></i>
      </span>
    `);

    // For enabling elements
    const enableElements = () => {

      // Enable buttons
      confirmBtn.attr('disabled', false);
      confirmBtn.html(`Yes, I'm sure.`);
    }

    await $.ajax({
      url: `${ BASE_URL_API }/documents/${ document_id }`,
      type: 'DELETE',
      success: async (res) => {
        processing = false;
        if (res.error) {
          enableElements();
          ajaxErrorHandler(res.message);
        } else {
          await reloadDataTable();
          deleteDocument_modal.modal('hide');
          enableElements();
          toastr.info('A file has been deleted.');
        }
      },
      error: (xhr, status, error) => {
        processing = false;
        enableElements();
        ajaxErrorHandler({
          file: 'projects/projectMain.js',
          fn: 'ProjectDocuments.deleteFile()',
          xhr: xhr
        });
      }
    });
  }

  const handleDeletDocumentModal = () => {
    const confirmBtn = deleteDocument_modal
      .find(`[data-delete-document-confirm-btn]`)

    confirmBtn.on('click', () => deleteFile(confirmBtn.attr(`data-delete-document-confirm-btn`)));

    deleteDocument_modal.on('hide.bs.modal', (e) => {
      if(processing) e.preventDefault();
      deleteDocument_modal
        .find(`[data-delete-document-confirm-btn]`)
        .attr('data-delete-document-confirm-btn', '');
      confirmBtn.attr(`data-delete-document-confirm-btn`, '');
    });
  }

  const initDataTable = async () => {
    dt = await dtElem.DataTable({
      ...DT_CONFIG_DEFAULTS,
      ajax: {
        url: `${ BASE_URL_API }/documents/project/${ project.id }/datatables`,
        // success: result => {
        //   console.log(result);
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'projects/projectMain.js',
            fn: 'ProjectDocuments.initDataTable',
            xhr: xhr
          }, 1);
        },
        data: {
          types: {
            created_at: 'date',
            file_name: 'string',
            mimetype: 'date',
          }
        },
        beforeSend: () => {
          dtElem.find('tbody').html(`
            <tr>
              <td colspan="5">${ DT_LANGUAGE.loadingRecords }</td>
            </tr>
          `);
        },
      },
      columns: [
        {
          data: 'created_at', 
          visible: false
        }, {
          data: 'file_name',
          width: '45%',
          render: (data, type, row) => {
            if (data.length > 39) {
              return `<span data-toggle="tooltip" title="${ data }">${ data.substring(0, 35) } ...</span>`
            } else {
              return data;
            }
          }
        }, {
          data: 'mimetype',
        }, {
          data: 'created_at',
          width: '25%',
          render: (data) => {
            return `
              <div>${ formatDateTime(data, 'Date') }</div>
              <div class="small text-muted">${ fromNow(data) }</div>
            `
          }
        }, {
          data: null,
          width: '5%',
          render: (data) => {
            const renameOption = () => {
              return user_roles.includes('Extensionist')
                ? `
                  <div
                    role="button"
                    class="dropdown-item"
                    onclick="ProjectDocuments.initRenameFile('${ data.id }', '${ data.file_name }')"
                  >
                    <i class="fas fa-pen fa-fw mr-1"></i>
                    <span>Rename</span>
                  </div>
                ` : ''
            }

            const deleteOption = () => {
              return user_roles.includes('Extensionist')
                ? `
                  <div class="dropdown-divider"></div>
                  <div
                    role="button"
                    class="dropdown-item"
                    onclick="ProjectDocuments.initDeleteFile('${ data.id }', '${ data.file_name }')"
                  >
                    <i class="fas fa-trash-alt fa-fw mr-1"></i>
                    <span>Delete</span>
                  </div>
                ` : ''
            }

            return `
              <div class="dropdown text-center">
                <div class="btn btn-sm btn-negative" data-toggle="dropdown" data-dt-btn="options" title="Options">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
                <div class="dropdown-menu dropdown-menu-right">
                  <div class="dropdown-header">Options</div>
                  ${ renameOption() }
                  <a
                    role="button"
                    href="${ BASE_URL_API }/documents/${ data.upload_name }"
                    download="${ data.file_name }"
                    class="dropdown-item"
                  >
                    <i class="fas fa-download fa-fw mr-1"></i>
                    <span>Download</span>
                  </a>
                  ${ deleteOption() }
                </div>
              </div>
            `
          }
        }
      ]
    });
  }

  // * Public Methods

  const reloadDataTable = async () => await dt.ajax.reload();

  const initRenameFile = (document_id, file_name) => {
    $('#renameFile_fileName').val(file_name);
    renameFile_modal.modal('show');
  }

  const initDeleteFile = (document_id, file_name) => {
    deleteDocument_modal
      .find(`[data-delete-document-confirm-btn]`)
      .attr('data-delete-document-confirm-btn', document_id);
    deleteDocument_modal
      .find(`[data-delete-document-file-name]`)
      .html(file_name);
    deleteDocument_modal.modal('show');
  }

  // * Init

  const init = async (projectData) => {
    if (!initialized) {
      initialized = true;
      project = projectData;
      if (user_roles.includes('Extensionist')) {
        initializations();
      }
      initDataTable();
    }
  }

  // * Return Public Methods
  return {
    init,
    reloadDataTable,
    initRenameFile,
    initDeleteFile,
    dz: () => dz
  }
})();