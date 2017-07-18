/*
  Function to carry out the actual PUT request to S3 using the signed request from the app.
*/
function uploadFile(file, signedRequest, url){
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);

  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      console.log("Ready 4");
      if(xhr.status === 200){
        if(file.type.match('image')){
          $('#preview').empty().append($('<img>', { src: url, width: "100%" }));
        } else if (file.type.match('video')) {
          $('#preview').empty().append($('<video>', { src: url, autoplay: true, loop: true, width: "100%" }));
        } else {
          alert('Bad filetype');
        }
        $('#submit-button').attr('disabled', false);
      }
      else{
        alert('Could not upload file.');
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
      else{
        alert('Could not get signed URL.');
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
  // Resize images here
  getSignedRequest(file);
}

/*
 Function to submit the new bob.
*/
function submitBob() {
  console.log("submitting");
  let data = {
    data: { 'Link': document.getElementById('preview').src },
    flavor: 'Moment',
    startDate: Date.now(),
    'tags[]': ['uploadSubmit']
  }
  console.log(data);

  $.post('/api/bobs', data, function(res) {
			alert('Bob saved!');
			// Redirect to FUTUREboard
			window.location = '/';
		});
}

/*
 Bind listeners when the page loads.
*/
window.onload = function () {
    document.getElementById('submit-button').onclick = submitBob;
}

/*
 Dropzone config
*/
Dropzone.options.dropzoneInput = {
  addedfile: function() {
    $('#preview').empty();
    document.getElementById('submit-button').disabled = "disabled";
    // Remove all extra files
    if(this.files.length >= 2){
      while(this.files.length >=2) { this.removeFile(this.files[0]); }
    }
    initUpload(this.files[0]);
  },
  autoProcessQueue: false,
  maxFilesize: 10, // MB
  maxFiles: 1,
  acceptedFiles: 'video/mp4,image/*'

  // iOS defaults to camera when capture is defined: capture: 'camcorder,camera'
};

  resizeWidth: 1000, // Pixels
