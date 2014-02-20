// safer global namespace
window.App = window.App || {};

(function(window, $) {

		var Models = {};
		var Views = {};

		Views.Thumbnails = Backbone.View.extend({

				MAX_COLS: 4,
				MAX_ROWS: 3,
				MAX_THUMB_SIZE: 436,

				el: "#thumbs",

				initialize: function() {
						_.bindAll(this, "drawGrid")						
						var thumbs = document.querySelectorAll(".thumb");
						this.numThumbs = thumbs.length;

						this.progress = new Views.ProgressBar({
								total: this.numThumbs
						});

						this.queue = [];
						this.numLoaded = 0;

						// create this for later use
						this.numPagesOfThumbs = 0;
						this.thumbPages = [];

						this.thumbsInnerEl = document.createElement('div');
						this.thumbsInnerEl.className = "thumbs__inner";
						this.el.appendChild(this.thumbsInnerEl);

						this.thumbsPagingNav = document.createElement('nav');
						this.thumbsPagingNav.className = "thumbs__paging";
						this.el.parentElement.appendChild(this.thumbsPagingNav);

						for (var i = 0; i < this.numThumbs; i++) {

								var thumb = new Views.Thumbnail({
										el: thumbs[i],
										id: i
								});

								thumb.once("load", this.onThumbLoaded, this);
								this.queue.push(thumb);
						};


						var fontSize = parseFloat(window.getComputedStyle(document.body, null).getPropertyValue('font-size')); 
						this.headerHeight = document.getElementById("header").offsetHeight;

						window.addEventListener("resize", _.bind(this.onWindowResize, this));
						this.drawGrid();

				},

				onThumbLoaded: function(thumb) {
						this.numLoaded++;
						
						if (this.numLoaded === this.numThumbs) {
								this.progress.complete();
						} else {
								this.progress.render(this.numLoaded);
						}
				},

				drawGrid: function() {
						var width = this.getAvailableWidth(),
								height = this.getAvailableHeight(),
								thumbs = this.queue,
								numThumbs = this.numThumbs,
								style = this.el.style,
								numPerPage = 0,
								numPages = 0,
								pageWidth = 0,
								pageHeight = 0,
								i = 0;

						cols = Math.ceil(width / this.MAX_THUMB_SIZE);
						rows = Math.ceil(height / this.MAX_THUMB_SIZE);

						numPerPage = cols * rows;
						numPages = Math.ceil(numThumbs / numPerPage);

						if (numPages !== this.numPagesOfThumbs) {
							
							this.numPagesOfThumbs = numPages;

							for (i = 0; i < numPages; i++) {

								if (typeof(this.thumbPages[i]) === 'undefined') {
									var page = document.createElement('div');
									page.id = "thumbs-page-" + i;
									page.className = "thumbs__page";
									this.thumbPages[i] = page;
									if (typeof(page.parent === 'undefined')) {
										this.thumbsInnerEl.appendChild(page);
									}
								} else {
								 	// this.thumbPages[i] = null;
								}
							}
							for (i = 0; i < numThumbs; i++) {
								var thumb = thumbs[i].el;
								thumb.style.width = 100 / cols + "%"; 
								thumb.style.height = 100 / rows + "%"; 
								
								this.thumbPages[Math.floor(i / numPerPage)].appendChild(thumb);
							}
						}

						pageWidth = ((height / rows) * cols);
						
						if (pageWidth <= width) {
							pageWidth = pageWidth;
						} else {
							pageWidth = width;
						}
						pageHeight = height;

						console.log(pageWidth, pageHeight);
						style.width = pageWidth + "px";
						style.height = pageHeight + "px";

						for (i = 0; i < numPages; i++) {
							this.thumbPages[i].style.width = pageWidth + "px";
							// this.thumbPages[i].style.height = pageWidth + "px";
						};

						this.thumbsInnerEl.style.width = (pageWidth * numPages) + "px";
						this.thumbsInnerEl.style.height = pageHeight + "px";
						
				},

				getAvailableHeight: function() {
						return window.innerHeight - (this.headerHeight * 2);
				},

				getAvailableWidth: function() {
						return window.innerWidth;
				},

				onWindowResize: function(e) {
					_.defer(this.drawGrid)
				}
		});

		Views.Thumbnail = Backbone.View.extend({

				initialize: function(attributes) {
						_.bindAll(this, "onImgLoad");
						this.images = this.el.querySelectorAll(".thumb__img");

						// this.callback = attributes.callback;

						this.load();
				},

				load: function () {
						var src = this.images[0].getAttribute("data-src");
						var newImg = new Image();
						
						newImg.onload = _.bind(this.onImgLoad, this);
						newImg.setAttribute("src", src);
						newImg.src = src;          
				},

				onImgLoad: function(e) {
						this.images[0].style.backgroundImage = "url(" + e.target.getAttribute("src") + ")";
						// this.images[0].setAttribute("src", e.target.getAttribute("src"));
						this.el.classList.add("is-loaded");

						this.trigger("load", this);
						// this.callback(this);
				}

		});

		Views.ProgressBar = Backbone.View.extend({

				id: "progress",

				initialize: function(attributes) {
						var wrapper = document.getElementById("global-wrapper");
						wrapper.insertBefore(this.el, wrapper.firstChild);
						this.innerEl = document.createElement("div");
						this.el.classList.add("progress");
						this.innerEl.classList.add("progress__bar")
						this.el.appendChild(this.innerEl);

						this.total = attributes.total;
						
				},

				render: function(value) {
							// console.log(value);
						var perc = ((value / this.total) * 100).toString() + "%";
						
						this.innerEl.style.width = perc;
				},

				complete: function() {

						this.render(this.total);
						window.setTimeout(_.bind(function() {
								this.el.classList.add("is-complete");
						}, this), 500);
				}
		});


		var thumbnailsView = new Views.Thumbnails();




}).call(this, window, Zepto);

window.onload = function(e) {
		document.body.className += "loaded";
};