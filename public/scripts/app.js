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

            for (var i = 0; i < this.numThumbs; i++) {
                this.queue.push(new Views.Thumbnail({
                    el: thumbs[i],
                    id: i
                }));
            };

            this.startQueue();

        },

        startQueue: function() {
            this.numLoaded = 0;
              _.map(this.queue, function(thumb, i, list) {
                if (i < this.QUEUE_SIZE) this.loadThumb(thumb);
            }, this);       
        },

        loadThumb: function(thumb) {

            console.log("loading: " + thumb.id);

            if (typeof(thumb) !== 'undefined') {
                thumb.once("load", this.onThumbLoaded, this);
                thumb.load();
            };
        },

        onThumbLoaded: function(thumb) {
            this.numLoaded++;
            if (this.numLoaded === this.numThumbs) {
                this.progress.complete();
                console.log("complete");
            } else {

                console.log("loaded: " + thumb.id);
                
                this.queue.splice(this.queue.indexOf(thumb), 1);

                console.log(this.queue);
                this.loadThumb(this.queue[this.QUEUE_SIZE-1]);

                this.progress.render(this.numLoaded);
                
            }
        }
    });

    Views.Thumbnail = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this, "onImgLoad");
            this.images = this.el.querySelectorAll("img");
        },

        load: function () {
            var src = this.images[0].getAttribute("data-src");
            var newImg = new Image();
            
            // newImg.onload = _.bind(this.onImgLoad, this);
            newImg.setAttribute("src", src);
            newImg.src = src;

            var that = this;

            setInterval(function() {
                that.onImgLoad({
                    target: newImg
                })
            }, 1000);
        },

        onImgLoad: function(e) {
            this.images[0].setAttribute("src", e.target.getAttribute("src"));
            this.el.classList.add("is-loaded");

            this.trigger("load", this);
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
            this.el.classList.add("is-complete")
        }
    });


    var thumbnailsView = new Views.Thumbnails();




}).call(this, window, Zepto);

window.onload = function(e) {
    document.body.className += "loaded";
};