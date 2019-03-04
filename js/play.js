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
    },
    
    update: function() {
        game.physics.arcade.collide(this.supermario.mario, this.map.layer); 
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
                if(this.mario.body.blocked.down || this.mario.animations.name.includes('walk')){
                    this.supermario.isjumping = false;
                    //this.mario.body.gravity.y = 0;
                }
                this.release = this.supermario.jump(this.release);
            }
        }
        else if(!this.cursor.up.isDown){
            if(this.mario.body.blocked.down || this.mario.animations.name.includes('walk')){
                this.supermario.isjumping = false;
                this.release = false;
                this.supermario.firstjump = true;
            } else {
                this.release = true;
                //this.mario.body.gravity.y = 981;
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
};