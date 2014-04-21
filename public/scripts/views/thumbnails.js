window.App = window.App || {};
App.Views = App.Views || {};

App.Views.Thumbnails = Backbone.View.extend({

	el: "#thumbs",

	initialize: function () {
		_.bindAll(this, "hide", "show", "onHideAnimationEnd");

		if (_.isUndefined(this.el)) {
			return;
		}

		this.thumbs = document.querySelectorAll(".thumb");
		this.numThumbs = this.thumbs.length;
		this.thumbsParent = this.el.parentElement;

		this.imgLoader = new App.Views.ImageLoader({
			imgs: this.thumbs
		});

		this.thumbsInnerEl = document.createElement('div');
		this.thumbsInnerEl.className = "thumbs-inner";
		this.el.appendChild(this.thumbsInnerEl);

		this.show();
	},

	hide: function () {
		// console.log("thumbs hide");
		this.eventCount = 0;
		this.el.classList.add("is-off-screen");
		this.el.addEventListener("webkitAnimationEnd", this.onHideAnimationEnd, false);
	},

	onHideAnimationEnd: function (e) {
		this.eventCount++;
		if (this.eventCount === this.numThumbs) {
			this.thumbsParent.removeChild(this.el);
			this.el.removeEventListener("webkitAnimationEnd", this.onHideAnimationEnd);
		}
	},

	show: function () {
		this.el.classList.remove("hide");

		if (this.el.parentElement === null) {
			this.thumbsParent.appendChild(this.el);
			this.el.classList.remove("is-off-screen");
		}
	}
});