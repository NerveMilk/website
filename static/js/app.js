var isMenuDisplayed, toggleMenu;

isMenuDisplayed = false;

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
