const packages = {
    gulp: { src, dest, series, watch } = require('gulp'),
    scss: require('gulp-sass')(require('sass')),
    autoPrefix: require('gulp-autoprefixer'),
    min: {
        css: require('gulp-clean-css'),
        js: require('gulp-terser')
    }
};
const config = {
    path: {
        styles: {
            src: './frontend/src/styles/**/*.scss',
            dest: './frontend/dist/styles/'
        },
        scripts: {
            src: './frontend/src/scripts/**/*.js',
            dest: './frontend/dist/scripts/'
        }
    },
    tasks: {
        styles: () => {
            return packages.gulp.src(config.path.styles.src)
                .pipe(packages.scss())
                .pipe(packages.autoPrefix('last 2 versions'))
                .pipe(packages.min.css())
                .pipe(packages.gulp.dest(config.path.styles.dest));
        },
        scripts: () => {
            return packages.gulp.src(config.path.scripts.src)
                .pipe(packages.min.js())
                .pipe(packages.gulp.dest(config.path.scripts.dest));
        },
        watch: () => {
            packages.gulp.watch(
                [config.path.styles.src, config.path.scripts.src],
                packages.gulp.series(config.tasks.styles, config.tasks.scripts)
            );
        }
    }
}

exports.default = packages.gulp.series(
    config.tasks.styles,
    config.tasks.scripts,
    config.tasks.watch
);