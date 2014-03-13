window.App = window.App || {};
App.Views = App.Views || {};

(function (window, $) {

	App.Views.Slider = Backbone.View.extend({

		initialize: function (args) {
			var i = 0;
			_.bindAll(this, "onPageNavClick");

			this.animType = args.animType;
			this.innerEl = args.innerEl;
			this.slides = this.innerEl.children;
			this.numSlides = this.innerEl.childElementCount;
			this.currentPageIndex = 0;
			this.el.classList.add("slider");
			this.innerEl.classList.add("slider-inner");

			while (i < this.numSlides) {
				var slide = this.slides[i];
				slide.classList.add("slider-slide");
				if (this.animType === "slide") {
					slide.style.width = (100 / this.numSlides).toString() + "%";
				}
				i++;
			}
			if (this.animType === "slide") {
				this.innerEl.style.width = (this.numSlides * 100).toString() + "%";
			} else {
				this.addUI();
			}
			
			this.navigateTo(0);
		},

		addUI: function () {
			var i = 0;

			this.pageNav = document.createElement("div");
			this.pageNav.className = "slider-paging  bg-check";
			this.pageNav.addEventListener("click", this.onPageNavClick);

			this.pageNav.innerHTML = "";

			while (i < this.numSlides) {
				var btn = document.createElement("div");
				btn.setAttribute("data-i", i.toString());
				btn.className = "slider-paging-btn";
				this.pageNav.appendChild(btn);
				i++;
			}

			this.el.appendChild(this.pageNav);

		},

		onPageNavClick: function (e) {
			this.navigateTo(e.target.getAttribute("data-i"), true);
		},

		next: function () {
			if ((this.currentPageIndex + 1) < this.numSlides) {
				this.navigateTo(this.currentPageIndex + 1);
			} else {
				this.trigger("navigate:next");
			}
		},

		prev: function () {
			if (this.currentPageIndex - 1 >= 0) {
				this.navigateTo(this.currentPageIndex - 1);
			} else {
				this.trigger("navigate:prev");
			}
		},

		navigateTo: function (i, animate) {
			var el = this.innerEl;

			if (!animate) {
				el.classList.remove("will-animate");
			}

			this.currentPageIndex = i;

			if (this.currentSlide) {
				this.currentSlide.classList.remove("is-current");
			}

			this.currentSlide = this.slides[i];
			this.currentSlide.classList.add("is-current");

			if (this.animType === "slide") {
				el.style.webkitTransform = "translate3d(-" + i * (100 / (this.numSlides)) + "%,0,0)";
			}

			if (!animate) {
				_.delay(function (arguments) {
					el.classList.add("will-animate");
				}, 100)
			};	

			if (this.pageNav) {
				
				if (this.pageNav.querySelector(".is-current")) {
					this.pageNav.querySelector(".is-current").classList.remove("is-current");
				}
				
				this.pageNav.children[i].classList.add("is-current");
			}

			this.trigger("slidechanged", this.currentSlide);
		},

		hide: function () {
			this.pageNav.classList.add("is-off-screen");
		},

		show: function () {
			this.pageNav.classList.remove("is-off-screen");
		}

	});

}).call(this, window, Zepto);