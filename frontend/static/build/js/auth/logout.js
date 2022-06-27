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
        toastr.error('Something went wrong. Please reload the page.');
        ajaxErrorHandler(res.message);
      } else {
        toastr.info('Logging out.');
        localStorage.clear();
        setTimeout(() => location.replace(`${ BASE_URL_WEB }/login`), 750);
      }
    },
    error: () => {
      toastr.error('Something went wrong. Please reload the page.', {
        "timeOut": "0",
        "extendedTimeOut": "0",
      });
      console.error(`[ERR]: Failed to call ajax.`);
    }
  })
});