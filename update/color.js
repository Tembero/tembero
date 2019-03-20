function HSBtoRGB (hsb) {

    var rgb = { };
    var h = Math.round(hsb.h);
    var s = Math.round(hsb.s * 255 / 100);
    var v = Math.round(hsb.b * 255 / 100);
    if (hsb.a != undefined) {rgb.a = hsb.a}else {rgb.a = 1};

        if (s == 0) {

        rgb.r = rgb.g = rgb.b = v;
        } else {
        var t1 = v;
        var t2 = (255 - s) * v / 255;
        var t3 = (t1 - t2) * (h % 60) / 60;

            if (h == 360) h = 0;

                if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3 }
                else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3 }
                else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3 }
                else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3 }
                else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3 }
                else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3 }
                else { rgb.r = 0; rgb.g = 0; rgb.b = 0 }
        }
    
    let color = { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b), a: rgb.a };
    
    return {str: "rgba("+color.r+","+color.g+","+color.b+", "+color.a+")", json: color};
}

var sb = DRAW.getDrawJSContext(document.getElementById("sb"), "2d");

var hsb = {
    h: 0,
    s: 100,
    b: 100,
    a: 1,
}

var cDisplay = {};


cDisplay.update = () => {
    var parent = document.getElementsByClassName("edit")[0];

    if (cDisplay.drag === "h") {
        hsb.h = (mouse.y-sb.canvas.offsetTop-parent.offsetTop)*3.6;
    };
    if (cDisplay.drag === "a") {
        hsb.a = (mouse.y-sb.canvas.offsetTop-parent.offsetTop)/100;
    };
    if (cDisplay.drag === "sb") {
        hsb.s = mouse.x-sb.canvas.offsetLeft-parent.offsetLeft;
        hsb.b = mouse.y-sb.canvas.offsetTop-parent.offsetTop;
    };

    if (hsb.h > 360) {hsb.h = 360};
    if (hsb.h < 0) {hsb.h = 0};

    if (hsb.s > 120) {hsb.s = 120};
    if (hsb.s < 20) {hsb.s = 20};
    if (hsb.b > 100) {hsb.b = 100};
    if (hsb.b < 0) {hsb.b = 0};

    if (hsb.a > 1) {hsb.a = 1};
    if (hsb.a < 0) {hsb.a = 0};


    sb.clearAll();
    // fill all of the backgrounds
    sb.drawTexture("color_slider.png", 0, 0, 20, 100);

    let rgb = HSBtoRGB({h: hsb.h, s: 100, b: 100, a: 1}).json;
    rgb = "rgb("+rgb.r+", "+rgb.g+", "+rgb.b+")";

    sb.fillArea(rgb, 20, 0, 100, 100);
    sb.drawTexture("color_background.png", 20, 0, 100, 100);

    let prev = hsb.a;
    hsb.a = 1;
    sb.fillArea(HSBtoRGB(hsb).str, 120, 0, 20, 100);
    hsb.a = prev;
    sb.drawTexture("alpha_gradient.png", 120, 0, 20, 100);


    sb.fillArea("gray", 0, hsb.h/3.6-5, 20, 10);
    sb.fillArea("black", 120, hsb.a*100-5, 20, 10);

    let invert = HSBtoRGB(hsb).json;
    invert.r = 255-invert.r;
    invert.g = 255-invert.g;
    invert.b = 255-invert.b;
    invert = "rgb("+invert.r+", "+invert.g+", "+invert.b+")";

    sb.circle(invert, hsb.s, hsb.b, 4);

    sb.fillArea(HSBtoRGB(hsb).str, 0, 100, 140, 20);
}

sb.canvas.addEventListener("mousedown", function(){
    if (cDisplay.areaHover(0, 0, 20, 100)) {
        cDisplay.drag = "h";
    };
    if (cDisplay.areaHover(120, 0, 20, 100)) {
        cDisplay.drag = "a";
    };
    if (cDisplay.areaHover(20, 0, 100, 100)) {
        cDisplay.drag = "sb";
    };
}, false);
window.addEventListener("mouseup", function(){cDisplay.drag = false}, false);

//sb.canvas.addEventListener("mouseover", function(){hsb.hover = true}, false);
//sb.canvas.addEventListener("mouseleave", function(){hsb.hover = false; hsb.hold = false}, false);

cDisplay.areaHover = (x, y, width, height) => {
    var parent = document.getElementsByClassName("edit")[0];
    return (mouse.x-sb.canvas.offsetLeft-parent.offsetLeft >= x && mouse.x-sb.canvas.offsetLeft-parent.offsetLeft <= x+width &&
    mouse.y-sb.canvas.offsetTop-parent.offsetTop >= y && mouse.y-sb.canvas.offsetTop-parent.offsetTop <= y+height);
}