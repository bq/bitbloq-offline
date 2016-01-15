module.exports = function(grunt) {
    //load grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: ['dist'],
            electron: ['dist/Electron.app/Contents/Resources/app/']
        },
        wiredep: {
            task: {
                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: ['app/index.html'],
                exclude: ['bower_components/jquery/dist/jquery.js']
            }
        },
        sass: {
            options: {
                sourceMap: false
            },
            dist: {
                files: {
                    'app/styles/main.css': 'app/styles/main.scss'
                }
            }
        },
        copy: {
            electron: {
                expand: true,
                cwd: 'node_modules/electron-prebuilt/dist/',
                src: ['**'],
                dest: 'dist/'

            },
            dist: {
                expand: true,
                cwd: '',
                src: ['app/**', 'bower_components/**', 'node_modules/jquery/**', 'LICENSE', 'main.js', 'package.json'],
                dest: 'dist/Electron.app/Contents/Resources/app/'
            }
        },
        exec: {
            electron: 'electron .',
            stop_electron: 'ps aux | grep \'[E]lectron \.\' | awk \'{print $2}\' | xargs kill || true'
        },
        watch: {
            scripts: {
                files: ['app/**/*.*', 'bower.json'],
                //twice "stop_electron" or not close :( 
                tasks: ['exec:stop_electron', 'exec:stop_electron', 'exec:electron'],
                options: {
                    atBegin: true,
                    interrupt: true
                }
            },
        },
    });

    // Default task(s).
    grunt.registerTask('default', function() {
        grunt.task.run([
            'dist'
        ]);
    });

    // Default task(s).
    grunt.registerTask('dist', function() {
        grunt.task.run([
            //'clean:dist',
            'clean:electron',
            'wiredep',
            'sass',
            //'copy:electron',
            'copy:dist'
        ]);
    });

};