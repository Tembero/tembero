var graphics = [
    [],
    [],
    [],
    [],
    [],
];

// setup frame
var frame = 0;
var time = "";

// setup mouse x and y
var mouse = {x: 0, y: 0};


var tween = {
    point: 0,
};

window.addEventListener("mousemove", function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}, false);

//appilication window
var app = document.getElementById("app");

// setup graphic functions
var graphic = {};

graphic.add = (type, layer, frame, length, options) => {
    let el;
    if (type === "square") {
        el = {
            type: type, x: options.x, y: options.y, width: options.width, height: options.height,
            color: {h: 0, s: 100, b: 100},
            frame: frame,
            length: length,
            display: true,
            vector: [
                {x: 0, y: 0},
                {x: 100, y: 0},
                {x: 100, y: 100},
                {x: 0, y: 100},
            ],
            unfinishedTween: {
                start: {},
                end: {},
                type: tween.easeOutQuad,
            }
        }
        
        graphics[layer].push(el);
    };
    return el;
}

graphic.create = () => {
    if (timeline.selected.frame === undefined) {
        //generate a rounded number for the layer
        document.getElementById("length").value = 10;


        var num = mouse.y-timeline.canvas.offsetTop;
        num = parseInt((num-50)/50);

        if (num > graphics.length-1) {
            num = graphics.length-1;
        }
        if (num < 0) {
            num = 0;
        }
        timeline.selected.layer = num;


        let el = graphic.add("square", num,
            frame,
            100, {x: 0, y: 0, width: 100, height: 100, color: "orange"}
        );
        timeline.selected = select(el, graphics[num].length-1, num);
        console.log(el);
    }
    
}

window.addEventListener("keydown", function(key){
    if (key.keyCode === 78) {graphic.create();};
    if (key.keyCode === 39) {frame += 15};
    if (key.keyCode === 37) {frame -= 15};
}, false);

// setup timeline

var timeline = {events: {hold: false, canvasHover: false}, selected: {frame: undefined}, play: false, highest: 0};


// timeline rendering
timeline.draw = () => {
    let t = DRAW.getDrawJSContext(document.getElementById("timeline"), "2d");
    t.clearAll();


    for (let j = 0; j < graphics.length; j++) {

        t.fillArea("rgb(14, 0, 48)", 0, j*50+50, timeline.canvas.width, 1);

        for (let i = 0; i < graphics[j].length; i++) {
            const el = graphics[j][i];
            if (el.frame != undefined) {
                t.fillArea("rgb(0, 85, 160)", el.frame, j*50+50, el.length, 50);
                t.fillArea(HSBtoRGB(el.color).str, el.frame+2, j*50+52, 10, 10);
            }
        }
    }

    t.fillArea("rgba(48, 0, 163, 0.3)", timeline.selected.frame, timeline.selected.layer*50+50, timeline.selected.length, 50);

    t.fillArea("rgba(38, 38, 38, 0.5)", timeline.highest, 0, timeline.canvas.width, 300);

    t.fillArea("rgb(76, 0, 255)", frame, 0, 2, 300);


    t.font = "20px arial";
    t.fillStyle = "white";
    t.fillText(frame, frame+10, 20, 1000);
    //console.log(graphics[0][1].color);
    
    
}

timeline.hover = (x ,y, width, height) => {
    return /*X*/x <= mouse.x-timeline.canvas.offsetLeft-app.offsetLeft && x+width >= mouse.x-timeline.canvas.offsetLeft-app.offsetLeft
    && /*Y*/ y <= mouse.y-timeline.canvas.offsetTop-app.offsetTop && y+height >= mouse.y-timeline.canvas.offsetTop-app.offsetTop;
};

