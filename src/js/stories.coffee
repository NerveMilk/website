ctx = null
curr = null
font = null
words = []
menuHeight = 40

class Word
  constructor: (@ctx, @font, @id, @text, @link, @x, @y) ->
    @animateStartIndex = 0
    @animateSpeed = 1
    @width = textWidth(@text) * 1.1 #@ctx.measureText(@text).width * 1.2
    @displayText = @text
    @colorStop = 1
    # -1:null 0:static 1:interactive 2:typewriter 3:lightshift
    @state = 0
    @path = @font._getPath @text, @x, @y, 27

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
      @displayText = ""
    else if @state == 0
      @displayText = @text
    # interactive
    else if @state == 1
      @colorStop = max(min((mouseX - curr.x) / curr.width, 1), 0)
      @displayText = @text
    # typewriter
    else if @state == 2
      if @animateStartIndex < @text.length
        @animateStartIndex += @animateSpeed
        @displayText = ""
        @displayText = @text.substring(0, int(@animateStartIndex)) if @animateStartIndex > 0
      else
        @state = 0
    # lightshift
    else if @state == 3
      @colorStop = cos(@animateStartIndex*0.11 * @animateSpeed) * 0.5 + 0.5
      @displayText = @text
      @animateStartIndex++
      @state = 0 if @animateStartIndex > 111

  draw: ->
    @color = @ctx.createLinearGradient(@x, @y, @x + @width, @y)
    @color.addColorStop("0", "#111")
    @color.addColorStop(@colorStop, "#fff")
    @color.addColorStop("1.0", "#111")
    @ctx.fillStyle = @color
    # @ctx.fillText(@displayText, @x, @y)
    # fill 255
    # @font._renderPath @path, @x, @y
    # text @displayText, @x, @y
    #
    pdata = @path.commands
    @ctx.beginPath()
    i = 0
    letterCount = 0
    while i < pdata.length
      if letterCount == @displayText.length
        i = pdata.length
        break
      cmd = pdata[i]
      if cmd.type == 'M'
        @ctx.moveTo cmd.x, cmd.y
      else if cmd.type == 'L'
        @ctx.lineTo cmd.x, cmd.y
      else if cmd.type == 'C'
        @ctx.bezierCurveTo cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y
      else if cmd.type == 'Q'
        @ctx.quadraticCurveTo cmd.x1, cmd.y1, cmd.x, cmd.y
      else if cmd.type == 'Z'
        @ctx.closePath()
        letterCount++
      i += 1
    @ctx.fill()


stats = new Stats()
stats.showPanel(0)
document.body.appendChild stats.dom

preload = ->
  font = loadFont('../fonts/PingFang Bold.ttf')
  # console.log font

setup = ->

  stories = selectAll('.story-item')
  if stories.length == 0
    return

  canvas = createCanvas(windowWidth, windowHeight - menuHeight)
  canvas.id('canvas').position(0, menuHeight).style('position', 'absolute')
  ctx = canvas.drawingContext
  # ctx.font = "27px San Francisco"
  # frameRate 60

  startX = 0
  startY = 50
  index = 0
  textSize 27
  textAlign LEFT

  while startY < windowHeight
    story = stories[index]
    link = story.elt.href
    text = story.elt.innerHTML
    word = new Word ctx, font, index, text, link, startX, startY
    words.push word
    spacing = random 10, 40
    startX += word.width + spacing
    if startX > windowWidth
      startX = startX - spacing - windowWidth - word.width
      startY += 50
    else
      index = (index + 1) % stories.length

  # setup initial typewriter animation
  for word in words
    word.animateStartIndex = random(-50, 0)
    word.state = 2

draw = ->
  stats.begin()
  background 0

  # find mouseover
  curr = null
  for word in words
    if mouseX > word.x && mouseX < word.x + word.width && mouseY < (word.y + 10) && mouseY > (word.y - 30)
      curr = word
      break

  for word in words
    word.update()
    word.draw()
  stats.end()

windowResized = ->
  resizeCanvas(windowWidth, windowHeight)

mousePressed = ->
  if curr != null
    window.location = curr.link
