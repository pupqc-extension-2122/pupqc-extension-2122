/**
 * ==============================================
 * * MEMO DETAILS
 * ==============================================
 */

'use strict';

const MemoDetails = (() => {

  // * Local Variables

  let memo;
  let initialized = false;

  // * Private Methods

  const noContentTemplate = (message) => `<div class="text-muted font-italic">${message}</div>`;

  const loadDocumentTitle = () => {
    const memoName = memo.partner.name;
    const documentTitle = memoName.length > 75 
      ? memoName.substring(0, 75) + ' ...' 
      : memoName;

    setDocumentTitle(`${ documentTitle } - MOA/MOU Details`);
  }

  const loadActiveBreadcrumb = () => {
    const memoName = memo.partner.name;
    $('#active_breadcrumb').html(() => memoName.length > 33 ? `${ memoName.substring(0, 30) } ...` : memoName);
  }

  const loadHeaderDetails = () => {
    loadActiveBreadcrumb();

    const { 
      representative_partner,
      validity_date,
      end_date,
      partner: p, 
      organization: o 
    } = memo;

    setHTMLContent({
      '#memoDetails_header_partnerName': p.name,
      '#memoDetails_header_address': p.address,
      '#memoDetails_header_representative': representative_partner,
      '#memoDetails_header_organization': `${ o.name } <span class="mx-1">&bull;</span> ${ o.type }`,
      '#memoDetails_header_validity': `${ moment(validity_date).format('MMMM DD, YYYY') } - ${ moment(end_date).format('MMMM DD, YYYY') }`,
      '#memoDetails_header_status': () => {
        const status = moment().isBetween(moment(validity_date), moment(end_date)) ? 'Active' : 'Inactive';
        const { theme, icon } = MEMO_STATUS_STYLES[status];
          return `
            <div class="badge badge-subtle-${ theme } px-2 py-1">
              <i class="${ icon } fa-fw mr-1"></i>
              <span>${ status }</span>
            </div>
          `;
      }
    });
  }

  const loadBodyDetails = () => {
    const {
      representative_partner,
      representative_pup,
      notarized_date,
      witnesses,
      validity_date,
      end_date,
      partner: p, 
      organization: o,
    } = memo;

    setHTMLContent({
      '#memoDetails_body_partnerName': () => {
        return `
          <a href="${ BASE_URL_WEB }/m/partners/${ p.id }">${ p.name }</a>
        `
      },
      '#memoDetails_body_partnerAddress': p.address,
      '#memoDetails_body_representative': representative_partner,
      '#memoDetails_body_pupREPDRepresentative': representative_pup,
      '#memoDetails_body_organization': `${ o.name } <span class="mx-1">&bull;</span> ${ o.type }`,
      '#memoDetails_body_notarySignedDate': () => {
        return `
          <div>${ moment(notarized_date).format('MMMM DD, YYYY (dddd)') }</div>
          <div class="small text-muted">${ fromNow(notarized_date) }</div>
        `
      },
      '#memoDetails_body_witnesses': () => {
        if (witnesses.length) {
          let list = '<ul class="mb-0">';
          witnesses.forEach(w => list += `<li>${w.name}${ w.role ? ` - ${ w.role }` : '' }</li>`);
          list += '</ul>';
          return list;
        }
        return noContentTemplate('No witnesses has been added.');
      },
      '#memoDetails_body_validity': () => {
        if (validity_date && end_date) {
          const getDuration = () => {
            return moment(validity_date).isSame(moment(end_date))
              ? 'in the whole day'
              : moment(validity_date).to(moment(end_date), true)
          }

          const getStatus = () => {
            const status = moment().isBetween(moment(validity_date), moment(end_date)) ? 'Active' : 'Inactive';
            const { theme, icon } = MEMO_STATUS_STYLES[status];
              return `
                <div class="badge badge-subtle-${ theme } px-2 py-1">
                  <i class="${ icon } fa-fw mr-1"></i>
                  <span>${ status }</span>
                </div>
              `;
          }

          return `
            <div class="ml-4 ml-lg-0 row">
              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">Effective on:</div>
              </div>
              <div class="col-8 col-lg-10">
                <div>${ moment(validity_date).format('MMMM D, YYYY (dddd)') }</div>
                <div class="small text-muted">${ fromNow(validity_date) }</div>
              </div>

              <div class="col-12"><div class="mt-2"></div></div>

              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">Until:</div>
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

              <div class="col-12"><div class="mt-2"></div></div>

              <div class="pl-0 col-4 col-lg-2">
                <div class="font-weight-bold">Status:</div>
              </div>
              <div class="col-8 col-lg-10">
                <div>${ getStatus() }</div>
              </div>
            </div>
          `
        } else return noContentTemplate('No dates have been set up.');
      }
    });
  }

  const loadDetails = async (memoData) => {
    if (memoData) memo = memoData;
    loadHeaderDetails();
    loadBodyDetails();
  }

  const removeLoaders = () => {
    $('#contentHeader_loader').remove();
    $('.content-header').show();

    $('#memoDetails_header_loader').remove();
    $('#memoDetails_header').show();
    
    $('#memoDetails_body_loader').remove();
    $('#memoDetails_body').show();

    $('#options_loader').remove();
    $('#options').show();
    $('#options').removeAttr('id');
  }

  // * Public Methods

  // * Init

  const init = async (memoData) => {
    if (!initialized) {
      initialized = true;
      memo = memoData;
      loadDocumentTitle();
      loadDetails();
      removeLoaders();
    }
  }

  // * Return Public Methods

  return {
    init,
    loadDetails
  }

})();