timeline.update = () => {
    timeline.canvas.width = innerWidth*0.99-20;

    if (timeline.play) {
        frame++;
    };
    // move the canvas
    if (innerWidth <= 1060) {
        canvas.style.left = "23%";
        canvas.style.width = "768px";
        canvas.style.height = "432px";
    }else {
        canvas.style.left = "";
        canvas.style.width = "";
        canvas.style.height = "";
        timeline.canvas.style.height = 300;
    }
    if (innerHeight <= 930) {
        timeline.canvas.height = 200;
        timeline.canvas.style.height = "200px";
    }else {
        timeline.canvas.height = 300;
        timeline.canvas.style.height = "300px";
    }


    time = frameToTime(frame);
    document.getElementById("frame").innerHTML = "<strong>frame</strong>: "+frame+" <strong>time</strong>: "+time.hours+"."+time.minutes+"."+time.seconds+"."+time.miliseconds;
    

    if (timeline.selected.frame != undefined) {timeline.play = false};

    if (timeline.play) {document.getElementById("playBtn").innerHTML = "▕ ▏"}else {
        document.getElementById("playBtn").innerHTML = "►";
    }
    if (!timeline.events.canvasHover) {timeline.events.hold = false};

    if (timeline.events.hold && timeline.hover(-5, 0, timeline.canvas.width, 50)) {
        if (!(mouse.x-timeline.canvas.offsetLeft < 0)) {
            frame = mouse.x-timeline.canvas.offsetLeft;
        }
    }

    timeline.highest = 0;
    for (let j = 0; j < graphics.length; j++) {
        for (let i = 0; i < graphics[j].length; i++) {
            const el = graphics[j][i];
            if (el.frame+el.length > timeline.highest) {
                timeline.highest = el.frame+el.length;
            };
            if (el.tween != undefined) {
                if (frame >= el.frame && frame <= el.frame+el.length) {
                    el.x = el.tween.type(frame-el.frame, el.tween.start.x, el.tween.end.x-el.tween.start.x, el.length);
                    el.y = el.tween.type(frame-el.frame, el.tween.start.y, el.tween.end.y-el.tween.start.y, el.length);
                }
            }
        }
    }
    if (frame > timeline.highest) {
        if (timeline.play) {
            frame = 0;
        }else {
            frame = timeline.highest;
        }
    }
    if (frame < 0) {
        frame = 0;
    }
    


    if (timeline.selected.frame != undefined) {
        //show or gide the vector
        timeline.selected.display = document.getElementById("showHideVector").checked;

        //update the color and clip length
        if (timeline.selected.color.h != undefined) {
            timeline.selected.color = hsb;
        }
        timeline.selected.length = parseInt(document.getElementById("length").value);
        timeline.selected.text = {};
        timeline.selected.text.content = document.getElementById("text").value;
        timeline.selected.text.size = parseInt(document.getElementById("textSize").value);
        timeline.selected.text.maxWidth = parseInt(document.getElementById("maxWidth").value);
        timeline.selected.text.font = "arial";

        if (timeline.events.hold) {
            if (mouse.x-timeline.canvas.offsetLeft-timeline.selected.frameOffset >= 0) {
                if (timeline.hover(0, 0, timeline.canvas.width, timeline.canvas.height)){
                    timeline.selected.frame = mouse.x-timeline.canvas.offsetLeft-timeline.selected.frameOffset;
    
                    //generate a rounded number for the layer
                    var num = mouse.y-timeline.canvas.offsetTop-app.offsetTop;
                    num = parseInt((num-50)/50);
    
                    if (num > graphics.length-1) {
                        num = graphics.length-1;
                    }
                    if (num < 0) {
                        num = 0;
                    }
                    timeline.selected.layer = num;
                    //console.log(num);
                    
                    
    
                    timeline.selected.i = graphics[timeline.selected.layer].length;
                }
            }
        }
        if(tween.point === 0 || tween.point === 3) {
            frame = timeline.selected.frame;
        }
        if (tween.point === 1) {
            frame = timeline.selected.frame+timeline.selected.length;
        }
        if(tween.point === 2) {
            frame = Math.round(timeline.selected.length/2)+timeline.selected.frame;
        }
    };
    //close the edit menu if nothing is selected
    if (timeline.selected.frame != undefined) {
        document.getElementsByClassName("edit")[0].style.display = "block";
        document.getElementsByClassName("project")[0].style.display = "none";
    }else {
        document.getElementsByClassName("edit")[0].style.display = "none";
        document.getElementsByClassName("project")[0].style.display = "block";
    }

    

    //tweening point (start/end)

    tween.point = parseInt(document.getElementsByName("tween")[0].value);


    if (timeline.selected.frame != undefined) {

        let type = document.getElementById("tweenType").value;
        //console.log(type);

        if (type === "linear") {timeline.selected.unfinishedTween.type = tween.linear};
        if (type === "easeInQuad") {timeline.selected.unfinishedTween.type = tween.easeInQuad};
        if (type === "easeOutQuad") {timeline.selected.unfinishedTween.type = tween.easeOutQuad};
        if (type === "easeInOutQuad") {timeline.selected.unfinishedTween.type = tween.easeInOutQuad};
        timeline.selected.unfinishedTween.strType = type;
        

        if (timeline.selected.unfinishedTween.start != undefined) {
            if (
                timeline.selected.unfinishedTween.start.x != undefined &&
                timeline.selected.unfinishedTween.start.y != undefined &&
                timeline.selected.unfinishedTween.end.x != undefined &&
                timeline.selected.unfinishedTween.end.y != undefined &&
                timeline.selected.unfinishedTween.type != undefined
            ) {
                timeline.selected.tween = timeline.selected.unfinishedTween;
            }
        }
    }
}

timeline.canvas = document.getElementById("timeline");

