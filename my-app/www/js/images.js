/**
 * count of image
 */

var numDirs = 0;
var numFiles = 0;
var ImageFilePath = new Array();

function GetAllImageFromSD() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);

}

function onFileSystemSuccess(fileSystem) {
    fileSystem.root.getDirectory("/sdcard", { create: false, exclusive: false }, getDirSuccess, fail);
}

function getDirSuccess(dirEntry) {
    var directoryReader = dirEntry.createReader();

    // Get a list of all the entries in the directory
    directoryReader.readEntries(readerSuccess, fail);
}


var readerTimeout = null, millisecondsBetweenReadSuccess = 1000;

function readerSuccess(entries) {
    String.prototype.startsWith = function (str)
    { return (this.match("^" + str) == str) }

    var i = 0, len = entries.length;
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