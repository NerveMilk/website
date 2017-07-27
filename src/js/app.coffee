isMenuDisplayed = false

# layout list
articles = document.querySelectorAll('#story_list li a');
Array::forEach.call articles, (el, i) ->
  w = el.offsetWidth
  num = Math.ceil(800 / w)
  for i in [0..num]
    cln = el.cloneNode(true)
    el.parentNode.appendChild cln

toggleMenu = ->
  isMenuDisplayed = !isMenuDisplayed
  if isMenuDisplayed
    document.getElementById('menu').classList.remove 'hide'
    document.getElementsByTagName('nav')[0].classList.add 'expand'
    document.getElementById('btn_menu').innerHTML = 'close'
  else
    document.getElementById('menu').classList.add 'hide'
    document.getElementsByTagName('nav')[0].classList.remove 'expand'
    document.getElementById('btn_menu').innerHTML = 'menu'
  return
