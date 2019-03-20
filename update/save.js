
function generateFile() {
    let save = "'encodeType:vfp;licence:MIT;start:_.=>;';\nvar $save$ = [";
        for (let j = 0; j < graphics.length; j++) {
            save += "[";
            for (let i = 0; i < graphics[j].length; i++) {
                var el = JSON.stringify(graphics[j][i]);
                save += el+",";
                //console.log(save[i][j]);
            }
            save += "],";
        }
        save += "];";
    return save;
}
function saveFile() {
    let date = new Date();
    let time = {};
    time.month = date.getUTCMonth();
    time.day = date.getUTCDate();
    time.year = date.getUTCFullYear();

    date = time.day+"."+time.month+"."+time.year;

    console.log(date);
    
    var FileSaver = require('file-saver');
    var blob = new Blob([generateFile()], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "MyVFProject "+date+".vfp");
}

function openFile() {
    var btn = document.getElementById("openProject");
    
    let path = btn.files[0].path;
    
    for (let i = 0; path.indexOf("\\") >= 0; i++) {
        path = path.replace("\\", "/");
    }
    

    var file = fs.readFileSync(path, "utf8", function(err) {
        if (err != null) {console.error(err)};
    })
    
    return file;
}

document.getElementById("openProject").addEventListener("change", function(){
    var file = openFile();


    if (
        document.getElementById("openProject").files[0].type == "" &&
        document.getElementById("openProject").files[0].name.indexOf(".vfp") > 0 &&
        file.indexOf("encodeType:vfp;licence:MIT;start:_.=>;") > 0
    ) {
        eval(file);

        graphics = $save$;
    }else {
        document.getElementById("openProject").value = "";
    }

}, false);

document.getElementById("openBtn").addEventListener("click", function(){
    document.getElementById("openProject").click();
}, false);