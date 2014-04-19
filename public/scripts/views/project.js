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
			if (typeof(this.slider) === 'undefined' ){			
				this.slider = new App.Views.Slider({
					animType: "fade",
					el: this.el.querySelector(".gallery"),
					innerEl: this.el.querySelector(".gallery-inner")
				});
			} else {
				this.navigateTo(slide);
			}

			BackgroundCheck.init({
				targets: '.bg-check',
				images: '.slider .img',
				debug: false
			});

			this.loaded = true;
			
			this.trigger("loaded");
		},

		navigateTo: function(slide) {
			this.slider.navigateTo(slide);
		}

				
	});


}).call(this, window, Zepto);