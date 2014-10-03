/*!
 * Jarallax
 * Version: 0.2.3b
 * website: http://jarallax.com
 *
 * Copyright 2012, CodeHunger
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * http://jarallax.com/license.html
 * 
 * Date: 08 Aug 2012
 */

////////////////////////////////////////////////////////////////////////////////
// jarallax class //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var Jarallax = function (controller) {
  this.FPS = 24;
  this.FPS_INTERVAL = 1000 / this.FPS;
  this.FRAME_DATA_SAMPLE = 24;
  this.FRAME_DATA_REFRESH = 12;
  this.fpsTop = 0;
  this.fpsBottom = 1000;
  this.animations = [];
  this.defaultValues = [];
  this.progress = 0.0;
  this.prev_progress = 0.0;
  this.controllers = [];
  this.maxProgress = 1;
  this.timer = undefined;
  this.allowWeakProgress = true;
  this.frameRate = this.FPS;
  this.stepSize = 0;
  this.jumping = false;

  if (controller === undefined) {
    if($.browser.iDevice){
      this.controllers.push(new ControllerApple(false));
    } else if ($.browser.mozilla) {
      this.controllers.push(new ControllerScroll(false));
    } else {
      this.controllers.push(new ControllerScroll(true));
    }
  } else if (controller !== 'none') {
    if (controller.length) {
      this.controllers = controller;
    } else if (typeof (controller) === 'object') {
      this.controllers.push(controller);
    } else {
      throw new Error('wrong controller data type: "' +
                      typeof (controller) +
                      '". Expected "object" or "array"');
    }
  }

  for (var i in this.controllers) {
    this.controllers[i].activate(this);
  }

  this.frameChart = [];
  for(var j = 1; j <= 600; j++) {
    this.frameChart[j] = (1000 / j);
  }
};

////////////////////////////////////////////////////////////////////////////////
// Jarallax methods ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
Jarallax.prototype.setProgress = function (progress, isWeak) {
  if (progress > 1) {
    progress = 1;
  } else if (progress < 0) {
    progress = 0;
  }else{
    progress = Math.round(progress * 1000) / 1000;
  }

  if(this.progress != progress){
    this.progress = progress;
    if (this.allowWeakProgress || !weak) {
      this.previousTime = new Date();
      this.currentTime = new Date();
      var weak = isWeak || false;

      for (var defaultValue in this.defaultValues) {
        this.defaultValues[defaultValue].activate(this.progress);
      }

      for (var animation in this.animations) {
        this.animations[animation].activate(this.progress);
      }

      for (var controller in this.controllers) {
        this.controllers[controller].update(this.progress);
      }

      this.currentTime = new Date();
      this.stepSize = Math.max(this.currentTime - this.previousTime, this.stepSize);
    }
  }
};

Jarallax.prototype.clearAnimations = function() {
  this.animations = [];
};

Jarallax.prototype.clearDefaults = function() {
  this.defaultValues = [];
};

Jarallax.prototype.clearControllers = function() {
  this.controllers = [];
};

Jarallax.prototype.jumpToProgress = function (progress, time, fps) {
  if (!progress.indexOf) {
    progress = progress / this.maxProgress;
  } else if (progress.indexOf('%') != -1) {
    progress = parseFloat(progress) / 100;
  }

  if(progress == this.progress) {
    return false;
  }

  if (progress > 1) {
    progress = 1;
  } else if (progress < 0) {
    progress = 0;
  }

  this.smoothProperties = {};
  this.smoothProperties.timeStep = 1000 / fps;
  this.smoothProperties.steps = time / this.smoothProperties.timeStep;
  this.smoothProperties.currentStep = 0;

  this.smoothProperties.startProgress = this.progress;
  this.smoothProperties.diffProgress = progress - this.progress;
  this.smoothProperties.previousValue = this.progress;
  this.smooth();
  this.allowWeakProgress = false;

  return false;
};

