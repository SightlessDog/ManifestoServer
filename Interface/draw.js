let canvas = new fabric.Canvas("c");

var circle = new fabric.Circle({
  radius: 30,
});

canvas.on("object:modified", function (e) {
  var obj = e.target;
  var rect = obj.getBoundingRect();

  if (
    rect.left < 0 ||
    rect.top < 0 ||
    rect.left + rect.width > canvas.getWidth() ||
    rect.top + rect.height > canvas.getHeight()
  ) {
    if (obj.getAngle() != obj.originalState.angle) {
      obj.setAngle(obj.originalState.angle);
    } else {
      obj.setTop(obj.originalState.top);
      obj.setLeft(obj.originalState.left);
      obj.setScaleX(obj.originalState.scaleX);
      obj.setScaleY(obj.originalState.scaleY);
    }
    obj.setCoords();
  }
});

$("#drawCircle").click(function (e) {
  canvas.add(circle);
});
