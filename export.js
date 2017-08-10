var opentype = require('opentype.js');
var fs = require('fs');

// List all files in post
var getPostNames = function (dir) {
  var files = fs.readdirSync(dir);
  filelist = [];
  files.forEach(function (file) {
    if (file.indexOf('md') >= 0) {
      filelist.push(file.replace('.md', ''));
    }
  });
  return filelist;
};

var font = opentype.loadSync('static/fonts/PingFang Bold.ttf');
var posts = getPostNames('content/post/');
var results = {};

posts.forEach(function (post) {
  var path = font.getPath(post, 0, 0, 27);
  var width = font.getAdvanceWidth(post, 27);
  var obj = {};
  obj.path = path.commands;
  obj.width = width;
  results[post] = obj;
  console.log('generating path for', post, '...');
});

const jsonString = JSON.stringify(results);
fs.writeFile("static/shapes.json", jsonString, 'utf8', function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("Paths Exported");
});