Jarallax.prototype.smooth = function (externalScope) {
  var scope;
  if (!externalScope) {
    scope = this;
  } else {
    scope = externalScope;
  }

  scope.smoothProperties.currentStep++;
  clearTimeout(scope.timer);
  if (scope.smoothProperties.currentStep < scope.smoothProperties.steps) {
    var position = scope.smoothProperties.currentStep / scope.smoothProperties.steps;
    var newProgress = Jarallax.EASING.easeOut(position,
                                       scope.smoothProperties.startProgress,
                                       scope.smoothProperties.diffProgress,
                                       1,
                                       5);

    scope.jumping_allowed = true;
    scope.setProgress(newProgress);
    scope.jumping_allowed = false;
    scope.timer = window.setTimeout(function(){scope.smooth(scope);}, scope.smoothProperties.timeStep);
    scope.smoothProperties.previousValue = newProgress;
    scope.allowWeakProgress = false;
  } else {
    scope.jumping_allowed = true;
    scope.setProgress(scope.smoothProperties.startProgress + scope.smoothProperties.diffProgress);
    scope.jumping_allowed = false;
    scope.clearSmooth(scope);
  }
};

Jarallax.prototype.clearSmooth = function(scope){
  scope.allowWeakProgress = true;
  clearTimeout(scope.timer);
  delete scope.smoothProperties;
};

Jarallax.prototype.setDefault = function (selector, values) {
  if (!selector) {
    throw new Error('no selector defined.');
  }

  if (JarallaxTools.isValues(values))
  {
    var newDefault = new JarallaxObject(selector, values);
    newDefault.activate();
    this.defaultValues.push(newDefault);
  }
};

Jarallax.prototype.addStatic = function (selector, values) {
  if (!selector) {
    throw new Error('no selector defined.');
  }

  if (JarallaxTools.isValues(values))
  {
    var newDefault = new JarallaxStatic(selector, values[0], values[1]);
    this.defaultValues.push(newDefault);
  }
};

Jarallax.prototype.addCounter = function (properties) {
  this.animations.push(new JarallaxCounter(this, properties));
};

Jarallax.prototype.addController = function (controller, activate) {
  this.controllers.push(controller);

  if (activate) {
    controller.activate(this);
  }
};

Jarallax.prototype.addAnimation = function (selector, values, platforms, allMustBeTrue) {
  if (!platforms) {
    platforms = ['any'];
  } else if(platforms.substring) {
    platforms = [platforms];
  } else {
    platforms = platforms || [JarallaxTools.Platform.Any];
  }

  if (JarallaxTools.PlatformAllowed(platforms, allMustBeTrue)) {
    var newAnimation;

    if (!selector) {
      throw new Error('no selector defined.');
    }

    var returnValue = [];
    if (JarallaxTools.isValues(values)) {
      if (values.length) {
        for (var i = 0; i < values.length - 1; i++) {
          if (values[i] && values[i + 1])
          {
            if (values[i].progress && values[i + 1].progress) {
              if (values[i + 1].progress.indexOf('%') == -1) {
                if (this.maxProgress < values[i + 1].progress) {
                  this.maxProgress = values[i + 1].progress;
                }
              }
              newAnimation = new JarallaxAnimation(selector, values[i], values[i + 1], this);
              this.animations.push(newAnimation);
              returnValue.push(newAnimation);
            }
            else
            {
              throw new Error('no animation boundry found.');
            }
          }
          else
          {
            throw new Error('bad animation data.');
          }
        }
      } else {
        if (!values.progress) {
          values.progress = '100%';
        }
        var startValues = {};

        for (var j in values) {
          startValues[j] = $(selector).css(j);
        }

        startValues.progress = '0%';


        newAnimation = new JarallaxAnimation(selector, startValues, values, this);
        this.animations.push(newAnimation);
        returnValue.push(newAnimation);
      }
    }
    return returnValue;
  }
  return false;
};

Jarallax.prototype.cloneAnimation = function (selector, adittionalValues, animations) {
  if (!selector) {
    throw new Error('no selector defined.');
  }

  var newAnimations = [];
  var adittionalValuesArray = [];

  for (var i = 0; i < animations.length + 1; i++) {
    if (adittionalValues instanceof Array) {
      adittionalValuesArray.push(adittionalValues[i]);
    } else {
      adittionalValuesArray.push(adittionalValues);
    }
  }

  for (i = 0; i < animations.length; i++) {
    var currentAnimation = animations[i];
    var newStart = JarallaxTools.clone(currentAnimation.startValues);
    var newEnd = JarallaxTools.clone(currentAnimation.endValues);

    var adittionalValueStart = adittionalValuesArray[i];
    var adittionalValueEnd = adittionalValuesArray[i + 1];

    for (var j in newStart) {
      if (adittionalValueStart[j]) {
        newStart[j] = JarallaxTools.calculateNewValue(adittionalValueStart[j], newStart[j]);
      }
    }

    for (var k in newEnd) {
      if (adittionalValueEnd[k]) {
        newEnd[k] = JarallaxTools.calculateNewValue(adittionalValueEnd[k], newEnd[k]);
      }
    }

    newAnimations.push(this.addAnimation(selector, [newStart, newEnd])[0]);

  }
  return newAnimations;
};

