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
			this.length = this.innerEl.childElementCount;
			this.index = 0;
			this.el.classList.add("slider");
			this.innerEl.classList.add("slider-inner");

			while (i < this.length) {
				var slide = this.slides[i];
				slide.classList.add("slider-slide");
				if (this.animType === "slide") {
					slide.style.width = (100 / this.length).toString() + "%";
				}
				i++;
			}

			if (this.animType === "slide") {
				this.innerEl.style.width = (this.length * 100).toString() + "%";
			} 
			
			this.navigateTo(0, false);
		},

		navigateTo: function (i, animate) {
			var animate = animate;
			var el = this.innerEl;

			if (!animate) {
				el.classList.remove("will-animate");
			}

			this.index = parseInt(i, 10);

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

				el.style.webkitTransform = "translate3d(-" + i * (100 / (this.length)) + "%,0,0) rotateY(0deg)";
			
				// el.style.webkitTransform = "translateX(-" + i * (100 / (this.length)) + "%)";
				
				// el.style.position = "absolute";
				// el.style.left = 0 - (i * (100 / (this.length))) + "%";
			}

		},

		onSlideAnimationEnd: function(e) {
			this.trigger("animationComplete");
			e.target.removeEventListener("webkitAnimationEnd", this.onSlideAnimationEnd);
			if (DEBUG) {
				_.delay(BackgroundCheck.refresh, 500);
			}
		}

	});

}).call(this, window, Zepto);