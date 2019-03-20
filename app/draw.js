var DRAW = {};

DRAW.getDrawJSContext = function(canvas, type) {
    var context = canvas.getContext(type);
    context.fillArea = function(color, x, y, width, height) {
        var last = context.fillStyle;
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        context.fillStyle = last;
    };
    context.drawTexture = function(image, x, y, width, height) {
        var img = new Image();
        img.src = image;
        context.drawImage(img, x, y, width, height);
    };
    context.circle = function(color, x, y, radius) {
        var last = context.fillStyle;
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI*100);
        context.fill();
        context.fillStyle = last;
    };
    context.clearAll = function() {
        context.canvas.width = context.canvas.width;
        context.canvas.height = context.canvas.height;
    };
    context.clearColor = function(color) {
        var last = context.fillStyle;
        context.fillStyle = color;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = last;
    };
    context.vector2 = function(vector, color, x, y) {
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(vector[0].x+x, vector[0].y+y);
        for (let v = 1; v < vector.length; v++) {
            context.lineTo(vector[v].x+x, vector[v].y+y);
        };
        context.fill();
    };
    context.drawText = (size, font, content, color, x, y, maxwidth) => {
        var last = {color: context.fillStyle, font: context.font};
        context.fillStyle = color;
        context.font = size+"px "+font;
        context.fillText(content, x, y, maxwidth);
        context.fillStyle = last.color;
        context.font = last.font;
    }
    return(context);
};