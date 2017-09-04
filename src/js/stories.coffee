ctx = null
curr = null
shapes = null
words = []
scale = 1
menuHeight = 32

class Word
  constructor: (@ctx, @id, @text, @link, @path, @width, @x, @y, @scale) ->
    @animateStartIndex = 0
    @animateSpeed = 1
    @colorStop = 1
    # -1:null 0:static 1:interactive 2:typewriter 3:lightshift
    @state = 0
    @shapeCount = 0

    for cmd in @path
      if cmd.type == 'Z'
        @shapeCount++

    @displayText = @shapeCount

  update: ->
    # mouse over
    if curr && curr.id == @id
      @state = 1
    else
      if @state == 1
        @state = 0
      if @state == 0
        r = random(0,1111)
        if r < 1
          @state = 2
          @animateStartIndex = 0
          @animateSpeed = random(0.11,0.66)
        else if r < 2
          @state = 3
          @animateStartIndex = 0
          @animateSpeed = random(0.11,0.66)
    # static
    if @state == -1
      @displayText = 0
    else if @state == 0
      @displayText = @shapeCount
    # interactive
    else if @state == 1
      @colorStop = max(min((mouseX - curr.x) / curr.width, 1), 0)
      @displayText = @shapeCount
    # typewriter
    else if @state == 2
      if @animateStartIndex < @shapeCount
        @animateStartIndex += @animateSpeed
        @displayText = min(int(@animateStartIndex), @shapeCount)
      else
        @state = 0
    # lightshift
    else if @state == 3
      @colorStop = cos(@animateStartIndex*0.11 * @animateSpeed) * 0.5 + 0.5
      @displayText = @shapeCount
      @animateStartIndex++
      @state = 0 if @animateStartIndex > 111

  draw: ->
    @color = @ctx.createLinearGradient(@x, @y, @x + @width, @y)
    @color.addColorStop("0", "#111")
    @color.addColorStop(@colorStop, "#fff")
    @color.addColorStop("1.0", "#111")
    @ctx.fillStyle = @color
    @ctx.beginPath()
    i = 0
    letterCount = 0
    while i < @path.length
      if letterCount == @displayText
        i = @path.length
        break
      cmd = @path[i]
      if cmd.type == 'M'
        @ctx.moveTo cmd.x*@scale + @x, cmd.y*@scale + @y
      else if cmd.type == 'L'
        @ctx.lineTo cmd.x*@scale + @x, cmd.y*@scale + @y
      else if cmd.type == 'C'
        @ctx.bezierCurveTo cmd.x1*@scale + @x, cmd.y1*@scale + @y, cmd.x2*@scale + @x, cmd.y2*@scale + @y, cmd.x*@scale + @x, cmd.y*@scale + @y
      else if cmd.type == 'Q'
        @ctx.quadraticCurveTo cmd.x1*@scale + @x, cmd.y1*@scale + @y, cmd.x*@scale + @x, cmd.y*@scale + @y
      else if cmd.type == 'Z'
        @ctx.closePath()
        letterCount++
      i += 1
    @ctx.fill()


# stats = new Stats()
# stats.showPanel(0)
# document.body.appendChild stats.dom


preload = ->
  shapes = loadJSON('../shapes.json');

setup = ->
  stories = selectAll('.story-item')
  if stories.length == 0
    return

  canvas = createCanvas(windowWidth, windowHeight - menuHeight)
  canvas.id('canvas').position(0, menuHeight).style('position', 'absolute')
  ctx = canvas.drawingContext
  frameRate 60

  scale = 1
  if windowWidth < 480
    scale = 0.75

  startX = 0
  startY = 55 * scale
  index = 0
  textSize 27
  textAlign LEFT

  while startY < windowHeight
    story = stories[index]
    link = story.elt.href
    text = story.elt.innerHTML
    path = shapes[text].path || []
    textWidth = shapes[text].width * scale || 0
    word = new Word ctx, index, text, link, path, textWidth, startX, startY, scale
    words.push word
    spacing = (random 10, 40) * scale
    startX += word.width + spacing
    if startX > windowWidth
      startX = startX - spacing - windowWidth - word.width
      startY += 50 * scale
    else
      index = (index + 1) % stories.length

  # setup initial typewriter animation
  for word in words
    word.animateStartIndex = random(-50, 0)
    word.state = 2

draw = ->
  # stats.begin()
  background 0

  # find mouseover
  curr = null
  for word in words
    if mouseX > word.x && mouseX < word.x + word.width && mouseY < (word.y + 12 * scale) && mouseY > (word.y - 32 * scale)
      curr = word
      break

  for word in words
    word.update()
    word.draw()
  # stats.end()

windowResized = ->
  resizeCanvas(windowWidth, windowHeight)

mouseReleased = ->
  if curr != null
    window.location = curr.link
