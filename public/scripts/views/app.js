window.App = window.App || {};
App.Views = App.Views || {};

(function (window, $) {

	App.Views.AppView = Backbone.View.extend({

		el: "body",

		initialize: function () {
			var projectIDs = [];

			_.bindAll(this, "projectRoute", "homeRoute", "rootRoute", "onProjectLoaded");

			App.eventDispatcher = _.clone(Backbone.Events);

			window.onload = _.bind(this.onWindowLoad, this);

			this.progress = new App.Views.ProgressBar();
			this.thumbsView = new App.Views.Thumbnails();

			for (var i = 0; i < this.thumbsView.thumbs.length; i++) {
				projectIDs.push(this.thumbsView.thumbs[i].getAttribute("data-project-id"));
			}

			this.projectsNavView = new App.Views.ProjectNavView({	projectIDs: projectIDs });

			App.eventDispatcher.on("progress:change", this.progress.update);
			App.eventDispatcher.on("progress:complete", this.progress.complete);

			this.initRouter();
		},

		initRouter: function () {
			var router = new App.Router();
			this.router = router;
			this.router.on("route:root", this.rootRoute);
			this.router.on("route:home", this.homeRoute);
			this.router.on("route:project", this.projectRoute);

			Backbone.history.start({ pushState: true	});

			$(document).on("click", "a[href^='/']", function(e) {
			  if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
			    e.preventDefault();
			    href = $(e.currentTarget).attr('href');
			    // Remove leading slashes and hash bangs (backward compatablility)
    			url = href.replace(/^\//,'').replace('\#\!\/','');
			    router.navigate(url, { trigger: true });

			    return false;
			  }
			});
		},

		rootRoute: function () {
			this.router.navigate("home", { trigger: true	});
		},

		projectRoute: function (id, slide) {
			console.log(id, slide);
			// var currentProject = this.projectsNavView.currentProject;
			// if (typeof(currentProject) !== 'undefined' && currentProject.id === id){
			// 	this.projectsNavView.currentProject.slider.navigateTo(slide);
			// } else {
			// 	this.projectsNavView.on("loaded", this.onProjectLoaded);
			// 	this.projectsNavView.loadProject(id, slide);
			// }
		},

		onProjectLoaded: function () {
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