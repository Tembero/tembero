const { remote } = require("electron");
const { dialog } = require("electron");
const fs = require("fs");

function closeWindow() {
    let options = {
        type: "warning",
        buttons: ["Yes", "No thanks"],
        message: "Do you wish to save the changes?",
        title: "Save the changes?",
    }

    dialog.showMessageBox(remote.getCurrentWindow(), options, function(response) {
        console.log(response);
      });

    if (!confirm("Save the changes?")) {
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