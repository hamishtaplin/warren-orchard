window.App = window.App || {};

(function(window, $) {
  
  var mouseX, mouseY, deltaX, deltaY, bgStyle;

  var Nav = {
    OPEN_CLASS: "js-mobile-nav-open",
    isOpen: false,
    btn: document.getElementById("primary-nav"),
    globalWrapper: document.getElementById("global-wrapper"),
    
    init: function() {
      if (Nav.btn) {
        $(Nav.btn).on("click", Nav.open);
        $(Nav.globalWrapper).on("click", Nav.close);
        $(Nav.globalWrapper).on("touchstart", Nav.close);
      }
    },
    open: function(e) {
      if (window.innerWidth > 767) return;
      e.preventDefault();
      $("body").addClass(Nav.OPEN_CLASS);
      Nav.isOpen = true;
      window.scrollTo(0);
      $(Nav.btn).off("click", Nav.open);
      return false;
    },
    close: function(e) {
      if (Nav.isOpen) {
        $(Nav.btn).on("click", Nav.open);
        $("body").removeClass(Nav.OPEN_CLASS);
        Nav.isOpen = false;
        e.preventDefault();
        return false;
      }
    }
  };
  

}).call(this, window, jQuery);