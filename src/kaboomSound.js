if (typeof kaboom == "undefined"){
    var kaboom = {};
}

kaboom.sound = {
    sounds: null,
    settings: null,
    init: function (sounds, settings){
        this.sounds = sounds;
        this.settings = settings;
    },
    play: function(soundFile, optionalSound, loop){
        var soundIsOptional = optionalSound || false;
        var loopSound = loop || false;
        
        if (this.sounds[soundFile] != null){
            if (this.settings.playAllSounds === true || soundIsOptional === false){
                this.sounds[soundFile].loop = loopSound;
                this.sounds[soundFile].play();
            }
        }
    },
    pause: function(soundFile){		
        if (this.sounds[soundFile] != null){
            this.sounds[soundFile].pause();
        }
    },
    stop: function(soundFile){		
        if (this.sounds[soundFile] != null){
            this.sounds[soundFile].pause();
            if (this.sounds[soundFile].currentTime > 0){
                this.sounds[soundFile].currentTime = 0;    
            }
        }
    },
    // iOS/Android need to activate the Audio element from a click first or they won't play.
    activateSounds: function(){
        if (navigator.userAgent.search(/iPad|iPhone|Android|Linux/)) {
            for (var i = 0; i < this.settings.assetMap.length; i++) {
                if (this.settings.assetMap[i].fileType === "Sound"){	
                    this.sounds[this.settings.assetMap[i].name].play();
                    this.sounds[this.settings.assetMap[i].name].pause();
                }
            }
        }
    }
};

