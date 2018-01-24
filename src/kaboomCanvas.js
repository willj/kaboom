if (typeof kaboom == "undefined"){
    var kaboom = {};
}

kaboom.canvas = {
    create: function(settings){
        this.settings = settings;
        
        this.containerElement = document.getElementById(this.settings.containerElementId);
        
        if (!this.settings.canvasWidth || !this.settings.canvasHeight){
            this.detectContainerSize();
        }
        
        this.canvasElement = document.createElement("canvas");
        this.context = this.canvasElement.getContext("2d");
        this.canvasElement.width = this.settings.canvasWidth;
        this.canvasElement.height = this.settings.canvasHeight;
        this.containerElement.appendChild(this.canvasElement);
    },
    resize: function (width, height){
        if (!width || !height){
            this.detectContainerSize();
        } else {
            this.settings.canvasWidth = width;
            this.settings.canvasHeight = height;
        }
        this.canvasElement.width = this.settings.canvasWidth;
        this.canvasElement.height = this.settings.canvasHeight;
    },
    detectContainerSize: function(){
        this.settings.canvasWidth = this.containerElement.clientWidth;
        this.settings.canvasHeight = this.containerElement.clientHeight;
    },
    getWidth: function(){
        return this.canvasElement.width;
    },
    getHeight: function(){
        return this.canvasElement.height;
    },
    animationClassApplied: false,
    applyAnimationClass: function (className, durationInSeconds){
        if (this.animationClassApplied == false){	// only if there's no other animation class still running
            this.canvasElement.className = className;	
            this.animationClassApplied = true;	
            
            setTimeout(this.removeAnimationClass(this), (durationInSeconds * 1000));
        }
    },
    removeAnimationClass: function (self){
        // wrap this to create a closure over self, so we can interact with 'this' when called from setTimeout
        return function(){
            self.canvasElement.className = "";	
            self.animationClassApplied = false;   
        }
    }
};
