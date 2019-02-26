// We create our only state
var menuState = {
    // Here we add all the functions we need for our state
    // For this project we will just have 3
    preload: function () {
    // This function will be executed at the beginning 
    // That's where we load the game's assets
    game.load.image('logo', 'assets/logo.png');
    game.load.spritesheet('coin', 'assets/coin.png',16,28);
    },
    
    create: function () {
    // This function is called after the 'preload' function 
    // Here we set up the game, display sprites, etc.
        this.sprite = game.add.sprite(game.width/2, 150, 'logo');
        this.coin = game.add.sprite(170, 25, 'coin');
        this.coin.animations.add('flip', [0, 1, 2, 3], 8, true);
        //game.physics.startSystem(Phaser.Physics.ARCADE);    
        game.renderer.renderSession.roundPixels = true;
        var scoreLabel = game.add.text(50, 30, 'score: ' + 10, { font: '20px fontmario', fill: '#ffffff' });
        var coinLabel = game.add.text(200, 30, 'x' + '00', { font: '20px fontmario', fill: '#ffffff' });
        var worldLabel = game.add.text(310, 30, 'world: ' + 10, { font: '20px fontmario', fill: '#ffffff' });
        var timeLabel = game.add.text(430, 30, 'time: ' + 10, { font: '20px fontmario', fill: '#ffffff' });
        var connectLabel = game.add.text(game.width/2, game.height/2+40, 'Please connect the controller', { font: '20px fontmario', fill: '#ffffff' });
        var topscareLabel = game.add.text(game.width/2, game.height/2+70, 'top score: ' + 10, { font: '20px fontmario', fill: '#ffffff' });
        
        scoreLabel.anchor.setTo(0.5, 0.5);
        worldLabel.anchor.setTo(0.5, 0.5);
        timeLabel.anchor.setTo(0.5, 0.5);
        coinLabel.anchor.setTo(0.5, 0.5);
        topscareLabel.anchor.setTo(0.5, 0.5);
        connectLabel.anchor.setTo(0.5, 0.5);
        this.coin.anchor.setTo(0.5, 0.5);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.coin.animations.play('flip');
        game.stage.backgroundColor = '#3498db';
    },
    update: function () {
        // This function is called 60 times per second 
        // It contains the game's logic
        //this.sprite.angle += 1;
        
        
        
    } 
};
// We initialize Phaser
var game = new Phaser.Game(500, 450, Phaser.AUTO, 'gameDiv');
// And we tell Phaser to add and start our 'main' state
game.state.add('main', menuState);
game.state.start('main');