if (typeof kaboom == "undefined"){
    var kaboom = {};
}

kaboom.createActor = function(name, sprite, posX, posY){
    var a = Object.create(kaboom.actor);
    a.init(name, sprite, posX, posY);
    return a;
}

kaboom.actor = {
    init: function(name, sprite, posX, posY){
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
        this.ticksToLive = -2;	// -2 live forever
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotation = 0;
        this.shouldRotate = false;
    },
    kill: function(){
        this.killed = true;	
    },
    update: function(){
        this.tickCount = (this.tickCount + 1) % this.ticksPerUpdate;

        if (this.ticksToLive > -2){
            this.ticksToLive--;
            
            if (this.ticksToLive < 1){
                this.killed = true;
            }
        }

        this.posX += this.velocityX;
        this.posY += this.velocityY;

        this.updateFrame();
    },
    draw: function(context){
        if (this.shouldRotate){
            context.save();
            
            // move the origin to the center of this actor
            var translateX = this.posX + (this.sprite.width / 2);
            var translateY = this.posY + (this.sprite.height / 2);
            context.translate(translateX,translateY);
            
            context.rotate(kaboom.util.degreesToRadians(this.rotation));
            
            // then move it back so we drawImage in the right place
            context.translate(-translateX,-translateY);
        }
        
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
            
        if (this.shouldRotate){
            context.restore();
        }
    },
    rotateBy: function(degrees){
        this.rotation += degrees;
        this.shouldRotate = true;
    },
    rotateTo: function(degrees){
        this.rotation = degrees;
        this.shouldRotate = true;
    },
    setState: function(stateName){
        this.currentState = stateName;
        this.currentStateFrameCount = this.sprite.states[this.currentState].length;
        this.currentFrame = -1;	
    },
    updateFrame: function(){    
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
    },
    getHitRect: function(){
        return {
            top: this.posY + this.sprite.hitMargin.top,
            right: this.posX + (this.sprite.width - this.sprite.hitMargin.right),
            bottom: (this.posY + this.sprite.height) - this.sprite.hitMargin.bottom,
            left: this.posX + this.sprite.hitMargin.left
        };
    },
    contains: function(otherActor){
        var a = this.getHitRect();
        var b = otherActor.getHitRect();
        
        if (a.bottom >= b.bottom 
            && a.top <= b.top 
            && a.left <= b.left 
            && a.right >= b.right){
            
            return true;
        }

        return false;
    },
    touches: function(otherActor){
        var a = this.getHitRect();
        var b = otherActor.getHitRect();

        if (a.top <= b.bottom && a.bottom >= b.top && 
            a.left <= b.right && a.right >= b.left){
            return true;
        }

        return false;
    }
};