SUBMIT_URL = null;

/*
  Function to carry out the actual PUT request to S3 using the signed request from the app.
*/
function uploadFile(file, signedRequest, url){
  const xhr = new XMLHttpRequest();

  xhr.open('PUT', signedRequest);
  var $progressBar = document.getElementById("progress");
  xhr.upload.onprogress = function(e){
    if (e.lengthComputable) {
       $progressBar.max = e.total;
       $progressBar.value = e.loaded;
       var ratio = Math.floor((e.loaded / e.total) * 100) + '%';
    }
  }
  xhr.upload.onloadstart = function (e) {
      $progressBar.value = 0;
      $('.dz-message').html("Uploading...");
      $('#dropzone-input').animate({"height": "10vh"}, 500);
  };
  xhr.upload.onloadend = function (e) {
      $progressBar.value = e.loaded;
  };
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4){
      if (xhr.status === 200){
        SUBMIT_URL = url;
        $('.dz-message').html("Complete!");
        $('#dropzone-input').animate({"height": "10vh"}, 500);
        $('#submit-button').attr('disabled', false);
        submitBob();
      }
      else{
        alert('Could not upload file.');
        SUBMIT_URL = null;
      }
    }
  };
  xhr.send(file);
}

/*
  Function to get the temporary signed request from the app.
  If request successful, continue to upload the file using this signed
  request.
*/
function getSignedRequest(file){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/aws/s3-sign?file-name=${file.name}&file-type=${file.type}`);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4){
      if (xhr.status === 200){
        const response = JSON.parse(xhr.response);
        if (response.signedRequest === null){
          return alert("Did not get S3 signed request!");
        }
        uploadFile(file, response.signedRequest, response.url);
      }
      else {
        return alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}

/*
 Function called when file input updated. If there is a file selected, then
 start upload procedure by asking for a signed request from the app.
*/
function initUpload(file){
  if (file == null){
    return alert('No file selected.');
  }
  $("form.dropzone").append($('<div/>').attr("id", "preview"));
  $('#preview').empty();
  $('#submit-button').attr("disabled", "disabled");

  // Resize images here
  getSignedRequest(file);
}

/*
 Function to submit the new bob.
*/
function submitBob() {
  if (SUBMIT_URL){
    let flavor = 'Moment';
    if (['mp4','mov','avi'].indexOf(SUBMIT_URL.split('.').pop().toLowerCase()) > -1){
      flavor = 'Video';
    }

    let data = {
      data: { 'Link': SUBMIT_URL },
      flavor: flavor,
      description: $('#description').val(),
      startDate: Date.now(),
      'tags[]': ['uploadSubmit']
    };

    $.post('/api/bobs', data, function(res) {

  		});
    } else {
      alert("No file selected!");
    }

}

/*
 Bind listeners when the page loads.
*/
window.onload = function () {
  // $('#submit-button').on("click", submitBob);
  alert('Media saved!');
  // Redirect to FUTUREboard
  window.location = '/';
};

/*
 Dropzone config
*/
Dropzone.options.dropzoneInput = {
  addedfile: function() {
    // Remove old files
    if (this.files.length > 1){
      while(this.files.length > 1) { this.removeFile(this.files[0]); }
    }
    initUpload(this.files[0]);
  },
  drop: function() {
    $(this).removeClass("dz-drag-hover");
    // Remove old files
    if (this.files.length > 1){
      while(this.files.length > 1) { this.removeFile(this.files[0]); }
    }
    initUpload(this.files[0]);
  },
  // Disable processing by dropzone
  autoProcessQueue: false,
  maxFilesize: 10, // MB
  maxFiles: 1,
  acceptedFiles: 'video/*,image/*',
  dictDefaultMessage : "Drop files here, <br>Touch to Upload",
  dictFallbackMessage : "Your browser does not support drag'n'drop file uploads."
  /*
  Not using dropzone for resizing:
  resizeWidth: 1000, // Pixels
  iOS defaults to camera when capture is defined (Do not use!):
  capture: 'camcorder,camera'
  */
};
