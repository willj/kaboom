var assetMap = [];

assetMap.push({
    fileType: "Image",
    fileName: "pigeon.png",
    sprites: [
        {
            name: "leftPigeon",
            startX: 0,
            startY: 0,
            width: 99,
            height: 70,
            states: {
                initial: [0,"initial"],
                fadeAndDie: [1,2,3,"die"]
            }
        },
        {
            name: "rightPigeon",
            startX: 0,
            startY: 70,
            width: 99,
            height: 70,
            states: {
                initial: [0,"initial"],
                fadeAndDie: [1,2,3,"die"]
            }
        }
    ]
});

assetMap.push({
    fileType: "Image",
    fileName: "charsprite.png",
    sprites: [
        {
            name: "yellow",
            startX: 0,
            startY: 0,
            width: 88,
            height: 80,
            states: {
                initial: [0,"initial"],
                fadeAndDie: [1,2,3,"die"]
            }
        },
        {
            name: "blue",
            startX: 0,
            startY: 80,
            width: 88,
            height: 80,
            states: {
                initial: [0,"initial"],
                fadeAndDie: [1,2,3,"die"]
            }
        },
        {
            name: "red",
            startX: 0,
            startY: 160,
            width: 88,
            height: 80,
            states: {
                initial: [0,"initial"],
                fadeAndDie: [1,2,3,"die"]
            }
        }
    ]
});

assetMap.push({ fileType: "Sound", fileName: "quack.mp3", name: "quack" });