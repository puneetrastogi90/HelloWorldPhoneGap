/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {

        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
        

        var numDirs = 0;
        var numFiles = 0;
        var ImageFilePath = new Array();
        GetAllImageFromSD();
        
        console.log('Received Event: ' + id);
    }
};


function GetAllImageFromSD() {
	alert("GetAllImageFromSD");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);

}

function onFileSystemSuccess(fileSystem) {
	alert("onFileSystemSuccess");
    fileSystem.root.getDirectory("/sdcard", { create: false, exclusive: false }, getDirSuccess, fail);
}

function getDirSuccess(dirEntry) {
alert("getDirSuccess");
    var directoryReader = dirEntry.createReader();

    // Get a list of all the entries in the directory
    directoryReader.readEntries(readerSuccess, fail);
}


var readerTimeout = null, millisecondsBetweenReadSuccess = 1000;

function readerSuccess(entries) {
	alert("readerSuccess");
    String.prototype.startsWith = function (str)
    { return (this.match("^" + str) == str) }

    var i = 0, len = entries.length;
    alert(len.value);
    for (; i < len; i++) {
        if (entries[i].isFile) {
            if ((entries[i].name.indexOf(".jpeg") != -1) || (entries[i].name.indexOf(".png") != -1) || (entries[i].name.indexOf(".jpg") != -1)) {
                var fileName = entries[i].name;
                if (!fileName.startsWith(".")) {
                    numFiles++;
                    ImageFilePath.push(entries[i].fullPath)
                    //  console.log("file "+entries[i].fullPath)
                }
            }

        } else if (entries[i].isDirectory) {
            numDirs++;
            // console.log("directory "+entries[i].name)
            var dirName = entries[i].name;
            if (!dirName.startsWith(".")) {
                getDirSuccess(entries[i]);
            }
        }
        if (readerTimeout) {
            window.clearTimeout(readerTimeout);
        }
    }
    if (readerTimeout) {
        window.clearTimeout(readerTimeout);
    }
    readerTimeout = window.setTimeout(weAreDone, millisecondsBetweenReadSuccess);
}

function weAreDone() {

console.log("numDirs " + numDirs);
console.log("numFiles " + numFiles);

var a = "";

var GalleryImageTag = "";
GalleryImageTag = "<div class='spacingbox'></div> ";

for (var j = 0; j < ImageFilePath.length; j++) {
    GalleryImageTag += "<div class='divgallery divcolor'>"
    var ChkId = "chk" + j;
    GalleryImageTag += "<img class='imggallery' id='" + j + "' src=' " + ImageFilePath[j] + "'alt=''/>";
    GalleryImageTag += "<input id='" + ChkId + "' name='" + ChkId + "' type='checkbox' value='" + ImageFilePath[j] + "' class='allignchk'>";
    GalleryImageTag += "</div>";

}
$('#ImageContainer').html('');
$('#ImageContainer').append(GalleryImageTag);
$('#GalleryView').popup("open");
numDirs = 0;
numFiles = 0;

ImageFilePath = [];
console.log(GalleryImageTag);
}