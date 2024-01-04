const B_CHILD = {
    fill: { "#ffffff": "#ef1cec" },
    delay: "rand(300, 359)",
    duration: 700,
    pathScale: "rand(0.8, 1)",
    isSwirl: true,
    swirlSize: "stagger(-2,2)",
    swirlFrequency: 1 };
  
  const B_OPTS = {
    count: "rand(15,20)",
    top: "100%",
    children: {
      ...B_CHILD } };
  
  window.addEventListener("resize", resizeCanvas, false);
        window.addEventListener("DOMContentLoaded", onLoad, false);
        
        window.requestAnimationFrame = 
            window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     ||  
            function (callback) {
                window.setTimeout(callback, 1000/60);
            };
        
        var canvas, ctx, w, h, particles = [], probability = 0.04,
            xPoint, yPoint;
        
        
        
        
        
        function onLoad() {
            canvas = document.getElementById("canvas");
            ctx = canvas.getContext("2d");
            resizeCanvas();
            
            window.requestAnimationFrame(updateWorld);
        } 
        
        function resizeCanvas() {
            if (!!canvas) {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            }
        } 
        
        function updateWorld() {
            update();
            paint();
            window.requestAnimationFrame(updateWorld);
        } 
        
        function update() {
            if (particles.length < 500 && Math.random() < probability) {
                createFirework();
            }
            var alive = [];
            for (var i=0; i<particles.length; i++) {
                if (particles[i].move()) {
                    alive.push(particles[i]);
                }
            }
            particles = alive;
        } 
        window.requestAnimFrame = ( function() {
          return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function( callback ) {
                  window.setTimeout( callback, 1000 / 60 );
                };
        })();
        
        // now we will setup our basic variables for the demo
        var canvas = document.getElementById( 'canvas' ),
            ctx = canvas.getContext( '2d' ),
            // full screen dimensions
            cw = window.innerWidth,
            ch = window.innerHeight,
            // firework collection
            fireworks = [],
            // particle collection
            particles = [],
            // starting hue
            hue = 120,
            // when launching fireworks with a click, too many get launched at once without a limiter, one launch per 5 loop ticks
            limiterTotal = 20,
            limiterTick = 0,
            // this will time the auto launches of fireworks, one launch per 80 loop ticks
            timerTotal = 500,
            timerTick = 0,
            mousedown = false,
            // mouse x coordinate,
            mx,
            // mouse y coordinate
            my;
        
            
        // set canvas dimensions
        canvas.width = cw;
        canvas.height = ch;
        
        // now we are going to setup our function placeholders for the entire demo
        
        // get a random number within a range
        function random( min, max ) {
          return Math.random() * ( max - min ) + min;
        }
        
        // calculate the distance between two points
        function calculateDistance( p1x, p1y, p2x, p2y ) {
          var xDistance = p1x - p2x,
              yDistance = p1y - p2y;
          return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
        }
        
        // create firework
        function Firework( sx, sy, tx, ty ) {
          // actual coordinates
          this.x = sx;
          this.y = sy;
          // starting coordinates
          this.sx = sx;
          this.sy = sy;
          // target coordinates
          this.tx = tx;
          this.ty = ty;
          // distance from starting point to target
          this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
          this.distanceTraveled = 0;
          // track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
          this.coordinates = [];
          this.coordinateCount = 3;
          // populate initial coordinate collection with the current coordinates
          while( this.coordinateCount-- ) {
            this.coordinates.push( [ this.x, this.y ] );
          }
          this.angle = Math.atan2( ty - sy, tx - sx );
          this.speed = 2;
          this.acceleration = 1.05;
          this.brightness = random( 50, 70 );
          // circle target indicator radius
          this.targetRadius = 1;
        }
        
        // update firework
        Firework.prototype.update = function( index ) {
          // remove last item in coordinates array
          this.coordinates.pop();
          // add current coordinates to the start of the array
          this.coordinates.unshift( [ this.x, this.y ] );
          
          // cycle the circle target indicator radius
          if( this.targetRadius < 8 ) {
            this.targetRadius += 0.3;
          } else {
            this.targetRadius = 1;
          }
          
          // speed up the firework
          this.speed *= this.acceleration;
          
          // get the current velocities based on angle and speed
          var vx = Math.cos( this.angle ) * this.speed,
              vy = Math.sin( this.angle ) * this.speed;
          // how far will the firework have traveled with velocities applied?
          this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );
          
          // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
          if( this.distanceTraveled >= this.distanceToTarget ) {
            createParticles( this.tx, this.ty );
            // remove the firework, use the index passed into the update function to determine which to remove
            fireworks.splice( index, 1 );
          } else {
            // target not reached, keep traveling
            this.x += vx;
            this.y += vy;
          }
        }
        
        // draw firework
        Firework.prototype.draw = function() {
          ctx.beginPath();
          // move to the last tracked coordinate in the set, then draw a line to the current x and y
          ctx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
          ctx.lineTo( this.x, this.y );
          ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
          ctx.stroke();
          
          ctx.beginPath();
          // draw the target for this firework with a pulsing circle
          //ctx.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
          ctx.stroke();
        }
        
        // create particle
        function Particle( x, y ) {
          this.x = x;
          this.y = y;
          // track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
          this.coordinates = [];
          this.coordinateCount = 5;
        
          while( this.coordinateCount-- ) {
            this.coordinates.push( [ this.x, this.y ] );
          }
          // set a random angle in all possible directions, in radians
          this.angle = random( 0, Math.PI * 2 );
          this.speed = random( 1, 10 );
          // friction will slow the particle down
          this.friction = 0.95;
          // gravity will be applied and pull the particle down
          this.gravity = 0.6;
          // set the hue to a random number +-20 of the overall hue variable
          this.hue = random( hue - 20, hue + 20 );
          this.brightness = random( 50, 80 );
          this.alpha = 1;
          // set how fast the particle fades out
          this.decay = random( 0.0075, 0.009 );
        }
        
        // update particle
        Particle.prototype.update = function( index ) {
          // remove last item in coordinates array
          this.coordinates.pop();
          // add current coordinates to the start of the array
          this.coordinates.unshift( [ this.x, this.y ] );
          // slow down the particle
          this.speed *= this.friction;
          // apply velocity
          this.x += Math.cos( this.angle ) * this.speed;
          this.y += Math.sin( this.angle ) * this.speed + this.gravity;
          // fade out the particle
          this.alpha -= this.decay;
          
          // remove the particle once the alpha is low enough, based on the passed in index
          if( this.alpha <= this.decay ) {
            particles.splice( index, 1 );
          }
        }
        
        // draw particle
        Particle.prototype.draw = function() {
          ctx. beginPath();
          // move to the last tracked coordinates in the set, then draw a line to the current x and y
          ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
          ctx.lineTo( this.x, this.y );
          ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
        
          ctx.stroke();
        }
        
        // create particle group/explosion
        function createParticles( x, y ) {
          // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
          var particleCount = 20;
          while( particleCount-- ) {
            particles.push( new Particle( x, y ) );
          }
        }
        
        
        // main demo loop
        function loop() {
          // this function will run endlessly with requestAnimationFrame
          requestAnimFrame( loop );
          
          // increase the hue to get different colored fireworks over time
          hue += 0.5;
          
          // normally, clearRect() would be used to clear the canvas
          // we want to create a trailing effect though
          // setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
          ctx.globalCompositeOperation = 'destination-out';
          // decrease the alpha property to create more prominent trails
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect( 0, 0, cw, ch );
          // change the composite operation back to our main mode
          // lighter creates bright highlight points as the fireworks and particles overlap each other
          ctx.globalCompositeOperation = 'lighter';
          
          // loop over each firework, draw it, update it
          var i = fireworks.length;
          while( i-- ) {
            fireworks[ i ].draw();
            fireworks[ i ].update( i );
          }
          
          // loop over each particle, draw it, update it
          var i = particles.length;
          while( i-- ) {
            particles[ i ].draw();
            particles[ i ].update( i );
        
          }
        
          
          // launch fireworks automatically to random coordinates, when the mouse isn't down
          if( timerTick >= timerTotal ) {
            timerTick = 0;
          } else {
            var temp = timerTick % 400;
            if(temp <= 15){   
              fireworks.push( new Firework( 100, ch, random( 190, 200 ), random(90, 100) ));
              fireworks.push( new Firework( cw - 100, ch, random(cw - 200, cw - 190), random(90, 100) ));
            }
        
            var temp3 = temp / 10;
        
            if(temp > 319){
              fireworks.push(new Firework(300 + (temp3 - 31 ) * 100 , ch, 300 + (temp3 - 31) * 100 , 200));
            }
        
            timerTick++;
          }
          
          // limit the rate at which fireworks get launched when mouse is down
          if( limiterTick >= limiterTotal ) {
            if( mousedown ) {
              // start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
              fireworks.push( new Firework( cw / 2, ch, mx, my ) );
              limiterTick = 0;
            }
          } else {
            limiterTick++;
          }
        }
        
        // mouse event bindings
        // update the mouse coordinates on mousemove
        canvas.addEventListener( 'mousemove', function( e ) {
          mx = e.pageX - canvas.offsetLeft;
          my = e.pageY - canvas.offsetTop;
        });
        
        // toggle mousedown state and prevent canvas from being selected
        canvas.addEventListener( 'mousedown', function( e ) {
          e.preventDefault();
          mousedown = true;
        });
        
        canvas.addEventListener( 'mouseup', function( e ) {
          e.preventDefault();
          mousedown = false;
        });
        
        // once the window loads, we are ready for some fireworks!
        window.onload = loop;
        function paint() {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';
            for (var i=0; i<particles.length; i++) {
                particles[i].draw(ctx);
            }
        } 
        
        function createFirework() {
            xPoint = Math.random()*(w-200)+100;
            yPoint = Math.random()*(h-200)+100;
            var nFire = Math.random()*50+100;
            var c = "rgb("+(~~(Math.random()*200+55))+","
                 +(~~(Math.random()*200+55))+","+(~~(Math.random()*200+55))+")";
            for (var i=0; i<nFire; i++) {
                var particle = new Particle();
                particle.color = c;
                var vy = Math.sqrt(25-particle.vx*particle.vx);
                if (Math.abs(particle.vy) > vy) {
                    particle.vy = particle.vy>0 ? vy: -vy;
                }
                particles.push(particle);
            }
        } 
        
        function Particle() {
            this.w = this.h = Math.random()*4+1;
            
            this.x = xPoint-this.w/2;
            this.y = yPoint-this.h/2;
            
            this.vx = (Math.random()-0.5)*10;
            this.vy = (Math.random()-0.5)*10;
            
            this.alpha = Math.random()*.5+.5;
            
            this.color;
        } 
        
        Particle.prototype = {
            gravity: 0.05,
            move: function () {
                this.x += this.vx;
                this.vy += this.gravity;
                this.y += this.vy;
                this.alpha -= 0.01;
                if (this.x <= -this.w || this.x >= screen.width ||
                    this.y >= screen.height ||
                    this.alpha <= 0) {
                        return false;
                }
                return true;
            },
            draw: function (c) {
                c.save();
                c.beginPath();
                
                c.translate(this.x+this.w/2, this.y+this.h/2);
                c.arc(0, 0, this.w, 0, Math.PI*2);
                c.fillStyle = this.color;
                c.globalAlpha = this.alpha;
                
                c.closePath();
                c.fill();
                c.restore();
            }
        }
  const burst1 = new mojs.Burst({
    ...B_OPTS,
    radius: { 0: "rand(150,170)" },
    x: -45,
    y: -335 });
  
  
  const burst1_2 = new mojs.Burst({
    ...B_OPTS,
    radius: { 0: "rand(150,170)" },
    x: -45,
    y: -335,
    children: {
      ...B_CHILD,
      delay: "rand(260, 350)",
      pathScale: "rand(0.7, 0.8)",
      degreeShift: 20 } });
  
  
  
  const burst2 = new mojs.Burst({
    ...B_OPTS,
    radius: { 0: "rand(100,150)" },
    x: 140,
    y: -315,
    children: {
      ...B_CHILD,
      fill: { "#ffffff": "#d8ff00" } } });
  
  
  
  const burst2_2 = new mojs.Burst({
    ...B_OPTS,
    radius: { 0: "rand(100,150)" },
    x: 140,
    y: -315,
    children: {
      ...B_CHILD,
      fill: { "#ffffff": "#d8ff00" },
      delay: "rand(260, 350)",
      pathScale: "rand(0.7, 0.8)",
      degreeShift: 20 } });
  
  
  
  
  const burst_tune = new mojs.Burst({
    ...B_OPTS,
    radius: { 0: "rand(100,150)" },
    left: 0,
    top: 0,
    x: 0,
    y: 0,
    children: {
      ...B_CHILD,
      delay: "rand(0, 50)",
      fill: { "#ffffff": "#d8ff00" } } });
  
  
  const burst_tune_2 = new mojs.Burst({
    ...B_OPTS,
    radius: { 0: "rand(100,150)" },
    left: 0,
    top: 0,
    children: {
      ...B_CHILD,
      fill: { "#ffffff": "#d8ff00" },
      delay: "rand(10, 150)",
      pathScale: "rand(0.7, 0.8)",
      degreeShift: 20 } });
  
  
  document.addEventListener("click", function (e) {
    burst_tune.generate().tune({ x: e.pageX, y: e.pageY }).replay();
    burst_tune_2.generate().tune({ x: e.pageX, y: e.pageY }).replay();
  });
  
  
  const FW_OPTS = {
    shape: "curve",
    fill: "none",
    isShowStart: false,
    strokeWidth: { 3: 0 },
    stroke: "#ffffff",
    strokeDasharray: "100%",
    strokeDashoffset: { "-100%": "100%" },
    duration: 1000 };
  
  const fw1 = new mojs.Shape({
    ...FW_OPTS,
    radius: 170,
    radiusY: 20,
    top: "100%",
    y: -165,
    angle: 75,
    onStart: function () {
      burst1.replay(0);
      burst1_2.replay(0);
    } });
  
  
  const fw2 = new mojs.Shape({
    ...FW_OPTS,
    radius: 180,
    radiusY: 50,
    top: "100%",
    x: 50,
    y: -155,
    strokeDashoffset: { "100%": "-100%" },
    angle: -60,
    delay: 200,
    onStart: function () {
      burst2.replay(0);
      burst2_2.replay(0);
    } });
  
  
  
  const underline = new mojs.Shape({
    parent: document.getElementById("title"),
    shape: "curve",
    strokeLinecap: "round",
    fill: "none",
    isShowStart: false,
    strokeWidth: { "1em": "5em" },
    stroke: "#ffffff",
    strokeDasharray: "200%",
    strokeDashoffset: { "200%": "100%" },
    radius: 150,
    radiusY: 10,
    y: "1.1em",
    angle: -10,
    duration: 2000,
    delay: 1000 }).
  then({
    strokeWidth: { "5em": "1em" },
    strokeDashoffset: { "100%": "-200%" },
    duration: 2000,
    delay: 10000 });
  
  const timelineText = new mojs.Timeline({
    repeat: 2018 }).
  
  add(underline).
  play();
  
  // Fire off the explosions
  const timeline = new mojs.Timeline({
    repeat: 2018 }).
  
  add([fw1, fw2]).
  play();
