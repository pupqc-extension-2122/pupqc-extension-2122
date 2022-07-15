/**
 * ==============================================
 * * PROJECT DETAILS FOR ACTIVITY EVALUATION
 * ==============================================
 */

'use strict';

(() => {
  const project_id = location.pathname.split('/')[3];

  $.ajax({
    url: `${BASE_URL_API}/projects/${project_id}`,
    type: 'GET',
    success: res => {
      if (res.error) {
        ajaxErrorHandler(res.message);
      } else {
        const data = {
          project: res.data,
          mode: 'Activity Evaluation'
        }

        ProjectDetails.init(data);
        ProjectOptions.init(data);

        if ($('#activities_dt').length) ProjectActivities.init(data);

        ProjectComments.init(data.project);
        ProjectHistory.init(data.project.history);

        if ($('#projectDetails_body').length) ProjectDocuments.init(data.project);
      }
    },
    error: (xhr, status, error) => {
      ajaxErrorHandler({
        file: 'projects/projectMonitoringDetails.js',
        fn: 'onDOMLoad.$.ajax',
        xhr: xhr
      }, 1);
    }
  });
})();