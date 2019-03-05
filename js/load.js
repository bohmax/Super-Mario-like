var loadState = {
    
    preload: function () {
        game.load.image('logo', 'assets/logo.png');
        game.load.image('tileset', 'assets/tileset.png');
        
        game.load.atlasJSONHash('animazione', 'assets/animations.png', 'assets/animations.json');    
        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        
        game.global.style = { font: '20px fontmario', fill: '#ffffff', align: "center" };
    },
    
    create: function() {
        // Set some game settings
        // Start the load state
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;
        game.stage.backgroundColor = '#3498db';
        
        game.state.start('menu');
    }
};