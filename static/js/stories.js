var Word, ctx, curr, draw, menuHeight, mousePressed, preload, setup, shapes, windowResized, words;

ctx = null;

curr = null;

shapes = null;

words = [];

menuHeight = 40;

Word = (function() {
  function Word(ctx1, id, text1, link1, path1, width, x, y, scale1) {
    var cmd, j, len, ref;
    this.ctx = ctx1;
    this.id = id;
    this.text = text1;
    this.link = link1;
    this.path = path1;
    this.width = width;
    this.x = x;
    this.y = y;
    this.scale = scale1;
    this.animateStartIndex = 0;
    this.animateSpeed = 1;
    this.colorStop = 1;
    this.state = 0;
    this.shapeCount = 0;
    ref = this.path;
    for (j = 0, len = ref.length; j < len; j++) {
      cmd = ref[j];
      if (cmd.type === 'Z') {
        this.shapeCount++;
      }
    }
    this.displayText = this.shapeCount;
  }

  Word.prototype.update = function() {
    var r;
    if (curr && curr.id === this.id) {
      this.state = 1;
    } else {
      if (this.state === 1) {
        this.state = 0;
      }
      if (this.state === 0) {
        r = random(0, 1111);
        if (r < 1) {
          this.state = 2;
          this.animateStartIndex = 0;
          this.animateSpeed = random(0.11, 0.66);
        } else if (r < 2) {
          this.state = 3;
          this.animateStartIndex = 0;
          this.animateSpeed = random(0.11, 0.66);
        }
      }
    }
    if (this.state === -1) {
      return this.displayText = 0;
    } else if (this.state === 0) {
      return this.displayText = this.shapeCount;
    } else if (this.state === 1) {
      this.colorStop = max(min((mouseX - curr.x) / curr.width, 1), 0);
      return this.displayText = this.shapeCount;
    } else if (this.state === 2) {
      if (this.animateStartIndex < this.shapeCount) {
        this.animateStartIndex += this.animateSpeed;
        return this.displayText = min(int(this.animateStartIndex), this.shapeCount);
      } else {
        return this.state = 0;
      }
    } else if (this.state === 3) {
      this.colorStop = cos(this.animateStartIndex * 0.11 * this.animateSpeed) * 0.5 + 0.5;
      this.displayText = this.shapeCount;
      this.animateStartIndex++;
      if (this.animateStartIndex > 111) {
        return this.state = 0;
      }
    }
  };

  Word.prototype.draw = function() {
    var cmd, i, letterCount;
    this.color = this.ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
    this.color.addColorStop("0", "#111");
    this.color.addColorStop(this.colorStop, "#fff");
    this.color.addColorStop("1.0", "#111");
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    i = 0;
    letterCount = 0;
    while (i < this.path.length) {
      if (letterCount === this.displayText) {
        i = this.path.length;
        break;
      }
      cmd = this.path[i];
      if (cmd.type === 'M') {
        this.ctx.moveTo(cmd.x * this.scale + this.x, cmd.y * this.scale + this.y);
      } else if (cmd.type === 'L') {
        this.ctx.lineTo(cmd.x * this.scale + this.x, cmd.y * this.scale + this.y);
      } else if (cmd.type === 'C') {
        this.ctx.bezierCurveTo(cmd.x1 * this.scale + this.x, cmd.y1 * this.scale + this.y, cmd.x2 * this.scale + this.x, cmd.y2 * this.scale + this.y, cmd.x * this.scale + this.x, cmd.y * this.scale + this.y);
      } else if (cmd.type === 'Q') {
        this.ctx.quadraticCurveTo(cmd.x1 * this.scale + this.x, cmd.y1 * this.scale + this.y, cmd.x * this.scale + this.x, cmd.y * this.scale + this.y);
      } else if (cmd.type === 'Z') {
        this.ctx.closePath();
        letterCount++;
      }
      i += 1;
    }
    return this.ctx.fill();
  };

  return Word;

})();

preload = function() {
  return shapes = loadJSON('../shapes.json');
};

setup = function() {
  var canvas, index, j, len, link, path, results, scale, spacing, startX, startY, stories, story, text, textWidth, word;
  stories = selectAll('.story-item');
  if (stories.length === 0) {
    return;
  }
  canvas = createCanvas(windowWidth, windowHeight - menuHeight);
  canvas.id('canvas').position(0, menuHeight).style('position', 'absolute');
  ctx = canvas.drawingContext;
  frameRate(60);
  scale = 1;
  if (windowWidth < 480) {
    scale = 0.75;
  }
  startX = 0;
  startY = 50 * scale;
  index = 0;
  textSize(27);
  textAlign(LEFT);
  while (startY < windowHeight) {
    story = stories[index];
    link = story.elt.href;
    text = story.elt.innerHTML;
    path = shapes[text].path || [];
    textWidth = shapes[text].width * scale || 0;
    word = new Word(ctx, index, text, link, path, textWidth, startX, startY, scale);
    words.push(word);
    spacing = (random(10, 40)) * scale;
    startX += word.width + spacing;
    if (startX > windowWidth) {
      startX = startX - spacing - windowWidth - word.width;
      startY += 50 * scale;
    } else {
      index = (index + 1) % stories.length;
    }
  }
  results = [];
  for (j = 0, len = words.length; j < len; j++) {
    word = words[j];
    word.animateStartIndex = random(-50, 0);
    results.push(word.state = 2);
  }
  return results;
};

draw = function() {
  var j, k, len, len1, results, word;
  background(0);
  curr = null;
  for (j = 0, len = words.length; j < len; j++) {
    word = words[j];
    if (mouseX > word.x && mouseX < word.x + word.width && mouseY < (word.y + 10) && mouseY > (word.y - 30)) {
      curr = word;
      break;
    }
  }
  results = [];
  for (k = 0, len1 = words.length; k < len1; k++) {
    word = words[k];
    word.update();
    results.push(word.draw());
  }
  return results;
};

windowResized = function() {
  return resizeCanvas(windowWidth, windowHeight);
};

mousePressed = function() {
  if (curr !== null) {
    return window.location = curr.link;
  }
};
