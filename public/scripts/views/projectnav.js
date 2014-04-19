(function (window, $) {

	window.App = window.App || {};
	App.Views = App.Views || {};

	App.Views.ProjectNavView = Backbone.View.extend({

		tagName: "div",

		className: "project-view",

		projects: [],

		initialize: function (args) {
			_.bindAll(this, "onClick", "loadProject", "onAjaxSuccess", "show", "onProjectLoaded");
			this.projectIDs = args.projectIDs;
			this.render();

			this.el.addEventListener("click", this.onClick);
		},

		render: function () {
			var header = document.getElementById("header");

			this.nextBtn = this.makeBtn("next");
			this.prevBtn = this.makeBtn("prev");

			this.innerEl = document.createElement("div");
			this.innerEl.setAttribute("class", "project-view-item-inner");
			this.el.appendChild(this.innerEl);

			for (var i = 0; i < this.projectIDs.length; i++) {

				var project = new App.Views.ProjectView({
					id: this.projectIDs[i],
					el: document.createElement("div")
				});		

				project.on("loaded", this.onProjectLoaded);

				this.projects.push(project);
				this.innerEl.appendChild(project.el);
			}

			header.parentNode.insertBefore(this.el, header.nextSibling);

			this.slider = new App.Views.Slider({
				animType: "slide",
				el: this.el,
				innerEl: this.innerEl
			});

		},

		addUI: function () {
			var i = 0;
			var inner = document.createElement("div");
			
			inner.setAttribute("class", "slider-paging-inner bg-check");
			inner.innerHTML = "";
			
			this.pageNav = document.createElement("div");
			this.pageNav.setAttribute("class", "slider-paging");
			this.pageNav.innerHTML = "";

			while (i < this.numSlides) {
				var btn = document.createElement("div");
				btn.setAttribute("data-i", i.toString());
				// btn.innerHTML = i.toString();
				btn.setAttribute("class", "slider-paging-btn");
				inner.appendChild(btn);
				i++;
			}
			
			this.pageNav.inner = inner;
			this.pageNav.appendChild(inner);
			this.el.appendChild(this.pageNav);

		},

		makeBtn: function (type) {
			var btn = document.createElement("div");

			btn.className = "bg-check  btn  btn-" + type;
			btn.innerHTML = type;
			
			this.el.appendChild(btn);

			return btn;
		},

		onClick: function (e) {
			console.log(e.target);
		},

		show: function () {
			this.el.classList.add("is-visible");
		},

		hide: function () {
			this.currentProject = undefined;
			console.log("hide");
			this.el.classList.remove("is-visible");
		},

		navigateTo: function(id, slide) {
			
			console.log("navigateTo: " + id, slide);

			if (this.isCurrentProject(id)) {
				console.log("project already current, navigating to slide: " + slide);
				this.currentProject.navigateTo(slide);
			} else {
				var project = this.getProjectByID(id);
				if (project.loaded) {
					console.log("project already loaded but not current, navigating to project and slide: " + slide);
					this.currentProject = project;
					project.navigateTo(slide);
					this.goToProject(project);
					
					this.trigger("loaded");
				} else {
					console.log("project not loaded, loading: ");
					this.loadProject(id, slide);
				}	
			}

		},

		loadProject: function (id, slide) {
			console.log("load :" + id, slide);

			this.currentProject = this.getProjectByID(id);

			Backbone.ajax({
				url: '/project-ajax',
				data: {
					'id': id
				},
				success: _.bind(function(data, textStatus, jqXHR) {
					this.onAjaxSuccess(data, slide);
				}, this)
			});

		},

		onAjaxSuccess: function (data, slide) {
			this.currentProject.render(data, slide);
		},

		onProjectLoaded: function(e) {
			console.log("onProjectLoaded");
			this.goToProject(this.currentProject);
			this.trigger("loaded");
		},

		getProjectByID: function(id) {
			return _.find(this.projects, function (project) {
				return project.id === id;
			});
		},

		goToProject: function(project) {
			console.log(project);

			this.slider.navigateTo(this.projects.indexOf(project));

		},

		isCurrentProject: function(id) {
			return (typeof(this.currentProject) !== 'undefined' && this.currentProject.id === id);
		}

	});


}).call(this, window, Zepto);