var gulp         = require("gulp"),
		plumber      = require('gulp-plumber'),
		less         = require("gulp-less"),
/** sass         = require('gulp-sass'),           */
		autoprefixer = require('gulp-autoprefixer'),
		minify       = require('gulp-csso');
		rename       = require('gulp-rename');
		imagemin     = require('gulp-imagemin'), 
		pngquant     = require('imagemin-pngquant'),
		cache        = require('gulp-cache'),
		server       = require("browser-sync"),
		del          = require('del'),
		run          = require('run-sequence');

gulp.task("clean", function() {
		return del.sync("dist");
});

gulp.task("clear", function() {
		return cache.clearAll();
})

gulp.task("style", function() {
	gulp.src("app/less/style.less")
		.pipe(plumber())
		.pipe(less())
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

	var copyHtml = gulp.src("app/*.html")
		.pipe(gulp.dest("dist"));

	var copyCss = gulp.src("app/css/style.min.css")
		.pipe(gulp.dest("dist/css"));

	var copyFonts = gulp.src("app/fonts/**/*")
		.pipe(gulp.dest("dist/fonts"));

	var copyJs = gulp.src("app/js/**/*")
		.pipe(gulp.dest("dist/js"));

});

gulp.task("build", function(fn) {

	run("clean", "style", "img", "copy", fn);

});

gulp.task("watch", ['serve', 'style'], function() {
	gulp.watch("app/less/**/*.less", ['style']);
	gulp.watch('app/*.html', server.reload);
	gulp.watch('app/js/**/*.js', server.reload);
});

gulp.task("default", ["watch"]);
