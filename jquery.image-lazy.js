// ***************************************************************
// ImagePreLoader and a jquery plugin with ImagePreLoader.
// Compatible with the retina screen and ordinary screen for the same <img>
// author:  bomee  
// date:  2016/3/30
// version: 1.1
// ***************************************************************
!(function(window){
  // process element's class, its intention is to remove repeat code.
  // ImagePreLoader can use anywhere without jQuery.
  function processClass(ele, className, processFn){
    var eleClass = (' ' + ele.className + ' ').replace(/[\t\r\n\f]/g, ' ');
    var classArray = className.split(/ +/);
    var clazz, i = 0;
    for(; i < classArray.length; i++){
      clazz = classArray[i];
      if(!clazz) continue;

      eleClass = processFn(eleClass, clazz);
    }
    eleClass = eleClass.replace(/^ +| +$/g, '');
    if(eleClass != ele.className){
      ele.className = eleClass;
    }
  }
  var _private = {
    addClass: (function() {
      function processFn(eleClass, clazz){
        return eleClass.indexOf(' ' + clazz + ' ') < 0 ? eleClass + clazz + ' ' : eleClass;
      }
      return function(ele, className) {
        processClass(ele, className, processFn);
      }
    })(),
    removeClass: (function(ele, className){
      function processFn(eleClass, clazz){
        while (eleClass.indexOf(' ' + clazz + ' ') > -1) {
          eleClass = eleClass.replace(' ' + clazz + ' ', '');
        }
        return eleClass;
      }
      return function(ele, className) {
        processClass(ele, className, processFn);
      }
    })(),
    done: function(loader){
      _private.removeClass(loader.ele, ImagePreLoader.defaults.loadingClass);
      _private.addClass(loader.ele, ImagePreLoader.defaults.successClass);
      loader.ele.setAttribute('src', loader.getUrl());  
    },
    error: function(loader){
      _private.removeClass(loader.ele, ImagePreLoader.defaults.loadingClass);
      _private.addClass(loader.ele, ImagePreLoader.defaults.errorClass);  
    }
  };
  
  var ImagePreLoader = window['ImagePreLoader'] = function(ele){
    this.ele = ele;
  };

  // defaults for ImagePreLoader
  ImagePreLoader.defaults = {
    loadingClass    : "image-lazy-loading",
    successClass    : "image-lazy-success",
    errorClass      : "image-lazy-error"
  };
  
  ImagePreLoader.prototype.getUrl = function(){
    return window.devicePixelRatio > 1 
      ? this.ele.getAttribute('data-src-retina') || this.ele.getAttribute('data-src') 
      : this.ele.getAttribute('data-src');
  }

  ImagePreLoader.prototype.load = function(){
    _private.addClass(this.ele, ImagePreLoader.defaults.loadingClass);
    var img = new Image();
    img.src = this.getUrl();
    var that = this;
    if (img.complete) {
      _private.done.call(that, that);
      return;
    }

    img.onload = function () {
      _private.done.call(that, that);
    };

    img.onerror = function(){
      _private.error.call(that, that);
    }
  };
})(window);

// jQuery plugin for ImagePreLoader
!(function(window, $) {
  $.fn.imageLazy = function() {
    var $w = $(window), 
        $remains = this;

    function imageLazy() {
      var $visibleEles = $remains.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;
        if (!$e.hasClass($.fn.imageLazy.defaults.scrollLazyClass)) return true;
        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt && et <= wb;
      });
      
      $remains = $remains.not($visibleEles.trigger("download.imageLazy"));

      if(!$remains.length){
        $w.off("scroll.imageLazy resize.imageLazy");
      }
    }

    this.one("download.imageLazy", function() {
      new ImagePreLoader(this).load();
    });

    $w.on("scroll.imageLazy resize.imageLazy", imageLazy);
    imageLazy();
    
    return this;
  };

  $.fn.imageLazy.defaults = {
    autoInit        : true,
    scrollLazyClass : "image-lazy-scroll"
  };

  if($.fn.imageLazy.defaults.autoInit){
    $(function(){
      $('.image-lazy').imageLazy();
    });
  }
})(window, window.jQuery);