/**
 * ==============================================
 * * PROJECT COMMENTS
 * ==============================================
 */


'use strict';


const ProjectComments = (() => {
  
  /**
	 * * Local Variables
	 */

  const container = $('#projectComments_grp');

  const data = [
    {
      id: 'Test',
      comment: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque obcaecati ipsa distinctio, corporis cumque deserunt beatae nesciunt. Deleniti corporis ex odio perferendis illo quisquam tempore voluptates fugit blanditiis quaerat. Omnis?',
      commented_by: 'user_id_1',
      created_at: '05/31/2022',
      commentor: {
        name: 'Juan Dela Cruz'
      }
    }, {
      id: 'Test',
      comment: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque obcaecati ipsa distinctio, corporis cumque deserunt beatae nesciunt. Deleniti corporis ex odio perferendis illo quisquam tempore voluptates fugit blanditiis quaerat. Omnis?',
      commented_by: 'user_id_2',
      created_at: '06/01/2022',
      commentor: {
        name: 'Alexander Pierce'
      }
    }, {
      id: 'Test',
      comment: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque obcaecati ipsa distinctio, corporis cumque deserunt beatae nesciunt. Deleniti corporis ex odio perferendis illo quisquam tempore voluptates fugit blanditiis quaerat. Omnis?',
      commented_by: 'user_id_1',
      created_at: '06/02/2022',
      commentor: {
        name: 'Juan Dela Cruz'
      }
    }, 
  ]
  
  /**
	 * * Public Functions
	 */

  const init = (projectID) => {
    setTimeout(() => {
      data.forEach((c, i) => {
        const isCommentedByUser = () => {
          return c.commented_by == 'user_id_1' 
            ? `
              <div class="mt-1">
                <div class="btn btn-light btn-sm py-0">Edit</div>
                <div class="btn btn-light btn-sm py-0">Delete</div>
              </div>
            `
            : ''
        }
  
        const comment = `
          <div class="d-flex mb-3">
            <div class="user-block mr-3">
              <div class="d-inline-block bg-light border rounded-circle" style="width: 34px; height: 34px"></div>
              <!-- <img class="img-circle" src="../../dist/img/user1-128x128.jpg" alt="user image"> -->
            </div>
            <div class="flex-grow-1">
              <a href="#" class="font-weight-bold text-black">${ c.commentor.name }</a>
              <div class="small text-muted">${ fromNow(c.created_at) }</div>
              <div class="mt-2">
                <div>${ c.comment }</div>
                ${ isCommentedByUser() }
              </div>
            </div>
          </div>
        `
  
        container.children().first().after(comment);
      });
    }, 1750);
  }

  /**
	 * * On DOM Load
	 */

  return {
    init,
  }

})();

ProjectComments.init();
