const ipc = require("electron").ipcRenderer;
const { remote } = require("electron");
const fs = require("fs");
var loaded = 0;
var progress = document.querySelector(".progress");

var version = "0.0.1";

function launch() {
    ipc.send("launch");
    var window = remote.getCurrentWindow();
    window.close();
}

//setTimeout(launch,  2000);

function loop() {
    window.requestAnimationFrame(loop);
    loaded+=Math.random()*3;
    if (loaded > 300) {
        loaded = 300;
        if (version === network.version) {
            //launch();
        }else {
            loaded = 0;
        }
    }
    progress.style.width = loaded+"px";

}
setTimeout(loop, 20);

let app = require('electron').remote.app;

var basepath = app.getAppPath();

function loadFile(url) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://raw.githubusercontent.com/NotePortal/NotePortal.github.io/master/libary.js");
    request.responseType = "text";
    request.onload = function() {
        console.log(this.responseText);
        return this.responseText;
    }
    request.send();
}

document.getElementsByClassName("transparent")[0].addEventListener("click", function(){
    var window = remote.getCurrentWindow();
    window.minimize();
    console.log("..");
    
}, false)


