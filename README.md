# kaboom
A very basic web canvas game framework. Kaboom will help you take care of creating the canvas, loading and managing your assets, 
running a game loop, drawing, animating and moving your characters. 

## What is kaboom

- kaboom.game - handles the game loop/timers to begin/run/end a game
- kaboom.canvas - creates and helps manage the canvas
- kaboom.assetManager - loads images/sounds from a json map
- kaboom.sprite - an image sprite, it's states and animation sequences
- kabom.actor - an instance of a sprite on the canvas, moves, collides, animates and dies
- kaboom.sound - play sounds
- kaboom.util - Some useful helper functions

## Getting started: kaboom.createGame()

kaboom.createGame returns an object with kaboom.game set as it's prototype. 
You can then add your game specific functions and reference kaboom using `this`.

```
var myGame = kaboom.createGame();

myGame.startMyGame = function(){
    this.startGame();
};

```
## kaboom.game

### initialize(settings, gameReadyCallback)

**Required settings**

These are the minimal required settings for kaboom to work. 
Any additional settings for your game can of course be added and can be accessed using `this.settings`.

```
var settings = {
    containerElementId: "canvas-wrapper",
    framesPerSecond: 25,
    assetDirectory: "assets/",
    assetMap: [],
    playAllSounds: true 
};
```
* containerElementId - the ID of the HTML element you want the canvas to be created in
* framesPerSecond - the number of times per second the game loop should attempt to run. 
If your game has lots of actors or complex functionality you may want to reduce this to improve performance
* assetDirectory - the relative path or absolute URL to the assets directory
* assetMap - an array of asset objects, see below for full details
* playAllSounds - whether to play optional sounds or ignore them, see kaboom.sound for more info

### updateCallback

Gets run once per game loop, assign a function `this.updateCallback = function(){}` you will use to 
update game state. This is called before `drawCallback`, but after `updateOncePerSecondCallback` and 
after dead actors have been removed.

### updateOncePerSecondCallback

Like `updateCallback` but called approximately once per second, so useful to do things like update the timer.

### drawCallback

Assign a function `this.drawCallback = function(){}` if you need to do any additional drawing.
All actors in `this.actors` will already have been drawn. This runs after both `updateCallback` 
and `updateOncePerSecondCallback` and is called once per game loop. 

### gameOverCallback

This is called after `kaboom.stopGame()` has been run. StopGame is not automatically called by kaboom, 
you handle when a game is considered to be over, at which point you should call `this.stopGame`.

## kaboom.canvas

### Properties

- **canvas.containerElement** - the HTML element wrapping the canvas
- **canvas.canvasElement** - the canvas HTML element
- **canvas.context** - the canvas 2d context

### getWidth() and getHeight()

Returns width/height of the canvas.

### resize([width, height])

Resize the canvas. Either to a size specified or when no arguments are passed in, 
the canvas will fill it's container element.

To handle responsive layouts you can attach `canvas.resize()` to the `window.onresize` event.

### Animation with CSS

`applyAnimationClass(className, durationInSeconds)` can be used to add a CSS class to the 
canvas element. It can be useful to apply flashing background or similar effects,
and will remove itself once the `durationInSeconds` has been reached.

## Asset map format

The asset map is a single array of asset objects. 

### Images

Each image file can contain a number of sprites, and a number of states for each sprite.

Each sprite should be added vertically one after the other, 
and each animation state should be added horizontally.

An image with 3 character sprites and 4 states for each should be laid out as follows:

```
SampleCharacters.png

[CharA - Frame 0][CharA - Frame 1][CharA - Frame 2][CharA - Frame 3]
[CharB - Frame 0][CharB - Frame 1][CharB - Frame 2][CharB - Frame 3]
[CharC - Frame 0][CharC - Frame 1][CharC - Frame 2][CharC - Frame 3]
```

The position and size of each image & frame is then specified along with animation 
sequences in the asset map. 

An image asset in the map consists of a `fileType: "Image"`, a `fileName: "SampleCharacters.png"` 
and an array of sprite objects. 

Below is the image object required for `SampleCharacters.png`

```
[{
    fileType: "Image",
    fileName: "SampleCharacters.png",
    sprites: [
        {
            name: "charA",
            startX: 0,
            startY: 0,
            width: 100,
            height: 100,
            hitMargin: { top: 5, right: 8, bottom: 5, left: 8 },
            states: {
                initial: [0,"initial"],
                bounce: [1,1,2,2,3,3, "bounce"]
            }
        },
        {
            name: "charB",
            startX: 0,
            startY: 100,
            width: 50,
            height: 50,
            hitMargin: 0,
            states: {
                initial: [0,"initial"],
                fadeAndDie: [1,2,3, "die"]
            }
        },
        {
            name: "charC",
            startX: 0,
            startY: 150,
            width: 100,
            height: 100,
            hitMargin: { top: 20, right: 8, bottom: 5, left: 8 },
            states: {
                initial: [0,"initial"],
                flash: [1,1,2,2,3,3, "initial"]
            }
        }
    ]
}]
```

**Sprite object**

