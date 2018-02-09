var gulp         = require("gulp"),
    plumber      = require('gulp-plumber'),
    pump         = require('pump'),
    less         = require("gulp-less"), // if you use {less}
    sass         = require('gulp-sass'), 
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin      = require('gulp-htmlmin'),
    minify       = require('gulp-csso'),
    uglify       = require('gulp-uglify'),
    rename       = require('gulp-rename'),
    imagemin     = require('gulp-imagemin'), 
    pngquant     = require('imagemin-pngquant'),
    server       = require("browser-sync"),
    del          = require('del'),
    run          = require('run-sequence'),
    ghPages      = require('gulp-gh-pages');

gulp.task("clean", function() {
		return del.sync("dist");
});

gulp.task("style", function() {
	gulp.src("app/sass/style.scss")
		.pipe(plumber())
		.pipe(sass())
		.pipe(
			autoprefixer(
				["last 15 versions", "> 1%", "ie 8", "ie 7"], 
				{ cascade: true }
			)
		)
		.pipe(gulp.dest("app/css"))
		.pipe(minify())
		.pipe(rename("style.min.css"))
		.pipe(gulp.dest("app/css"))
		.pipe(server.reload({stream: true}))
});

gulp.task("img", function() {
		return gulp.src("app/img/**/*")
			.pipe(imagemin({
					interlaced: true,
					progressive: true,
					svgoPlugins: [{removeViewBox: false}],
					use: [pngquant()]
				})
			)
			.pipe(gulp.dest("dist/img"));
});

gulp.task("serve", function() {
	server({
		server: {
			baseDir: "app"
		},
		notify: false
	});
});

gulp.task("copy", function(){

	var copyCss = gulp.src("app/css/style.min.css")
		.pipe(gulp.dest("dist/css"));

	var copyFonts = gulp.src("app/fonts/**/*")
		.pipe(gulp.dest("dist/fonts"));

});

gulp.task('minifyHTML', function() {
  return gulp.src('app/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('compressJs', function (cb) {
  pump([
        gulp.src('app/js/*.js'),
        uglify(),
        gulp.dest('dist/js')
    ],
    cb
  );
});

gulp.task("build", function(done) {

	run("clean", "style", "img", "copy", "minifyHTML", "compressJs", done);

});

gulp.task("watch", ['serve', 'style'], function() {
	gulp.watch("app/sass/**/*.scss", ['style']);
	gulp.watch('app/*.html', server.reload);
	gulp.watch('app/js/**/*.js', server.reload);
});

gulp.task("deploy", function(){
	return gulp.src('./dist/**/*')
		.pipe(ghPages());
});

gulp.task("default", ["watch"]);
