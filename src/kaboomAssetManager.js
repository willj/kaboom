if (typeof kaboom == "undefined"){
    var kaboom = {};
}

kaboom.assetManager = {
    images: {},
    sounds: {},
    sprites: {},
    assetsLoaded: 0,
    loadedCallback: null,
    loadAll: function(settings){
        this.settings = settings;
        
        if (this.settings.assetMap.length == 0){
            if (this.loadedCallback){
                this.loadedCallback.apply(this);  
            }
            return;
        }

        for (var i = 0; i < this.settings.assetMap.length; i++){
            if (this.settings.assetMap[i].fileType === "Image"){
                this.loadImage(this.settings.assetMap[i]);
            }
            else if (this.settings.assetMap[i].fileType === "Sound") {
                this.loadSound(this.settings.assetMap[i]);
            }
        }
    },
    loadImage: function(asset){
        var newImage = new Image();
        this.images[asset.fileName] = newImage;
        newImage.onload = this.assetLoaded(asset);
        newImage.src = this.settings.assetDirectory + asset.fileName;
    },
    loadSound: function(asset){
        var newSound = new Audio();
        this.sounds[asset.name] = newSound;
        newSound.onload = this.assetLoaded(asset);
        newSound.src = this.settings.assetDirectory + asset.fileName;
    },
    assetLoaded: function(asset){
        this.assetsLoaded += 1;
        
        if (asset.fileType === "Image"){
            for (var i = 0; i < asset.sprites.length; i++){
                var spr = asset.sprites[i];	
                this.sprites[spr.name] = Object.create(kaboom.sprite); 
                this.sprites[spr.name].init(this.images[asset.fileName], spr.startX, spr.startY, spr.width, spr.height, spr.states, spr.hitMargin);
            }
        }
        
        if (this.assetsLoaded == this.settings.assetMap.length){
            if (this.loadedCallback){
                this.loadedCallback.apply(this);  
            }
        }
    }
};