timeline.canvas.addEventListener("mousedown", function(){
    timeline.events.hold = true;


    var added = false;

    if (timeline.selected.frame != undefined) {
        var placeable = false;
        for (let j = 0; j < graphics[timeline.selected.layer].length; j++) {
            const el = graphics[timeline.selected.layer][j];
            if (timeline.selected.frame != el.frame) {
                if (timeline.selected.frame <= el.frame+el.length && timeline.selected.frame+timeline.selected.length >= el.frame) {
                    placeable = false;
                    j = graphics[timeline.selected.layer];
                }else {placeable = true;};
            }
        }
        
        if (!placeable){
            if (!timeline.selected.default.new) {
                timeline.selected.layer = timeline.selected.default.layer;
                timeline.selected.i = timeline.selected.default.i;
                timeline.selected.frame = timeline.selected.default.frame;
                timeline.selected.length = timeline.selected.default.length;
            };
        }else {added = true};
        
        graphics[timeline.selected.default.layer].splice(timeline.selected.default.i, 1);
        graphics[timeline.selected.layer].push(timeline.selected);
        if (timeline.selected.default.new && !placeable) {
            graphics[timeline.selected.layer].splice(graphics[timeline.selected.layer].length-1, 1);
        }
    }

    timeline.selected = {frame: undefined};

    //select a new item IF possible
    if (!added) {
        for (let j = 0; j < graphics.length; j++) {
            for (let i = 0; i < graphics[j].length; i++) {
                const el = graphics[j][i];
                if (timeline.hover(el.frame, j*50+50, el.length, 50)) {
                    timeline.selected = select(el, i, j);
                }
            }
        }
    }
}, false);
timeline.canvas.addEventListener("mouseup", function(){
    timeline.events.hold = false;
}, false);
timeline.canvas.addEventListener("mouseover", function(){timeline.events.canvasHover = true}, false);
timeline.canvas.addEventListener("mouseleave", function(){timeline.events.canvasHover = false}, false);


function select(el, i, layer) {
    if (timeline.selected.frame === undefined) {
        let selected;
        selected = el;
        selected.i = i;
        selected.layer = layer;
        selected.frameOffset = mouse.x-timeline.canvas.offsetLeft-el.frame;
        selected.default = {layer: el.layer , i: i, frame: el.frame, length: el.length};
        if (el.unfinishedTween === undefined) {
            selected.unfinishedTween = {
                start: {},
                end: {},
                type: tween.easeOutQuad,
            };
        }
        if (selected.text != undefined) {
            document.getElementById("text").value = selected.text.content;
            document.getElementById("textSize").value = selected.text.size;
            document.getElementById("maxWidth").value = selected.text.maxWidth;
        }
        if (selected.unfinishedTween.strType != undefined) {
            document.getElementById("tweenType").value = selected.unfinishedTween.strType;
        }else {
            document.getElementById("tweenType").value = "linear";
        }


        if (el.color.h != undefined) {
                hsb = JSON.stringify(selected.color);
                hsb = JSON.parse(hsb); 
            }
        document.getElementById("length").value = el.length;
        return selected;
    }
}





graphic.add("square", 0, 200, 500,  {x: 100, y: 100, width: 100, height: 200,});
graphic.add("square", 1, 0, 100,  {x: 100, y: 100, width: 100, height: 200,});


// defaults that can not be seen. Used to trigger the for loop that checks if placeable should be true.
for (let i = 0; i < graphics.length; i++) {
    graphic.add("square", i, -100, 0,  {x: 0, y: 0, width: 0, height: 0, color: "black"});
}

// setup a loop witch runs 60 times per second (60fps)

function loop() {
    window.requestAnimationFrame(loop);
    cDisplay.update();
    if (timeline.selected.frame != undefined) {graphic.update();}
    timeline.update();
    timeline.draw();
    render();
};





//display

 var controllers = {
    center: false,
    vector: {},
};

canvas.hover = (x, y, width, height) => {
    return /*X*/x <= mouse.x-canvas.offsetLeft-app.offsetLeft && x+width >= mouse.x-canvas.offsetLeft-app.offsetLeft
    && /*Y*/ y <= mouse.y-canvas.offsetTop-app.offsetTop && y+height >= mouse.y-canvas.offsetTop-app.offsetTop;
}

// create offset property
var displayOffset = {second: {}};

