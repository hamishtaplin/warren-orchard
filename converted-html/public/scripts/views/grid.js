window.App = window.App || {};
App.Views = App.Views || {};

App.Views.Grid = Backbone.View.extend({

	MAX_COLS: 5,
	MAX_ROWS: 3,


	initialize: function(args) {
		this.el = args.el;
		// create this for later use
		this.numPagesOfThumbs = 0;
		this.thumbPages = [];

		this.thumbsInnerEl = args.thumbsInnerEl;
		
		this.thumbs = args.thumbs;
		this.numThumbs = this.thumbs.length;

		var fontSize = parseFloat(window.getComputedStyle(document.body, null).getPropertyValue('font-size')); 
		this.headerHeight = document.getElementById("header").offsetHeight;
	},

	draw: function() {

		var winWidth = window.innerWidth,
				winHeight = window.innerHeight - (this.headerHeight * 2),
				maxThumbSize = parseInt(this.getStyleProp(this.thumbs[0], "max-width")),
				style = this.el.style,
				thumbs = this.thumbs,
				numThumbs = this.numThumbs,
				numPerPage = 0,
				numPages = 0,
				pageWidth = 0,
				pageHeight = 0,
				i = 0;

		
		rows = Math.ceil(winHeight / maxThumbSize);

		cols = (rows < 2) ? Math.ceil(winWidth / maxThumbSize) : Math.ceil(winWidth / maxThumbSize)

		if (cols > this.MAX_COLS) cols = this.MAX_COLS;
		if (rows > this.MAX_ROWS) rows = this.MAX_ROWS;

		numPerPage = cols * rows;
		numPages = Math.ceil(numThumbs / numPerPage);

		if (numPages !== this.numPagesOfThumbs) {

			this.numPagesOfThumbs = numPages;

			i = 0;
			while (i < numPages) {

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

				i++;
			}

			i = 0;
			while	(i < numThumbs) {
				var thumb = thumbs[i];
				thumb.style.width = 100 / cols + "%"; 
				thumb.style.height = 100 / rows + "%"; 
				this.thumbPages[Math.floor(i / numPerPage)].appendChild(thumb);
				i++;
			}

			this.trigger("change:numpages", numPages);
		}

		pageWidth = ((winHeight / rows) * cols);
		pageHeight = winHeight;

		style.width = pageWidth + "px";
		style.height = pageHeight + "px";

		i = 0;
		while (i < numPages) {
			this.thumbPages[i].style.width = pageWidth + "px";
			this.thumbPages[i].style.height = pageHeight + "px";
			i++;
		};

		this.thumbsInnerEl.style.width = (pageWidth * numPages) + "px";
		this.thumbsInnerEl.style.height = pageHeight + "px";

	},

	getStyleProp: function(elem, prop){
		if(window.getComputedStyle)
			return window.getComputedStyle(elem, null).getPropertyValue(prop);
		else if(elem.currentStyle) return elem.currentStyle[prop]; //IE
	}

});