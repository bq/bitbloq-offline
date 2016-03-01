module.exports = function(grunt) {
  //load grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.loadTasks('tasks');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
          src: ['app/**', 'bower_components/**', 'node_modules/jquery/**', 'LICENSE', 'main.js', 'package.json', 'bower.json', '!app/res/web2board/linux/**', '!app/res/web2board/darwin/**'],
          dest: 'dist/windows32/resources/app/'
        }]
      },
      linux: {
        files: [{
          expand: true,
          cwd: '',
          src: ['app/**', 'bower_components/**', 'node_modules/jquery/**', 'LICENSE', 'main.js', 'package.json', 'bower.json', '!app/res/web2board/win32/**', '!app/res/web2board/darwin/**'],
          dest: 'dist/linux/resources/app/'
        }]
      },
      mac: {
        files: [{
          expand: true,
          cwd: '',
          src: ['app/**', 'bower_components/**', 'node_modules/jquery/**', 'LICENSE', 'main.js', 'package.json', 'bower.json', '!app/res/web2board/win32/**', '!app/res/web2board/linux/**'],
          dest: 'dist/mac/Electron.app/Contents/Resources/app/'
        }]
      },
      prebuiltWindows: {
        files: [{
          expand: true,
          cwd: 'res/windows32-prebuilt',
          src: ['**'],
          dest: 'dist/windows32/'
        }]
      },
      prebuiltLinux: {
        files: [{
          expand: true,
          cwd: 'res/linux-prebuilt',
          src: ['**'],
          dest: 'dist/linux/'
        }]
      }
    },
    clean: {
      windows: ['dist/windows32/resources/app/', 'dist/windows64/resources/app/'],
      linux: ['dist/linux/resources/app/'],
      mac: ['dist/mac/Electron.app/Contents/Resources/app/'],
      prebuilt: ['dist/windows32/', 'dist/windows64/', 'dist/linux/'],
      i18n: 'i18n/*'
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
      target: {
        command: 'chmod -R 755 dist/'
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', function() {
    grunt.task.run([
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

  // Default task(s).
  grunt.registerTask('dist', function(os) {
    switch (os) {
      case 'windows':
        grunt.task.run([
          'sass',
          'svgstore',
          'clean',
          'copy:prebuiltWindows',
          'copy:windows'
        ]);
        break;
      case 'mac':
        grunt.task.run([
          'sass',
          'svgstore',
          'clean',
          'copy:mac',
          'shell'
        ]);
        break;
      case 'linux':
        grunt.task.run([
          'sass',
          'svgstore',
          'clean',
          'copy:prebuiltLinux',
          'copy:linux',
          'shell'
        ]);
        break;
      default:
        grunt.task.run([
          'sass',
          'svgstore',
          'clean',
          'copy:prebuiltLinux',
          'copy:prebuiltWindows',
          'copy:linux',
          'shell'
        ]);
    }
  });
};
