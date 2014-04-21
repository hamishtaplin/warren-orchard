window.App = window.App || {};
App.Views = App.Views || {};

App.Views.PageNav = Backbone.View.extend({

	tagName: "div",

	initialize: function () {
		_.bindAll(this, "show", "hide", "go");
		this.btns = [];
		this.inner = document.createElement("div");
		this.inner.setAttribute("class", "slider-paging-inner bg-check");
		this.inner.innerHTML = "";

		this.el.setAttribute("class", "slider-paging");
		this.el.appendChild(this.inner);

		this.hide();
	},

	render: function (length) {
		var i = 0;
		this.inner.innerHTML = "";
		this.btns = [];
		while (i < length) {
			var btn = document.createElement("div");
			btn.setAttribute("data-i", i.toString());
			// btn.innerHTML = i.toString();	
			btn.setAttribute("class", "slider-paging-btn");
			this.btns.push(btn);
			this.inner.appendChild(btn);
			if (i === 0) {
				this.curr = btn;
			};
			i++;
		}

		this.go(0);
	},

	go: function(i) {
		console.log("go " + i);
		if (!_.isUndefined(this.curr)) {
			this.curr.classList.remove("is-current");
		};
		
		if (this.btns.length > 0) {
			this.curr = this.btns[i];
			this.curr.classList.add("is-current");
		};
	},

	show: function() {
		console.log(this, this.el);
		this.el.classList.remove("is-hidden");
		console.log("pageNav show");
	},

	hide: function() {
		console.log("pageNav hide");
		this.el.classList.add("is-hidden");
	},

	contains: function(target) {
		return this.btns.indexOf(target);
	}

});