////////////////////////////////////////////////////////////////////////////////
// Jarallax static methods /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
Jarallax.EASING = {
  'linear':function (currentTime, beginningValue, changeInValue, duration, power) {
    return currentTime / duration * changeInValue + beginningValue;
  },

  'easeOut':function (currentTime, beginningValue, changeInValue, duration, power) {
   if (power === undefined) {
    power = 2;
   }
   return ((Math.pow((duration - currentTime) / duration, power) * -1) + 1) * changeInValue + beginningValue;
  },
  'easeIn':function (currentTime, beginningValue, changeInValue, duration, power) {
   if (power === undefined) {
    power = 2;
   }
   return Math.pow(currentTime / duration, power) * changeInValue + beginningValue;
  },
  'easeInOut':function (currentTime, beginningValue, changeInValue, duration, power) {
   if (power === undefined) {
    power = 2;
   }
   changeInValue /= 2;
   currentTime *= 2;
   if (currentTime < duration) {
     return Math.pow(currentTime / duration, power) * changeInValue + beginningValue;
   } else {
     currentTime = currentTime - duration;
     return ((Math.pow((duration - currentTime) / duration, power) * -1) + 1) * changeInValue + beginningValue + changeInValue;
   }

   return Math.pow(currentTime / duration, power) * changeInValue + beginningValue;
  }
};

Jarallax.EASING.none = Jarallax.EASING.linear;

////////////////////////////////////////////////////////////////////////////////
// Jarallax tools //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
JarallaxTools = {};

JarallaxTools.hasNumbers = function(t) {
  var expr = new RegExp('\\d');
  return expr.test(t);
  
};

JarallaxTools.isValues = function(object) {
  if(!object) {
    throw new Error('no values set.');
  }
  
  if(typeof object != 'object') {
    throw new Error('wrong data type values. expected: "object", got: "' + 
        typeof object + '"');
  }
  
  if(object.size === 0) {
    throw new Error('Got an empty values object');
  }
  
  return true;
};

JarallaxTools.PlatformAllowed = function(platforms, allMustBeTrue, invert){
  allMustBeTrue = allMustBeTrue || false;
  invert = invert || false;
  for (var i = 0; i < platforms.length; i++) {
    if(platforms[i] == 'any'){
      return !invert;
    }
    if(jQuery.browser[platforms[i]]) {
      if(!allMustBeTrue) {
        return !invert;
      }
    } else if(allMustBeTrue) {
      return invert;
    }
  }
  
  return !invert ? allMustBeTrue : !allMustBeTrue;
};

JarallaxTools.calculateNewValue = function (modifier, original) {
  var result;
  var units = JarallaxTools.getUnits(original);
  if (modifier.indexOf('+') === 0) {
    result = String(parseFloat(original) + parseFloat(modifier) + units);
  } else if (modifier.indexOf('-') === 0) {
    result = String(parseFloat(original) + parseFloat(modifier) + units);
  } else if (modifier.indexOf('*') === 0) {
    result = String(parseFloat(original) * parseFloat(modifier.substr(1)) + units);
  } else if (modifier.indexOf('/') === 0) {
    result = String(parseFloat(original) / parseFloat(modifier.substr(1)) + units);
  } else {
    result = modifier;
  }
  
  if(original.indexOf){
    if(original.indexOf('%') > 0){
      return result + '%';
    }
  }
  return result;
};

JarallaxTools.getUnits = function (string) {
  return string.replace(/\d+/g, '');
};

JarallaxTools.clone = function (obj) {
  var newObj = {};
  for(var i in obj){
    newObj[i] = obj[i];
  }
  
  return newObj;
};

Position = function(x, y){
  this.x = x;
  this.y = y;
};

Position.prototype.add = function(value){
  return new Position(this.x + value.x,
                      this.y + value.y);
};

Position.prototype.subract = function(value){
  return new Position(this.x - value.x,
                      this.y - value.y);
};

