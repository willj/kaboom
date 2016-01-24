var kaboomCanvas = {
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
    }
};