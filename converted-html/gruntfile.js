/*
 * Warren Orchard
 * http://warrenorchard.co.uk
 *
 * Copyright (c) 2013 Bluegg.co.uk
 */

/*global module:false*/
module.exports = function(grunt) {
    var path = require('path');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        paths: {
            theme: "/public",
            public_dir: "public",
            scripts: "scripts",
            styles: "styles"
        },

        /**
         * Grunt Bower task for copying files from bower components file to specified directory
         */

        bower: {
            install: {
                options: {
                    targetDir: "./public/",
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    verbose: true,
                    layout: function(type, component) {
                        var renamedType = type;
                        if (type == 'js') renamedType = 'scripts/vendor/';
                        else if (type == 'scss') renamedType = 'styles/scss/vendor/';
                        return path.join(renamedType, component);
                    }
                }
            }
        },

        /**
         * Bitbucket task for automatically creating a bitbucket repo for the project
         * TODO: automate creation of git repo
         */

        http: {
            bitbucket: {
                url: 'https://api.bitbucket.org/1.0/repositories/',
                method: 'post',
                auth: {
                    user: "bluegg",
                    password: "b1u3ggpa55w0rd",
                    sendImmediately: true
                },
                form: {
                    name: "Warren Orchard",
                    is_private: true
                }
            }
        },


        grunticon: {
            myIcons: {
                files: [{
                    expand: true,
                    cwd: "public/images/icons",
                    src: ["*.svg"],
                    dest: "public/images/icons",
                    cssprefix: "",
                }],
                options: {
                    svgo: true,
                    pngcrush: true,
                    cssprefix: ".",
                    pngfolder: "/png",
                    datasvgcss: "_icons-svg.scss",
                    datapngcss: "_icons-png.scss"
                }
            }
        },

        /**
         * Sass watch task
         */

        watch: {
            // sass: {
            //     files: ['public/styles/scss/**/*.scss'],
            //     tasks: ['sass:dist']
            // },
            // css: {
            //     files: ['public/styles/*.css']
            // },
            images: {
                files: ['public/images/icons/*.svg'],
                tasks: ['svg']
            },
            // livereload: {
            //     files: ['**/*.{php,html}',
            //         'public/scripts/**/*.{js,json}',
            //         'public/styles/*.css',
            //         'public/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
            //     ],
            //     options: {
            //         livereload: true
            //     }
            // }
        },
        // sass: {
        //     dist: {
        //         files: {
        //             'public/styles/responsive.css': 'public/styles/scss/responsive.scss',
        //             'public/styles/fixed.css': 'public/styles/scss/fixed.scss'
        //         },
        //         options: {
        //             sourcemap: 'true',
        //             quiet: true
        //         }
        //     }
        // },
        /**
         * Task for copying databases between hosts with ssh
         */

        deployments: {
            options: {
                backup_dir: "db_backups"
            },
            local: {
                title: "Local",
                database: "perch",
                user: "perch_user",
                pass: "password",
                host: "localhost",
                url: "seerg.dev"
            },
            dev: {
                title: "Development",
                database: "perch",
                user: "perch_user",
                pass: "password",
                host: "localhost",
                url: "seerg.bluegg.co.uk",
                ssh_host: "root@seerg.bluegg.co.uk"
            }
            // live: {
            //   title: "Live",
            //   database: "mhs_live",
            //   user: "mhs_live",
            //   pass: "e8jyymuBRcdmHfu4",
            //   host: "localhost",
            //   url: "myhealthskills.com",
            //   ssh_host: "swhyment@162.13.97.98"
            //}
        },


        /**
         * Renames files
         */

        fileregexrename: {
            dist: {
                files: {
                    "public/images/icons/**": "public/images/icons/*"
                },
                options: {
                    replacements: [{
                        pattern: "vectors_",
                        replacement: ""
                    }]
                }
            }
        },

        svgmin: {
            options: {
                plugins: [{
                    removeViewBox: false
                }, {
                    removeUselessStrokeAndFill: false
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'public/images/icons',
                    src: ['**/*.svg'],
                    dest: 'public/images/icons',
                    ext: '.svg'
                }]
            }
        },

        responsive_images: {
            images: {
                options: {
                    sizes: [{
                        name: "small",
                        width: 480
                    }, {
                        name: "large",
                        width: 1024
                    }]
                },
                files: [{
                    expand: true,
                    src: ['**/*.{jpg,gif,png}'],
                    cwd: 'public/images/content/fullsize',
                    dest: 'public/images/content/thumbs'
                }],
            },
            thumbs: {
                options: {
                    aspectRatio: false,
                    sizes: [{
                        aspectRatio: false,
                        quality: 90,
                        width: 218,
                        height: 218
                    }, {
                        aspectRatio: false,
                        quality: 90,
                        width: 218 * 2,
                        height: 218 * 2
                    }]
                },
                files: [{
                    expand: true,
                    src: ['**/*.{jpg,gif,png}'],
                    cwd: 'public/images/content',
                    dest: 'public/images/content/thumbs'
                }],
            }
        }

    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-http');
    grunt.loadNpmTasks('grunt-deployments');
    grunt.loadNpmTasks('grunt-bg-shell');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-devtools');
    grunt.loadNpmTasks('grunt-svg2png');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-file-regex-rename');
    // grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-grunticon');
    grunt.loadNpmTasks('grunt-responsive-images');


    grunt.registerTask("deployments", 'deployments');
    grunt.registerTask("bitbucket", 'http:bitbucket');
    grunt.registerTask("bugherd", 'http:bugherd');
    grunt.registerTask("createDb", 'bgShell:createLocalDb');
    grunt.registerTask("dumpDb", 'bgShell:dumpDb');
    grunt.registerTask('bower', ['bower:install']);

    grunt.registerTask('images', ['responsive_images']);



    // grunt.registerTask('svg', ['svgmin', 'svg2png:all']);
    grunt.registerTask('svg', ['fileregexrename']);
    grunt.registerTask('rename', ['fileregexrename']);
    // grunt.registerTask('rename', ['fileregexrename']);
    // grunt.registerTask('default', ['watch']);
    grunt.registerTask('default', ['watch', 'grunticon']);
    grunt.registerTask('icon', ['grunticon']);
    grunt.registerTask('build', ['']);

};