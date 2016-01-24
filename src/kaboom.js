var kaboom = {
    init: function(settings){
        this.settings = settings;
        
        this.createCanvas();
        
        this.gameLoopIntervalId;
		this.actors = [];        
		this.frameCount = 0;
		this.approxRunTimeInSeconds = 0;
        this.gameOver = false;
    },
    createCanvas: function(){
        this.containerElement = document.getElementById(this.settings.containerElementId);
        
        if (!this.settings.canvasWidth || !this.settings.canvasHeight){
            this.detectContainerSize();
        }

        this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");        
        this.canvas.width = this.settings.canvasWidth;
		this.canvas.height = this.settings.canvasHeight;
		this.containerElement.appendChild(this.canvas);
    },
    resizeCanvas: function (width, height){
        if (!width || !height){
            this.detectContainerSize();
        } else {
            this.settings.canvasWidth = width;
            this.settings.canvasHeight = height;
        }
		this.canvas.width = this.settings.canvasWidth;
		this.canvas.height = this.settings.canvasHeight;
	},
    detectContainerSize: function(){
        this.settings.canvasWidth = this.containerElement.clientWidth;
        this.settings.canvasHeight = this.containerElement.clientHeight;
    },
    getRandomInt: function (min, max){
	    return Math.floor(Math.random() * (max - min)) + min;	
	}
};