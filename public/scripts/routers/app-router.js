window.App = window.App || {};

App.Router = Backbone.Router.extend({

	routes: {
		"": "root",
		"home": "index",
		"projects/:id": "project",
		"projects/:id/:slide": "project"
	}

});