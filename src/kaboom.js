var kaboom = {
    gameReadyCallback: null,
    gameOverCallback: null,
    drawCallback: null,
    updateCallback: null,
    updateOncePerSecondCallback: null,
    init: function(settings){
        this.settings = settings;
        
        this.canvas = Object.create(kaboomCanvas); 
        this.canvas.create(this.settings);
                
        this.gameLoopIntervalId;
		this.actors = [];        
		this.frameCount = 0;
		this.approxRunTimeInSeconds = 0;
        this.gameOver = false;
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
        
        if (this.updateCallback){
            this.updateCallback.apply(this);
        }
    },
    draw: function(){
		this.canvas.context.clearRect(0, 0, this.canvas.getWidth, this.canvas.getHeight);

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
	},
    getRandomInt: function (min, max){
	    return Math.floor(Math.random() * (max - min)) + min;	
	}
};