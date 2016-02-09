/*
 FlexFile v1.0.0
 (c) 2015 Depth Development. http://depthdev.com
 License: MIT
*/

'use strict';

function FlexFile(o) {

  var $ = function(s) {
    return document.querySelector(s);
  };

  // SCOPED VARIABLES
  var _files = []; // This is where all processed file data will be stored
  var _rawFiles = [];
  var _reader = new FileReader();
  var _totalFiles = 0;
  var _totalFilesCompleted = 0;

  var _readAs = o.readAs || 'DataURL';
  var _multiple = o.multiple === false ? false : true;

  // SELECTORS PROVIDED?
  if (!o.dropListener && !o.fileListener) {
    throw 'ERROR: No "fileListener" and/or "dropListener" property provided for FlexFile.';
  }

  // CALLBACKS
  var _callbackAbort = function() {
    if (o.abort) { o.abort(); }
    if (o.fileListener) { $(o.fileListener).value = null; }
  };
  var _callbackComplete = function() {
    if (o.complete) {
      o.complete(_multiple ? _files : _files[0], _multiple ? _rawFiles : _rawFiles[0], _totalFilesCompleted, _totalFiles);
    }
  };
  var _callbackStatus = function() {
    _totalFilesCompleted++;
    if (o.status) {
      o.status(_totalFilesCompleted, _totalFiles);
    }
    if (_totalFilesCompleted !== _totalFiles) {
      _queue();
    } else {
      _callbackComplete();
    }
  };
  var _callbackError = function(e) {
    if (e.target.error) {
      if (o.error) {
        o.error(e.target.error);
      }
    }
  };
  var _callbackLoad = function(e) {
    var data = e.target.result;
    _files.push(data);
    _callbackStatus();
    if (o.load) {
      o.load(data);
    }
  };
  var _callbackPreload = o.preload ? function(f) {
    return o.preload(f);
  } : false;
  var _callbackProgress = function(e) {
    if (o.progress) {
      if (e.lengthComputable) {
        o.progress(e.loaded, e.total);
      }
    }
  };
  var _callbackReset = function() {
    _files = [];
    _rawFiles = [];
    _totalFiles = 0;
    _totalFilesCompleted = 0;
    if (o.fileListener) { $(o.fileListener).value = null; }
    if (o.reset) { o.reset(); }
  };
  var _callbackStart = o.start || function(){};
  
  // ABORT UPLOAD
  var _abort = function() {
    _reader.abort();
  };
  
  // GET RAW FILES (RETURN THE RAW FILES)
  var _getRawFile = function() {
    return _rawFiles[0];
  };
  var _getRawFiles = function() {
    return _rawFiles;
  };
  
  // GET FILES (RETURN THE PROCESSED FILES)
  var _getFile = function() {
    return _files[0];
  };
  var _getFiles = function() {
    return _files;
  };

  // FILE READER API
  var _init = function(files) {
    
    // Has one or more files been selected?
    if (!files.length) { return false; }
    
    // Convert files to array
    var f = [];
    for(var i=files.length;i--;f.unshift(files[i]));
    // Run through dev preload callback
    f = o.preload ? _callbackPreload(_multiple ? f : f[0]) : f;
    // Reset global variables
    _callbackReset();
    // Set files to array if dev preload callback returned a single object
    _rawFiles = Array.isArray(f) ? f : [f];
    
    // If preload was used, did the user return 
    if (!_rawFiles.length || !_rawFiles[0]) { console.log('ERROR: Nothing was returned from the FlexFile "preload" callback.'); return false; }
    
    // Set methods
    _totalFiles = _rawFiles.length;
    _reader.onerror = _callbackError;
    _reader.onabort = _callbackAbort;
    _reader.onloadstart = _callbackStart;
    _reader.onprogress = _callbackProgress;
    _reader.onload = _callbackLoad;
    _queue();
  };

  var _queue = function() {
    _reader['readAs' + _readAs](_rawFiles[_totalFilesCompleted]);
  };

  // LISTENERS
  if (o.abortListener) {
    $(o.abortListener).addEventListener('click', _abort);
  }
  if (o.dropListener) {
    $(o.dropListener).addEventListener('dragover', function(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }, false);
    $(o.dropListener).addEventListener('drop', function(e) {
      e.stopPropagation();
      e.preventDefault();
      _init(e.dataTransfer.files);
    }, false);
  }
  if (o.fileListener) {
    var sf = $(o.fileListener);
    sf.addEventListener('change', function() { _init(this.files); }, false);
    if (_multiple) {
      sf.setAttribute('multiple', true);
    } else {
      sf.removeAttribute('multiple');
    }
  }
  
  // EXPOSE FLEXFILE API
  return {
    reset: _callbackReset,
    getRawFile: _getRawFile,
    getRawFiles: _getRawFiles,
    getFile: _getFile,
    getFiles: _getFiles
  }

}; // FlexFile
