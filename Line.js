class Line{

    constructor(dot1, dot2, color){
        this.dot1 = dot1;
        this.dot2 = dot2;

        this.color = color;

    }


    draw(){
        push();
        stroke(this.color);
        strokeWeight(3);

        line(this.dot1.pos.x, this.dot1.pos.y, this.dot2.pos.x, this.dot2.pos.y)
        

        pop();
    }

}