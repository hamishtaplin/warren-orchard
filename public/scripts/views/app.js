window.App = window.App || {};
App.Views = App.Views || {};

(function (window, $) {

	App.Views.AppView = Backbone.View.extend({

		el: "body",

		initialize: function () {
			var projectIDs = [];

			_.bindAll(this, "onClick", "infoRoute", "projectRoute", "homeRoute", "onProjectLoaded");

			App.eventDispatcher = _.clone(Backbone.Events);

			window.onload = _.bind(this.onWindowLoad, this);

			this.progressView = new App.Views.ProgressBar();
			this.thumbsView = new App.Views.Thumbnails();

			if (typeof(this.thumbsView.thumbs) !== 'undefined') {
				for (var i = 0; i < this.thumbsView.thumbs.length; i++) {
					projectIDs.push(this.thumbsView.thumbs[i].getAttribute("data-project-id"));
				}
			}

			this.projectsNavView = new App.Views.ProjectNavView({	projectIDs: projectIDs });

			App.eventDispatcher.on("progress:change", this.progressView.update);
			App.eventDispatcher.on("progress:complete", this.progressView.complete);

			this.initRouter();
		},

		initRouter: function () {
			this.router = new App.Router();

			this.router.on("route:projects", this.homeRoute);
			this.router.on("route:info", this.infoRoute);
			this.router.on("route:project", this.projectRoute);

			Backbone.history.start({ pushState: true });

			$(document).on("click", "a[href^='/']", this.onClick);
		},

		onClick: function(e) {
			if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
		    e.preventDefault();
		    href = $(e.currentTarget).attr('href');
		    // Remove leading slashes and hash bangs (backward compatablility)
  			url = href.replace(/^\//,'').replace('\#\!\/','');
		    console.log("url: ", url);
		    this.router.navigate(url, { trigger: true });

		    return false;
		  }
		},

		homeRoute: function () {
			console.log("home");
			this.router.navigate("home", { trigger: true	});
		},

		projectRoute: function (id, slide) {
			this.projectsNavView.on("loaded", this.onProjectLoaded);
			this.projectsNavView.navigateTo(id, slide);
		},

		infoRoute: function() {
			console.log("info");
		},

		onProjectLoaded: function () {
			console.log("project loaded");
			this.projectsNavView.off("loaded");
			this.projectsNavView.show();
			this.thumbsView.hide();
		},

		homeRoute: function () {
			_.delay(this.thumbsView.show, 500);
			this.projectsNavView.hide();
		},

		onWindowLoad: function () {
			this.el.className += "loaded";
		}

	});

	var app = new App.Views.AppView();

}).call(this, window, Zepto);