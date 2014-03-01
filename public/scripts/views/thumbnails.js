window.App = window.App || {};
App.Views = App.Views || {};

App.Views.Thumbnails = Backbone.View.extend({

	el: "#thumbs",

	initialize: function() {		
		this.thumbs = document.querySelectorAll(".thumb");
				
		this.imgLoader = new App.Views.ImageLoader({
			imgs: this.thumbs
		});

		// this.imgLoader.on("progress:change", this.onImageLoaded);

		this.thumbsInnerEl = document.createElement('div');
		this.thumbsInnerEl.className = "thumbs__inner";

		this.el.appendChild(this.thumbsInnerEl);

		this.grid = new App.Views.Grid({
			thumbs: this.thumbs,
			el: this.el,
			thumbsInnerEl: this.thumbsInnerEl
		});

		this.slider = new App.Views.Slider({
			el: this.el,
			thumbsInnerEl: this.thumbsInnerEl
		});

		this.grid.on("change:numpages", this.slider.draw);

		window.addEventListener("resize", _.bind(this.onWindowResize, this));
		this.grid.draw();
	},

	onWindowResize: function(e) {
		this.grid.draw();
	},

	hide: function() {
		this.el.classList.add("is-off-screen");
		this.slider.hide();
	},

	show: function() {
		this.el.classList.remove("is-off-screen");
		this.slider.show();
	}
});



