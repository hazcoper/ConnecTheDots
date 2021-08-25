class Sound{
    constructor(life, natural){
        this.pulse = new p5.Oscillator();
        if(natural == 0){
            this.natural = 0;

            this.pulse.setType("sine");
            this.maximum = life;
        }else {
            this.natural = 1;
            this.pulse = natural //natural will be the sound pre loaded
        }
        
    }

    startPulse(){
        if(this.natural == 0){
            this.Amp = 0.2;
            this.freq = 7000;
            this.counter = 0;
            this.maximum = 70;
    
            this.pulse.start();
            this.pulse.amp(this.Amp);
            this.pulse.freq(this.freq);
        }else {
            this.pulse.play();
        } 
    }
    
    updateFreq(){
        if(this.natural ==  0){
            if(this.counter < this.maximum){
                //lets update the freq and counter
                let adjust = 1;
                this.freq = (-0.0022/adjust)*this.counter**3 + (0.4799/adjust)*this.counter**2 - (46.047/adjust)*this.counter + 4569.9/adjust;

                this.counter += 0.5;
                this.pulse.freq(this.freq);
            }else{
                //means that I am done with the sound so I want to stop it
                this.stopPulse();
            }
        }
    }
    
    stopPulse(){
        if(this.natural == 0){
            this.pulse.stop();
        }else{
            this.pulse.pause();
        }
    }

}