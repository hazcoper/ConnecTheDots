//a game will have a representation of the map
//will also have a list of all players
//have a representation of the current player


//I ideia vai ser que cada pessoa vai ter a sua representacao do jogo, e quando carrega alguma coisa vai mandar so os pontos que ligou

class Game{


    constructor(quant, spacing, initX, initY, border, timeLimit){
        

        this.timeLimit = timeLimit;     //how many seconds do i have to playb
        this.playTime = timeLimit*30;

        this.playerList = [];

        this.currentPlayer;
        this.playerIndex;

        this.hasStarted = 0;
        this.border = border;

        this.dotQuant = quant;
        // this.border = [initX-15, initY-15, initX+15 + (spacing * (quant -1)), initY+15 + (spacing * (quant -1))]
        this.map = new Dots(quant, spacing, initX, initY, this.border);//Object of class Dots -> class which contains the representation for the map

        console.log(this.border);

    }

    isMyTurn(){
        return this.currentPlayer.isMe;
    }

    createPlayer(Name, ID, color, isMe){
        var myPlayer = new Player(Name, ID, color, isMe);
        this.playerList.push(myPlayer);
        console.log("A new player has been created");
    }


    startGame(){
        console.log("Game is going to start with ", this.playerList.length, " players");
        this.hasStarted = !this.hasStarted;
        this.playerIndex = 0;
        this.currentPlayer = this.playerList[this.playerIndex];
        console.log(this.currentPlayer);
        console.log("The first player has been selected");
    }

    selectDot(ind){
        //receives a dot to select it
        if(this.hasStarted){
            var result = -1;
            result = this.map.selectDot(ind, this.currentPlayer.color); 
            if (result == -2){
                console.log("this means that I have selected the same one");
                return -2;
            }
            if(result == -3){
                console.log("means that I made an invalid selection");
                return -3;
            }
            if(result >= 0){
                //means that it was the second dot and I want to change sides and check for squares
                //I want to check if it formed a square
                console.log("I need to change players")
                if(result > 0){
                    //means that a square was completed and I want to increment scores
                    console.log("points have been added ", int(result));
                    if(result == 3 || restult == 9){
                        this.currentPlayer.addPoints(2);
                    }else{
                        this.currentPlayer.addPoints(1);
                        
                    }
                }else{
                    this.playerIndex = (this.playerIndex + 1) % this.playerList.length; 
                    this.currentPlayer = this.playerList[this.playerIndex];
                }
                this.playTime = this.timeLimit * 30;
                return 1;

            }
        }
    }

    randomPlay(){

        //gonna get a random dot from the list of dots
        //verify if it is not full
        //select one possible option
  

        if(this.map.notFull.length == 0){
            return -1;
        }
        var myDot = this.map.notFull[Math.floor(Math.random()*this.map.notFull.length)]

        //i will calculate all possible neighbours and chose the biggest one
        //since the dot is not full, at least one of them will be bigger than -1
        //  plot twist, this does not work, need to add some logic to it
        //maybe it will be better to just filter the ones that are bigger than 0 and choose one randomly
        // var secondInd = max(
        // [myDot.index + 1, myDot.index - 1, myDot.index  + this.dotQuant, myDot.index - this.dotQuant];
        var ind = myDot.index;  //make the code smaller
        var q = this.dotQuant;  //make the code smaller

        var x = ind % q;
        var y = Math.floor(ind / q);

        var left = x-1 >= 0 ? (x-1) + (y * q) : null;
        var right = x+1 <= q -1 ? (x+1) + (y * q) : null;
        var top = y-1 >= 0 ? x + ((y-1) * q) : null;
        var bottom = y+1 <= q-1 ? x + ((y+1) * q) : null;

        
        var n = [left, right, top, bottom];
        n = (Math, n.filter(function(x){return x != null && !myDot.connected.includes(x)}));

        var secondInd = n[Math.floor(Math.random()*n.length)];
        console.log("This are the options: ", n);
        console.log("Time is up, I should do a random play right now, selected dots: ", myDot.index, secondInd);


        return [myDot.index, secondInd];

    }

    drawGame(isSingle){

       
   
        strokeWeight(4);
        stroke(51);
        noFill();
        rect(this.border[0], this.border[1], this.border[2]-this.border[0], this.border[3]-this.border[1]);
        


        this.map.drawLines();
        this.map.drawDots(this.currentPlayer.color);
        
        push();
        textSize(20);
        if(this.hasStarted){
            fill(this.currentPlayer.color);
            if(this.currentPlayer.isMe){
                stroke(30);
            }else{
                stroke(5);
            }
            textAlign(CENTER, CENTER);
            text(this.currentPlayer.name+ " - " + this.currentPlayer.points, 30, 20, 160, 60);
        }else{
            fill(255);
            text("has not started", 10, 30);
        }
        pop();


         //draw the time and keep track of it if its not single
         if(isSingle == false && this.isMyTurn()){
            var color;
            
            color = [210, 210, 210];

            fill(color);
            arc(600, 300, 80, 80, 0, map(this.playTime, 0, this.timeLimit*30, 0, 2*PI));
            this.playTime --;
            if(this.playTime <= 0){
                var randomDots = this.randomPlay();
                this.playTime = this.timeLimit*30;
                return randomDots;
            } 

        }

        return null;
    }

    


}