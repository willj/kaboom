(function(){

    var keys = {
        left: 37,
        up: 38,
        right: 39,
        down: 40
    };

    var assets = [{
        fileType: "Image",
        fileName: "squareA.png",
        sprites: [
            {
                name: "a",
                startX: 0,
                startY: 0,
                width: 100,
                height: 100,
                states: {
                    initial: [0,"initial"]
                }
            }
        ]
    },
    {
        fileType: "Image",
        fileName: "squareB.png",
        sprites: [
            {
                name: "b",
                startX: 0,
                startY: 0,
                width: 50,
                height: 50,
                states: {
                    initial: [0,"initial"]
                }
            }
        ]
    }];

    var settings = {
        containerElementId: "canvas-wrapper",
        framesPerSecond: 25,
        assetDirectory: "assets/",
        assetMap: assets, 
    };

    window.onload = function(){
        window.squaresGame = sq;
        sq.init();
    }

    var sq = kaboom.createGame();

    sq.init = function(){
        this.outputElement = document.getElementById("output");
        window.onkeydown = this.handleKeyPress;

        this.initialize(settings, function(){
            sq.output("ready...");
            sq.createActors();
            sq.startGame();
        });
    };

    sq.output = function(status){
        this.outputElement.innerText = status;
    };

    sq.createActors = function(){
        this.boxA = kaboom.createActor("a", this.assets.sprites["a"], 150, 150);
        this.actors.push(this.boxA);

        this.boxB = kaboom.createActor("b", this.assets.sprites["b"], 50, 50);
        this.actors.push(this.boxB);
    };

    sq.updateCallback = function(){    
        if (this.boxA.contains(this.boxB)){
            this.output("B is contained in A.");
        } else if(this.boxA.touches(this.boxB)) {
            this.output("A and B are touching.");
        } else if (this.approxRunTimeInSeconds > 3) {
            this.output("");
        }
    };

    sq.handleKeyPress = function(kbEvent){
        switch (kbEvent.keyCode) {
            case keys.left:
                sq.boxB.posX -= 5;
                kbEvent.preventDefault();
                break;
            case keys.up:
                sq.boxB.posY -= 5;
                kbEvent.preventDefault();
                break;
            case keys.right:
                sq.boxB.posX += 5;
                kbEvent.preventDefault();
                break;
            case keys.down:
                sq.boxB.posY += 5;
                kbEvent.preventDefault();
                break;
        }
    };

})();