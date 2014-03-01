window.App = window.App || {};
App.Views = App.Views || {};

App.Views.ImageLoader = Backbone.View.extend({

	initialize: function(args) {
		var imgs = args.imgs;		
		
		this.numImages = imgs.length;
		this.queue = [];
		this.numLoaded = 0;

		for (var i = 0; i < this.numImages; i++) {

			var img = new App.Views.ImageView({
				el: imgs[i],
				id: i
			});

			img.once("load", this.onImageLoaded, this);
			this.queue.push(img);

		};
	},

	onImageLoaded: function(img) {
		this.numLoaded++;

		img.el.classList.add("img-" + this.numLoaded);

		if (this.numLoaded === this.numImages) {
			App.eventDispatcher.trigger("progress:complete");
			this.trigger("progress:complete");

		} else {
			App.eventDispatcher.trigger("progress:change", (this.numLoaded / this.numImages) * 100);
			this.trigger("progress:change", (this.numLoaded / this.numImages) * 100);
		}
	}

});