////////////////////////////////////////////////////////////////////////////////
// Platforms ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

JarallaxTools.Platforms = ['webkit',
                           'opera',
                           'msie',
                           'mozilla',
                           'android',
                           'blackBerry',
                           'webOs',
                           'windowsPhone',
                           'iDevice',
                           'iPad',
                           'iPhone',
                           'iPod',
                           'msie',
                           'mobile',
                           'nonMobile'];

/*jQuery.browser.webkit
jQuery.browser.opera
jQuery.browser.msie
jQuery.browser.mozilla*/

/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 * jQuery.browser.mobile will be true if the browser is a mobile device
 **/
//(function(a){jQuery.browser.mobile=/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4));})(navigator.userAgent||navigator.vendor||window.opera);

jQuery.browser.android = /android/i.test(navigator.userAgent.toLowerCase());
jQuery.browser.blackBerry = /blackberry/i.test(navigator.userAgent.toLowerCase());
jQuery.browser.webOs = /webos/i.test(navigator.userAgent.toLowerCase());
jQuery.browser.windowsPhone = /windows phone/i.test(navigator.userAgent.toLowerCase());
jQuery.browser.iDevice = /ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase());
jQuery.browser.iPad = /ipad/i.test(navigator.userAgent.toLowerCase());
jQuery.browser.iPhone = /iphone/i.test(navigator.userAgent.toLowerCase());
jQuery.browser.iPod = /ipod/i.test(navigator.userAgent.toLowerCase());
jQuery.browser.mobile = jQuery.browser.android ||
                        jQuery.browser.blackBerry ||
                        jQuery.browser.webOs ||
                        jQuery.browser.windowsPhone ||
                        jQuery.browser.iDevice;
jQuery.browser.nonMobile = !jQuery.browser.mobile;


// This script sets OSName variable as follows:
// "Windows"    for all versions of Windows
// "MacOS"      for all versions of Macintosh OS
// "Linux"      for all versions of Linux
// "UNIX"       for all other UNIX flavors 
// "Unknown OS" indicates failure to detect the OS

jQuery.platform = {};
jQuery.platform.windows = navigator.appVersion.indexOf("Win")!=-1;
jQuery.platform.macOs = navigator.appVersion.indexOf("Mac")!=-1;
jQuery.platform.unix = navigator.appVersion.indexOf("X11")!=-1;
jQuery.platform.linux = navigator.appVersion.indexOf("Linux")!=-1;
jQuery.platform.unknown = !(jQuery.platform.windows ||
                            jQuery.platform.macOs || 
                            jQuery.platform.unix || 
                            jQuery.platform.linux);

////////////////////////////////////////////////////////////////////////////////
// Jarallax Controller base class //////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
JarallaxController = function() {
  this.isActive = false;
  this.bindings = [];
};


JarallaxController.prototype.activate = function(jarallax) {
  this.isActive = true;
  if (!this.jarallax || this.jarallax !== jarallax) {
    this.jarallax = jarallax;
  }
};

JarallaxController.prototype.deactivate = function(jarallax) {
  this.isActive = false;
};

JarallaxController.prototype.update = function(progress) {
  //do nothing
};

////////////////////////////////////////////////////////////////////////////////
// Jarallax counter class //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
JarallaxCounter = function(jarallax, properties) {
  if (!properties) {
    throw new Error('No properties defined.');
  } else if (!properties.selector) {
    throw new Error('No selector defined. properties.selector.');
  }
  
  this.jarallax = jarallax;
  this.selector = properties.selector;
  this.startNumber = properties.startNumber || 0;
  this.endNumber = properties.endNumber || 100;
  this.startProgress = properties.startProgress || '0%';
  this.endProgress = properties.endProgress || '100%';
  this.decimals = properties.decimals || 0;
  this.stepSize = properties.stepSize;
  
  if (this.decimals === 0 && this.stepSize < 1) {
    tmp = this.stepSize.toString().split('.');
    this.decimals = tmp[1].length;
  }
};

