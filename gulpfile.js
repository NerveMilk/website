var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var coffee = require('gulp-coffee');

// Compile SCSS files to CSS
gulp.task("scss", function () {
  gulp.src("src/scss/**/*.scss")
    .pipe(sass({
      outputStyle: "compressed"
    }))
    .pipe(autoprefixer({
      browsers: ["last 20 versions"]
    }))
    .pipe(gulp.dest("static/css"))
})

// Compile CoffeeScript files to JS
gulp.task('coffee', function() {
  gulp.src('src/js/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('static/js'));
});


// Watch asset folder for changes
gulp.task("watch", ["scss", "coffee"], function () {
  gulp.watch("src/scss/**/*", ["scss"])
  gulp.watch("src/js/**/*", ["coffee"])
})

// Set watch as default task
gulp.task("default", ["watch"])
