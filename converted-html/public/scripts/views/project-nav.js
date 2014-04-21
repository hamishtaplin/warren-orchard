(function (window, $) {

	window.App = window.App || {};
	App.Views = App.Views || {};

	App.Views.ProjectNav = Backbone.View.extend({

		el: document.getElementById("project-view"),

		projects: [],

		initialize: function (args) {
			_.bindAll(this, "onClick", "show", "loadProject", "onProjectLoaded", "onSliderAnimationComplete");
			
			this.pagenav = new App.Views.PageNav();

			this.projects = _.map(this.el.querySelectorAll(".project-view-item"), function(item, key) {
				
				var project = new App.Views.ProjectView({
					id: item.id,
					el: item
				});

				return project;
			});

			this.slider = new App.Views.Slider({
				animType: "slide",
				el: this.el,
				innerEl: document.getElementById("project-view-slider-inner")
			});

			this.nextBtn = document.getElementById("btn-next");
			this.prevBtn = document.getElementById("btn-prev");

			this.el.addEventListener("click", this.onClick);
		},

		onClick: function (e) {

			console.log(e);
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
			window.scrollTo(0,0);
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
			this.currentProject.on("loaded", this.onProjectLoaded);
			this.currentProject.load(slide);
			App.eventDispatcher.trigger("progress:change", 10);
		},

		onProjectLoaded: function() {
			this.currentProject.off("loaded");

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