JarallaxCounter.prototype.activate = function() {
  var rawDiff = this.endNumber - this.startNumber;
  var rawNumber = rawDiff * this.jarallax.progress + this.startNumber;
  
  
  
  if (this.startProgress.indexOf('%') >= 0) {
    start = parseInt(this.startProgress,10) / 100;
  } else if (JarallaxTools.hasNumbers(this.startProgress)) {
    start = parseInt(this.startProgress,10) / this.jarallax.maxProgress;
  }
  
  if (this.endProgress.indexOf('%') >= 0) {
    end = parseInt(this.endProgress,10) / 100;
  } else if (JarallaxTools.hasNumbers(this.endProgress)) {
    end = parseInt(this.endProgress,10) / this.jarallax.maxProgress;
  }
  
  if (this.jarallax.progress < start) {
    $(this.selector).html(this.startNumber);
  } else if (this.jarallax.progress > end) {
    $(this.selector).html(this.endNumber);
  } else {
    var duration = end - start;
    var currentTime = (this.jarallax.progress-start);
    var changeInValue = this.endNumber - this.startNumber ;
    var result =  Jarallax.EASING.none(currentTime, this.startNumber , 
        changeInValue, duration);
    
    if (this.stepSize) {
      result = Math.round(result / this.stepSize) * this.stepSize;
    }
    
    if (this.decimals > 0) {
      result = result.toFixed(this.decimals);
    }
    
    $(this.selector).html(result);
  }
};

////////////////////////////////////////////////////////////////////////////////
// Jarallax object class ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

JarallaxObject = function (selector, values) {
  this.selector = selector;
  this.values = values;
};

JarallaxObject.prototype.activate = function (position) {
  for (var i in this.values) {
    $(this.selector).css(i ,this.values[i]);
  }
};

////////////////////////////////////////////////////////////////////////////////
// Jarallax animation class ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
JarallaxAnimation = function (selector, startValues, endValues, jarallax) {
  this.progress = -1;
  this.selector = selector;
  this.startValues = startValues;
  this.endValues = endValues;
  this.jarallax = jarallax;
};

JarallaxAnimation.prototype.activate = function (progress) {
  if (this.progress != progress) {
    var start;
    var end;
    var style;
    
    if (this.startValues.style === undefined) {
      style = {easing:'linear'};
    } else{
      style = this.startValues.style;
    }
    
    if (this.startValues.progress.indexOf('%') >= 0) {
      start = parseInt(this.startValues.progress,10) / 100;
    } else if (JarallaxTools.hasNumbers(this.startValues.progress)) {
      start = parseInt(this.startValues.progress,10) / this.jarallax.maxProgress;
    }
    
    if (this.endValues.progress.indexOf('%') >= 0)
    {
      end = parseInt(this.endValues.progress,10) / 100;
    } else if (JarallaxTools.hasNumbers(this.endValues.progress)) {
      end = parseInt(this.endValues.progress,10) / this.jarallax.maxProgress;
    }
    
    if (this.startValues.event) {
      this.dispatchEvent(this.progress, progress, start, end);
    }
    
    if (progress >= start && progress <= end ) {
      for(var i in this.startValues) {
        if (i !== 'progress' && i !== 'style' && i !== 'event') {
          if (undefined !== this.endValues[i] && i !== 'display' && i !== 'backgroundImage') {
            var units = JarallaxTools.getUnits(this.startValues[i]+'');
            units = units.replace('-','');
            var startValue = parseFloat(this.startValues[i]);
            var endValue = parseFloat(this.endValues[i]);
            
            var duration = end - start;
            var currentTime = (progress-start);
            var changeInValue = endValue - startValue ;
            var result =  Jarallax.EASING[style.easing](currentTime, 
                startValue , changeInValue, duration, style.power);
            
            if(units == 'px'){
              result = parseInt(result, 10);
            }
            
            if(units !== '.'){
              result+= units;
            }
            $(this.selector).css(i,result);
          } else {
            $(this.selector).css(i,this.startValues[i]);
          }
        }
      }
    }
    this.progress = progress;
  }
};

JarallaxAnimation.prototype.dispatchEvent = function(progress_old, progress_new, 
    start, end) {
  var events = this.startValues.event;
  var event_data = {};
  event_data.animation = this;
  event_data.selector = this.selector;
  
  if (progress_new >= start && progress_new <= end ) {
    if (events.start && progress_old < start) {
      event_data.type = 'start';
      events.start(event_data);
    }
    
    if (events.start && progress_old > end) {
      event_data.type = 'rewind';
      events.start(event_data);
    }
    
    if (events.animating) {
      event_data.type = 'animating';
      events.animating(event_data);
    } 
    
    if (events.forward && progress_old < progress_new) {
      event_data.type = 'forward';
      events.forward(event_data);
    }
    
    if (events.reverse && progress_old > progress_new) {
      event_data.type = 'reverse';
      events.reverse(event_data);
    }
    
  } else {
    if (events.complete && progress_old < end && progress_new > end) {
      event_data.type = 'complete';
      events.complete(event_data);
    }
    
    if (events.rewinded && progress_old > start && progress_new < start) {
      event_data.type = 'rewind';
      events.rewinded(event_data);
    }
  }
};

