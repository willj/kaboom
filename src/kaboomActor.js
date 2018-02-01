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
        this.opacity = 1;
        this.fadeState = null;
        this.scaleFactor = 1;
        this.scaleState = null;
    },
    kill: function(){
        this.killed = true;	
    },
    fade: function(start, end){
        this.fadeState = {
            start: start,
            end: end
        };
        this.opacity = start;
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

        this.updateFade();
        this.updateScale();

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
        
        if (this.opacity < 1) context.globalAlpha = this.opacity;

        context.drawImage(
            this.sprite.image,
            this.currentSourceX,
            this.sprite.sourceY,
            this.sprite.width,
            this.sprite.height,
            this.scaledPosX(), 
            this.scaledPosY(),
            this.scaledWidth(),
            this.scaledHeight()
        );
        
        if (this.opacity < 1) context.globalAlpha = 1;

        if (this.shouldRotate){
            context.restore();
        }
    },
    scaledPosX: function(){
        if (this.scaleFactor == 1) return this.posX;
        
        return this.posX - ((this.scaledWidth() - this.sprite.width) / 2);
    },
    scaledPosY: function(){
        if (this.scaleFactor == 1) return this.posY;

        return this.posY - ((this.scaledHeight() - this.sprite.height) / 2);
    },
    scaledWidth: function(){
        return this.sprite.width * this.scaleFactor;
    },
    scaledHeight: function(){
        return this.sprite.height * this.scaleFactor;
    },
    scale: function(start, end){
        this.scaleState = {
            start: start,
            end: end
        };
        this.scaleFactor = start;
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
            } else if (this.sprite.states[this.currentState][this.currentFrame] === "fadeOut") {
                this.fade(1, 0);
            } else if (this.sprite.states[this.currentState][this.currentFrame] === "fadeIn") {
                this.fade(0, 1);
            } else {
                this.setState(this.sprite.states[this.currentState][this.currentFrame]);	
            }
        } else {
            this.currentSourceX = this.sprite.states[this.currentState][this.currentFrame] * this.sprite.width;
        }
    },
    updateFade: function(){
        if (this.fadeState){
            // fade up
            if (this.fadeState.start < this.fadeState.end ){  
                if (this.opacity <= this.fadeState.end){
                    this.opacity = this.opacity + 0.1;
                    if (this.opacity >= this.fadeState.end) {
                        this.opacity = this.fadeState.end;
                        this.fadeState = null;
                    }
                }
            // fade down
            } else {    
                if (this.opacity >= this.fadeState.end){
                    this.opacity = this.opacity - 0.1;
                    if (this.opacity <= this.fadeState.end) {
                        this.opacity = this.fadeState.end;
                        this.fadeState = null;
                    }
                }
            }
        }
    },
    updateScale: function(){
        if (this.scaleState){
            // scale up
            if (this.scaleState.start < this.scaleState.end ){  
                if (this.scaleFactor <= this.scaleState.end){
                    this.scaleFactor = this.scaleFactor + 0.1;
                    if (this.scaleFactor >= this.scaleState.end) {
                        this.scaleFactor = this.scaleState.end;
                        this.scaleState = null;
                    }
                }
            // scale down
            } else {    
                if (this.scaleFactor >= this.scaleState.end){
                    this.scaleFactor = this.scaleFactor - 0.1;
                    if (this.scaleFactor <= this.scaleState.end) {
                        this.scaleFactor = this.scaleState.end;
                        this.scaleState = null;
                    }
                }
            }
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