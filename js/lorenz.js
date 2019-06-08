/* We will implement two Lorenz systems
https://en.wikipedia.org/wiki/Lorenz_system
The beauty of this type of system is that it is "chaotic".
That is even if the two trajectories start out very close to each other,
they will diverge over time.
==> Small perturbation in initial conditions has great effect on the path!
*/

var rho = 28, // constants of the system
    sigma = 10,
    beta = 8/3,
    dt = 0.015; // time scale

// for animation
var interval = 1,
    scale = 20,
    rotateBy = -30
    cx = 250, // center
    cy = 330
    n_steps = 500;



// credit: https://css-tricks.com/snippets/javascript/lighten-darken-color/
function LightenDarkenColor(col, amt) {
    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

function getRadianAngle(degreeValue) {
    return degreeValue * Math.PI / 180;
}

function calculateDerivative(cur_x, cur_y, cur_z){
    var dx = dt * sigma * (cur_y - cur_x),
        dy = dt * (cur_x * (rho-cur_z) - cur_y),
        dz = dt * (cur_x * cur_y - beta * cur_z);

    return [dx, dy, dz];
}

function lorenzSystem(system1, system2){
    // initial coordinates (x, y, z) of the first system
    var x1 = system1[0],
        x2 = system1[1],
        x3 = system1[2];
    // initial coordinates of the second system
    var y1 = system2[0],
        y2 = system2[1],
        y3 = system2[2];



    // counters
    var i = 0;

    // for lighten/ darken color
    var min=-30,
        max=-20;



    context.rotate(getRadianAngle(rotateBy));


    // animation
    var interval = setInterval(function() {
      if (i < n_steps) {
        for (var k = 0; k < interval; k += 1) {
            setTimeout(function(){

          var derivative1 = calculateDerivative(x1, x2, x3),
              derivative2 = calculateDerivative(y1, y2, y3);


          x1_next = x1 + derivative1[0];
          x2_next = x2 + derivative1[1];
          x3_next = x3 + derivative1[2];

          y1_next = y1 + derivative2[0];
          y2_next = y2 + derivative2[1];
          y3_next = y3 + derivative2[2];



        var random = Math.random() * (+max - +min) + +min;
        var color = LightenDarkenColor("#FFA500", random);
        context.strokeStyle = color;


         // draw system 1
         context.beginPath();
         context.moveTo(cx + x1 * scale, cy + x2 * scale);
         context.lineTo(cx + x1_next * scale, cy + x2_next * scale);
         context.stroke();


          var color = LightenDarkenColor("#33cc33", random);
          context.strokeStyle = color;

          // draw system 2
          context.beginPath();
          context.moveTo(cx + y1 * scale, cy + y2 * scale);
          context.lineTo(cx + y1_next * scale, cy + y2_next * scale);
          context.stroke();


          // update current positions
          x1 = x1_next;
          x2 = x2_next;
          x3 = x3_next;

          y1 = y1_next;
          y2 = y2_next;
          y3 = y3_next;

          i += 1;
      }, 1000* k);
        }
      } else {
        clearInterval(interval);
      }
    }, 1);


}


var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

var system1 = [0, 1, 10]
    system2 = [2, 0.9, 11];

lorenzSystem(system1, system2);
