import gulp from "gulp";
import cleanCSS from "gulp-clean-css";
import gulpif from "gulp-if";
import less from "gulp-less";
import livereload from "gulp-livereload";
import gulpSassImport from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import gutil from "gulp-util";
import dartSass from "sass";
import args from "./lib/args";

const sass = gulpSassImport(dartSass);

gulp.task("styles:css", () =>
	gulp
		.src("app/styles/*.css")
		.pipe(gulpif(args.sourcemaps, sourcemaps.init()))
		.pipe(gulpif(args.production, cleanCSS()))
		.pipe(gulpif(args.sourcemaps, sourcemaps.write()))
		.pipe(gulp.dest(`dist/${args.vendor}/styles`))
		.pipe(gulpif(args.watch, livereload())),
);

gulp.task("styles:less", () =>
	gulp
		.src("app/styles/*.less")
		.pipe(gulpif(args.sourcemaps, sourcemaps.init()))
		.pipe(
			less({ paths: ["./app"] }).on("error", function (error) {
				gutil.log(
					gutil.colors.red(`Error (${error.plugin}): ${error.message}`),
				);
				this.emit("end");
			}),
		)
		.pipe(gulpif(args.production, cleanCSS()))
		.pipe(gulpif(args.sourcemaps, sourcemaps.write()))
		.pipe(gulp.dest(`dist/${args.vendor}/styles`))
		.pipe(gulpif(args.watch, livereload())),
);

gulp.task("styles:sass", () =>
	gulp
		.src("app/styles/*.scss")
		.pipe(gulpif(args.sourcemaps, sourcemaps.init()))
		.pipe(
			sass({
				includePaths: ["./app"],
				outputStyle: args.production ? "compressed" : "expanded",
			}).on("error", function (error) {
				gutil.log(
					gutil.colors.red(`Error (${error.plugin}): ${error.message}`),
				);
				this.emit("end");
			}),
		)
		.pipe(gulpif(args.production, cleanCSS()))
		.pipe(gulpif(args.sourcemaps, sourcemaps.write()))
		.pipe(gulp.dest(`dist/${args.vendor}/styles`))
		.pipe(gulpif(args.watch, livereload())),
);

gulp.task(
	"styles",
	gulp.series(gulp.parallel("styles:css", "styles:less", "styles:sass")),
);
