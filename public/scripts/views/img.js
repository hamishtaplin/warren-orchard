window.App = window.App || {};
App.Views = App.Views || {};

App.Views.ImageView = Backbone.View.extend({

	initialize: function(args) {
		_.bindAll(this, "onImgLoad", "load");
		this.imgEl = this.el.querySelector('.img');
		this.load();
	},

	load: function() {
		var src = this.imgEl.getAttribute("data-src");
		var newImg = new Image();

		newImg.onload = _.bind(this.onImgLoad, this);
		newImg.setAttribute("src", src);
		newImg.src = src;
	},

	onImgLoad: function(e) {
		var newImg = e.target;
		if (newImg.naturalWidth < newImg.naturalHeight) {
			this.el.classList.add("portrait");
		};
		// this.imgEl.style.backgroundImage = "url(" + newImg.getAttribute("src") + ")";
		this.imgEl.setAttribute("src", newImg.getAttribute("src"));
		this.el.classList.add("is-loaded");

		this.trigger("load", this);

	}

});