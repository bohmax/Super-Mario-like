var loadState = {
    
    preload: function () {
        
        game.load.atlas('animazione', 'assets/animations.png', 'assets/animations.json',null,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('mario_animation', 'assets/mario_animation.png', 'assets/mario_animation.json',null,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH); 
        game.load.atlas('tileset', 'assets/tileset.png','assets/tileset.json',null,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH); 
        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        
        game.load.image('logo', 'assets/logo.png');
        
        game.load.audio('music', ['assets/music.ogg', 'assets/music.mp3']);
        
        game.global.style = { font: '15px fontmario', fill: '#ffffff', align: "center" };
    },
    
    create: function() {
        // Set some game settings
        // Start the load state
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //centra finestra di gioco
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
        game.renderer.renderSession.roundPixels = true;
        
        //niente pausa
        game.stage.disableVisibilityChange = true;
        
        //gestisco ridimensionamento finestra browser
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //Imposta dimensione massima
        game.scale.maxWidth = 480;
        game.scale.maxHeight = 480;

        
        
        game.state.start('editor');
    }
};