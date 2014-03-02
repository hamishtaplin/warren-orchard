(function(window, $) {

	window.App = window.App || {};
	App.Views = App.Views || {};

	App.Views.JobView = Backbone.View.extend({

		tagName: "div",

		className: "job-view",

		initialize: function() {
			_.bindAll(this, "onAjaxLoaded", "show");

			this.render();
		},

		render: function() {
			var wrapper = document.getElementById("global-wrapper");
			wrapper.insertBefore(this.el, wrapper.firstChild);
		},

		load: function(id) {

			Backbone.ajax({
				url: '/job-ajax',
				data: {
					'id': id
				},

				success: this.onAjaxLoaded

			});

		},

		show: function() {
			this.el.classList.add("is-visible");
			BackgroundCheck.init({
				targets: '.brand',
				images: '.gallery__item'
			});
			BackgroundCheck.refresh();
		},

		hide: function() {
			this.el.classList.remove("is-visible");
		},

		onAjaxLoaded: function(data) {

			this.el.innerHTML = data;
			BackgroundCheck.refresh();

			this.imgLoader = new App.Views.ImageLoader({
				imgs: this.el.querySelectorAll(".gallery__item")
			});

			this.imgLoader.on("progress:complete", this.show);
		}

	});


}).call(this, window, Zepto);