if (typeof kaboom == "undefined"){
    var kaboom = {};
}

kaboom.createGame = function(){
    return Object.create(kaboom.game);
}

kaboom.game = {
    gameOverCallback: null,
    drawCallback: null,
    updateCallback: null,
    updateOncePerSecondCallback: null,
    initialize: function(settings, gameReadyCallback){
        this.settings = settings;
        
        this.gameLoopIntervalId;
        this.actors = [];
        this.frameCount = 0;
        this.approxRunTimeInSeconds = 0;
        this.gameOver = false;
        
        this.canvas = Object.create(kaboom.canvas); 
        this.canvas.create(this.settings, this.approxRunTimeInSeconds);
        
        this.assets = Object.create(kaboom.assetManager);
        this.assets.loadedCallback = gameReadyCallback;
        this.assets.loadAll(this.settings);
        
    },
    startGame: function(){
        var self = this;
        this.gameLoopIntervalId = setInterval(function() {
            self.update();
            self.draw();
        }, 1000/self.settings.framesPerSecond);
    },
    stopGame: function(){
        clearInterval(this.gameLoopIntervalId);
        this.gameOver = true;
        this.actors.splice(0, this.actors.length);
        if (this.gameOverCallback){
            this.gameOverCallback.apply(this);    
        }
    },
    restartGame: function(){
        clearInterval(this.gameLoopIntervalId);
        this.actors.splice(0, this.actors.length);
        this.draw();
        this.frameCount = 0;
        this.approxRunTimeInSeconds = 0;
        this.gameOver = false;
        this.startGame();
    },
    update: function(){
        this.frameCounter();
        this.updateOncePerSecond();
        
        var actorsToKill = [];

        for (var i = 0; i < this.actors.length; i++) {
            this.actors[i].update();
            if (this.actors[i].killed){
                actorsToKill.push(i);
            }
        }

        for (var i = 0; i < actorsToKill.length; i++){
            this.actors.splice(actorsToKill[i], 1);
        }
        
        if (this.updateCallback){
            this.updateCallback.apply(this);
        }
    },
    draw: function(){
        this.canvas.context.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
                
        for (var i = 0; i < this.actors.length; i++){
            this.actors[i].draw(this.canvas.context);
        }
        
        if (this.drawCallback){
            this.drawCallback.apply(this);
        }
    },
    frameCounter: function(){
        // keep a count of frames in this second and total runtime seconds so we can do things at a slower pace than fps
        this.frameCount = (this.frameCount + 1) % this.settings.framesPerSecond;
    },
    updateOncePerSecond: function(){
        if (this.frameCount !== 0){
            return;
        }
        
        this.approxRunTimeInSeconds += 1;
                
        if (this.updateOncePerSecondCallback){
            this.updateOncePerSecondCallback.apply(this, [this.approxRunTimeInSeconds]);
        }
    }
};