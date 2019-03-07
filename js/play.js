var playState = {
    
    create: function() {
    
        game.global.score = 0;
        game.stage.backgroundColor = '#3498db';
        this.labels = new Label();
        this.labels.draw();
        
        this.map = new Map();
        this.supermario = new Mario(this.map);
        this.mario = this.supermario.mario;
        
        //gravity & movements animation
        this.supermario.gravity();
        this.supermario.animation();
        this.labels.followcamera();
        
        this.cursor = game.input.keyboard.createCursorKeys();
        
        //queste variabili servono per far premere nuovamente all'utente il pulsante per saltare, 
        //in modo da evitare salti multipli consecutivi
        this.supermario.isjumping = true;
        this.release = false;
        
        //gruppo dei blocchi col punto interrogativo
        this.specialblock = game.add.group();
        //gruppo dei blocchi su cui era presente il punto interrogativo
        this.discoveredblock = game.add.group();
        
        this.specialblock.enableBody = true;
        this.discoveredblock.enableBody = true;
        
        this.map.map.createFromObjects('Special', 1, 'animazione', 0, true, false, this.specialblock);
        
        this.specialblock.callAll('animations.add', 'animations', 'bling', [17, 18, 19, 18], 10, true);
        this.specialblock.callAll('animations.play', 'animations', 'bling');
        this.specialblock.setAll('body.immovable', true);
        //this.specialblock.setAll('body.moves', false);
        //this.specialblock.setAll('body.collideWorldBounds', true);
        //this.specialblock.setAll('checkCollision.up', false);
        //this.specialblock.setAll('checkCollision.left', false);
        //this.specialblock.setAll('checkCollision.right', false);
    },
    
    update: function() {
        //game.physics.arcade.collide(this.mario, this.specialblock);
        game.physics.arcade.collide(this.mario, this.specialblock, this.onSpecialCollide,null,this);
        game.physics.arcade.collide(this.mario, this.discoveredblock);
        game.physics.arcade.collide(this.mario, this.map.layer);
        this.movePlayer();
        this.movecamera();
        
        if(!this.mario.inWorld){
            this.playerDie();
        }
        

    },
    
    movePlayer: function() {
        // If the left arrow key is pressed 
        if (this.cursor.left.isDown) {
        // Move the player to the left
        // The velocity is in pixels per second
            //if(this.time)
            this.supermario.moveleft();
        }
        // If the right arrow key is pressed
        else if (this.cursor.right.isDown) { 
            // Move the player to the right 
            this.supermario.moveright();
        }   
        // If neither the right or left arrow key is pressed
        else {
            // Stop the player
            this.supermario.stop();
        }
        // If the up arrow key is pressed and the player is on the ground
        if (this.cursor.up.isDown) {
            if(!this.release){
                if(this.mario.body.blocked.down){
                    this.mario.isjumping = false;
                }
                this.release = this.supermario.jump(this.release);
            }
        }
        else if(!this.cursor.up.isDown){
            if(this.supermario.touching()){
                this.mario.isjumping = false;
                this.release = false;
                this.supermario.firstjump = true;
            } else {
                this.release = true;
            }
        }
    },
    
    movecamera: function(){
        var x = game.camera.x + (game.width/2);
        if(this.mario.x > x ){
           game.camera.x -= (-this.supermario.mario.x + x);
        }
    },
    
    playerDie: function() {
        // When the player dies, we go to the menu 
        game.state.start('loadplay');
    },
    
    updatebox: function() {
        this.i = (this.i+1)%16;
        if(this.i==0){
            this.j = (this.j%3)+1;
            this.map.map.replace(this.j,(this.j%3)+1);
        }
    },
    
    onSpecialCollide: function(mario, specialblockitem) {
        if(mario.body.touching.up){
            specialblockitem.animations.stop();
            specialblockitem.frame = 20;
            specialblockitem.parent.remove(specialblockitem,false,false);
            this.discoveredblock.add(specialblockitem);
            specialblockitem.body.immovable = true;

            game.add.tween(specialblockitem).to({y: specialblockitem.position.y-16}, 125, Phaser.Easing.Linear.none).to({y: specialblockitem.position.y+4}, 125,Phaser.Easing.Linear.none).to({y: specialblockitem.position.y}, 75,Phaser.Easing.Linear.none).start();  
            //bounce.onComplete.add(startBounceTween, this);
        
        }
    }
};