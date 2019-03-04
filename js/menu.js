// We create our only state
var menuState = {    
    
    create: function () {
        // This function is called after the 'preload' function 
        // Here we set up the game, display sprites, etc.
        
        this.labels = new Label();
        this.labels.draw();
        
        this.map = new Map();
        
        this.sprite = game.add.sprite(game.width/2, 150, 'logo');
        var connectLabel = game.add.text(game.width/2, game.height/2+40, 'PLEASE CONNECT THE CONTROLLER', game.global.style);
        var topscareLabel = game.add.text(game.width/2, game.height/2+90, 'top score: ' + 10, game.global.style);
        
        topscareLabel.anchor.setTo(0.5, 0.5);
        connectLabel.anchor.setTo(0.5, 0.5);
        this.sprite.anchor.setTo(0.5, 0.5);
        
        this.supermario = new Mario(this.map);
        
        
        //and gravity
        this.supermario.gravity();
        
        //this.cursor = game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
        this.cursor = game.input.keyboard.createCursorKeys();
    },
        
    update: function () {
        // This function is called 60 times per second 
        // It contains the game's logic
        game.physics.arcade.collide(this.supermario.mario, this.map.layer); 
        if (this.cursor.left.isDown){
            this.start();
        }
        
    },
    
    
    start: function() {
        // loading the game 
        game.state.start('loadplay');
    }
};