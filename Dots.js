

//each point has an x and y value that represents where it will be drawn on the screen
//and it also has an index value to represent in place in the matrix

class Dots{

    //the size of square of dots to make
    constructor(dotQuant, space, initX, initY, border){
        this.dotList = [];
        this.notFull = []; //list to keep track of the points that are not full

        this.initX = initX;
        this.initY = initY;
        this.space = space;
        this.dotQuant = dotQuant;

        this.border = border;
        this.dotSize = 13;

        var counter = 0;
        for(var y = 0; y < dotQuant; y++){
            for(var x = 0; x < dotQuant; x++){
                var myDot = new Dot(initX+x*space, initY+y*space, counter, this.dotSize, this.dotQuant);
                this.dotList.push(myDot);
                this.notFull.push(myDot);
                counter++;
            }   
        }
        this.selected = [];
        this.connected = [];   //this is the information that I will want to pass on

        this.lineList = []; // list containing objects of the Line class that represent a line on the board

    }

    

    selectDot(index, pColor){
        console.log("Starting dot selections", this.selected.length);
        
        //First click
        if(this.selected.length == 0){
            //selecionei um ponto, tenho de verificar se posso
            //  Verificar se ele ja nao tem todas as ligacoes possiveis
            console.log("This is the index in select: ", index);
            if(!this.dotList[index].isFull()){
                console.log("A dot has been selected");
                this.selected.push(index);
                return -1;
            }
            
        }

        //Second click
        if(this.selected.length == 1){
            //vou verificar se posso meter
            
            //means that i selected the same one
            if(index == this.selected[0]){
                console.log("I have selected the same");
                //I want to clear the list and return
                this.selected = [];
                return -2;
            }
            
            if(this.isValidConnection(index,  this.selected[0])){
                var dot1 = this.dotList[index];
                var dot2 = this.dotList[this.selected[0]];

                //quero check que ja nao esta na lista de coisas
                if(!dot2.connected.includes(index)){
                    console.log("A new line will be created");
                    //criar a minha nova linha
                    this.lineList.push(new Line(dot1, dot2, pColor));
                    //dizer aos dots que agora estao ligados um ao outro
                    dot1.addConnected(dot2.index);
                    dot2.addConnected(index);

                    // check to see if any of the dots have been filled up
                    if(dot1.isFull()){
                        var index = this.notFull.indexOf(dot1);                      
                        console.log("this dot is full", dot1);
                        this.notFull.splice(index, 1);
                    }
                    if(dot2.isFull()){
                        console.log("this dot is full", dot2);
                        var index = this.notFull.indexOf(dot2);                      
                        this.notFull.splice(index, 1);
                    }

                    //limpart a lista de selecionados
                    this.selected = [];
                    //check if I have completed a square
                    let result = this.completesSquare(dot1.index, dot2.index);
                    if(result > 0){
                        //values for result:
                        //      0 --> means that no square was completed
                        //      1 --> means square completed above line
                        //      2 --> means square completed below line
                        //      3 --> means square completed below and above line
                        //      4 --> means square completed to the right of the line
                        //      5 --> means square completed to the left of the line
                        //      9 --> means squase completed to the right and left of the line

                        console.log("This has been detected ", int(result));
                        return result;
                    }
                    
                    console.log("dots have been pushed"); 
                    this.connected.push([dot1, dot2]);
                    return 0;   // ---> serve para indicar que vou trocar de jogador

                    
                }else{
                    //quer dizer que estou a tentar fazer um movimento
                    console.log("This line already exists");
                    //se calhar aqui vou quere apagar os doid pontos que selecionei e nao so o segundo
                    return -3;
                }
            }
        return -3;
        }
        
    }

