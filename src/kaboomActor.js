function KActor(name, sprite, posX, posY, ticksToLive){
    this.name = name;
    this.sprite = sprite;
    this.posX = posX || 0;
    this.posY = posY || 0;
    this.killed = false;
    this.currentState = "initial";
    this.currentStateFrameCount = this.sprite.states[this.currentState].length;
    this.currentFrame = 0;
    this.currentSourceX = this.sprite.states[this.currentState][this.currentFrame] * this.sprite.width;
    this.tickCount = 0;
    this.ticksPerUpdate = 1;
    this.ticksToLive = ticksToLive || -2;	// -2 live forever
}

KActor.prototype.kill = function(){
    this.killed = true;	
};

KActor.prototype.update = function(){
    this.tickCount = (this.tickCount + 1) % this.ticksPerUpdate;

    if (this.ticksToLive > -2){
        this.ticksToLive--;
        
        if (this.ticksToLive < 1){
            this.killed = true;
        }
    }

    this.updateFrame();
};

KActor.prototype.draw = function(context){
    context.drawImage(
        this.sprite.image,
        this.currentSourceX,
        this.sprite.sourceY,
        this.sprite.width,
        this.sprite.height,
        this.posX, 
        this.posY,
        this.sprite.width,
        this.sprite.height);
};

KActor.prototype.setState = function(stateName){
    this.currentState = stateName;
    this.currentStateFrameCount = this.sprite.states[this.currentState].length;
    this.currentFrame = 0;	
};

KActor.prototype.updateFrame = function(){
    if (this.tickCount > 0){
        return;
    }

    this.currentFrame += 1;
    if (this.currentFrame > this.currentStateFrameCount){
        this.currentFrame = 0;
    }

    if(typeof this.sprite.states[this.currentState][this.currentFrame] === "string"){
        if (this.sprite.states[this.currentState][this.currentFrame] === "die"){
            this.killed = true;	
        } else {
            this.setState(this.sprite.states[this.currentState][this.currentFrame]);	
        }
    } else {
        this.currentSourceX = this.sprite.states[this.currentState][this.currentFrame] * this.sprite.width;
    }
};