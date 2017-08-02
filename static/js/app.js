var Word, ctx, curr, draw, isMenuDisplayed, mouseClicked, setup, words;

isMenuDisplayed = false;

ctx = null;

curr = null;

words = [];

Word = (function() {
  function Word(ctx1, id, text1, link1, x, y) {
    this.ctx = ctx1;
    this.id = id;
    this.text = text1;
    this.link = link1;
    this.x = x;
    this.y = y;
    this.width = this.ctx.measureText(this.text).width;
  }

  Word.prototype.update = function() {
    var stop;
    if (curr !== null && this.id === curr.id) {
      this.color = this.ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
      stop = (mouseX - curr.x) / this.width;
      console.log(stop);
      this.color.addColorStop("0", "#111");
      this.color.addColorStop(stop, "#fff");
      return this.color.addColorStop("1.0", "#111");
    } else {
      this.color = this.ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
      this.color.addColorStop("0", "#111");
      return this.color.addColorStop("1.0", "#fff");
    }
  };

  Word.prototype.draw = function() {
    this.ctx.fillStyle = this.color;
    return this.ctx.fillText(this.text, this.x, this.y);
  };

  return Word;

})();

setup = function() {
  var canvas, index, link, results, spacing, startX, startY, stories, story, text, word;
  canvas = createCanvas(windowWidth, windowHeight);
  ctx = canvas.drawingContext;
  canvas.id('canvas').position(0, 0).style('position', 'absolute');
  stories = selectAll('.story-item');
  ctx.font = "27px San Francisco";
  startX = 0;
  startY = 50;
  index = 0;
  results = [];
  while (startY < windowHeight) {
    story = stories[index];
    link = story.elt.href;
    text = story.elt.innerHTML;
    word = new Word(ctx, index, text, link, startX, startY);
    words.push(word);
    spacing = random(10, 40);
    startX += word.width + spacing;
    if (startX > windowWidth) {
      startX = startX - spacing - windowWidth - word.width;
      results.push(startY += 50);
    } else {
      results.push(index = (index + 1) % stories.length);
    }
  }
  return results;
};

draw = function() {
  var i, j, len, len1, results, word;
  background(0);
  curr = null;
  for (i = 0, len = words.length; i < len; i++) {
    word = words[i];
    if (mouseX > word.x && mouseX < word.x + word.width && mouseY < (word.y + 10) && mouseY > (word.y - 30)) {
      curr = word;
      break;
    }
  }
  results = [];
  for (j = 0, len1 = words.length; j < len1; j++) {
    word = words[j];
    word.update();
    results.push(word.draw());
  }
  return results;
};

mouseClicked = function() {
  if (curr !== null) {
    return window.location = curr.link;
  }
};
