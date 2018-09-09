var isMenuDisplayed, toggleMenu;

isMenuDisplayed = false;

// layout list
// articles = document.querySelectorAll('#story_list li a');
// Array::forEach.call articles, (el, i) ->
//   w = el.offsetWidth
//   num = Math.ceil(800 / w)
//   for i in [0..num]
//     cln = el.cloneNode(true)
//     el.parentNode.appendChild cln

toggleMenu = function(event) {
  isMenuDisplayed = !isMenuDisplayed;
  if (isMenuDisplayed) {
    document.getElementsByTagName('nav')[0].classList.add('expand');
  } else {
    document.getElementsByTagName('nav')[0].classList.remove('expand');
  }
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
};
