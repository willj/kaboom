var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

gulp.task("scripts", function(){ 
    return gulp.src("src/*.js") 
    .pipe(concat('kaboom.js')) 
    .pipe(uglify()) 
    .pipe(rename({extname: ".min.js"})) 
    .pipe(gulp.dest("dist"))
    .pipe(gulp.dest("sample")); 
}); 

gulp.task("watch", function(){
   gulp.watch("src/*.js", ["scripts"]); 
});

gulp.task("default", ["scripts"]);