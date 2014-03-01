window.App = window.App || {};
App.Views = App.Views || {};

(function(window, $) {

	App.Views.AppView = Backbone.View.extend({

		el: "body",

		initialize: function() {
			_.bindAll(this, "jobRoute", "indexRoute");

			App.eventDispatcher = _.clone(Backbone.Events); 

			window.onload = _.bind(this.onWindowLoad, this);
			
			this.progress = new App.Views.ProgressBar();

			this.thumbsView = new App.Views.Thumbnails();
	
			this.jobsView = new App.Views.JobView();
		
			App.eventDispatcher.on("progress:change", this.progress.update);
			App.eventDispatcher.on("progress:complete", this.progress.complete);

			this.initRouter();
		},

		initRouter: function() {
			this.router = new App.Router();
			this.router.on('route:index', this.indexRoute);
			this.router.on('route:job', this.jobRoute);

			Backbone.history.start();
		},

		jobRoute: function(id) {
			this.thumbsView.hide();
			// this.jobsView.on("progress:change", this.progress.update);
			// this.jobsView.on("progress:complete", this.onJobLoaded);


			this.jobsView.load(id);
		},

		indexRoute: function() {
			this.thumbsView.show();
			this.jobsView.hide();
		},

		onWindowLoad: function(arguments) {
			this.el.className += "loaded";
		}

	});
	
	var app = new App.Views.AppView();

}).call(this, window, Zepto);
