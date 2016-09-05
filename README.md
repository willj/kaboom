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

## kaboom.canvas

## Asset map format

## kaboom.assetManager

## kaboom.sprite

## kaboom.actor

## kaboom.sound

### play(sound), pause(sound), stop(sound)

Play, pause or stop a sound. Pass in the name of the sound file as set in the asset map.

### activateSounds()

On iOS and Android sounds can only be played when they've first been activated by a user action (tap).
Call this function from a button click (or similar event), before using sounds elsewhere in the game.

It plays and then immediately pauses all loaded sounds. 


## kaboom.util

### getRandomInt(min, max)

Returns a random (using Math.random) int between min and max.

### degreesToRadians(degrees)

Converts degrees to radians