////////////////////////////////////////////////////////////////////////////////
// Apple mobile controller /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
ControllerApple = function(scrollPage) {
  if(scrollPage === undefined) {
    this.scrollPage = true;
  } else {
    this.scrollPage = scrollPage;
  }
  
  this.target = $('body');
  this.scrollPostion = new Position(0, 0);
};

ControllerApple.prototype = new JarallaxController();

ControllerApple.prototype.activate = function(jarallax) {
  
  JarallaxController.prototype.activate.call(this, jarallax);
  
  this.scrollSpace = $('body').height() - $(window).height();
  this.target.bind('touchmove', {scope: this}, this.onMove);
  this.target.bind('touchstart', {scope: this}, this.onTouch);
  
};

ControllerApple.prototype.deactivate = function(jarallax) {
  JarallaxController.prototype.deactivate.call(this, jarallax);
  this.target.unbind('touchmove');
  this.target.unbind('touchstart');
};

ControllerApple.prototype.onTouch = function(event) {
  var controller = event.data.scope;
  var targetEvent = event.originalEvent.touches.item(0);
  
  controller.startPosition = new Position(targetEvent.clientX, targetEvent.clientY);
  
  event.preventDefault();
};

ControllerApple.prototype.onMove = function(event) {
  var controller = event.data.scope;
  var targetEvent = event.originalEvent.touches.item(0);
  var tempPosition = new Position(targetEvent.clientX, targetEvent.clientY);
  var vector = tempPosition.subract(controller.startPosition);
  controller.startPosition = tempPosition;
  controller.scrollPostion = vector.add(controller.scrollPostion);
  
  controller.scrollPostion.y = Math.max(Math.min(controller.scrollPostion.y, 0),-controller.scrollSpace);
  controller.jarallax.setProgress(-controller.scrollPostion.y / controller.scrollSpace, false);
  $('body').scrollTop(controller.scrollSpace * controller.jarallax.progress);
  
  if (!controller.scrollPage) {
    event.preventDefault();
  }
};

ControllerApple.prototype.update = function(progress) {
  this.position.y = Math.round(progress * this.scrollSpace);
};

////////////////////////////////////////////////////////////////////////////////
// Mobile controller ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
ControllerMobile = function(disableDefault, height){
  this.disableDefault = disableDefault || false;
  this.y = 0;
  this.previousY = undefined;
  this.height = height;
};

ControllerMobile.prototype = new JarallaxController();

ControllerMobile.prototype.activate = function(jarallax){
  JarallaxController.prototype.activate.call(this, jarallax);
  
  if (!this.height) {
    this.height = this.height = parseInt($("body").css('height'),10);
    if (this.height ==  $(window).height) {
      this.height = parseInt($("#wrapper").css('height'),10);
    }
  }
  $('body').bind('touchmove', {scope: this}, this.onTouchMove);
  $('body').bind('touchend', {scope: this}, this.onTouchEnd);
  //TODO:
  //horizontal scrolling
  //flip_direction
};

ControllerMobile.prototype.onTouchEnd = function(event){
  this.previousY = undefined;
};

ControllerMobile.prototype.onTouchMove = function(event, manuel){
  if(this.isActive) {
    if (this.disableDefault) {
      event.preventDefault();
    }
    
    var scope = event.data.scope;
    var targetEvent = manuel ? event : event.originalEvent.touches.item(0);    
    
    if(scope.previousY === undefined) {
      scope.previousY = targetEvent.clientY;
    }
    else
    {
      scope.y += (targetEvent.clientY - scope.previousY);
      scope.y = scope.y < scope.height ? scope.y : scope.height;
      scope.y = scope.y > 0 ? scope.y : 0;
      scope.previousY = targetEvent.clientY;
      var poss = scope.y/scope.height;
      
      scope.jarallax.setProgress(scope.y/scope.height);
    }
  }
};


