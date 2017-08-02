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
# toggleMenu = ->
#   isMenuDisplayed = !isMenuDisplayed
#   if isMenuDisplayed
#     document.getElementById('menu').classList.remove 'hide'
#     document.getElementsByTagName('nav')[0].classList.add 'expand'
#     document.getElementById('btn_menu').innerHTML = 'close'
#   else
#     document.getElementById('menu').classList.add 'hide'
#     document.getElementsByTagName('nav')[0].classList.remove 'expand'
#     document.getElementById('btn_menu').innerHTML = 'menu'
#   return

ctx = null
curr = null
words = []

class Word
  constructor: (@ctx, @id, @text, @link, @x, @y) ->
    @width = @ctx.measureText(@text).width
  update: ->
    if curr != null && @id == curr.id
      @color = @ctx.createLinearGradient(@x, @y, @x + @width, @y)
      stop = (mouseX - curr.x) / @width
      console.log stop
      @color.addColorStop("0", "#111")
      @color.addColorStop(stop, "#fff")
      @color.addColorStop("1.0", "#111")
    else
      @color = @ctx.createLinearGradient(@x, @y, @x + @width, @y)
      @color.addColorStop("0", "#111")
      @color.addColorStop("1.0", "#fff")
  draw: ->
    @ctx.fillStyle = @color
    @ctx.fillText(@text, @x, @y)

setup = ->
  canvas = createCanvas(windowWidth, windowHeight)
  ctx = canvas.drawingContext
  canvas.id('canvas').position(0, 0).style('position', 'absolute')
  stories = selectAll('.story-item');
  ctx.font = "27px San Francisco";

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

mouseClicked = ->
  if curr != null
    window.location = curr.link
