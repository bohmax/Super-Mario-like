var loadState = {
    
    preload: function () {
        game.load.atlas('animazione', 'assets/animations.png', 'assets/animations.json',null,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);   
        game.load.atlas('mario_animation', 'assets/mario_animation.png', 'assets/mario_animation.json',null,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);  
        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        
        game.load.image('logo', 'assets/logo.png');
        game.load.image('tileset', 'assets/tileset.png');
        
        game.global.style = { font: '15px fontmario', fill: '#ffffff', align: "center" };
    },
    
    create: function() {
        // Set some game settings
        // Start the load state
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;
        
        game.state.start('play');
    }
};