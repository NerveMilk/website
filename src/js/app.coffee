isMenuDisplayed = false

# layout list
# articles = document.querySelectorAll('#story_list li a');
# Array::forEach.call articles, (el, i) ->
#   w = el.offsetWidth
#   num = Math.ceil(800 / w)
#   for i in [0..num]
#     cln = el.cloneNode(true)
#     el.parentNode.appendChild cln
#
stopHere = (event) ->
  if event.stopPropagation
    event.stopPropagation()
  else
    event.cancelBubble = true
  return

toggleMenu = (event)->
  isMenuDisplayed = !isMenuDisplayed
  if isMenuDisplayed
    document.getElementById('menu').classList.remove 'hide'
    document.getElementsByTagName('nav')[0].classList.add 'expand'
    document.getElementById('btn_menu').innerHTML = 'close'
  else
    document.getElementById('menu').classList.add 'hide'
    document.getElementsByTagName('nav')[0].classList.remove 'expand'
    document.getElementById('btn_menu').innerHTML = 'Nervemilk'
  if event.stopPropagation
    event.stopPropagation()
  else
    event.cancelBubble = true
  return

ctx = null
curr = null
words = []

class Word
  constructor: (@ctx, @id, @text, @link, @x, @y) ->
    @animateStartIndex = 0
    @animateSpeed = 1
    @width = @ctx.measureText(@text).width
    @displayText = @text
    @colorStop = 1
    # -1:null 0:static 1:interactive 2:typewriter 3:blink 4:lightshift
    @state = 0

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
        else if r < 4
          @state = 4
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
    # blink
    else if @state == 3
      @displayText = @text
      if random(111) < 1
        @displayText = ""
      @animateStartIndex++
      @state = 0 if @animateStartIndex > 1111
    # lightshift
    else if @state == 4
      @colorStop = cos(@animateStartIndex*0.22 * @animateSpeed) * 0.5 + 0.5
      @displayText = @text
      @animateStartIndex++
      @state = 0 if @animateStartIndex > 111

  draw: ->
    @color = @ctx.createLinearGradient(@x, @y, @x + @width, @y)
    @color.addColorStop("0", "#111")
    @color.addColorStop(@colorStop, "#fff")
    @color.addColorStop("1.0", "#111")
    @ctx.fillStyle = @color
    @ctx.fillText(@displayText, @x, @y)

setup = ->
  stories = selectAll('.story-item')
  if stories.length == 0
    return

  canvas = createCanvas(windowWidth, windowHeight)
  canvas.id('canvas').position(0, 0).style('position', 'absolute')
  ctx = canvas.drawingContext
  ctx.font = "27px San Francisco"
  frameRate 60

  startX = 0
  startY = 50
  index = 0
  while startY < windowHeight
    story = stories[index]
    link = story.elt.href
    text = story.elt.innerHTML
    word = new Word ctx, index, text, link, startX, startY
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

windowResized = ->
  resizeCanvas(windowWidth, windowHeight)

mouseClicked = ->
  if curr != null
    window.location = curr.link
