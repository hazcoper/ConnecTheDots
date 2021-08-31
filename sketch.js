//Jogo de ligar os dots
// final goal poder jogar online com outras pessoas no minimo ate 8 pessoas

//primeira coisa:
// difinir o que vai ser um dot
// ter uma lista de dots  -> done
//now lets get the closest one to the mouse to be in a different color

//now lets make a class for the player and a class for the game

//tenho de fazer os sizes e positions responsive
//quando mudo eles tambem mudam
//posicao do pontos no ecra, tamanho dos pontos, disatancias entre os pontos...


//ver quando eu troco de tab
document.addEventListener("visibilitychange", function() {
    if (document.hidden){
        console.log("browser tab is not visible");
    } else {
        console.log("Browser tab is visible, attempting connection again")
        connect()
    }
});


//-------------------------------------------------------------

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


function messageParser(event){
    console.log("A new message has been received: ", event.data);
    sleep(20);

    var message = event.data.split(":");
    //tenho de verificar se eu era o destinatario
    if(message[1] == playerName){
        console.log("   message was for me");
        switch(message[2]){
            case "id":
                //menas that i have to set the id of the player
                playerNumber = int(message[3])
                console.log("This is my ID: ", playerNumber);

                //create the player

                //tambem quero adicionar a lista de pessoas todas as pessoas aqui ditas
                for(var counter = 4; counter < message.length; counter++){
                    
                    myGame.createPlayer(message[counter], counter-3, generateColor(), false);


                    console.log(message[counter]);
                    playerList.push(message[counter]);
                }
                myGame.createPlayer(playerName, playerNumber, generateColor(), true);

        }
    
    
    }else{
        //means that the message was not meant for me, but maybe I want to extract something from it
        if(message[0] == "server"){
            //aqui vao ficar todas as mensagens vindas do server
            switch(message[2]){
                case "new":
                    //new person has connected, lets add them
                    // playerList.append(message[0]);
                    playerList.push(message[3]);
                    console.log("new person has joined the server ", message[3]);

                    myGame.createPlayer(message[3], playerList.length, generateColor(), false);

                    return;
                
                case "ready":
                    readyList.push(message[3]); 
                    console.log("a new person has said ready");
                    return;
                
                case "start":
                    //means that everyone is ready and we should start the game
                    waiting = false;
                    started = true;
                    
                    //start the game
                    myGame.startGame();
                    
                    return;
                
                case "click":
                    // means that someone has cliked a button
                    if(playerName != message[3]){
                        //quer dizer que nao fui eu a carregar e quero adicionar este ponto
                        myGame.selectDot(int(message[4]));
                    }
                    return;

                case "FINISHED":
                    if(playerName != message[3]){
                        hasEnded = true;
                        started = false; 
                    }
                    return;
                
            }
        }
    }

    //event.data vai conter a informacao da mensagem
    //mensagem vai ter origem:destinatario:informacao

}



async function connect(){
    if(connection == null || connection.readyState === WebSocket.CLOSED){
        console.log("starting connection");
        
        connection = new WebSocket("wss", + IP + ":4441");

        // if(location.hostname === "192.168.1.81" || location.hostname === "127.0.0.1"){
        //     connection = new WebSocket('wss://192.168.1.81:4441');
        // }else{
        //     connection = new WebSocket('wss://85.246.46.40:4441');
        // }
        
        // connection = new WebSocket('ws://85.246.46.40:4441');
        // connection = new WebSocket('ws://192.168.1.81:4441');
        
        connection.onopen = function () {
            console.log("connection has been made");
            sendData(playerName + ":server:hello"); //send initilize message
        };

    

    connection.onmessage = function(event) {
        messageParser(event);

        // console.log("A new message has been received: ", event.data);

        // alert(`[message] Data received from server: ${event.data}`);
    };
    }
}


function closeSocket(){
    connection.close();

    console.log("socket has been closed");
}

function sendData(message){
    console.log("This is the message that will be sent ", message)
    if(connection != null){
        connection.send(message);
    }
    else{
        console.log("Connection was not established yet");
    }
}




//-------------------------------------------------------------


// Name e defenido pelo o programa e mandado para o server
// server vai responder com o numero dessa pessoa
let playerName;
let playerNumber;

//lists
let colorList = [];    //keep track of all generated colors
let playerList = [];   //keep track of all the joined players
let readyList = [];    //keep track of all the players that are ready

