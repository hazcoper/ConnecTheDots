class ColorPallete{
    //Color is in the format of RGBE where e is the index of the main component of the color
    constructor(color, mutationStrenght){
        this.base = [color[0], color[1], color[2]];
        this.mutation = [color[0], color[1], color[2]];
        this.main = color[3];
        this.mutationStrenght = mutationStrenght;

    }

    getColor(){
        //return the color with a bit of a mutation
        let i;
        for (i = 0; i < this.base.length; i++){
            if(i != this.main){
                //if it is not the main color, lets mutate the color
                this.mutation[i] = random(this.base[i]-this.mutationStrenght, this.base[i]+this.mutationStrenght);
            }
        }
        return this.mutation;
    }
}