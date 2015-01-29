'use strict';

module.exports = function (grunt) {

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Load grunt tasks automatically
	require('jit-grunt')(grunt, {
		useminPrepare: 'grunt-usemin',
		validation: 'grunt-html-validation',
		scsslint: 'grunt-scss-lint'
	});

	// Configurable paths
	var config = {
		app: 'app',
		dist: 'dist',
		tmp: '.tmp'
	};

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		config: config,

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['wiredep']
			},
			js: {
				files: ['<%= config.app %>/js/{,*/}*.js'],
				tasks: ['jshint'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			jstest: {
				files: ['test/spec/{,*/}*.js'],
				tasks: ['test:watch']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			sass: {
				files: ['<%= config.app %>/css/**/*.{scss,sass}'],
				tasks: ['sass:server', 'autoprefixer']
			},
			styles: {
				files: ['<%= config.app %>/css/{,*/}*.css'],
				tasks: ['newer:copy:styles', 'autoprefixer']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= config.app %>/{,*/}*.html',
					'<%= config.tmp %>/css/{,*/}*.css',
					'<%= config.app %>/images/{,*/}*'
				]
			},
			jade: {
				files: '<%= config.app %>/jade/**/*.jade',
				tasks: ['jade', 'jsbeautifier', 'validation'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				open: true,
				livereload: 35729,
				// Change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost'
			},
			livereload: {
				options: {
					middleware: function(connect) {
						return [
							connect.static('.tmp'),
							connect().use('/bower_components', connect.static('./bower_components')),
							connect.static(config.app)
						];
					}
				}
			},
			test: {
				options: {
					open: false,
					port: 9001,
					middleware: function(connect) {
						return [
							connect.static('.tmp'),
							connect.static('test'),
							connect().use('/bower_components', connect.static('./bower_components')),
							connect.static(config.app)
						];
					}
				}
			},
			dist: {
				options: {
					base: '<%= config.dist %>',
					livereload: false
				}
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= config.dist %>/*',
						'!<%= config.dist %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= config.app %>/js/{,*/}*.js',
				'!<%= config.app %>/js/vendor/*',
				'test/spec/{,*/}*.js'
			]
		},

		// Mocha testing framework configuration options
		mocha: {
			all: {
				options: {
					run: true,
					urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
				}
			}
		},

		// Compiles Sass to CSS and generates necessary files if requested
		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/css',
					src: ['*.{scss,sass}'],
					dest: '<%= config.tmp %>/css',
					ext: '.css'
				}]
			},
			server: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/css',
					src: ['*.{scss,sass}'],
					dest: '<%= config.tmp %>/css',
					ext: '.css'
				}]
			}
		},

		// Compile Jade files
		jade: {
			html: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/jade',
					src: ['**/*.jade', '!**/_*'],
					dest: '<%= config.tmp %>/',
					ext: '.html'
				}],
				options: {
					client: false,
					pretty: true,
					basedir: '<%= config.app %>/jade',
					data: function(dest, src) {

						var page = src[0].replace(/app\/jade\/(.*)\/index.jade/, '$1');

						if (page === src[0]) {
							page = 'index';
						}

						return {
							page: page
						};
					}
				}
			}
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				map: true,
				browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 9', 'Safari 6']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.tmp %>/css/',
					src: '{,*/}*.css',
					dest: '<%= config.tmp %>/css/'
				}]
			}
		},

		// Automatically inject Bower components into the HTML file
		wiredep: {
			app: {
				ignorePath: '../../../../',
				src: [
					'<%= config.app %>/jade/**/*.jade'
				],
				exclude: [
					// 'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
					'modernizr'
				]
			}
		},

		// Renames files for browser caching purposes
		rev: {
			dist: {
				files: {
					src: [
						'<%= config.dist %>/js/{,*/}*.js',
						'<%= config.dist %>/css/{,*/}*.css',
						// '<%= config.dist %>/images/{,*/}*.*',
						// '<%= config.dist %>/css/fonts/{,*/}*.*',
						// '<%= config.dist %>/*.{ico,png}'
					]
				}
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			options: {
				dest: '<%= config.dist %>'
			},
			html: [
				'<%= config.tmp %>/*.html'
		  	]
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			options: {
				assetsDirs: [
					'<%= config.dist %>',
					'<%= config.dist %>/images',
					'<%= config.dist %>/css'
				]
			},
			html: ['<%= config.dist %>/{,*/}*.html'],
			css: ['<%= config.dist %>/css/{,*/}*.css']
		},

		// The following *-min tasks produce minified files in the dist folder
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/images',
					src: '{,*/}*.{gif,jpeg,jpg,png}',
					dest: '<%= config.dist %>/images'
				}]
			}
		},

		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/images',
					src: '{,*/}*.svg',
					dest: '<%= config.dist %>/images'
				}]
			}
		},

		htmlmin: {
			dist: {
				options: {
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeEmptyAttributes: true
				},
				files: [{
					expand: true,
					cwd: '<%= config.dist %>',
					src: '{,*/}*.html',
					dest: '<%= config.dist %>'
				}]
			},
			nocms: {
				options: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					conservativeCollapse: true,
					removeCommentsFromCDATA: true,
					removeComments: true,
					removeEmptyAttributes: true
				},
				files: [{
					expand: true,
					cwd: '<%= config.dist %>',
					src: '{,*/}*.html',
					dest: '<%= config.dist %>'
				}]
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= config.app %>',
					dest: '<%= config.dist %>',
					src: [
						'*.{ico,png,txt}',
						'images/{,*/}*.webp',
						'images/videos/{,*/}*.*',
						'**/*.html',
						'css/fonts/{,*/}*.*'
					]
				}, {
					src: 'node_modules/apache-server-configs/dist/.htaccess',
					dest: '<%= config.dist %>/.htaccess'
				}, {
					expand: true,
					dot: true,
					cwd: '.',
					src: [
						// 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
						'bower_components/font-awesome/fonts/*.*'
					],
					dest: '<%= config.dist %>'
				}, {
					expand: true,
					dot: true,
					cwd: '<%= config.tmp %>/',
					src: [
						'**/*.html'
					],
					dest: '<%= config.dist %>'
				}]
			},
			styles: {
				expand: true,
				dot: true,
				cwd: '<%= config.app %>/css',
				dest: '<%= config.tmp %>/css/',
				src: '{,*/}*.css'
			}
		},

		// Generates a custom Modernizr build that includes only the tests you
		// reference in your app
		modernizr: {
		  dist: {
			devFile: 'bower_components/modernizr/modernizr.js',
			outputFile: '<%= config.dist %>/js/vendor/modernizr.js',
			files: {
				src: [
					'<%= config.dist %>/js/{,*/}*.js',
					'<%= config.dist %>/css/{,*/}*.css',
					'!<%= config.dist %>/js/vendor/*'
				]
			},
			'extra' : {
                'shiv' : true,
                'printshiv' : false,
                'load' : true,
                'mq' : true,
                'cssclasses' : true
            },
            'extensibility' : {
                'addtest' : false,
                'prefixed' : false,
                'teststyles' : false,
                'testprops' : false,
                'testallprops' : false,
                'hasevents' : false,
                'prefixes' : false,
                'domprefixes' : false
            },
			uglify: true
		  }
		},

		// Run some tasks in parallel to speed up build process
		concurrent: {
			server: [
				'sass:server',
				'copy:styles'
			],
			test: [
				'copy:styles'
			],
			dist: [
				'sass',
				'copy:styles',
				'imagemin',
				'svgmin'
			]
		},

		// Validate our HTML code via W3C checker
		validation: {
			options: {
				reset: grunt.option('reset') || false,
				stoponerror: false,
				path: 'log/validation-status.json',
				reportpath: 'log/validation-report.json',
				relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.']
			},
			files: {
				src: ['<%= config.tmp %>/*.html']
			}
		},

		// Lint our SCSS files to check for errors
		scsslint: {
			allFiles: [
				'<%= config.app %>/css/**/*.scss',
				'!<%= config.app %>/css/vendor/*.scss'
			],
			options: {
				config: 'log/.scss-lint.yml',
				reporterOutput: 'log/scss-lint-report.xml',
				colorizeOutput: true
			}
		},

		// Create responsive images
		responsive_images: {
			dist: {
				options: {
					sizes: [{
							width: 320,
							name: 'sm',
							rename: false,
							suffix: '-sm'
						},{
							width: 640,
							name: 'md',
							rename: false,
							suffix: '-md'
						},{
							width: 1024,
							name: 'lg',
							rename: false,
							suffix: '-lg'
						},{
							width: 1800,
							name: 'lgst',
							rename: false,
							suffix: '-lgst'
					}]
				},
				files: [{
					expand: true,
					src: [
						'**/*.{jpg,gif,png}',
						'!resp/**/*.{jpg,gif,png}'
					],
					cwd: '<%= config.app %>/images',
					dest: '<%= config.app %>/images/resp/'
				}]
			}
		},

		jsbeautifier: {
			files: ['<%= config.tmp %>/**/*.html'],
			options: {
				html: {
					indent_inner_html: false,
					braceStyle: 'collapse',
					indentChar: ' ',
					indentScripts: 'normal',
					indentSize: 2,
					maxPreserveNewlines: 10,
					preserveNewlines: true,
					unformatted: ['sub', 'sup', 'b', 'em', 'u'],
					wrapLineLength: 0
				}
			}
		}

	});

	grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
		if (grunt.option('allow-remote')) {
			grunt.config.set('connect.options.hostname', '0.0.0.0');
		}
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'wiredep',
			'jade',
			'jsbeautifier',
			'concurrent:server',
			'autoprefixer',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('test', function (target) {
		if (target !== 'watch') {
			grunt.task.run([
				'clean:server',
				'concurrent:test',
				'autoprefixer'
			]);
		}

		grunt.task.run([
			'connect:test',
			'mocha'
		]);
	});

	// Regular build
	grunt.registerTask('build', [
		'clean:dist',
		'jade',
		'jsbeautifier',
		'useminPrepare',
		'concurrent:dist',
		'autoprefixer',
		'concat',
		'cssmin',
		'uglify',
		'copy:dist',
		'modernizr',
		'usemin',
		'htmlmin:dist'
	]);

	// No CMS build: Minify HTML, Rev
	grunt.registerTask('build-nocms', [
		'clean:dist',
		'jade',
		'useminPrepare',
		'concurrent:dist',
		'autoprefixer',
		'concat',
		'cssmin',
		'uglify',
		'copy:dist',
		'modernizr',
		'rev',
		'usemin',
		'htmlmin:nocms'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'test',
		'build'
	]);
};
