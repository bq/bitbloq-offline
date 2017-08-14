module.exports = function(grunt) {
    //load grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.loadTasks('tasks');

    function getCopySrc(os) {
        var array = ['app/**',
            'bower_components/**',
            'node_modules/jquery/**',
            'node_modules/Q/**',
            'node_modules/angular/**',
            'node_modules/universal-analytics/**',
            'node_modules/ws/**',
            'node_modules/ultron/**',
            'node_modules/options/**',
            'LICENSE',
            'main.js',
            'package.json',
            'bower.json',
            '!app/res/web2board/{osValue}/**/info.log',
            '!app/res/web2board/{osValue}/**/info.log.*',
            '!app/res/web2board/{osValue}/**/config.json',
            '!app/res/web2board/{osValue}/**/web2boardLauncher.log',
            '!app/res/web2board/{osValue}/**/platformioWS*/**',
            '!app/res/web2board/web2board-config.json'
        ];
        array = array.map(function(src) {
            return src.replace("{osValue}", os);
        });

        return array;
    }

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    'app/**/*.js'
                ]
            }
        },
        wiredep: {
            task: {
                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: ['app/index.html'],
                exclude: ['bower_components/jquery/dist/jquery.js', 'bower_components/angular/angular.js']
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
                    src: getCopySrc("win32").concat(['!app/res/web2board/linux/**', '!app/res/web2board/darwin/**', '!app/res/web2board/linux32/**']),
                    dest: 'dist/BitbloqOffline-windows/data/resources/app/'
                }]
            },
            linux: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: getCopySrc("linux").concat(['!app/res/web2board/win32/**', '!app/res/web2board/darwin/**', '!app/res/web2board/linux32/**']),
                    dest: 'dist/BitbloqOffline-linux/resources/app/'
                }]
            },
            linux32: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: getCopySrc("linux32").concat(['!app/res/web2board/win32/**', '!app/res/web2board/darwin/**', '!app/res/web2board/linux/**']),
                    dest: 'dist/BitbloqOffline-linux32/resources/app/'
                }]
            },
            linuxArm: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: getCopySrc("linuxArm").concat(['!app/res/web2board/win32/**', '!app/res/web2board/darwin/**', '!app/res/web2board/linux/**']),
                    dest: 'dist/BitbloqOffline-linuxArm/resources/app/'
                }]
            },
            mac: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: getCopySrc("darwin").concat(['!app/res/web2board/linux/**', '!app/res/web2board/win32/**', '!app/res/web2board/linux32/**']),
                    dest: 'dist/BitbloqOffline-mac/Bitbloq.app/Contents/Resources/app/'
                }]
            },
            prebuiltWindows: {
                files: [{
                    expand: true,
                    cwd: 'res/windows32-prebuilt',
                    src: ['**'],
                    dest: 'dist/BitbloqOffline-windows/'
                }]
            },
            prebuiltLinux: {
                files: [{
                    expand: true,
                    cwd: 'res/linux-prebuilt',
                    src: ['**'],
                    dest: 'dist/BitbloqOffline-linux/'
                }]
            },
            prebuiltLinux32: {
                files: [{
                    expand: true,
                    cwd: 'res/linux32-prebuilt',
                    src: ['**'],
                    dest: 'dist/BitbloqOffline-linux32/'
                }]
            },
            prebuiltLinuxArm: {
                files: [{
                    expand: true,
                    cwd: 'res/linuxArm-prebuilt',
                    src: ['**'],
                    dest: 'dist/BitbloqOffline-linuxArm/'
                }]
            },
            prebuiltMac: {
                files: [{
                    expand: true,
                    cwd: 'res/mac-prebuilt',
                    src: ['**'],
                    dest: 'dist/BitbloqOffline-mac/'
                }]
            }
        },
        clean: {
            windows: ['dist/BitbloqOffline-windows/'],
            linux: ['dist/BitbloqOffline-linux/'],
            linux32: ['dist/BitbloqOffline-linux32/'],
            linuxArm: ['dist/BitbloqOffline-linuxArm/'],
            mac: ['dist/BitbloqOffline-mac/'],
            i18n: 'i18n/*'
        },
        exec: {
            electron: 'electron .',
            stop_electron: 'killall electron || killall Electron || true',
            mac_copy_python: 'cp -rp app/res/web2board/darwin/Web2Board.app/Contents/MacOS/python \'dist/BitbloqOffline-mac/Bitbloq.app/Contents/Resources/app/app/res/web2board/darwin/Web2Board.app/Contents/MacOS/python\'',
            mac_python_symbolic_link: 'ln -sf /usr/bin/python \'dist/BitbloqOffline-mac/Bitbloq.app/Contents/Resources/app/app/res/web2board/darwin/Web2Board.app/Contents/MacOS/python\''
        },
        watch: {
            sass: {
                files: ['app/styles/{,**/}*.{scss}', '!app/styles/main.css'],
                tasks: ['sass', 'svgstore']
            },
            scripts: {
                files: ['app/**/*.*', 'bower.json', '!app/styles/main.css', '!app/res/config.json', '!app/res/web2board/**/*.*'],
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
            target: {
                command: 'chmod -R 755 dist/'
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', function() {
        grunt.task.run([
            'jshint:all',
            'dist'
        ]);
    });

    grunt.registerTask('i18n', 'get all file of i18n', function() {
        grunt.task.run([
            'clean:i18n',
            'getpoeditorfiles:38967',
            'poeditor2bitbloq'
        ]);
    });

    grunt.registerTask('dist', function() {
        grunt.task.run([
            'build:windows',
            'build:mac',
            'build:linux',
            'build:linux32',
            'build:linuxArm'
        ]);
    });
    // Default task(s).
    grunt.registerTask('build', function(os) {
        switch (os) {
            case 'windows':
                grunt.task.run([
                    'sass',
                    'svgstore',
                    'clean:windows',
                    'copy:prebuiltWindows',
                    'copy:windows'
                ]);
                break;
            case 'mac':
                grunt.task.run([
                    'sass',
                    'svgstore',
                    'clean:mac',
                    'copy:prebuiltMac',
                    'copy:mac',
                    'exec:mac_python_symbolic_link',
                    'shell'
                ]);
                break;
            case 'linux':
                grunt.task.run([
                    'sass',
                    'svgstore',
                    'clean:linux',
                    'copy:prebuiltLinux',
                    'copy:linux',
                    'shell'
                ]);
                break;
            case 'linux32':
                grunt.task.run([
                    'sass',
                    'svgstore',
                    'clean:linux32',
                    'copy:prebuiltLinux32',
                    'copy:linux32',
                    'shell'
                ]);
                break;
            case 'linuxArm':
                grunt.task.run([
                    'sass',
                    'svgstore',
                    'clean:linuxArm',
                    'copy:prebuiltLinuxArm',
                    'copy:linuxArm',
                    'shell'
                ]);
                break;
            default:
                grunt.log.error('No OS selected, usage: grunt build:[mac|linux|windows]');
        }
    });
};