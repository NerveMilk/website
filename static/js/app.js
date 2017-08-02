var ctx, draw, isMenuDisplayed, setup;

isMenuDisplayed = false;

ctx = null;

setup = function() {
  var canvas, gradient, index, link, results, startX, startY, stories, story, text, textWidth;
  canvas = createCanvas(windowWidth, windowHeight);
  ctx = canvas.drawingContext;
  canvas.id('canvas').position(0, 0).style('position', 'absolute');
  background(0);
  stories = selectAll('.story-item');
  ctx.font = "27px San Francisco";
  startX = 0;
  startY = 25;
  index = 0;
  results = [];
  while (startY < windowHeight) {
    story = stories[index];
    link = story.elt.href;
    text = story.elt.innerHTML;
    textWidth = ctx.measureText(text).width;
    gradient = ctx.createLinearGradient(startX, startY, startX + textWidth, startY);
    gradient.addColorStop("0", "#111");
    gradient.addColorStop("1.0", "#fff");
    ctx.fillStyle = gradient;
    ctx.fillText(text, startX, startY);
    startX += textWidth + 20;
    if (startX > windowWidth) {
      startX = windowWidth - startX;
      results.push(startY += 50);
    } else {
      results.push(index = (index + 1) % stories.length);
    }
  }
  return results;
};

draw = function() {};
