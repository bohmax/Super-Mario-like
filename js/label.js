class Label{
    constructor(){
        this.label = null;
    }
    
    draw(){
        this.coin = game.add.sprite(165, 25, 'animazione','1');
        this.coin.animations.add('flip', [0, 1, 2, 3], 8, true);
        
        this.scorestringa = '000000';
        this.scorecollected = '00';
        this.texttime = '000';
        this.scoreLabel = game.add.text(50, 30, '', game.global.style);
        this.coinLabel = game.add.text(200, 30, '', game.global.style);
        this.worldLabel = game.add.text(310, 30, 'world\n' + '1-1', game.global.style);
        this.timeLabel = game.add.text(430, 30, 'time ', game.global.style);
        
        this.scoreLabel.anchor.setTo(0.5, 0.5);
        this.worldLabel.anchor.setTo(0.5, 0.5);
        this.timeLabel.anchor.setTo(0.5, 0.5);
        this.coinLabel.anchor.setTo(0.5, 0.5);
        this.coin.anchor.setTo(0.5, 0.5);
        
        this.coin.animations.play('flip');
        this.updatescore(0);
        this.updatecollected();
    }
    
    followcamera(){
        this.scoreLabel.fixedToCamera = true;
        this.worldLabel.fixedToCamera = true;
        this.timeLabel.fixedToCamera = true;
        this.coinLabel.fixedToCamera = true;
        this.coin.fixedToCamera = true;
    }
    
    updatescore(num){
        game.global.score += num;
        var score = this.scorestringa+game.global.score;
        this.scoreLabel.text ='mario\n' + score.substr(score.length-this.scorestringa.length); 
    }
    
    updatecollected(){
        if(game.global.collectedcoin!=100){
            var score = this.scorecollected+game.global.collectedcoin;
            this.coinLabel.text ='x' + score.substr(score.length-this.scorecollected.length); 
        } else {
            game.global.collectedcoin = 0;
            this.coinLabel.text ='x' + this.scorecollected;
            game.global.life++;
        }
    }
    
    settime(countDown){
        var time = this.texttime+(countDown.duration / Phaser.Timer.SECOND).toString().split('.')[0];
        this.timeLabel.text = 'time \n' + time.substr(time.length-this.texttime.length);
        
    };
    
    settimeend(countDown){
        this.timeLabel.text = 'time \n' + countDown;
        
    };
}