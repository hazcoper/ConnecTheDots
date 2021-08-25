class Colors{

    constructor(strenght){
        
        this.color1 = [206, 32, 41, 0];       //fire red
        this.color2 = [255, 102, 75, 0];      //tomato
        this.color3 = [23, 56, 183, 2];       //perisian blue
        this.color4 = [125, 197, 114, 1];     //mantis
        this.color5 = [255, 243, 71, 1];      //lemon yellow
        this.color6 = [109, 99, 173, 2];      //Crayola's Blue-Violet 
        this.color7 = [166, 174, 187, 2];     //Crayola's Cadet Blue

        this.PalleteList = [];

        for (var color in this){
            //make the colorlist
            if(color != "PalleteList"){

                this.PalleteList.push(new ColorPallete(this[color], strenght));
            }
        }
    }

    getPallete(){
        
        return random(this.PalleteList);
    }

    
}