window.addEventListener("mousedown", function(){
    let el = timeline.selected;
    if (el.unfinishedTween != undefined) {
        if (el.unfinishedTween.start != undefined) {
            if (el.unfinishedTween.start.x === undefined) {
                el.unfinishedTween.start.x = el.x;
                el.unfinishedTween.start.y = el.y;
                el.unfinishedTween.end.x = el.x;
                el.unfinishedTween.end.y = el.y;
            }
        }
    }
    
    //center (normal movement)
    if (tween.point === 2 && canvas.canvasHover) {
        displayOffset.x = mouse.x-canvas.offsetLeft-timeline.selected.unfinishedTween.start.x;
        displayOffset.y = mouse.y-canvas.offsetTop-timeline.selected.unfinishedTween.start.y;

        displayOffset.second.x = mouse.x-canvas.offsetLeft-timeline.selected.unfinishedTween.end.x;
        displayOffset.second.y = mouse.y-canvas.offsetTop-timeline.selected.unfinishedTween.end.y;
        
        controllers.center = true;
        canvas.style.cursor = "move";
    }else if(canvas.hover(el.x, el.y, el.width, el.height) && tween.point != 3) {
        displayOffset.x = mouse.x-canvas.offsetLeft-el.x;
        displayOffset.y = mouse.y-canvas.offsetTop-el.y;
        controllers.center = true;
        canvas.style.cursor = "move";
    };


    //vector editing
    if (timeline.selected.frame != undefined) {
        if (tween.point === 3) {
            el = timeline.selected;
            for (let i = 0; i < timeline.selected.vector.length; i++) {
                
                if (canvas.hover(el.vector[i].x+el.x-5, el.vector[i].y+el.y-5, 10, 10)) {
                    
                    controllers.vector.i = i;
                    controllers.vector.inUse = true;
                    displayOffset.x = mouse.x-canvas.offsetLeft-el.vector[i].x;
                    displayOffset.y = mouse.y-canvas.offsetTop-el.vector[i].y;
                    canvas.style.cursor = "move";
                }
            }
        }
    }
}, false);

window.addEventListener("mouseup", function(){
    controllers.center = false;
    controllers.vector.inUse = false;
    displayOffset = {second: {}};
    canvas.style.cursor = "default";
}, false);

canvas.addEventListener("mouseover", function(){canvas.canvasHover = true}, false);
canvas.addEventListener("mouseleave", function(){canvas.canvasHover = false}, false);


graphic.update = () => {
    //position (x and y)
    let el = timeline.selected;
    if (el.unfinishedTween != undefined) {
        if (tween.point === 0) {el = timeline.selected.unfinishedTween.start}else if(tween.point === 1) {el = timeline.selected.unfinishedTween.end};
    };


    if (timeline.selected.frame != undefined) {
        if (controllers.center) {
            /*el.x = mouse.x-canvas.offsetLeft-displayOffset.x;
            el.y = mouse.y-canvas.offsetTop-displayOffset.y;*/

            if (tween.point === 2) {
                timeline.selected.unfinishedTween.start.x = mouse.x-canvas.offsetLeft-displayOffset.x;
                timeline.selected.unfinishedTween.start.y = mouse.y-canvas.offsetTop-displayOffset.y;
    
                timeline.selected.unfinishedTween.end.x = mouse.x-canvas.offsetLeft-displayOffset.second.x;
                timeline.selected.unfinishedTween.end.y = mouse.y-canvas.offsetTop-displayOffset.second.y;
            }else {
                el.x = mouse.x-canvas.offsetLeft-displayOffset.x;
                el.y = mouse.y-canvas.offsetTop-displayOffset.y;
            }
            
        };
        if (tween.point === 3 && controllers.vector.inUse) {
            timeline.selected.vector[controllers.vector.i].x = mouse.x-canvas.offsetLeft-displayOffset.x;
            timeline.selected.vector[controllers.vector.i].y = mouse.y-canvas.offsetTop-displayOffset.y;
        };
    }
}

function remove() {
    if (timeline.selected.frame != undefined) {
        graphics[timeline.selected.default.layer].splice(timeline.selected.default.i, 1);
        timeline.selected = {frame: undefined};
    }
}
setTimeout(loop, 500);

tween.linear = (t, b, c, d) => {
	return c*t/d + b;
};

tween.easeInQuad = (t, b, c, d) => {
	t /= d;
	return c*t*t + b;
};


tween.easeOutQuad = (t, b, c, d) => {
	t /= d;
	return -c * t*(t-2) + b;
};

tween.easeInOutQuad = (t, b, c, d) => {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};



function frameToTime(frame) {
    var time = {};
    var miliseconds = Math.round(1000/60*frame);

    time.miliseconds = miliseconds;
    time.seconds = parseInt(miliseconds/1000);
    time.minutes = parseInt(time.seconds/60);
    time.hours = parseInt(time.minutes/60);

    time.miliseconds = time.miliseconds-time.seconds*1000;
    time.seconds = time.seconds-time.minutes*60;
    time.minutes = time.minutes-time.hours*60;


    return time;
};

function round(number, to) {
    var num = parseInt(number/to);
    num = num*to;
    return num;
}


function save() {
    let fs = require("fs");
    fs.writeFile("./save.txt", graphics, function(error){
        console.log(error);
    })
}