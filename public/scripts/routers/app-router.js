window.App = window.App || {};

App.Router = Backbone.Router.extend({

	routes: {
		"projects": "projects",
		"info": "info",
		"projects/:id/:slide": "project"

	}

});