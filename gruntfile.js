module.exports = function(grunt) {
    //load grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            windows:  ['dist/windows32/resources/app/', 'dist/windows64/resources/app/'],
            linux:    ['dist/linux/resources/app/'],
            mac:      ['dist/mac/Electron.app/Contents/Resources/app/'],
            prebuilt: ['dist/windows32/', 'dist/windows64/', 'dist/linux/']
        },
        wiredep: {
            task: {
                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: ['app/index.html'],
                exclude: ['bower_components/jquery/dist/jquery.js']
            }
        },
        svgstore: {
            options: {
                svg: {
                    viewBox: '0 0 100 100',
                    xmlns: 'http://www.w3.org/2000/svg'
                },
                includedemo: false,
                formatting: {
                    indent_size: 2
                },
                cleanup: true
            },
            all: {
                files: [{
                    src: 'app/images/icons/{,*/}*.svg',
                    dest: 'app/images/sprite.svg'
                }]
            }
        },
        sass: {
            options: {
                sourceMap: false
            },
            all: {
                files: {
                    'app/styles/main.css': 'app/styles/main.scss'
                }
            }
        },
        copy: {
            windows: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['app/**', 'bower_components/**', 'node_modules/jquery/**', 'LICENSE', 'main.js', 'package.json', '!app/res/web2board/linux/**', '!app/res/web2board/darwin/**'],
                    dest: 'dist/windows32/resources/app/'
                },{
                    expand: true,
                    cwd: '',
                    src: ['app/**', 'bower_components/**', 'node_modules/jquery/**', 'LICENSE', 'main.js', 'package.json', '!app/res/web2board/linux/**', '!app/res/web2board/darwin/**'],
                    dest: 'dist/windows64/resources/app/'
                }]
            },
            linux: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['app/**', 'bower_components/**', 'node_modules/jquery/**', 'LICENSE', 'main.js', 'package.json', '!app/res/web2board/win32/**', '!app/res/web2board/darwin/**'],
                    dest: 'dist/linux/resources/app/'
                }]
            },
            mac: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['app/**', 'bower_components/**', 'node_modules/jquery/**', 'LICENSE', 'main.js', 'package.json', '!app/res/web2board/win32/**', '!app/res/web2board/linux/**'],
                    dest: 'dist/mac/Electron.app/Contents/Resources/app/'
                }]
            },
            prebuilt: {
                files: [{
                    expand: true,
                    cwd: 'res/windows64-prebuilt',
                    src: ['**'],
                    dest: 'dist/windows64/'
                }, {
                  expand: true,
                  cwd: 'res/windows32-prebuilt',
                  src: ['**'],
                  dest: 'dist/windows32/'
                }, {
                  expand: true,
                  cwd: 'res/linux-prebuilt',
                  src: ['**'],
                  dest: 'dist/linux/'
                }]
            }
        },
        exec: {
            electron: 'electron .',
            stop_electron: 'killall electron || killall Electron || true'
        },
        watch: {
            sass: {
                files: ['app/styles/{,**/}*.{scss}', '!app/styles/main.css'],
                tasks: ['sass', 'svgstore']
            },
            scripts: {
                files: ['app/**/*.*', 'bower.json', '!app/styles/main.css'],
                tasks: ['exec:stop_electron', 'sass', 'exec:electron'],
                options: {
                    atBegin: true,
                    interrupt: true
                }
            }
        },
        shell: {
            options: {
                stderr: false
            },
            linux: {
                command: 'chmod -R 755 dist/linux'
            },
            windows32: {
                command: 'chmod -R 755 dist/windows32'
            },
            windows64: {
                command: 'chmod -R 755 dist/windows64'
            }
        }
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
          'sass',
          'svgstore',
          'clean:prebuilt',
          'copy:prebuilt',
          'buildLinux',
          'buildWindows',
          'buildMac'
        ]);
    });

    grunt.registerTask('buildLinux', function() {
        grunt.task.run([
          'clean:linux',
          'copy:linux',
          'shell:linux'
        ]);
    });

    grunt.registerTask('buildWindows', function() {
        grunt.task.run([
            'clean:windows',
            'copy:windows',
            'shell:windows32',
            'shell:windows64'
        ]);
    });

    grunt.registerTask('buildMac', function() {
        grunt.task.run([
            //'clean:mac',
            'copy:mac'
        ]);
    });

};
