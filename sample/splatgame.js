var splat = Object.create(Kaboom);
            
splat.init = function(settings){
    splat.initialize(settings, this.loaded);
}

splat.loaded = function(){
    console.log("loaded splat");  
};

splat.updateOncePerSecondCallback = function(seconds){
    document.getElementById("gameTime").innerText = seconds;
    
    var x = this.getRandomInt(0, this.settings.canvasWidth);
    var y = this.getRandomInt(0, this.settings.canvasHeight);
    
    if (seconds % 2){
        this.actors.push(new KActor("leftPigeon", this.assets.sprites["leftPigeon"], x, y, 75));
    } else {
        this.actors.push(new KActor("rightPigeon", this.assets.sprites["rightPigeon"], x, y, 75));
        this.assets.playSound("quack");
        this.canvas.applyAnimationClass("animtest", 4);
    }
    
};