ControllerMobile.prototype.deactivate = function(jarallax){
  JarallaxController.prototype.deactivate.call(this, jarallax);
  $('body').unbind('touchmove');
};

ControllerMobile.prototype.update = function(progress){
  //empty
};


////////////////////////////////////////////////////////////////////////////////
// Scroll controller ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
ControllerScroll = function(smoothing, scrollSpace) {
  this.target = $(window);
  $(window).scrollTop(0);
  this.height = parseInt($("body").css('height'),10);
  this.scrollSpace = scrollSpace || this.height - this.target.height();

  if (this.scrollSpace < 10) {
    this.height = parseInt($("#wrapper").css('height'),10);
    this.scrollSpace = this.height - this.target.height();
  }

  this.smoothing = smoothing || false;

  this.targetProgress = 0;
};

ControllerScroll.prototype = new JarallaxController();

ControllerScroll.prototype.activate = function(jarallax) {
  JarallaxController.prototype.activate.call(this, jarallax);
  this.target.bind('scroll', {scope: this} , this.onScroll);
};

ControllerScroll.prototype.deactivate = function(jarallax) {
  JarallaxController.prototype.deactivate.call(this, jarallax);
  this.target.unbind('scroll');
};

ControllerScroll.prototype.onScroll = function(event) {
  var controller = event.data.scope;

  if(controller.jarallax.jumping){
    if(!controller.jarallax.jumping_allowed) {
      controller.jarallax.clearSmooth(controller.jarallax);
    }
  }

  if (controller.isActive) {
    var y = event.data.y || controller.target.scrollTop();
    var progress = y/controller.scrollSpace;

    if(!controller.smoothing){
      controller.jarallax.setProgress(progress, true);
    } else {
      controller.targetProgress = progress;
      controller.smooth();
    }
  }
};

ControllerScroll.prototype.smooth = function(externalScope) {
  var scope;
  if (!externalScope) {
    scope = this;
  } else {
    scope = externalScope;
  }

  var oldProgress = scope.jarallax.progress;

  var animationSpace =  scope.targetProgress - oldProgress;
  clearTimeout(scope.timer);

  if(animationSpace > 0.0001 || animationSpace < -0.0001){
    var newProgress = oldProgress + animationSpace / 5;

    scope.timer = window.setTimeout(function(){
        scope.smooth(scope);}, scope.jarallax.FPS_INTERVAL);
    scope.jarallax.setProgress(newProgress, true);
  }else{
    scope.jarallax.setProgress(scope.targetProgress, true);
  }
};

ControllerScroll.prototype.update = function(progress) {
  var scrollPosition = progress * this.scrollSpace;

  if(!this.jarallax.allowWeakProgress) {
    $(window).scrollTop(scrollPosition);
  }
};

////////////////////////////////////////////////////////////////////////////////
// onDrag controller /////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
ControllerDrag = function(selector, start, end){
  this.object = $(selector);
  this.start = start;
  this.end = end;
  this.container = "";
  this.width = 0;
  
  this.startX = 0;
  this.startY = 0;
};

ControllerDrag.prototype = new JarallaxController();

ControllerDrag.prototype.activate = function(jarallax){
  JarallaxController.prototype.activate.call(this, jarallax);
  this.container = "#scrollbar";
  this.object.draggable({containment:this.container, axis: 'x'});
  this.object.bind("drag", {scope: this}, this.onDrag);
  this.container = $(this.container);
  this.width = $(this.container).innerWidth() - this.object.outerWidth();
};


ControllerDrag.prototype.onDrag = function(event){
  var controller = event.data.scope;
  
  if (controller.isActive) {
    var x = parseInt($(this).css('left'), 10);
    var position = (x / event.data.scope.width);
    event.data.scope.jarallax.setProgress(position);
  }
};

ControllerDrag.prototype.deactivate = function(jarallax){
  JarallaxController.prototype.deactivate.call(this, jarallax);
  this.object.unbind('drag');
  this.object.draggable('destroy');
};

ControllerDrag.prototype.update = function(progress){
  this.object.css('left', progress * this.width);
};

////////////////////////////////////////////////////////////////////////////////
// Keyboard controller /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
ControllerKeyboard = function(keys, preventDefault, repetitiveInput) {
  this.repetitiveInput = repetitiveInput;
  this.preventDefault = preventDefault || false;
  this.keys = keys || {38:-0.01, 40:0.01};
  this.keysState = {};
};