//communication
let connection;
let IP;


//timers
let limitSec = 30;      //how many seconds does the player have to do its play 
let lastClicked;        //used to make sure there are no problems when a player clicks a point and time runs out

//game properties
let myDots;
let initX = 100;
let initY = 100;
let quant = 7;
let spacing = 50;

//definicoes de estado
let mainMenu = true;
let started = false;
let waiting = false;
let singlePlayer = false;
let hasEnded = false;



//missiles
let missiles = [];
let force = 0;
let myColor;



function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function generateColor(){
    //i want to generate random color check it against the list and see if its valid

    var myColor = [random(255),random(255),random(255)];
    if(sqrt(myColor[0]*myColor[0] + myColor[1]*myColor[1] + myColor[2]*myColor[2]) < 150){
        console.log("problem with black");
        return generateColor();
    }
    for(var counter = 0; counter < colorList.length; counter++){
        //i want to calcualte the distance between the colors
        var compareColor = colorList[counter];

        var red = (compareColor[0] - myColor[0])*(compareColor[0] - myColor[0]);
        var green = (compareColor[1] - myColor[1])*(compareColor[1] - myColor[1]);
        var blue = (compareColor[2] - myColor[2])*(compareColor[2] - myColor[2]);

        var distance = sqrt(red + green + blue);

        console.log("this is the distance ", distance);
        if(abs(distance) < 150){
            console.log("color is not valid, trying again");
            return generateColor();
        }
    }
    colorList.push(myColor);
    return myColor;
}


function setup(){

    
    if(location.hostname === "192.168.1.81" || location.hostname === "127.0.0.1"){
        IP = "192.168.1.81";
    }else{
        IP = prompt("Please enter IP", "127.0.0.1");
    }
    


    playerName = makeid(6);
    console.log("This is the name", playerName);
    
    createCanvas(displayWidth, displayHeight);
    noCursor();
    background(0);


    // myDots = new Dots(quant, spacing, initX, initY);

    //create the game
    border = [initX-15, initY-15, initX+15 + (spacing * (quant -1)), initY+15 + (spacing * (quant -1))]

    myGame = new Game(quant, spacing, initX, initY, border, limitSec, connection);
    

    //missiles
    myColor = new Colors(100);

}


//missiles

function sendRocket(x, y){
    missiles.push(new Missle(x,y, force, myColor.getPallete()));
    force = 0;   // reset the force
}




//missiles



function keyReleased() {
    console.log(keyCode);

    if(keyCode == 67){
        //letter c --> lets connect
        if(mainMenu == true){
            console.log("i have clicked to connect");
            if(connection == null){
                connect();
            }
        }
    }
    if(keyCode == 83){
        //letter s --> lets start
        if(mainMenu == true){
            mainMenu = false;
            waiting = true;

            sendData(playerName + ":server:ready");

            console.log("I am ready");
        }
    }
    if(keyCode == 82){
        //lets restart the server
        sendData("restart");
        console.log("restarting the server");
        connection = null;
        playerList = [];

    }
    // return false; // prevent any default behavior
}


function mouseClicked(event) {


    if(started == true){
        //se o rato estiver dentro da borda
        //i want to check if it is my turn
        if(myGame.isMyTurn() == true){

        
            if(mouseX > border[0] && mouseX < border[2] && mouseY > border[1] && mouseY < border[3]){
                pX = round((mouseX+initX)/spacing - 4);
                pY = round((mouseY+initY)/spacing - 4);

                
                let ind = pX + pY *  quant;
                console.log("this is the ind: ", ind);
                
                //maybe it will be enough to just send the dots that I click
                
                var value = myGame.selectDot(ind);
                if (value == 1){
                    console.log("this means that I am chaning player");
                    lastClicked = null;
                    
                }
                if(value == -2){
                    console.log("this means that I unselecting a dot");
                    lastClicked = null;
                }
                if(value == -3){
                    return;
                }
                lastClicked = ind;
                sendData(playerName + ":server:click:" + ind);               
                
            }
        }
    }

    if(mainMenu == true){

        if(mouseX > 100 && mouseY > 100 && mouseX < 400 && mouseY <200){
            //means that I have clicked on the start button, change to wait state and warn the server that I am ready
            mainMenu = false;
            waiting = true;

            sendData(playerName + ":server:ready");

            console.log("I am ready");
        }
        if(mouseX > 100 && mouseY > 250 && mouseX < 400 && mouseY < 350){
            //means that I have pressed the connect button
            console.log("i have clicked to connect");
            if(connection == null){
                connect();
            }
        }
        if(mouseX > 100 && mouseY > 400 && mouseX < 400 && mouseY < 500){
            //means that I want single player mode
            singlePlayer = true;
            started = true;
            mainMenu = false;
            // create the players
            myGame.createPlayer("P1", "p1", generateColor(), true);
            myGame.createPlayer("P2", "p2", generateColor(), true);
            myGame.startGame();
        }
        
    }
    
}

