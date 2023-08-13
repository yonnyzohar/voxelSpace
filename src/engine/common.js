
var Util = {

  degFromRot: function (p_rotInput) {
    var degOutput = p_rotInput;
    while (degOutput >= 360) {
      degOutput -= 360;
    }
    while (degOutput < 0) {
      degOutput += 360;
    }
    return degOutput;
  },
  
  radRotationFromRad : function (radAngle){
    while(radAngle < 0)
    {
      radAngle += Math.PI*2;
    }
    while(radAngle > Math.PI*2)
    {
      radAngle -= Math.PI*2;
    }
    return radAngle;
  },

  rotFromDeg :  function (p_degInput) {
    var rotOutput = p_degInput;
    while (rotOutput > 180) {
      rotOutput -= 360;
    }
    while (rotOutput < -180) {
      rotOutput += 360;
    }
    return rotOutput;
  },

  degFromRad : function (p_radInput) {
    var degOutput = (180 / Math.PI) * p_radInput;
    return degOutput;
  },

  radFromDeg :  function (p_degInput) {
    var radOutput = (Math.PI / 180) * p_degInput;
    return radOutput;
  },

  rotFromRad :  function (p_radInput) {
    return rotFromDeg(degFromRad(p_radInput));
  },

  radFromRot :  function (p_rotInput) {
    return radFromDeg(degFromRot(p_rotInput));
  },

  distanceTwoPoints :  function (x1, x2, y1, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  },



    timestamp:        function()                  { return new Date().getTime();                                    },
    toInt:            function(obj, def)          { if (obj !== null) { var x = parseInt(obj, 10); if (!isNaN(x)) return x; } return Util.toInt(def, 0); },
    toFloat:          function(obj, def)          { if (obj !== null) { var x = parseFloat(obj);   if (!isNaN(x)) return x; } return Util.toFloat(def, 0.0); },
    limit:            function(value, min, max)   { return Math.max(min, Math.min(value, max));                     },
    randomInt:        function(min, max)          { return Math.round(Util.interpolate(min, max, Math.random()));   },
    randomChoice:     function(options)           { return options[Util.randomInt(0, options.length-1)];            },
    percentRemaining: function(n, total)          { return (n%total)/total;                                         },
    interpolate:      function(a,b,percent)       { return a + (b-a)*percent                                        },
    easeIn:           function(a,b,percent)       { return a + (b-a)*Math.pow(percent,2);                           },
    easeOut:          function(a,b,percent)       { return a + (b-a)*(1-Math.pow(1-percent,2));                     },
    easeInOut:        function(a,b,percent)       { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5);        },
    exponentialFog:   function(distance, density) { return 1 / (Math.pow(Math.E, (distance * distance * density))); },
  
    getAngle:function(p1X, p1Y, p2X, p2Y) {
			var dX = p1X - p2X;
			var dY = p1Y - p2Y;
			return Math.atan2(dY, dX);
		},
  
    project: function(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
      p.camera.x     = (p.world.x || 0) - cameraX;
      p.camera.y     = (p.world.y || 0) - cameraY;
      p.camera.z     = (p.world.z || 0) - cameraZ;
      p.screen.scale = cameraDepth/p.camera.z;
      p.screen.x     = Math.round((width/2)  + (p.screen.scale * p.camera.x  * width/2));
      p.screen.y     = Math.round((height/2) - (p.screen.scale * p.camera.y  * height/2));
      p.screen.w     = Math.round(             (p.screen.scale * roadWidth   * width/2));
    }

  }
  
  //=========================================================================
  // POLYFILL for requestAnimationFrame
  //=========================================================================
  
  if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                   window.mozRequestAnimationFrame    || 
                                   window.oRequestAnimationFrame      || 
                                   window.msRequestAnimationFrame     || 
                                   function(callback, element) {
                                     window.setTimeout(callback, 1000 / 60);
                                   }
  }

  var print = console.log;