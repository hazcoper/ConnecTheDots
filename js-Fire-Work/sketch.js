// Particle System Simulation
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/syR0klfncCk
// https://thecodingtrain.com/learning/nature-of-code/4.1-particle-system-simulation.html
// https://editor.p5js.org/codingtrain/sketches/QRzgzQLnQ

let missiles = [];
let force = 0;
let myColor;

document.addEventListener("visibilitychange", function() {
  if (document.hidden){
    for(let index = 0; index < missiles.length; index++){
      missiles[index].stopSounds()  
    }
  } else {
      console.log("Browser tab is visible")
  }
});

//prevent certain moves on mobile
document.ontouchmove = function(event) {
  event.preventDefault();
};

function setup() {
  createCanvas(displayWidth, displayHeight);
  background(0);
  myColor = new Colors(100);
}

function sendRocket(x, y){
  missiles.push(new Missle(x,y, force, myColor.getPallete()));
  force = 0;   // reset the force
}

function automaticRocket(){
  var prob = Math.random();

  if (prob > 0.94){
    console.log("sending rocket");
    sendRocket(Math.floor(Math.random()*700) ,700);
  }
}

function mouseClicked(event) {
  // console.log(event);
  sendRocket(mouseX, mouseY);
  // fullscreen(1);
}

function draw() {
  background(0, 30);
  
  // automaticRocket();

  for(let index = 0; index < missiles.length; index++){
    missiles[index].makeMove()
    if(missiles[index].show() == 1){
      missiles.splice(index, 1);
    }

  }
  
  
  if(mouseIsPressed){
    force = force + 0.1;
  }


  
}
