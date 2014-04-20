window.App = window.App || {};
App.Views = App.Views || {};

App.Views.ProgressBar = Backbone.View.extend({

	el: document.getElementById("progress"),

	initialize: function (attributes) {
		_.bindAll(this, "update", "complete", "onTransitionEnd");
		this.render();


		// this.total = attributes.total;

		App.eventDispatcher.on("progress:change", this.update);
		App.eventDispatcher.on("progress:complete", this.complete);

	},

	render: function () {
		var wrapper = document.getElementById("global-wrapper");
		wrapper.insertBefore(this.el, wrapper.firstChild);
		this.innerEl = document.createElement("div");
		this.el.classList.add("progress");
		this.innerEl.classList.add("progress-bar");
		
		this.el.appendChild(this.innerEl);

	},

	update: function (perc) {
		console.log(perc);
		this.el.classList.remove("is-complete");
		this.innerEl.style.width = perc.toString() + "%";
	},

	complete: function () {
		this.update(100);

		var timeout = window.setTimeout(_.bind(function () {
			this.el.addEventListener("webkitTransitionEnd", this.onTransitionEnd);
			this.el.classList.add("is-complete");
			
		}, this), 500);

	},

	onTransitionEnd: function(e) {
		this.el.removeEventListener("webkitTransitionEnd", this.onTransitionEnd);
		this.innerEl.style.width = "10%";
	}

});