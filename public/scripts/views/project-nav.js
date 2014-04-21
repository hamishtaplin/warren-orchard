(function (window, $) {

	window.App = window.App || {};
	App.Views = App.Views || {};

	App.Views.ProjectNav = Backbone.View.extend({

		tagName: "div",

		className: "project-view",

		projects: [],

		initialize: function (args) {
			_.bindAll(this, "onClick", "loadProject", "onAjaxSuccess", "show", "onProjectLoaded", "onSliderAnimationComplete");
			this.projectIDs = args.projectIDs;
			this.render();

			this.el.addEventListener("click", this.onClick);
		},

		render: function () {
			var header = document.getElementById("header");

			this.pagenav = new App.Views.PageNav();

			this.nextBtn = this.makeBtn("next");
			this.prevBtn = this.makeBtn("prev");

			this.innerEl = document.createElement("div");
			this.innerEl.setAttribute("class", "project-view-item-inner  will-animate");
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

			this.el.insertBefore(this.pagenav.el, this.innerEl);

		},


		makeBtn: function (type) {
			var btn = document.createElement("a");

			btn.className = "bg-check  btn  btn-" + type;
			btn.innerHTML = type;
			
			this.el.appendChild(btn);

			return btn;
		},

		onClick: function (e) {
			var target = e.target;

			if (target === this.nextBtn) {
				this.next();
			} else if (target === this.prevBtn) {
				this.prev();
			} else if (this.pagenav.contains(target) > -1){
				this.setRoute(this.currentProject.id, this.pagenav.contains(target));
			}
		},

		next: function() {
			var next = this.currentProject.getNext();

			if (next === false) {
				this.setRoute(this.getNextProject().id, 0);
			} else {
				this.setRoute(this.currentProject.id, next);
			}

		},

		prev: function() {
			var prev = this.currentProject.getPrev();
			
			if (prev === false) {
				var prevProject = this.getPrevProject();
				this.setRoute(prevProject.id, prevProject.getLength() - 1);
			} else {
				this.setRoute(this.currentProject.id, prev);
			}
		},

		setRoute: function(id, slide) {
			App.router.navigate("projects/" + id + "/" + slide, {trigger:true});
		},

		show: function () {
			// this.pagenav.show();
			this.el.classList.add("is-visible");
			this.animate = true;
		},

		hide: function () {
			this.pagenav.hide();
			this.currentProject = undefined;
			this.animate = false;
			this.el.classList.remove("is-visible");
		},

		navigateTo: function(id, slide) {
			this.pagenav.go(slide);
			if (this.isCurrentProject(id)) {
				console.log("project already current, navigating to slide: " + slide);
				this.currentProject.navigateTo(slide, true);
			} else {
				var project = this.getProjectByID(id);
				if (project.loaded) {
					console.log("project already loaded but not current, navigating to project and slide: " + slide);
					this.currentProject = project;
					project.navigateTo(slide);
					this.goToProject(project, true);
					this.trigger("loaded");
				} else {
					console.log("project not loaded, loading: ");
					this.loadProject(id, slide);
				}	
			}
		},

		loadProject: function (id, slide) {
			this.currentProject = this.getProjectByID(id);

			App.eventDispatcher.trigger("progress:change", 10);

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

		onProjectLoaded: function() {
			this.goToProject(this.currentProject, this.animate);
			this.trigger("loaded");
		},

		getProjectByID: function(id) {
			return _.find(this.projects, function (project) {
				return project.id === id;
			});
		},

		goToProject: function(project, animate) {
			this.slider.navigateTo(this.getProjectSlideIndex(project), animate);
			if (animate) {
				this.pagenav.hide();
				this.slider.on("animationComplete", this.onSliderAnimationComplete);
			} else {
				this.pagenav.render(this.currentProject.slider.length);
				_.delay(this.pagenav.show, 1000);
			}
		},

		onSliderAnimationComplete: function() {
			this.pagenav.render(this.currentProject.slider.length);
			this.slider.off("animationComplete", this.onSliderAnimationComplete);
			_.delay(this.pagenav.show, 1000);
		},

		getProjectSlideIndex: function(project) {
			return this.projects.indexOf(project || this.currentProject);
		},

		getNextProject: function() {
			return this.projects[this.getProjectSlideIndex() + 1] || this.projects[0];
		},

		getPrevProject: function() {
			return this.projects[this.getProjectSlideIndex() - 1] || this.projects[this.projects.length-1];
		},

		isCurrentProject: function(id) {
			return (!_.isUndefined(this.currentProject) && this.currentProject.id === id);
		}

	});


}).call(this, window, Zepto);