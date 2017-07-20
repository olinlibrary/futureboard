SUBMIT_URL = null;

/*
  Function to carry out the actual PUT request to S3 using the signed request from the app.
*/
function uploadFile(file, signedRequest, url){
  const xhr = new XMLHttpRequest();

  xhr.open('PUT', signedRequest);

  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        console.log(xhr);
        SUBMIT_URL = url;
        if(file.type.match('image')){
          $('#preview').empty().append($('<img>', { src: url }));
        } else if (file.type.match('video')) {
          $('#preview').empty().append($('<video>', { src: url, autoplay: true, loop: true }));
        } else {
          alert('Bad filetype');
        }
        $('#submit-button').attr('disabled', false);
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
  xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        const response = JSON.parse(xhr.response);
        if(response.signedRequest === null){
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
  if(file == null){
    return alert('No file selected.');
  }
  $("form").append($('<div/>').attr("id", "preview"));
  $('#preview').empty();
  $('#submit-button').attr("disabled", "disabled").addClass("pulse");

  // Resize images here
  getSignedRequest(file);
}

/*
 Function to submit the new bob.
*/
function submitBob() {
  if(SUBMIT_URL){
    let flavor = 'Moment';
    if(SUBMIT_URL.split('.').pop() === 'mp4'){
      flavor = 'Video';
    }

    let data = {
      data: { 'Link': SUBMIT_URL },
      flavor: flavor,
      startDate: Date.now(),
      'tags[]': ['uploadSubmit']
    }

    $.post('/api/bobs', data, function(res) {
  			alert('Bob saved!');
  			// Redirect to FUTUREboard
  			window.location = '/';
  		});
    } else {
      alert("No file selected!")
    }

}

/*
 Bind listeners when the page loads.
*/
window.onload = function () {
  $('#submit-button').on("click touchstart", submitBob);
}

/*
 Dropzone config
*/
Dropzone.options.dropzoneInput = {
  addedfile: function() {
    // Remove old files
    if(this.files.length > 1){
      while(this.files.length > 1) { this.removeFile(this.files[0]); }
    }
    initUpload(this.files[0]);
  },
  drop: function() {
    $(this).removeClass("dz-drag-hover");
    // Remove old files
    if(this.files.length > 1){
      while(this.files.length > 1) { this.removeFile(this.files[0]); }
    }
    initUpload(this.files[0]);
  },
  // Disable processing by dropzone
  autoProcessQueue: false,
  maxFilesize: 10, // MB
  maxFiles: 1,
  acceptedFiles: 'video/mp4,image/*',
  dictDefaultMessage : "Drop files here, <br>Touch to Upload",
  dictFallbackMessage : "Your browser does not support drag'n'drop file uploads."
  /*
  Not using dropzone for resizing:
  resizeWidth: 1000, // Pixels
  iOS defaults to camera when capture is defined (Do not use!):
  capture: 'camcorder,camera'
  */
};
