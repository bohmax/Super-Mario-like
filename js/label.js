class Label{
    constructor(){
        this.label = null;
    }
    
    draw(){
        this.coin = game.add.sprite(170, 25, 'coin');
        this.coin.animations.add('flip', [0, 1, 2, 3], 8, true);
        
        this.scoreLabel = game.add.text(50, 30, 'mario\n' + '000000', game.global.style);
        this.coinLabel = game.add.text(200, 30, 'x' + '00', game.global.style);
        this.worldLabel = game.add.text(310, 30, 'world\n' + '1-1', game.global.style);
        this.timeLabel = game.add.text(430, 30, 'time: ' + 10, game.global.style);
        
        this.scoreLabel.anchor.setTo(0.5, 0.5);
        this.worldLabel.anchor.setTo(0.5, 0.5);
        this.timeLabel.anchor.setTo(0.5, 0.5);
        this.coinLabel.anchor.setTo(0.5, 0.5);
        this.coin.anchor.setTo(0.5, 0.5);
        
        this.scoreLabel.lineSpacing = -10;
        this.worldLabel.lineSpacing = -10;
        
        this.coin.fixedtoCamer = true;this.coin.animations.play('flip');
    }
    
    followcamera(){
        this.scoreLabel.fixedToCamera = true;
        this.worldLabel.fixedToCamera = true;
        this.timeLabel.fixedToCamera = true;
        this.coinLabel.fixedToCamera = true;
        this.coin.fixedToCamera = true;
    }
}