var Word, ctx, curr, draw, font, menuHeight, mousePressed, preload, setup, stats, windowResized, words;

ctx = null;

curr = null;

font = null;

words = [];

menuHeight = 40;

Word = (function() {
  function Word(ctx1, font1, id, text1, link1, x, y) {
    this.ctx = ctx1;
    this.font = font1;
    this.id = id;
    this.text = text1;
    this.link = link1;
    this.x = x;
    this.y = y;
    this.animateStartIndex = 0;
    this.animateSpeed = 1;
    this.width = textWidth(this.text) * 1.1;
    this.displayText = this.text;
    this.colorStop = 1;
    this.state = 0;
    this.path = this.font._getPath(this.text, this.x, this.y, 27);
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
      return this.displayText = "";
    } else if (this.state === 0) {
      return this.displayText = this.text;
    } else if (this.state === 1) {
      this.colorStop = max(min((mouseX - curr.x) / curr.width, 1), 0);
      return this.displayText = this.text;
    } else if (this.state === 2) {
      if (this.animateStartIndex < this.text.length) {
        this.animateStartIndex += this.animateSpeed;
        this.displayText = "";
        if (this.animateStartIndex > 0) {
          return this.displayText = this.text.substring(0, int(this.animateStartIndex));
        }
      } else {
        return this.state = 0;
      }
    } else if (this.state === 3) {
      this.colorStop = cos(this.animateStartIndex * 0.11 * this.animateSpeed) * 0.5 + 0.5;
      this.displayText = this.text;
      this.animateStartIndex++;
      if (this.animateStartIndex > 111) {
        return this.state = 0;
      }
    }
  };

  Word.prototype.draw = function() {
    var cmd, i, letterCount, pdata;
    this.color = this.ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
    this.color.addColorStop("0", "#111");
    this.color.addColorStop(this.colorStop, "#fff");
    this.color.addColorStop("1.0", "#111");
    this.ctx.fillStyle = this.color;
    pdata = this.path.commands;
    this.ctx.beginPath();
    i = 0;
    letterCount = 0;
    while (i < pdata.length) {
      if (letterCount === this.displayText.length) {
        i = pdata.length;
        break;
      }
      cmd = pdata[i];
      if (cmd.type === 'M') {
        this.ctx.moveTo(cmd.x, cmd.y);
      } else if (cmd.type === 'L') {
        this.ctx.lineTo(cmd.x, cmd.y);
      } else if (cmd.type === 'C') {
        this.ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
      } else if (cmd.type === 'Q') {
        this.ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
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

stats = new Stats();

stats.showPanel(0);

document.body.appendChild(stats.dom);

preload = function() {
  return font = loadFont('../fonts/PingFang Bold.ttf');
};

setup = function() {
  var canvas, index, j, len, link, results, spacing, startX, startY, stories, story, text, word;
  stories = selectAll('.story-item');
  if (stories.length === 0) {
    return;
  }
  canvas = createCanvas(windowWidth, windowHeight - menuHeight);
  canvas.id('canvas').position(0, menuHeight).style('position', 'absolute');
  ctx = canvas.drawingContext;
  frameRate(60);
  startX = 0;
  startY = 50;
  index = 0;
  textSize(27);
  textAlign(LEFT);
  while (startY < windowHeight) {
    story = stories[index];
    link = story.elt.href;
    text = story.elt.innerHTML;
    word = new Word(ctx, font, index, text, link, startX, startY);
    words.push(word);
    spacing = random(10, 40);
    startX += word.width + spacing;
    if (startX > windowWidth) {
      startX = startX - spacing - windowWidth - word.width;
      startY += 50;
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
  var j, k, len, len1, word;
  stats.begin();
  background(0);
  curr = null;
  for (j = 0, len = words.length; j < len; j++) {
    word = words[j];
    if (mouseX > word.x && mouseX < word.x + word.width && mouseY < (word.y + 10) && mouseY > (word.y - 30)) {
      curr = word;
      break;
    }
  }
  for (k = 0, len1 = words.length; k < len1; k++) {
    word = words[k];
    word.update();
    word.draw();
  }
  return stats.end();
};

windowResized = function() {
  return resizeCanvas(windowWidth, windowHeight);
};

mousePressed = function() {
  if (curr !== null) {
    return window.location = curr.link;
  }
};
