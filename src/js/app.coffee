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

toggleMenu = (event)->
  isMenuDisplayed = !isMenuDisplayed
  if isMenuDisplayed
    document.getElementsByTagName('nav')[0].classList.add 'expand'
  else
    document.getElementsByTagName('nav')[0].classList.remove 'expand'
  if event.stopPropagation
    event.stopPropagation()
  else
    event.cancelBubble = true
  return

# add targt blank to external links
links = document.body.getElementsByTagName('a')
i = 0
linksLength = links.length
while i < linksLength
  if links[i].hostname != window.location.hostname
    links[i].target = '_blank'
  i++
