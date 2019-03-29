var canvas = document.querySelector("#canvas");
canvas.width = 1920/2;
canvas.height = 1080/2;
var c = DRAW.getDrawJSContext(canvas, "2d");



function render() {
    canvas.width = 1920/2;
    canvas.height = 1080/2;
    
    c.clearColor("black");
    for (let j = graphics.length-1; j > -1; j--) {
        for (let i = 0; i < graphics[j].length; i++) {
            const el = graphics[j][i];
            if (el.frame <= frame && el.frame+el.length >= frame) {
                if (el.display) {
                    c.vector2(el.vector, HSBtoRGB(el.color).str, el.x, el.y);
                }

                
                if (el.text != undefined) {
                    c.drawText(el.text.size, el.text.font, el.text.content, el.color, el.x, el.y, el.text.maxWidth);
                }
            }
        }
    }

    
    if (timeline.selected.frame != undefined) {
        let invert = HSBtoRGB(timeline.selected.color).json;
            invert.r = 255-invert.r;
            invert.g = 255-invert.g;
            invert.b = 255-invert.b;
            invert = "rgb("+invert.r+","+invert.g+","+invert.b+")";

        if (timeline.selected.unfinishedTween != undefined) {
            let el = timeline.selected.unfinishedTween;
            
            if (tween.point === 0 || tween.point === 1) {
                if (timeline.selected.unfinishedTween.start.x != undefined && timeline.selected.unfinishedTween.end.x != undefined) {
                    let alpha = HSBtoRGB(timeline.selected.color).json;
                    alpha = "rgba("+alpha.r+", "+alpha.g+", "+alpha.b+", 0.5)";
                    c.strokeStyle = alpha;
                    c.lineWidth = 10;
                    c.beginPath();
                    c.moveTo(el.start.x+timeline.selected.width/2, el.start.y+timeline.selected.height/2);
                    c.lineTo(el.end.x+timeline.selected.width/2, el.end.y+timeline.selected.height/2);
                    c.stroke();
                }
                if (timeline.selected.unfinishedTween.end.x != undefined) {
                    c.vector2(timeline.selected.vector, invert, el.end.x, el.end.y);
                }
            }
            if (timeline.selected.unfinishedTween.start.x != undefined) {
                c.vector2(timeline.selected.vector, HSBtoRGB(timeline.selected.color).str, el.start.x, el.start.y);
            }
        }
        c.circle("white", timeline.selected.x, timeline.selected.y, 7);
        c.circle(invert, timeline.selected.x, timeline.selected.y, 5);
    }
    if (timeline.selected.frame != undefined && tween.point === 3) {
        for (let i = 0; i < timeline.selected.vector.length; i++) {
            const vector = timeline.selected.vector[i];
            c.fillArea("rgb(119, 60, 255)", vector.x+timeline.selected.x-5, vector.y+timeline.selected.y-5, 10, 10);
        }
    }
}