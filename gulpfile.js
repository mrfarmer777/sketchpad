var gulp = require('gulp'),
    watch = require('gulp-watch'),
    jsdoc = require('gulp-jsdoc3'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    fileInsert = require('gulp-file-insert'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    clean = require('gulp-clean'),
    packageJson = require('./package.json');

gulp.task("clean", function () {
    "use strict";
    gulp.src([
        "dist",
        "demos/dist",
        "docs"
    ], {read: false})
        .pipe(clean());
});


gulp.task("doc-client", function (cb) {
    "use strict";
    var config = require('./jsdoc-client.json');
    gulp.src(["package.json", "README.md", "client/*.js"], {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task("doc-server", function (cb) {
    "use strict";
    var config = require('./jsdoc-server.json');
    gulp.src(["package.json", "README.md", "server/*.js"], {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task("sketchpad-vanilla", function () {
    "use strict";
    return gulp.src([
        "client/colorpalette.js",
        "client/events.js",
        "client/eventsmanager.js",
        "client/fontpalette.js",
        "client/formpalette.js",
        "client/imagehost.js",
        "client/keyshortcuts.js",
        "client/misc.js",
        "client/NSSketchpad-agpl.js",
        "client/pixelpicker.js",
        "client/polyfill.js",
        "client/progressbar.js",
        "client/resources.js",
        "client/sketchpad.input.js",
        "client/sketchpad.js",
        "client/sketchpad.room.js",
        "client/sketchpad.sketch.js",
        "client/sketchpad.tool.js",
        "client/sketchpad.tool.*.js",
        "client/thickness.js",
    ])
        .pipe(concat("sketchpad.js"))
        .pipe(gulp.dest("dist/"))
        .pipe(gulp.dest("demos/dist/"))
        .pipe(uglify())
        .pipe(header("/*sketchpad.pro - free online drawing*/"))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("dist/"))
        .pipe(gulp.dest("demos/dist/"));
});

gulp.task("sketchpad-jquery", ["sketchpad-vanilla"], function () {
    "use strict";

    return gulp.src(["client/jquery.sketchpad-template.js"])
        .pipe(fileInsert({
            "/* file: sketchpad.js */": "dist/sketchpad.js"
        }))
        .pipe(rename({
            basename: "jquery.sketchpad"
        }))
        .pipe(uglify())
        .pipe(header("/*sketchpad.pro - free online drawing*/"))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("dist/"))
        .pipe(gulp.dest("demos/dist/"));
});

// define tasks here
gulp.task("default", function () {
    "use strict";
    console.log("Building", packageJson.name, packageJson.version);
    gulp.start("doc-client", "doc-server", "sketchpad-vanilla", "sketchpad-jquery");
});


gulp.task("watch", function () {
    "use strict";
    watch(["README.md", "*.js", "*.json", "client/*.js", "server/*.js"], function () {
        gulp.start("default");
    });
});

