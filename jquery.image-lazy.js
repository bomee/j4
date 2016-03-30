// ***************************************************************
// image lazy loader.
// author:  bomee  
// date:  2016/3/30
// version: 1.0
// ***************************************************************
!(function($) {
  function _addClass(ele, className){
    var eleClass = (' ' + ele.className + ' ').replace(/[\t\r\n\f]/g, ' ');
    var classArray = className.split(/ +/);
    var clazz, i = 0;
    for(; i < classArray.length; i++){
      clazz = classArray[i];
      if(!clazz) continue;

      if (eleClass.indexOf(' ' + clazz + ' ') < 0) {
        eleClass += clazz + ' ';
      }
    }
    eleClass = eleClass.replace(/^ +| +$/g, '');
    if(eleClass != ele.className){
      ele.className = eleClass;
    }
  }

  function _removeClass(ele, className){
    var eleClass = (' ' + ele.className + ' ').replace(/[\t\r\n\f]/g, ' ');
    var classArray = className.split(/ +/);
    var clazz, i = 0;
    for(; i < classArray.length; i++){
      clazz = classArray[i];
      if(!clazz) continue;

      while (eleClass.indexOf(' ' + clazz + ' ') > -1) {
        eleClass = eleClass.replace(' ' + clazz + ' ', '');
      }
    }
    
    eleClass = eleClass.replace(/^ +| + $/g, '');
    if(eleClass != ele.className){
      ele.className = eleClass;
    }
  }
  
  var ImagePreLoader = window['ImagePreLoader'] = function(ele){
    this.ele = ele;
  };

  ImagePreLoader.DEFAULTS = {
    loadingClass    : "image-lazy-loading",
    successClass    : "image-lazy-success",
    errorClass      : "image-lazy-error",
    scrollLazyClass : "image-lazy-scroll"
  };
  
  ImagePreLoader.prototype.getUrl = function(){
    var url;
    if(window.devicePixelRatio > 1){
      url = this.ele.getAttribute('data-src-retina');
    }

    if(!url){
      url = this.ele.getAttribute('data-src');
    }
    return url;
  }

  ImagePreLoader.prototype.done = function(){
    _removeClass(this.ele, ImagePreLoader.DEFAULTS.loadingClass);
    _addClass(this.ele, ImagePreLoader.DEFAULTS.successClass);
    this.ele.setAttribute('src', this.getUrl());
  };

  ImagePreLoader.prototype.error = function(){
    _removeClass(this.ele, ImagePreLoader.DEFAULTS.loadingClass);
    _addClass(this.ele, ImagePreLoader.DEFAULTS.errorClass);
  };

  ImagePreLoader.prototype.load = function(){
    _addClass(this.ele, ImagePreLoader.DEFAULTS.loadingClass);
    var img = new Image();
    img.src = this.getUrl();
    var that = this;
    if (img.complete) {
      that.done();
      return;
    }

    img.onload = function () {
      that.done();
    };

    img.onerror = function(){
      that.error();
    }
  };


  $.fn.imageLazy = function() {
    var $w = $(window), 
        $remains = this; // 未加载的

    function imageLazy() {
      var $visibleEles = $remains.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;
        if (!$e.hasClass(ImagePreLoader.DEFAULTS.scrollLazyClass)) return true;
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
})(window.jQuery);