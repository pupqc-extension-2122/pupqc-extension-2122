/**
 * ==============================================
 * * PROJECT MONITORING DETAILS / ACTIVITIES
 * ==============================================
 */

'use strict';

(() => {
  const project_id = location.pathname.split('/')[3];

  $.ajax({
    url: `${ BASE_URL_API }/projects/${ project_id }`,
    type: 'GET',
    success: res => {
      if (res.error) {
        ajaxErrorHandler(res.message);
      } else {
        const data = {
          project: res.data,
          mode: 'Monitoring'
        }

        ProjectDetails.init(data);
        ProjectOptions.init(data);

        if ($('#activities_dt').length) ProjectActivities.init(data);

        ProjectComments.init(data.project);
        ProjectHistory.init(data.project.history);

        ProjectDocuments.init(data.project);
      }
    },
    error: (xhr, status, error) => {
      ajaxErrorHandler({
        file: 'projects/projectMonitoringDetails.js',
        fn: 'onDOMLoad.$.ajax',
        details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
      }, 1);
    }
  });
})();