/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
      
    // Task configuration.
	imageEmbed: {
		dist: {
			src: [ "src/duckhunt.css" ],
			dest: "src/duckhunt.encoded.css",
			options: {
				deleteAfterEncoding : false
			}
		}
	},
	cssmin: {
		options: {
		//	banner: '<%= banner %>'
		},
		build: {
			src: 'src/duckhunt.encoded.css',
			dest: '../duckhunt.min.css'
		}
	},	    
    uglify: {
		options: {
		//	banner: '<%= banner %>'
		},
		build: {
			src:'src/duckhunt.js',
			dest: '../duckhunt.min.js'
		}
	} 
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-image-embed');
  grunt.loadNpmTasks('grunt-contrib-cssmin');  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // Default task.
  grunt.registerTask('default', ['imageEmbed','cssmin', 'uglify']);

};
