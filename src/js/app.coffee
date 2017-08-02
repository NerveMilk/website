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

setup = ->
  canvas = createCanvas(windowWidth, windowHeight)
  ctx = canvas.drawingContext
  canvas.id('canvas').position(0, 0).style('position', 'absolute')
  background(0)
  stories = selectAll('.story-item');
  ctx.font = "27px San Francisco";

  startX = 0
  startY = 25
  index = 0
  while startY < windowHeight
    story = stories[index]
    link = story.elt.href
    text = story.elt.innerHTML
    textWidth = ctx.measureText(text).width;
    gradient = ctx.createLinearGradient(startX, startY, startX + textWidth, startY);
    gradient.addColorStop("0", "#111");
    gradient.addColorStop("1.0", "#fff");
    ctx.fillStyle = gradient;
    ctx.fillText(text, startX, startY);
    startX += textWidth + 20
    if startX > windowWidth
      startX = windowWidth - startX
      startY += 50
    else
      index = (index + 1) % stories.length

draw = ->
