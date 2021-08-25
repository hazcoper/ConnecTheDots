//check in add connected if it is a valid connection and throw an error if not (?)


class Dot{

    constructor(posX, posY, index, dotSize, dotQuant){
        this.pos = createVector(posX,posY);
        this.size = dotSize;        //this should be passed by the main to game to dots to here
        this.index = index;
        this.dotQuant = dotQuant;

        this.selectedColor = [255, 255, 0];
        this.closestColor = [0, 150, 150];
        this.normalColor = [255,255,255];

        this.connected = []


    }


    addConnected(index){
        if(this.connected.length < 4){
            this.connected.push(index);
        }else{
            console.log("The length something is wrong");
        }
    }

    draw(value){
        //value == 0  --> normal color, nothing special
        //value == 1  --> closest color, i am the one closest to the mouse
        //value == 2  --> selected color, i have been selected
        push();

        if(this.isFull()){
            fill(255);
        }else{
            fill(value);
        }

        noStroke();
        circle(this.pos.x, this.pos.y, this.size);
        
        pop();
    }


    isFull(){
        
        if(this.isCorner() == true){
            if(this.isEdge()){
                return this.connected.length > 1;
            }
            return this.connected.length > 2;
        }

        return this.connected.length > 3;
    }

    isEdge(){
        if(this.index == 0 || this.index == this.dotQuant - 1 || this.index == (this.dotQuant - 1) * this.dotQuant || this.index == (this.dotQuant * this.dotQuant) - 1){
            return true;
        }
    }

    isCorner(){
        //need to verify as well if it is not one of the corner points
        //coner points will always be from 0 - dotQuant - 1 | (dotQuant - 1) * dotQaunt | all multiples of dotQuant and - 1
        //the way that I am doing it only works if the map is a square
        //  if not a square, the way i check the side lines with multiples will not work


        if(this.index >= 0 && this.index <= this.dotQuant - 1){ //top line
            return true;
        }
        else if(this.index >= (this.dotQuant - 1) * this.dotQuant){ //bottom line, dont need upper limit because after this there are no more points
            return true;

        }
        else if(this.index % this.dotQuant == 0 || (this.index + 1) % this.dotQuant == 0){
            return true;
        }
        
        return false;
    }
}



// class Particle {

//   constructor(x, y, force, colorPallet) {
//     this.pos = createVector(x, y);
//     this.vel = p5.Vector.random2D();
//     this.vel.mult(random(0.5, 2) + round(force/6));

//     this.acc = createVector(0, 0);
//     this.r = 2;
//     this.lifetime = 255;
//     this.force = force;
//     this.colorPallet = colorPallet;
    
    
//     // this.red = random(190, 201);
//     // this.green = random(20, 40);
//     // this.blue = random(0, 10);
    
//   }



//   finished() {
//     return this.lifetime < 0;
//   }

//   applyForce(force) {
//     this.acc.add(force);
//   }

//   edges() {
//     if (this.pos.y >= height - this.r) {
//       this.pos.y = height - this.r;
//       this.vel.y *= -1;
//     }

//     if (this.pos.x >= width - this.r) {
//       this.pos.x = width - this.r;
//       this.vel.x *= -1;
//     } else if (this.pos.x <= this.r) {
//       this.pos.x = this.r;
//       this.vel.x *= -1;
//     }
//   }

//   update() {
//     this.vel.add(this.acc);
//     this.pos.add(this.vel);
//     this.acc.set(0, 0);

//     this.lifetime -= round(5 - this.force/7);
    
//   }

//   show() {

//     // stroke(this.red, this.green, this.blue, this.lifetime);
//     strokeWeight(0);
//     //generate a color mutation 
//     this.colorPallet.getColor();
    
//     fill(this.colorPallet.mutation[0], this.colorPallet.mutation[1], this.colorPallet.mutation[2], this.lifetime);

//     ellipse(this.pos.x, this.pos.y, this.r * 2);
//   }
// }
