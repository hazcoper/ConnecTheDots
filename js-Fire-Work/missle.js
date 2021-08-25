class Missle{

    constructor(x, y, force, colorPallet){

        this.pos = createVector(x, y);
        this.vel = createVector(random(-1,1), 6 + force/5);  //velocidade no eixo x e no eixo y
        this.force = force;

        this.accel = random(0.035);
        this.explodeStatus = -1; //-1 -> not exploding; 0 -> exploding; 1 -> exploded
        this.life = round(random(40,55) + force/5);
        this.lifetime = 255;
        //red green blue
        this.color = [round(random(210, 240)), random(140, 160), random(120, 150)];

        // this.color = [round(random(210, 240)), 160, 140];
        this.colorPallet = colorPallet;
        this.sound = new Sound(map(this.life, 0, 55, 0, 70),0);  
        this.sound.startPulse();

        this.explosionSound = new Sound(10, loadSound("js-Fire-Work/explosion.mp3"));

        
    }

    stopSounds(){
        this.sound.stopPulse();
        this.explosionSound.stopPulse();
    }

    makeMove(){
        //update the position and life of
        //acceleration = change in velocity/time
        if(this.explodeStatus != 0){
            if(this.life < 20){
                this.vel.y = this.vel.y - this.vel.y*this.accel;
            }else{
                this.vel.y = this.vel.y + this.vel.y*this.accel;
            }
            this.pos.y = this.pos.y - this.vel.y;
            this.pos.x = this.pos.x - this.vel.x;
            this.life -= 1;
            this.lifetime -= 5; 
            this.sound.updateFreq();
        }
        

        if(this.life < 1 && this.explodeStatus == -1){
            this.explode();
            this.explodeStatus = 0;
            this.sound.stopPulse();
            this.explosionSound.startPulse();
            console.log("Has expldoed");
        }
    }

    explode(){
        //create the particles and send them
        this.Particle = new Particles(round(130+this.force/1.1), this.force, this.colorPallet);
        this.Particle.createParticles(this.pos.x, this.pos.y);

    }

    show(){
        // stroke(this.color[0], this.color[1], this.color[2])
        console.log("hello");
        strokeWeight(0);
        if(this.explodeStatus == -1){
            fill(this.color[0], this.color[1], this.color[2], random(this.lifetime-5, this.lifetime+100));
            // ellipse(this.pos.x, this.pos.y, random(6,8)+this.force/3, random(6,10)+this.force/2);    
            ellipse(this.pos.x, this.pos.y, random(6,8)+this.force/4, random(8,15)+this.force/2);    

            return 0;
        }
        if(this.explodeStatus == 0){
        //means that I need to draw the particles
            this.explodeStatus = this.Particle.drawParticles();
            return 0;
        }
        if(this.explodeStatus == 1){
            //means that I am done
            return 1;
        }
            
        
    }

}