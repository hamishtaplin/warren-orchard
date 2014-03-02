window.App = window.App || {};
App.Views = App.Views || {};

App.Views.Thumbnails = Backbone.View.extend({

	el: "#thumbs",

	initialize: function() {
		_.bindAll(this, "hide", "show", "onHideAnimationEnd");
		this.thumbs = document.querySelectorAll(".thumb");

		this.imgLoader = new App.Views.ImageLoader({
			imgs: this.thumbs
		});

		// this.imgLoader.on("progress:change", this.onImageLoaded);

		this.thumbsInnerEl = document.createElement('div');
		this.thumbsInnerEl.className = "thumbs__inner";

		this.el.appendChild(this.thumbsInnerEl);
	},

	onWindowResize: function(e) {
		this.grid.draw();
	},

	hide: function() {
		this.el.classList.add("is-off-screen");
		this.el.addEventListener("webkitAnimationEnd", this.onHideAnimationEnd, true);
	},

	onHideAnimationEnd: function(e) {
		console.log(e);
	},

	show: function() {
		this.el.classList.remove("is-off-screen");
	}
});