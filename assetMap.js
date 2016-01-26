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
				hitMarginTop: 0,
				hitMarginLeft: 0,
				hitMarginBottom: 0,
				hitMarginRight: 0,
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

assetMap.push({ fileType: "Sound", fileName: "quack.mp3", name: "quack" });