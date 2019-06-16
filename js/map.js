class Map{
    constructor(map){
        if(typeof map === 'string')
            // Create the tilemap
            this.map = game.add.tilemap(map);
        else
            this.map = map
        // Add the tileset to the map
        this.map.addTilesetImage('tileset');
        // Create the layer by specifying the name of the Tiled layer
        this.layer = this.map.createLayer('Tile Layer 1');
        // Set the world size to match the size of the layer
        this.layer.resizeWorld();

        // Enable collisions for the grounnd tile
        this.map.setCollisionBetween(1,7);
        this.map.setCollisionBetween(11,13);
        this.map.setCollisionBetween(38,41);
        this.map.setCollisionBetween(44,49);
    }

}