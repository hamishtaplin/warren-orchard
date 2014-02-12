// safer global namespace
window.App = window.App || {};

(function(window, $) {
    var Models = {};
    var Views = {};


    Views.Thumbnails = Backbone.View.extend({

        QUEUE_SIZE: 3,

        el: "#thumbs",

        initialize: function() {
                        
            var thumbs = document.querySelectorAll(".thumb");
            this.numThumbs = thumbs.length;

            this.progress = new Views.ProgressBar({
                total: this.numThumbs
            });

            this.queue = [];
            this.numLoaded = 0;
            for (var i = 0; i < this.numThumbs; i++) {

                var thumb = new Views.Thumbnail({
                    el: thumbs[i],
                    id: i
                });

                thumb.once("load", this.onThumbLoaded, this);

                this.queue.push(thumb);
                // thumb.load();
            };
        },

        onThumbLoaded: function(thumb) {
            this.numLoaded++;
            
            if (this.numLoaded === this.numThumbs) {
                this.progress.complete();
            } else {
                this.progress.render(this.numLoaded);
                
            }
        }
    });

    Views.Thumbnail = Backbone.View.extend({

        initialize: function(attributes) {
            _.bindAll(this, "onImgLoad");
            this.images = this.el.querySelectorAll("img");

            // this.callback = attributes.callback;

            this.load();
        },

        load: function () {
            var src = this.images[0].getAttribute("data-src");
            var newImg = new Image();
            
            newImg.onload = _.bind(this.onImgLoad, this);
            newImg.setAttribute("src", src);
            newImg.src = src;          
        },

        onImgLoad: function(e) {
            this.images[0].setAttribute("src", e.target.getAttribute("src"));
            this.el.classList.add("is-loaded");

            this.trigger("load", this);
            // this.callback(this);
        }

    });

    Views.ProgressBar = Backbone.View.extend({

        id: "progress",

        initialize: function(attributes) {
            var wrapper = document.getElementById("global-wrapper");
            wrapper.insertBefore(this.el, wrapper.firstChild);
            this.innerEl = document.createElement("div");
            this.el.classList.add("progress");
            this.innerEl.classList.add("progress__bar")
            this.el.appendChild(this.innerEl);

            this.total = attributes.total;
            
        },

        render: function(value) {
              // console.log(value);
            var perc = ((value / this.total) * 100).toString() + "%";
            
            this.innerEl.style.width = perc;
        },

        complete: function() {

            this.render(this.total);
            window.setTimeout(_.bind(function() {
                this.el.classList.add("is-complete");
            }, this), 500);
        }
    });


    var thumbnailsView = new Views.Thumbnails();




}).call(this, window, Zepto);

window.onload = function(e) {
    document.body.className += "loaded";
};