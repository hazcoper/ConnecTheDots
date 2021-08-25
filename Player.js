//A player will have a representation of their points
//Will also have a name and an ID


class Player{

    constructor(Name, ID, color, isMe){
        this.name = Name;
        this.ID = ID;
        this.points = 0;
        this.color = color;
        this.isMe = isMe;
    }

    addPoints(amount){
        //adds one point to the player and returns the color of the player
        console.log("points have beed added to player");
        this.points = this.points + amount;
        return this.color
    }



}