module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: [
            '*.js','!config.js','!Gruntfile.js'
        ],
        tasks: ['jshint']
      }
    },
   jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['*.js','!Gruntfile.js','!config.js']
    }
  });

  // Load the Grunt plugins.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Register the default tasks.
  grunt.registerTask('default', ['jshint', 'watch']);
};
