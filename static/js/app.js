var i, isMenuDisplayed, links, linksLength, toggleMenu;

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

links = document.body.getElementsByTagName('a');

i = 0;

linksLength = links.length;

while (i < linksLength) {
  if (links[i].hostname !== window.location.hostname) {
    links[i].target = '_blank';
  }
  i++;
}
