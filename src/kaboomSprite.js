if (typeof kaboom == "undefined"){
    var kaboom = {};
}

kaboom.sprite = {
    init: function(image, sourceX, sourceY, width, height, states, hitMargin){
        this.image = image;
        this.sourceX = sourceX || 0;
        this.sourceY = sourceY || 0;
        this.width = width || image.width;
        this.height = height || image.height;
        this.states = states;
        this.hitMargin = hitMargin || 0;

        if (typeof this.hitMargin === "number"){
            this.hitMargin = { top: this.hitMargin, right: this.hitMargin, bottom: this.hitMargin, left: this.hitMargin };
        }
    }
};