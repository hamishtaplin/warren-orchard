(function (window, $) {

	window.App = window.App || {};
	App.Views = App.Views || {};

	App.Views.ProjectNavView = Backbone.View.extend({

		tagName: "div",

		className: "project-view",

		projects: [],

		initialize: function (args) {
			_.bindAll(this, "loadProject", "onAjaxSuccess", "show", "onProjectImgsLoaded");
			this.projectIDs = args.projectIDs;
			this.render();
		},

		render: function () {
			var header = document.getElementById("header");

			this.nextBtn = this.makeBtn("next");
			this.prevBtn = this.makeBtn("prev");

			this.innerEl = document.createElement("div");
			this.innerEl.setAttribute("class", "project-view-item-inner");
			this.el.appendChild(this.innerEl);

			for (var i = 0; i < this.projectIDs.length; i++) {
				var id = this.projectIDs[i];
				var project = {
					id: id,
					el: document.createElement("div")
				}

				project.el.setAttribute("class", "project-view-item");
				project.el.setAttribute("id", id);

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

		makeBtn: function (type) {
			var btn = document.createElement("div");

			btn.className = "bg-check  btn  btn-" + type;
			btn.innerHTML = type;
			btn.addEventListener("click", this.onBtnClick);
			this.el.appendChild(btn);

			return btn;
		},

		onBtnClick: function (e) {
			
		},

		show: function () {
			this.el.classList.add("is-visible");
		},

		hide: function () {
			this.el.classList.remove("is-visible");
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
			this.currentProject.el.innerHTML = data;

			this.currentProject.imgLoader = new App.Views.ImageLoader({
				imgs: this.currentProject.el.querySelectorAll(".gallery-item"),
				useBg: true
			});

			this.currentProject.imgLoader.on("progress:complete", _.bind(function(e) {
				this.onProjectImgsLoaded(slide);
			}, this));
		},

		onProjectImgsLoaded: function (slide) {
			this.initProjectSlider(slide);
			
			this.trigger("loaded");
		},

		initProjectSlider: function (slide) {
			if (typeof(this.currentProject.slider) === 'undefined' ){
				this.currentProject.slider = new App.Views.Slider({
					animType: "fade",
					el: this.currentProject.el.querySelector(".gallery"),
					innerEl: this.currentProject.el.querySelector(".gallery-inner")
				});
			} else {
				this.currentProject.slider.navigateTo(slide);
			}

			BackgroundCheck.init({
				targets: '.bg-check',
				images: '.slider .img',
				debug: false
			});
		},

		unloadCurrentProject: function (dir) {
			this.currentProject.imgLoader.off("progress:complete");
			this.currentProject.slider.off("slidechanged");
			this.currentProject.slider.off("navigate:next");
			this.currentProject.slider.off("navigate:prev");
		},

		getProjectByID: function(id) {
			return _.find(this.projects, function (project) {
				return project.id === id;
			});
		}

	});


}).call(this, window, Zepto);