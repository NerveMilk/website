var articles, isMenuDisplayed, toggleMenu;

isMenuDisplayed = false;

articles = document.querySelectorAll('#story_list li a');

Array.prototype.forEach.call(articles, function(el, i) {
  var cln, j, num, ref, results, w;
  w = el.offsetWidth;
  num = Math.ceil(800 / w);
  results = [];
  for (i = j = 0, ref = num; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
    cln = el.cloneNode(true);
    results.push(el.parentNode.appendChild(cln));
  }
  return results;
});

toggleMenu = function() {
  isMenuDisplayed = !isMenuDisplayed;
  if (isMenuDisplayed) {
    document.getElementById('menu').classList.remove('hide');
    document.getElementsByTagName('nav')[0].classList.add('expand');
    document.getElementById('btn_menu').innerHTML = 'close';
  } else {
    document.getElementById('menu').classList.add('hide');
    document.getElementsByTagName('nav')[0].classList.remove('expand');
    document.getElementById('btn_menu').innerHTML = 'menu';
  }
};
