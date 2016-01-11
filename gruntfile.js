module.exports = function(grunt) {
    //load grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: ['dist/Electron.app/Contents/Resources/app']
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
            dist: {
                expand: true,
                cwd: '/',
                src: ['**', '!dist', '.git'],
                dest: 'dist/Electron.app/Contents/Resources/app/',
                flatten: true
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', function() {
        console.log('hi');
    });

    // Default task(s).
    grunt.registerTask('dist', function() {
        grunt.task.run([
            'clean:dist',
            'wiredep',
            'sass',
            'copy:dist'
        ]);
    });

};