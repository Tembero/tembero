const { remote } = require("electron");
const fs = require("fs");

function closeWindow() {
    if (confirm("Are you sure you want to quit? Progress will not be saved!")) {
        var window = remote.getCurrentWindow();
        window.close();
    }else {
        saveFile();
    }
}
function minimize() {
    var window = remote.getCurrentWindow();
    window.minimize();
}
function maximize() {
    var window = remote.getCurrentWindow();
    if (window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    }
}
function filesystemErr(error) {
    if (error != null) {
        console.error(error);
    }
}