function showGame(){

    var randomDots = myGame.drawGame(singlePlayer);
    if(randomDots == -1){
        started = false;
        hasEnded = true;
        sendData(playerName + ":server:FINISHED");
        return;
    }
    if(randomDots != null){
        
        //Check to see if there was a point selected and remove
        if(myGame.map.selected.length > 1){
            console.log("WE HAVE A PROBLEM");
        }
        if(myGame.map.selected.length > 0){
            sendData(playerName + ":server:click:" + myGame.map.selected[0] + ":remove");
            myGame.map.selected = [];
        }
        

        myGame.selectDot(randomDots[0]);
        myGame.selectDot(randomDots[1]);

        sendData(playerName + ":server:click:" + randomDots[0]);
        sendData(playerName + ":server:click:" + randomDots[1]);
        lastClicked = null;
    }
    

}

function showMenu(){
    //adicionar opcao para mudar o nome
    //adicionar opcao para escolher o server
    //adicionar opcao para jogar sozinho

    push();

    fill(200, 200, 200);
    rect(100, 100, 300, 100);
    
    fill(0, 102, 153);
    textSize(30);
    stroke(6); 
    textAlign(CENTER, CENTER);
    text("start", 100, 100, 300, 100);

    fill(200, 200, 200);
    rect(100, 400 , 300, 100);
    
    fill(0, 102, 153);
    textSize(30);
    stroke(6); 
    textAlign(CENTER, CENTER);
    text("single", 100, 400, 300, 100);


    if(connection == null){
        squareColor = color(200, 200, 200);
        textColor = color(0, 102, 153);
    }else{

        squareColor = color(3, 252, 78, 10);
        textColor = color(0, 102, 153, 40);
    }

    fill(squareColor);
    rect(100, 250, 300, 100);
    
    fill(textColor);
    textSize(30);
    stroke(6); 
    textAlign(CENTER, CENTER);
    text("connect", 100, 250, 300, 100);







    pop();
}

function showWait(){
    
    fill(100, 100, 100);
    textAlign(CENTER, CENTER);
    textSize(30); 
    text("waiting for players...", 100, 100, 300, 200);

    //lets draw all the name
    for(var counter = 0; counter < playerList.length; counter++){
        fill(100, 100, 100)
        if(readyList.includes(playerList[counter])){
            fill(3, 252, 78);

        }
        textSize(20);
        textAlign(CENTER, CENTER);
        text(playerList[counter], 100, 130+counter*20, 300, 200)
    }

}

function showEnd(){
    automaticRocket();

    push();
    fill(220, 220, 100);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(myGame.playerList[0].name + ": " + myGame.playerList[0].points, 100, 100, 300, 300);

    text(myGame.playerList[1].name + ": " + myGame.playerList[1].points, 100, 300, 300, 500);

    pop(); 
}

function draw() {
    background(0, 100);  //draw the background with some alpha



    if(started == true || singlePlayer == true){
        showGame();
    }
    if(mainMenu == true){
        showMenu();
    }
    if(waiting == true){
        showWait();
    }
    if(hasEnded == true){
        showEnd();
    }



    push();
    
    fill(255,255,10);
    stroke(10);
    circle(mouseX, mouseY, 9);

    
    for(let index = 0; index < missiles.length; index++){
        missiles[index].makeMove()
        if(missiles[index].show() == 1){
          missiles.splice(index, 1);
        }
    
    }


    pop();
    frameRate(60);

    // if(mouseIsPressed){
    //     console.log("mouse Is pressed")
    // }


    
}


function automaticRocket(){
    var prob = Math.random();
   
    if (prob > 0.94){
      console.log("sending rocket");
      sendRocket(Math.floor(Math.random()*700) ,700);
    }
}
