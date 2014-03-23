module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);    

    grunt.initConfig({
        tilerApp: {
            app: 'public'
        },

        watch: {
            js: {
                files: [
                    '<%= tilerApp.app %>/js/lib/{,*/}*.js',
                    '<%= tilerApp.app %>/js/node_modules/{,*/}*.js',
                ],
                tasks: ['newer:jshint:concat:all']
            },

            gruntfile: {
                files: ['Gruntfile.js']
            }
        }, 

        connect: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            dist: {
                options: {
                    base: '<%= tilerApp.app %>'
                }
            }
        },

        concat: {
            dist: {
                src: [
                    '<%= tilerApp.app %>/js/lib/{,*/}*.js',
                    '<%= tilerApp.app %>/js/node_modules/{,*/}*.js',
                ],
                dest: '<%= tilerApp.app %>/js/project.js'
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= tilerApp.app %>/js/lib/{,*/}*.js'
            ]
        }
    });

    grunt.registerTask('build', [
        'concat'
    ]);

    grunt.registerTask('serve', function (target) {
        if (target == 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'connect',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('default', [
        'newer:jshint',
        'build'
    ]);
};
