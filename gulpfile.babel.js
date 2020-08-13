import gulp 				from 'gulp';
import sourcemaps 	from 'gulp-sourcemaps';
import plumber			from 'gulp-plumber';
import notify 			from "gulp-notify";
import rename 			from "gulp-rename";
import browsersync 	from "browser-sync";
import htmlbeautify  from 'gulp-html-beautify';

let errorType;

// Add another root path if necessary
const root 		= "./assets";

const watchfile = {
	php : root + '/**/*.php',
	html: root + '/**/*.html'
}

const notifyError = (err, type) => {
	if (type !== 'JS') {
		errorType = err.formatted } else {
		err = 'Check your console';
		errorType = err;
	}
	return notify({
		title		: `Error to compile ${type} task`,
		message	: errorType, sound: true,
	}).write(err);
};

/**
 * Compile sass to css and store the stylesheet.
 * Stacked sass task should be run with:
 * - Watch sass error, before compiling and store the output.
 * - Watch error with plumber prevent breaking gulp task.
 * - Init sourcemaps but don't write it yet.
 * - Compile by default, prefixing with autoprefixer.
 * - Rename compiled css file has prefix in it.
 * - Pretty css output, store to the dest path.
 * - Minify css output after pretty output has been stored.
 * - Watch everything in sass path, watch sass file change.
 */
import sass from 'gulp-sass';
import compile from 'node-sass';
import merge from 'merge-stream';
import darts from 'gulp-dart-sass';
import cleanCSS from 'gulp-clean-css';

sass.compiler = compile;

/**
 * Return compiled css for documentation
 */

const sassPath = {
	src: root + '/scss/**/*.scss',
	dist: root + '/css/',
}

function CreateStylesheet(properties) {
	this.props = properties || {};
	let stylesheetOutput;


	let initializeSass = () => darts.sync().on('error', 
		err => { return notifyError(err, 'SASS'); }
	);

	let sassOutputStyle = () => darts({ 
		outputStyle: 'expanded',
		sourceComments: false,
	});

	let sassFileRename = () => rename({
		basename: this.props.name,
		extname: '.css',
	});

	let sassGenerateOutput = () => {
		if ( this.props.mode == 'development' ) {
			stylesheetOutput = plumber(); } else {
			stylesheetOutput = cleanCSS();
		}
		return stylesheetOutput;
	}

	return gulp.src(this.props.src)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(initializeSass())
		.pipe(sassOutputStyle())
		.pipe(sassGenerateOutput())
		.pipe(sassFileRename())
		.pipe(sourcemaps.write('.'))
		.pipe(browsersync.stream())
		.pipe(gulp.dest(this.props.dist));
}

gulp.task('sass', function() {
	
	return new CreateStylesheet({
		src: sassPath.src,
		dist: sassPath.dist,
		mode: 'development',
		name: "built"
	});
});

import babelify from 'babelify';
import bundling from 'gulp-bro';
import rollup from 'gulp-better-rollup';
import rollupbabel from 'rollup-plugin-babel';
import prettier from 'gulp-prettier';
import minify from 'gulp-minify';
import concat from 'gulp-concat';

const jsPath = {
	main  : root + '/js/src/main.js',
	src   : root + '/js/src/**/*.js',
	lib   : root + '/js/concat',
	dist  : root + '/js/dist',
}

function CreateJavascript(properties) {
	this.props = properties || {};
	let isMinified, headerMessage;

	const babelConfig = babelify.configure({});

	const jsFormat = () => {
		headerMessage = {
			message: '/*! Local Script */\n',
			open: `(function() { \n\n'use strict'`,
			close: `})();`
		}
		
		return headerMessage;
	}

	const rollupConfig = {
		input: this.props.main,
		plugins: [ rollupbabel({
			exclude: 'node_modules/**',
			runtimeHelpers: true
		})]
	}
	
	const rollupFormat = {
		format: 'es',
		intro: jsFormat().open, 
		outro: jsFormat().close
	}
	
	const prettify = {
		singleQuotes: false,
		bracketSpacing: true,
		endOfLine: "lf",
	}
	
	const javascriptOutput = () => {
		if ( this.props.mode == 'development' ) {
			isMinified = plumber(); 
		} else {
			isMinified = minify({ 
				preserveComments: 'some',
				ext: { min: '.min.js' }
			})
		}
		
		return isMinified;
	}

	const renameJsFile = () => rename({ 
		basename: this.props.name 
	});

	return gulp.src(this.props.main)
		.pipe(bundling({transform: [babelConfig]}, err => {
			return notifyError(err, 'JS');
		}))
		.pipe(rollup(rollupConfig, rollupFormat))
		.pipe(prettier(prettify))
		.pipe(sourcemaps.init())
		.pipe(renameJsFile())
		.pipe(javascriptOutput())
		.pipe(sourcemaps.write( './' ))
		.pipe(browsersync.stream())
		.pipe(gulp.dest(this.props.dist));
}

gulp.task('js', function() {
	return new CreateJavascript({
		main: jsPath.main,
		dist: jsPath.dist,
		mode: "development",
		name: "built"
	});
});

gulp.task('concat', () => {
	return gulp.src(jsPath.lib + "/**/*.js")
	.pipe(concat('polyfill.min.js', {newLine: ';\n'}))
	.pipe(gulp.dest(jsPath.dist))
});

const htmlpath = {
	pageSrc: root + '/html/src/*.html',
	pageDist: root + '/html/src/',
	rootSrc: root + '/html/src/*.html',
	rootDist: '.',
}

gulp.task('indexHTML', () => {
	return gulp.src(htmlpath.rootSrc)
	.pipe(htmlbeautify({indentSize: 1}))
	.pipe(gulp.dest(htmlpath.rootDist));
});

gulp.task('pageHTML', () => {
	return gulp.src(htmlpath.pageSrc)
	.pipe(htmlbeautify({indentSize: 1}))
	.pipe(gulp.dest(htmlpath.pageDist));
});

gulp.task('reload', function() {
	browsersync.init({ 
		server: { baseDir: "./" },
	});
	gulp.watch(sassPath.src, gulp.series('sass'));
	gulp.watch(jsPath.src, gulp.series('js'));
	gulp.watch(htmlpath.rootSrc, gulp.series('indexHTML'));
	// gulp.watch(htmlpath.pageSrc, gulp.series('pageHTML'));
	gulp.watch(watchfile.html).on('change', browsersync.reload);
});

gulp.task('default', gulp.parallel(
	'sass', 'js', 'indexHTML', 'reload'
) );