    completesSquare(ind1, ind2){
        //need to know if it is a vertical or horizontal connection
        let value = 0;

        if(ind1 + 1 == ind2 || ind1 - 1 == ind2){
            console.log("It is horizontal");

            let top1 = ind1 > this.dotQuant ? ind1 - this.dotQuant : null; 
            let top2 = ind2 > this.dotQuant ? ind2 - this.dotQuant : null; 
            let bottom1 = ind1 < this.dotQuant * this.dotQuant && ind1 < (this.dotQuant * this.dotQuant) - this.dotQuant ? ind1 + this.dotQuant : null;
            let bottom2 = ind2 < this.dotQuant * this.dotQuant && ind2 < (this.dotQuant * this.dotQuant) - this.dotQuant ? ind2 + this.dotQuant : null;

            console.log(ind1, top1, top2, bottom1, bottom2);

            //see if they are connected in between them
            //if bottom1 is different than null, so will be bottom 2, same for top1 and top2
            let bottomConnected = bottom1 != null ? this.dotList[bottom1].connected.includes(bottom2) : null;
            let topConnected = top1 != null ? this.dotList[top1].connected.includes(top2) : null;

            //see if the priamry dots are connected to the secondary dots

            let secConnectionOneTop = top1 != null ? this.dotList[ind1].connected.includes(top1) : null;
            let secConnectionTwoTop = top2 != null ? this.dotList[ind2].connected.includes(top2) : null;
            let secConnectionOneBottom = bottom1 != null ? this.dotList[ind1].connected.includes(bottom1) : null;
            let secConnectionTwoBottom = bottom2 != null ? this.dotList[ind2].connected.includes(bottom2) : null;

            if(bottomConnected && secConnectionOneBottom && secConnectionTwoBottom){
                console.log("there is a square below");
                value = value + 2;
                // return 2; // ---> means that there is a square below
            }
            if(topConnected && secConnectionOneTop && secConnectionTwoTop){
                console.log("there is a square above");
                value = value + 1;
                // return 1; // --->  means that there is a square on top
            }
        }else{
            //means that it is a vertical point
            //what I want to know my X coordinate
            let x1 = ind1 % this.dotQuant;
            let x2 = ind2 % this.dotQuant;

            let right1 = x1 + 1 < this.dotQuant ? ind1 + 1 : null;
            let right2 = x2 + 1 < this.dotQuant ? ind2 + 1 : null;
            let left1 = x1 - 1 >= 0 ? ind1 - 1 : null ;
            let left2 = x2 - 1 >= 0 ? ind2 - 1 : null ;
            console.log(ind1, right1, right2, left1, left2);

            //see if they are connected in between them
            //if right1 is different than null, so will be right 2, same for left1 and left2
            let rightConnected = right1 != null ? this.dotList[right1].connected.includes(right2) : null;
            let leftConnected = left1 != null ? this.dotList[left1].connected.includes(left2) : null;

            let secConnectionOneRight = right1 != null ? this.dotList[ind1].connected.includes(right1) : null;
            let secConnectionTwoRight = right2 != null ? this.dotList[ind2].connected.includes(right2) : null;
            let secConnectionOneLeft = left1 != null ? this.dotList[ind1].connected.includes(left1) : null;
            let secConnectionTwoLeft = left2 != null ? this.dotList[ind2].connected.includes(left2) : null;
            
            if(rightConnected && secConnectionOneRight && secConnectionTwoRight){
                console.log("there is a square right");
                value = value + 4;
                // return 3; // --> means that there is a square to the right
            }
            
            if(leftConnected && secConnectionOneLeft && secConnectionTwoLeft){
                console.log("there is a square left");
                value = value + 5; 
                // return 4; // --> means that there is a square to the left

            }

        }
        console.log("THis is the value ", value);
        return value;

    }

    isValidConnection(ind1, ind2){
        //top, right, down left
        return ind1 - ind2 == 1 || ind1 - ind2 == -1 || ind1 - ind2 == this.dotQuant || ind1 - ind2 == -this.dotQuant;  
    }

    drawLines(){
        for(var counter = 0; counter < this.lineList.length; counter++){
            stroke(255);
            this.lineList[counter].draw();
        }
    }

    drawDots(playerColor){
        noStroke();

        
        for(let index = 0; index < this.dotList.length; index++){
            
            
            //see if it is inside the border
            if(mouseX > this.border[0] && mouseX < this.border[2] && mouseY > this.border[1] && mouseY < this.border[3]){
                
                let pX = round((mouseX+initX)/spacing - 4);
                let pY = round((mouseY+initY)/spacing - 4);
                if(pX >= 0 && pY >= 0 && pX+(pY*this.dotQuant) == index){
                    //draw closest dot
                    this.dotList[index].draw([0, 150, 150]);
                    continue;  
                }
            
            }

            if(this.selected.includes(index)){
                //draw selected dot
                this.dotList[index].draw(playerColor);
                continue;
            }
            this.dotList[index].draw([255]);
        
        }

    }

}