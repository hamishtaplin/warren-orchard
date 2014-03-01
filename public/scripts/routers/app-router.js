window.App = window.App || {};

App.Router = Backbone.Router.extend({

	routes: {
		"": "index",
		"jobs/:id": "job"
	}

});