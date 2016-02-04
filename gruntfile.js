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
      dev: {
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
      stop_electron: 'killall electron || true'
    },
    watch: {
      sass: {
        files: ['app/styles/{,**/}*.{scss}', '!app/styles/main.css'],
        tasks: ['sass']
      },
      scripts: {
        files: ['app/**/*.*', 'bower.json', '!app/styles/main.css'],
        tasks: ['exec:stop_electron', 'sass', 'exec:electron'],
        options: {
          atBegin: true,
          interrupt: true
        }
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
      //'clean:dist',
      'clean:electron',
      'wiredep',
      'sass',
      'svgstore',
      //'copy:electron',
      'copy:dist'
    ]);
  });

};