ControllerKeyboard.prototype = new JarallaxController();

ControllerKeyboard.prototype.activate = function(jarallax) {
  JarallaxController.prototype.activate.call(this, jarallax);
  $(document.documentElement).keydown({scope: this}, this.keyDown);
  $(document.documentElement).keyup({scope: this}, this.keyUp);
  
  for(var key in this.keys){
    this.keysState[key] = false;
  }
};

ControllerKeyboard.prototype.deactivate = function(jarallax) {
  JarallaxController.prototype.deactivate.call(this, jarallax);
};

ControllerKeyboard.prototype.keyDown = function(event) {
  var controller = event.data.scope;
  
  if (controller.isActive) {
    for(var key in controller.keys) {
      if(key == event.keyCode) {
        if(controller.keysState[key] !== true || controller.repetitiveInput) {
          controller.jarallax.setProgress(controller.jarallax.progress + controller.keys[key]);
        }
        controller.keysState[key] = true;
        if(controller.preventDefault) {
          event.preventDefault(); 
        }
      }
    }
  }
};

ControllerKeyboard.prototype.keyUp = function(event) {
  if (this.isActive) {
    var controller = event.data.scope;
    for(var key in controller.keys) {
      if(key == event.keyCode) {
        controller.keysState[key] = false;
      }
    }
  }
};

ControllerKeyboard.prototype.update = function(progress) {
  //empty
};

////////////////////////////////////////////////////////////////////////////////
// Time controller /////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
ControllerTime = function(speed, interval, type) {
  this.interval = interval;
  this.speed = speed;
  this.playForward = true;
  this.type = type || ControllerTime.TYPES.NORMAL;
};

ControllerTime.prototype = new JarallaxController();


ControllerTime.prototype.activate = function(jarallax) {
  JarallaxController.prototype.activate.call(this, jarallax);
  this.progress = 0;
  this.timer = setInterval(this.onInterval.bind(this, {scope: this}), this.interval);
};

ControllerTime.prototype.deactivate = function(jarallax) {
  JarallaxController.prototype.deactivate.call(this, jarallax);
  clearInterval(this.timer);
};


ControllerTime.prototype.onInterval = function(event) {
  var scope = event.scope;
  if (this.isActive) {
    if(this.playForward) {
      this.progress+= this.speed;
    }else{
      this.progress-= this.speed;
    }
    
    if(this.progress >= 1) {
      switch(this.type) {
        case ControllerTime.TYPES.NORMAL:
          this.progress = 1;
          this.deactivate(this.jarallax);
          break;
        case ControllerTime.TYPES.LOOP:
          this.progress = 0;
          break;
        case ControllerTime.TYPES.BOUNCE:
          this.progress = 1 - this.speed;
          this.playForward = false;
          break;
      }
    } else if(this.progress <= 0) {
      this.progress = 0 + this.speed;
      this.playForward = true;
    }
    this.jarallax.setProgress(this.progress);
  }
};

ControllerTime.TYPES = {NORMAL: 0,
                        LOOP: 1,
                        BOUNCE: 2};

ControllerTime.prototype.update = function(progress) {
  this.progress = progress;
};

////////////////////////////////////////////////////////////////////////////////
// Mousewheel controller ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
ControllerMousewheel = function(sensitivity, preventDefault){
  this.sensitivity = -sensitivity;
  this.preventDefault = preventDefault || false;
};


ControllerMousewheel.prototype = new JarallaxController();

ControllerMousewheel.prototype.activate = function(jarallax){
  JarallaxController.prototype.activate.call(this, jarallax);
  $('body').bind('mousewheel', {scope: this} , this.onScroll);
};

ControllerMousewheel.prototype.deactivate = function(jarallax){
  $('body').unbind('mousewheel');
  JarallaxController.prototype.deactivate(this, jarallax);
};

ControllerMousewheel.prototype.onScroll = function(event, delta){
  var controller = event.data.scope;
  
  if (controller.isActive) {
    controller.jarallax.setProgress(controller.jarallax.progress + controller.sensitivity * delta);
    if(controller.preventDefault){
      event.preventDefault(); 
    }
  }
};

ControllerMousewheel.prototype.update = function(progress){
  //empty
};