/**
 * ==============================================
 * * LOGOUT
 * ==============================================
 */

'use strict';

$('[data-auth="logout"]').on('click', () => {
  $.ajax({
    url: `${ BASE_URL_API }/auth/logout`,
    success: res => {
      if(res.error) {
        toastr.error('Something went wrong. Please reload the page.', null, {
          "positionClass": "toast-top-right mt-5"
        });
        console.error(`[ERR]: ${ res.error }`);
      } else {
        location.replace(`${ BASE_URL_WEB }/login`)
      }
    },
    error: () => {
      toastr.error('Something went wrong. Please reload the page.', null, {
        "positionClass": "toast-top-right mt-5"
      });
      console.error(`[ERR]: Failed to call ajax.`);
    }
  })
});