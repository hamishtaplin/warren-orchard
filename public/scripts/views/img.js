window.App = window.App || {};
App.Views = App.Views || {};

App.Views.ImageView = Backbone.View.extend({

	initialize: function (args) {
		_.bindAll(this, "onImgLoad", "load");
		this.useBg = args.useBg;
		this.imgEl = this.el.querySelector('.img');
		this.load();
	},

	load: function () {
		var src = this.imgEl.getAttribute("data-src");
		var img = new Image();

		img.onload = _.bind(this.onImgLoad, this);
		// img.setAttribute('crossorigin', '');
		img.setAttribute("src", src);
	},

	onImgLoad: function (e) {
		var img = e.target;

		if (img.naturalWidth < img.naturalHeight) {
			this.el.classList.add("portrait");
		}

		if (this.useBg) {
			this.imgEl.style.backgroundImage = "url(" + img.getAttribute("src") + ")";
		} else {
			this.imgEl.setAttribute("src", img.getAttribute("src"));
		}

		this.el.classList.add("is-loaded");
		this.trigger("load", this);

	},

	convertImageToDataURI: function (img) {
		var canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;

		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);

		return canvas.toDataURL('image/png');
	}

});