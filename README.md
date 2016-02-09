# FlexFileJS
<h2>Flexible browser file uploader.</h2>

<p>FlexFile v1.0.0</p>
<p><a href="http://codepen.io/depthdev/pen/GoOLGv" target="_blank">Demo</a></p>


<br>
<strong>METHODS:</strong>
<ul>
  <li>getFile();</li>
  <li>getFiles();</li>
  <li>getRawFile();</li>
  <li>getRawFiles();</li>
  <li>reset();</li>
</ul>
<br>
<br>
<strong>OPTIONS &#38; CALLBACKS (with available parameters):</strong>
<p>Example use (w/ images):</p>
<pre>
// Global selectors for example
var $ = function(s) {
  return document.querySelector(s)
};
var uploadForm = $('form');
var progress = $('progress');
var output = $('output');
var span = $('span');
var completedMessage = $('#completed-message');
var div = $('#drag-and-drop-area');

/****************************************************************************************
  NOTE: Only the "dropListener" or "fileListener" is required in this entire object
****************************************************************************************/
// var ff = new FlexFile({ fileListener: 'input[type="file"]' });
// OR with other options:

var ff = <strong>new FlexFile({</strong>
  <strong>readAs:</strong> 'DataURL', // 'DataURL' by default, or set to 'BinaryString'
  <strong>multiple:</strong> true, // `true` by default, or set to `false` if multiple file selection isn't allowed
  <strong>abortListener:</strong> 'input[type="button"]',
  <strong>dropListener:</strong> '#drag-and-drop-area', // A file input and/or drag-n-drop selector is required
  <strong>fileListener:</strong> 'input[type="file"]', // A file input and/or drag-n-drop selector is required
  <strong>abort:</strong> function() {
    uploadForm.className = 'active';
    console.log('Image preview aborted.');
  },
  <strong>complete:</strong> function(files, rawFiles, uploaded, total) {
    console.log(files[0]);
    console.log(rawFiles[0]);
    completedMessage.textContent = 'All ' + total + ' images/files are currently accessible using the "get()" method.';
    completedMessage.style.display = 'block';
  },
  <strong>error:</strong> function(error) {
    console.log(error.message);
  },
  <strong>load:</strong> function(data) {
    var img = document.createElement('img');
    img.src = data;
    img.alt = '';
    div.appendChild(img);
  },
  <strong>preload:</strong> function(files) {
    // Optionally, filter selected files/images before returning them for processing (file reading)
    var images = [];
    for (var i = 0, l = files.length; i < l; i++) {
      var size = (files[i].size / 1048576).toFixed(3) + ' MB';
      console.log(size);
      if (files[i].size > 10485760) {
        alert('This image is ' + size + ' and will not be uploaded.\n\nImages at or below 10.24 MB will still be uploaded.');
      } else {
        images.push(files[i]);
      }
    }
    return images;
  },
  <strong>progress:</strong> function(loaded, total) {
    progress.value = loaded / total;
    output.textContent = (loaded / total * 100).toFixed(2) + '%';
    console.log((loaded / total * 100).toFixed(2) + '%');
  },
  <strong>reset:</strong> function() {
    // This reset also clears any previously uploaded files
    console.clear();
    completedMessage.style.display = 'none';
    uploadForm.className = '';
    progress.value = 0;
    output.textContent = '';
    span.textContent = 'See the console for more details.';
    div.innerHTML = '';
  },
  <strong>start:</strong> function() {
    console.log('Reading...');
  },
  <strong>status:</strong> function(uploaded, total) {
    span.textContent = uploaded + '/' + total + ' images loaded. See the console for more details.';
  }
<strong>});</strong>
