// Creation Date: 2015.03.11
// Author: Fernando L. Canizo - http://flc.muriandre.com/

"use strict";


module.exports = function (grunt) {
	// load plpugins
	['grunt-cafe-mocha', 'grunt-contrib-jshint', 'grunt-exec']
	.forEach(function (task) {
		grunt.loadNpmTasks(task);
	});

	// configure plugins
	grunt.initConfig({
		cafemocha: {
			all: {
				src: 'qa/*.js', options: { ui: 'tdd' }
			}
		},

		jshint: {
			options: {
				jshintrc: '/home/conan/.jshintrc'
			},
			app: ['index.js', 'public/js/**/*.js', 'lib/**/*.js']
			// exclude qa: jshint doesn't recognize mocha globals
//			qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
		},

		exec: {
			linkchecker: {
				cmd: 'linkchecker http://localhost:60242'
			}
		}
	});

	// register tasks
//	grunt.registerTask('default', ['cafemocha', 'jshint', 'exec']); // TODO activate when I solve issue with mocha
	grunt.registerTask('default', ['jshint', 'exec']);
};
