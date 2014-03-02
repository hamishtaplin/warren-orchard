window.App = window.App || {};
App.Views = App.Views || {};

(function(window, $) {

	App.Views.Slider = Backbone.View.extend({

		initialize: function(args) {
			_.bindAll(this, "draw", "onPageNavClick");

			this.type = args.type;

			this.innerEl = document.createElement("div");
			this.el.appendChild(this.innerEl);
			this.pageNav = document.createElement("div");
			this.pageNav.className = "paging";
			this.el.parentElement.appendChild(this.pageNav);
			this.pageNav.addEventListener("click", this.onPageNavClick);
			this.pageNavItems = [];
			this.numPages = 0;
			this.currentPage = 0;
		},

		draw: function(numPages) {

			var i = 0;

			this.numPages = numPages;
			this.pageNavItems = [];
			this.pageNav.innerHTML = "";

			while (i < numPages) {

				var btn = document.createElement('div');
				btn.setAttribute("data-i", i.toString());
				btn.className = "paging-btn";
				this.pageNavItems[i] = btn;
				this.pageNav.appendChild(btn);

				i++;

			}

			this.navigateTo(this.currentPage, false);
		},

		onPageNavClick: function(e) {
			this.navigateTo(e.target.getAttribute("data-i"), true);
		},

		navigateTo: function(i, animate) {
			var el = this.innerEl;

			if (!animate) {
				el.classList.remove("will-animate");
			}

			this.currentPage = i;

			if (this.style === "slide") {
				el.style.webkitTransform = "translate3d(-" + i * (100 / (this.numPages)) + "%,0,0)";
			} else if (this.style === "fade") {

			}

			if (!animate) {
				_.delay(function(arguments) {
					el.classList.add("will-animate");
				}, 100)
			};
		},

		hide: function() {
			this.pageNav.classList.add("is-off-screen");
		},

		show: function() {
			this.pageNav.classList.remove("is-off-screen");
		}

	});

}).call(this, window, Zepto);