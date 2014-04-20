(function (window, $) {

	window.App = window.App || {};
	App.Views = App.Views || {};

	App.Views.ProjectView = Backbone.View.extend({

		initialize: function () {
			_.bindAll(this, "onProjectImgsLoaded");
			this.el.setAttribute("class", "project-view-item");
			this.el.setAttribute("id", this.id);
			this.loaded = false;
		},

		render: function(data, slide) {
			this.el.innerHTML = data;

			this.imgLoader = new App.Views.ImageLoader({
				imgs: this.el.querySelectorAll(".gallery-item"),
				useBg: true
			});

			this.imgLoader.on("progress:complete", _.bind(function(e) {
				this.onProjectImgsLoaded(slide);
			}, this));
		},

		onProjectImgsLoaded: function (slide) {
			if (_.isUndefined(this.slider)){			
				this.slider = new App.Views.Slider({
					animType: "fade",
					el: this.el.querySelector(".gallery"),
					innerEl: this.el.querySelector(".gallery-inner")
				});
			} else {
				this.navigateTo(slide);
			}

			if (DEBUG) {
				BackgroundCheck.init({
					targets: '.bg-check',
					images: '.slider .img',
					debug: false
				});
			};

			this.loaded = true;
			
			this.trigger("loaded");
		},

		navigateTo: function(slide) {
			this.slider.navigateTo(slide);
		},

		getNext: function() {
			if (this.slider.index + 1 < this.slider.length) {
				return this.slider.index + 1;
			} else {
				return false;
			}
		},

		getPrev: function() {
			if (this.slider.index > 0) {
				return this.slider.index - 1;
			} else {
				return false;
			}
		}

				
	});


}).call(this, window, Zepto);