var splat = kaboom.createGame();
     
splat.init = function(settings){
    this.initialize(settings, this.loaded);
    this.newActorWeighting = 0;
    this.score = 0;
    
    var self = this;
    this.canvas.canvasElement.addEventListener("click", function (e){
        // wrap in anon func so "this" points to Game and not the canvas element
        self.onMouseClick(e);
    });   
}

splat.loaded = function(){
    console.log("loaded splat");  
};

splat.playGame = function(){    
    // fade intro screen
    
    this.startGame();  
    
    this.blueThing = kaboom.createActor("blue", this.assets.sprites["blue"], 100, 100);

    this.actors.push(this.blueThing);
    
    this.blueThing.rotateTo(45);
    
    // play background sound
};

splat.gameOverCallback = function(){
    // stop background sound
    // fade game over screen in  
    console.log("game over");
};

splat.updateCallback = function(){    
    this.generateNewActors();
};

splat.drawCallback = function(){
    
};

splat.increaseNewActorWeighting = function(){
    // increase newActorWeighting so we get new actors appear quicker the later in the game we are.
    if (this.newActorWeighting < 0.6){
        this.newActorWeighting = (Math.floor(this.approxRunTimeInSeconds / 10) * 0.1) + 0.15;
    }
};

splat.generateNewActors = function(){
    if (Math.random() > this.newActorWeighting){
        return;
    }

    var ticksToLive = kaboom.util.getRandomInt(this.settings.minTicksToLive, this.settings.maxTicksToLive);
    var x = kaboom.util.getRandomInt(0, this.settings.canvasWidth);
    var y = kaboom.util.getRandomInt(0, this.settings.canvasHeight);

    var velocityX = kaboom.util.getRandomInt(-3, 3); 
    var velocityY = kaboom.util.getRandomInt(1, 3);

    if (this.frameCount % 4 === 0){
        var newActor;
        
        if (x % 2 === 0){
            newActor = kaboom.createActor("yellow", this.assets.sprites["yellow"], x, y);
            newActor.ticksToLive = ticksToLive;
        } else {
            newActor = kaboom.createActor("red", this.assets.sprites["red"], x, y);
            newActor.ticksToLive = ticksToLive;
            this.assets.playSound("quack");	
        }
        
        newActor.velocityX = velocityX;
        newActor.velocityY = velocityY;
        this.actors.push(newActor);
    }
};

splat.updateOncePerSecondCallback = function(seconds){
    var timeLeft = (this.settings.gamesDurationSeconds - seconds);
    
    this.updateTimer(timeLeft);

    if (timeLeft <= 0){
        this.stopGame();
    }
    
    this.increaseNewActorWeighting();
    
    this.blueThing.rotateBy(45);
};

splat.onMouseClick = function(event){
    if (this.gameOver){
        return;
    }
    // event doesn't give us coords within our canvas element but within the visible viewport
    // so we need to offset the canvas position 
    var canvasRect = this.canvas.canvasElement.getBoundingClientRect();
    var mouseX = event.clientX - canvasRect.left;
    var mouseY = event.clientY - canvasRect.top;

    // Loop backwards and return once you detect a click
    // this means you'll click the latest added (highest z-order) element first
    // and only click one at a time
    for (var i = (this.actors.length - 1); i >= 0; i--){
        if (this.detectClickCollision(mouseX, mouseY, this.actors[i])){
            switch (this.actors[i].name) {
                case "yellow":		
                case "blue":
                    this.updateScore(this.score + 1);
                    this.actors[i].setState("fadeAndDie");
                break;
                case "red":	// reset back to zero
                    this.actors[i].setState("fadeAndDie");
                    this.updateScore(0);
                    this.canvas.applyAnimationClass("flashbg", 2);
                    this.assets.playSound("thunder");
                break;
            }
            return;
        }
    }  
};

splat.detectClickCollision = function(mouseX, mouseY, actor){		
    if (mouseX >= actor.posX && mouseX <= (actor.posX + actor.sprite.width)){
        if (mouseY >= actor.posY && mouseY <= actor.posY + actor.sprite.height){
            return true;
        }
    }

    return false;
};

splat.updateScore = function (score){
    this.score = score;
    this.settings.scoreElement.innerHTML = this.score;	
};

splat.updateTimer = function (timeLeft){
    this.settings.timerElement.innerHTML = timeLeft;
};