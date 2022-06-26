/**
 * ==============================================
 * * PROJECT PROPOSAL DETAILS / ACTIVITIES
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
          mode: 'Proposal'
        };

        ProjectDetails.init(data);
        ProjectOptions.init(data);

        const projectTitle = data.project.title;
        const documentTitle = projectTitle.length > 75 
          ? projectTitle.substring(0, 75) + ' ...' 
          : projectTitle;

        if ($('#activities_dt').length) {
          AddProjectActivity.init(data);
          ProjectActivities.init(data);
          setDocumentTitle(`${ documentTitle } - Project Activities`);
        } else {
          setDocumentTitle(`${ documentTitle } - Project Details`);
        }

        ProjectComments.init(data.project);
        ProjectHistory.init(data.project.history)
      }
    },
    error: (xhr, status, error) => {
      ajaxErrorHandler({
        file: 'projects/projectProposalDetails.js',
        fn: 'onDOMLoad.$.ajax',
        details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
      }, 1);
    }
  });
})();