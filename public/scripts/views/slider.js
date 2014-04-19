window.App = window.App || {};
App.Views = App.Views || {};

(function (window, $) {

	App.Views.Slider = Backbone.View.extend({

		initialize: function (args) {
			var i = 0;
			_.bindAll(this, "onSlideAnimationEnd");

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
			} 
			
			this.navigateTo(0);
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

			if (typeof(this.currentSlide) !== 'undefined') {
				this.currentSlide.classList.add("is-current");
			}

			if (!animate) {
				_.delay(function (arguments) {
					el.classList.add("will-animate");
				}, 100);
			} else {
				// TODO: cross-browser implementation
				el.addEventListener("webkitAnimationEnd", this.onSlideAnimationEnd);
			};	

			if (this.animType === "slide") {
				el.style.webkitTransform = "translate3d(-" + i * (100 / (this.numSlides)) + "%,0,0)";
			}

	
		},

		onSlideAnimationEnd: function() {
			BackgroundCheck.refresh();
		}

	});

}).call(this, window, Zepto);