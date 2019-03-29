const ipc = require("electron").ipcRenderer;
const { remote } = require("electron");
const fs = require("fs");
var loaded = 0;
var progress = document.querySelector(".progress");
var state = document.getElementById("state");

var dir = __dirname;

for (let i = 0; i < dir.length; i++) {
    dir = dir.replace("\\", "/");
}
dir += "/";

var version = fs.readFileSync(dir + "version.txt", {encoding: "utf8"});

function launch() {
    ipc.send("launch");
    var window = remote.getCurrentWindow();
    window.close();
}
var update = true;

function loop() {
    window.requestAnimationFrame(loop);
    if (!update) {
        state.innerHTML = "Launching...";
        loaded += 5;
        if (loaded > 300) {
            loaded = 300;
            launch();
        };
    }else {
        loaded = index/network.files.length*300;
        document.getElementById("status").innerHTML = Math.round(loaded/3)+"%"+"   "+network.version;
    }
    progress.style.width = loaded+"px";

}
setTimeout(loop, 50);

function check() {
    if (version === network.version) {
        update = false;
    }else {
        installUpdate();
        version = network.version;
        fs.writeFileSync(dir + "version.txt", version, {encoding: "utf8"});
        update = true;
        state.innerHTML = "Installing version "+network.version;
    }
}
setTimeout(check, 20);

document.getElementsByClassName("transparent")[0].addEventListener("click", function(){
    var window = remote.getCurrentWindow();
    window.minimize();
}, false)

var index = 0;
function installUpdate() {
    let i = index;

    var request = new XMLHttpRequest();
    request.open("GET", "https://raw.githubusercontent.com/Tembero/tembero/master/app/"+network.files[i]);
    request.responseType = "text";
    
    request.send();

    request.onload = function (){
        if (network.files[i].indexOf(".png") > -1) {
            fs.writeFileSync(dir + network.files[i], request.responseText, {encoding: "utf8"});
        }
        if (i < network.files.length-1) {
            index++;
            installUpdate();
        }else {
            ipc.send("close");
            ipc.send("update");
            close();
        }
    }
}