if (typeof kaboom == "undefined"){
    var kaboom = {};
}

kaboom.util = {
    getRandomInt: function (min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    },
    degreesToRadians: function(degrees){
        return degrees * (Math.PI / 180);
    }
};