const MemoDocuments = (() => {
  
  // * Local Variables

  const user_roles = JSON.parse(getCookie('roles'));
  
  const dtElem = $('#uploadedDocuments_dt');
  const uploadDocuments_modal = $('#uploadMemoDocuments_modal');
  const totalProgress_elem = $("#total_progress");
  const totalProgressCount_elem = $("#total_progress_count");
  const startUpload_btn = $("#startUpload_btn");
  
  const renameFile_modal = $('#renameFile_modal');
  const deleteDocument_modal = $('#deleteDocument_modal');
  
  let memo;
  let dt;
  let dz; // For dropzone
  let initialized = false;
  let processing = false;

  // * Private Methods

  const initializations = async () => {
    if (user_roles.includes('Extensionist')) {
      await initializeDropzone();
      handleSubmitDocumentForm();
      handleUploadDocumentsModal();
      handleRenameFileModal();
      handleDeleteDocumentModal();
    }
  }

  const initializeDropzone = async () => {

    // Get the template HTML and remove it from the doument.
    let previewNode = document.querySelector("#dropFiles_fileTemplate");
    previewNode.id = "";
    let previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);

    dz = await new Dropzone(document.querySelector('#dropFiles_container'), {
      url: `${ BASE_URL_API }/documents/memo/${ memo.id }`, // Set the url
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
    $app('#uploadMemoDocuments_form').handleForm({
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
          file: 'memos/memoDetail.js',
          fn: 'MemoDocuments.deleteFile()',
          details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
        });
      }
    });
  }

  const handleDeleteDocumentModal = () => {
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
        url: `${ BASE_URL_API }/documents/memo/${ memo.id }/datatables`,
        // success: result => {
        //   console.log(result);
        // },
        error: (xhr, status, error) => {
          ajaxErrorHandler({
            file: 'memos/memoDetail.js',
            fn: 'MemoDocuments.initDataTable',
            details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
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
            return `
            <div class="dropdown text-center">
              <div class="btn btn-sm btn-negative" data-toggle="dropdown" data-dt-btn="options" title="Options">
                <i class="fas fa-ellipsis-h"></i>
              </div>
              <div class="dropdown-menu dropdown-menu-right">
                <div class="dropdown-header">Options</div>
                <div
                  role="button"
                  class="dropdown-item"
                  onclick="MemoDocuments.initRenameFile('${ data.id }', '${ data.file_name }')"
                >
                  <i class="fas fa-pen fa-fw mr-1"></i>
                  <span>Rename</span>
                </div>
                <a
                  role="button"
                  href="${ BASE_URL_API }/documents/${ data.upload_name }"
                  download="${ data.file_name }"
                  class="dropdown-item"
                >
                  <i class="fas fa-download fa-fw mr-1"></i>
                  <span>Download</span>
                </a>
                <div class="dropdown-divider"></div>
                <div
                  role="button"
                  class="dropdown-item"
                  onclick="MemoDocuments.initDeleteFile('${ data.id }', '${ data.file_name }')"
                >
                  <i class="fas fa-trash-alt fa-fw mr-1"></i>
                  <span>Delete</span>
                </div>
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

  const init = async (memoData) => {
    if (!initialized) {
      initialized = true;
      memo = memoData;
      await initializations();
      await initDataTable();
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


(() => {
  const memo_id = location.pathname.split('/')[3];
  const user_roles = JSON.parse(getCookie('roles'));

  $.ajax({
    url: `${ BASE_URL_API }/memos/${ memo_id }`,
    type: 'GET',
    success: res => {
      if (res.error) {
        ajaxErrorHandler(res.message, 1);
      } else {
        const { data } = res;
        
        MemoDetails.init(data);
        MemoDocuments.init(data);

        if (user_roles.includes('Extensionist')) EditMemo.init(data);
      }
    },
    error: (xhr, status, error) => {
      ajaxErrorHandler({
        file: 'memo/memoDetails.js',
        fn: 'onDOMLoad.$.ajax',
        details: xhr.status + ': ' + xhr.statusText + "\n\n" + xhr.responseText,
      }, true);
    } 
  });
})();