- **name** - used to reference the file when creating actors from sprites
- **startX** & **startY** - the position of the top left corner of this sprite row
- **width** & **height** - the width and height of each frame of the sprite
- **hitMargin** (optional) - either a single number or object `{ top: 20, right: 8, bottom: 5, left: 8 }` 
to specify a margin to be ignored should 2 actors collide when `actor.touches(x)` or `actor.contains(y)` 
are used. If only margins collide, `actor.touches(x)` would return false.
- **states** - the states or animation sequences of a sprite. Each state has a key, with the value being an 
array of indices to select the frame in the sprite row, working from left to right. The final value 
in the state array is the name of the state that should be moved to after this sequence has ended, 
`"die"` is a special string, and will mark an actor to be deleted on the next `update()`, the first/default 
state should always be called `"initial"`.
For example, **charC** has an `"initial"` state, by default an actor using this sprite will always show
frame 0 because that's all `"initial"` defines. When the state is changed (by your game code) to `"flash"`
`kaboom.actor` will animate through the flash frames, 2 frames of 1 followed by 2 frames of 2, then 3.
It will then automatically revert back to `"initial"`, because that's what has been specified. 

Special state strings are also available to `"fadeOut"` and `"fadeIn"` an actor, during the opacity fade from `0 to 1` or `1 to 0` the sprites frame will continue to advance, if another special state string is encountered the fade will be interrupted, `"die"`, `"fadeIn"` and `"fadeOut"` will behave normally and begin on the next update.

### Sounds

```
{ fileType: "Sound", fileName: "cheer.mp3", name: "cheer" }
```

## kaboom.assetManager

The asset manager is created by kaboom.game during initialization and then loads all assets (images and sounds). 
A `kaboom.sprite` object is created for each sprite referenced.

You can access sprites using `this.assets.sprites[spriteName]`.

Once all assets are loaded the `gameReadyCallback` is called, you can use this event to hide a loading screen.

## kaboom.actor

Each character or moveable/animatable element in your game should be a `kaboom.actor`. 
You will add most of the actors you create to the `this.actors` array, which means they will be auto updated, 
animated, and drawn for you, but you may have some actors you choose to manage outside of this. 

### createActor()

To create an actor use the helper function `kaboom.createActor(name, sprite, [posX, posY])`, this will return 
an object with the prototype of `kaboom.actor`.

### Properties

- **name** - A name or type of the character, this doesn't need to be unique
- **sprite** - The sprite object this actor uses 
- **posX** & **posY** - the current X/Y coords of your actor 
- **velocityX** & **velocityX** - the current X/Y velocity, your actor will be moved this number of pixels on each `update()`
- **rotation** & **shouldRotate** - the current rotation in degrees, and whether your actor should be rotated (see rotation methods, you should probably use those)
- **killed** & **currentState** - the current state, and whether the actor should be removed
- **ticksToLive** - if you want the actor to die after a certain period
- **opacity** - the opacity level between 0 and 1
- **scaleFactor** - a scale factor to apply to the actor, a scaleFactor of 2 would draw the image at twice the size, 0.5 at half the size

### kill()

To kill the actor, it will be deleted on the next update();

### setState(stateName)

Change the state of the actor, passing in the statename as defined in the asset map.

### rotateBy(degrees) and rotateTo(degrees)

Rotate the actor by or to a specific orientation. This will also enable `shouldRotate` and 
will remain rotated until otherwise specified.

### getHitRect()

Get the hit rectangle object for this actor to test collisions/clicks. This returns the current position of 
the top, right, bottom and left sides within the canvas.

### contains(otherActor)

Returns true/false if this actor's hit rectangle completely contains `otherActor`'s hit rectangle.

### touches(otherActor)

Returns true/false if this actor's hit rectangle touches `otherActor`'s hit rectangle.

### fade(start, end)

Animates a fade from the starting opacity level to the end opacity level. Both `start` and `end` should be values between `0` and `1`. Calling `actor.fade(1, 0)` will fade out the image, calling `actor.fade(0.2, 1)` will first set the opacity to 0.2 and then fade up to fully opaque. Each update changes the opacity level by `0.1`.

### scale(start, end)

Animates a scale from the starting scale factor, to the end. Calling `actor.scale(1,2)` will increment the scaleFactor by `0.1` on each update. Once the image is drawn and 2x scale it will remain until another `scale()` call is made, or the scaleFactor is altered. Calling `scale(2,1)` will scale the image back from double size, to it's original size.

`posX` and `posY` are adjusted for a scaled image, so the centre of the image will be drawn in the same position as it would at it's original size.

## kaboom.sound

Play, pause or stop a sound. Pass in the name of the sound file as set in the asset map.

### play(sound, [optionalSound, loop]), pause(sound), stop(sound)

When playing a sound `play(sound, [optionalSound, loop])` two optional args allow you to 
mark a sounds as being optional, and choose whether to indefinitely loop the sound.

**Optional sounds**

Some mobile browsers seem to struggle with playing multiple simultaneous sounds. 
In this case you can mark some sounds as optional. 
Optional sounds will play when the global `settings.playAllSounds` is `true` and not play when this is `false`. 
So this global setting can be toggled based on the current client.

### activateSounds()

Plays and then immediately pauses all loaded sounds.

On iOS and Android sounds can only be played when they've first been activated by a user action (tap).
Call this function from a button click (or similar event), before using sounds elsewhere in the game.

## kaboom.util

### getRandomInt(min, max)

Returns a random (using Math.random) int between min and max.

### degreesToRadians(degrees)

Converts degrees to radians