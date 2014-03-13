(function (window, $) {

	window.App = window.App || {};
	App.Views = App.Views || {};

	App.Views.JobNavView = Backbone.View.extend({

		tagName: "div",

		className: "project-view",

		projects: [],

		initialize: function (args) {
			_.bindAll(this, "load", "onAjaxSuccess", "show", "onProjectImgsLoaded", "onSliderPrev", "onSliderNext", "onBtnClick");
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
				project.el.setAttribute("id", "project-" + id);

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

			btn.className = "bg-check btn  btn-" + type;
			btn.innerHTML = type;
			btn.addEventListener("click", this.onBtnClick);
			this.el.appendChild(btn);

			return btn;
		},

		onBtnClick: function (e) {
			if (e.target === this.nextBtn) {
				this.currentJob.slider.next();
			} else if (e.target === this.prevBtn) {
				this.currentJob.slider.prev();
			}
		},

		show: function () {
			this.el.classList.add("is-visible");
		},

		hide: function () {
			this.el.classList.remove("is-visible");
		},

		load: function (id) {
			this.currentJob = _.find(this.projects, function (project) {
				return project.id === id;
			});

			Backbone.ajax({
				url: '/project-ajax',
				data: {
					'id': id
				},
				success: this.onAjaxSuccess
			});

		},

		onAjaxSuccess: function (data, textStatus, jqXHR) {
			this.currentJob.el.innerHTML = data;

			this.currentJob.imgLoader = new App.Views.ImageLoader({
				imgs: this.currentJob.el.querySelectorAll(".gallery-item"),
				useBg: true
			});

			this.currentJob.imgLoader.on("progress:complete", this.onProjectImgsLoaded);
		},

		onProjectImgsLoaded: function (e) {
			
			BackgroundCheck.init({
				targets: '.bg-check',
				images: '.slider .img',
				debug: true
			});
			

			this.initSlider();
			this.slider.navigateTo(this.projects.indexOf(this.currentJob), true);
			this.trigger("loaded");
		},

		initSlider: function () {
			this.currentJob.slider = new App.Views.Slider({
				animType: "fade",
				el: this.currentJob.el.querySelector(".gallery"),
				innerEl: this.currentJob.el.querySelector(".gallery-inner")
			});

			this.currentJob.slider.on("slidechanged", this.onSlideChanged);
			this.currentJob.slider.on("navigate:next", this.onSliderNext);
			this.currentJob.slider.on("navigate:prev", this.onSliderPrev);
		},

		onSliderPrev: function () {
			this.unloadCurrentJob("prev");
		},

		onSliderNext: function () {
			this.unloadCurrentJob("next");
		},

		unloadCurrentJob: function (dir) {
			var currentJobIndex = this.projects.indexOf(this.currentJob);
			var newIndex = 0;

			this.currentJob.imgLoader.off("progress:complete");
			this.currentJob.slider.off("slidechanged");
			this.currentJob.slider.off("navigate:next");
			this.currentJob.slider.off("navigate:prev");

			if (dir === "next") {
				newIndex = currentJobIndex + 1;
			} else {
				newIndex = currentJobIndex - 1;
			}

			this.trigger("route:project", this.projects[newIndex].id);

			// this.load();

		},

		onSlideChanged: function (slide) {
			BackgroundCheck.set('targets', '.bg-check')
			BackgroundCheck.refresh();
		}

	});


}).call(this, window, Zepto);