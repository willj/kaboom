function KSprite(image, sourceX, sourceY, width, height, states){
    this.image = image;
    this.sourceX = sourceX || 0;
    this.sourceY = sourceY || 0;
    this.width = width || image.width;
    this.height = height || image.height;
    this.states = states;
}