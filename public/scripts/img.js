window.App = window.App || {};

(function(window, $) {

	var DATA_ATTR = "data-src-",

		SIZES = [{
			name: "s",
			size: 320
		}, {
			name: "m",
			size: 640
		}, {
			name: "l",
			size: 960
		}, {
			name: "xl",
			size: 1200
		}, {
			name: "xxl",
			size: 1600
		}],

		NUM_SIZES = SIZES.length,

		ResponsiveImgs = {
			init: function(imgs) {
				ResponsiveImgs.imgs = [];

				for (var i = 0; i < imgs.length; i++) {
					var responsiveImg = new ResponsiveImg(imgs[i]);
					responsiveImg.testWidth(ResponsiveImgs.getWindowWidth());
					ResponsiveImgs.imgs.push(responsiveImg);
				}
				if (window.addEventListener) {
					window.addEventListener("resize", ResponsiveImgs.onWindowResize, true);
				}
			},

			onWindowResize: function(e) {
				for (var i = 0; i < ResponsiveImgs.imgs.length; i++) {
					ResponsiveImgs.imgs[i].testWidth(ResponsiveImgs.getWindowWidth());
				}
			},

			getWindowWidth: function(e) {
				return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			}
		},

		// ResponsiveImg class

		ResponsiveImg = (function() {

			function ResponsiveImg(img) {
				this.hasLoaded = false;
				this.imgEl = img;
				this.imgSizes = this.getImageSizesFromDom();
			}

			ResponsiveImg.prototype.loadImg = function(src) {
				var newImg, self;
				self = this;
				newImg = new Image();

				newImg.onload = function() {
					var src = newImg.getAttribute("src");
					self.imgEl.setAttribute("src", src);

					if (!this.hasLoaded) {
						self.imgEl.className += " is-loaded";
						this.hasLoaded = true;
					};

				};

				newImg.src = src;
			};

			ResponsiveImg.prototype.getImageSizesFromDom = function() {
				var numAttr = this.imgEl.attributes.length,
					sizes = {};

				for (var i = 0; i < numAttr; i++) {
					var attr = this.imgEl.attributes[i];

					if (attr.name.indexOf(DATA_ATTR) >= 0) {
						var sizeName = attr.name.replace(DATA_ATTR, "");
						sizes[sizeName] = attr.value;
					}
				}
				return sizes;
			};

			ResponsiveImg.prototype.testWidth = function(width) {
				if (this.justLoadLargest(width)) return;

				for (var size in this.imgSizes) {
					if (this.imgSizes.hasOwnProperty(size)) {
						for (var i = 0; i < NUM_SIZES; i++) {
							var sizeW = parseInt(SIZES[i].size, 10);
							if (sizeW >= width) {
								this.loadImg(this.imgSizes[SIZES[i].name]);
								return;
							}
						}
					}
				}
			};

			ResponsiveImg.prototype.justLoadLargest = function(width) {
				for (var i = NUM_SIZES - 1; i >= 0; i--) {
					if (typeof this.imgSizes[SIZES[i].name] !== "undefined") {
						if (width >= SIZES[i].size) {
							this.loadImg(this.imgSizes[SIZES[i].name]);
							return true;
						}
					}
				}
			};

			return ResponsiveImg;

		}());


	window.App.ResponsiveImgs = ResponsiveImgs;

}).call(this, window, jQuery);