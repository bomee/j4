module.exports = function(grunt) {

  // Project configuration. 
grunt.initConfig({
  uglify: {
    options:{
        ASCIIOnly:true,
        compress:true,
        screwIE8: false /*是否兼容ie6-8*/
    },
    js_min: {
      files: [{
        expand: false,       // Enable dynamic expansion.
        cwd: '',        // Src matches are relative to this path.
        src: ['**.js', '!**.min.js'],   // Actual pattern(s) to match.
        //dest: 'all.min.js',      // Destination path prefix.
        ext: '.min.js',    // Dest filepaths will have this extension.
        extDot: 'first'     // Extensions in filenames begin after the first dot
      }]
    }
  }
});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};