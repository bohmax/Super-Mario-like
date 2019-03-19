var playState = {
    
    create: function() {

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
        //gruppo dei mattoncini
        this.block = game.add.group();
        //gruppo usato per eleminare gli oggetti che escono a sinistra dalla visuale dal giocatore
        this.extraobject = game.add.group();
        //gruppo usato per memorizzare gli oggetti come i funghi attualmente presenti in gioco
        this.special = game.add.group();
        //gruppo usato per reciclare gli oggetti già utilizzati
        this.ricicla = game.add.group();
        
        this.specialblock.enableBody = true;
        this.discoveredblock.enableBody = true;
        this.block.enableBody = true;
        this.extraobject.enableBody = true;
        this.special.enableBody = true;
        game.world.bringToTop(this.discoveredblock);
        
        this.map.map.createFromObjects('Special', 1, 'animazione', 0, true, false, this.specialblock);
        this.map.map.createFromObjects('block', 5, 'animazione', 8, true, false, this.block);
        
        this.specialblock.callAll('animations.add', 'animations', 'bling', [4, 5, 6, 5,4,4], 8, true);
        this.specialblock.callAll('animations.play', 'animations', 'bling');
        this.map.map.createFromObjects('Invisible', 1, 'animazione', 21,true,false,this.specialblock);
        this.map.map.createFromObjects('Special', 5, 'animazione', 8, true, false, this.specialblock);
        this.specialblock.setAll('body.immovable', true);
        this.block.setAll('body.immovable', true);
        
        // Create a custom timer
        this.countDown = game.time.create(false);
          
        // Set our initial event
        this.countDown.add(Phaser.Timer.SECOND * 400, this.timeout, this);
          
        // Start the timer
        this.countDown.start();
        
        //velocità dei funghi e nemici
        this.velocity = 150;
        
        //imposto i muri per distruggere gli oggetti bonus
        var left = game.add.sprite(-64, game.height,null,0,this.extraobject);
        var bottom = game.add.sprite(-32, game.height+32,null,0,this.extraobject);
        left.scale.y = -game.height-32;
        bottom.scale.x = game.width+96;
        this.extraobject.setAll('fixedToCamera', true);
    },
    
    update: function() {
        if(this.special.length>0){
            game.physics.arcade.collide(this.special, this.map.layer,this.enemymove,null,this);
            game.physics.arcade.collide(this.special, this.specialblock);
            game.physics.arcade.collide(this.special, this.discoveredblock);
            game.physics.arcade.collide(this.special, this.block);
            game.physics.arcade.overlap(this.mario, this.special, this.onOverlap,null,this);
            game.physics.arcade.overlap(this.special, this.extraobject, function(r,s){console.log('ugg');
                                                                                    r.parent.remove(r);
                                                                                    this.ricicla.add(r);
                                                                                    r.kill();
                                                                                    },null,this);
        }
        game.physics.arcade.collide(this.mario, this.specialblock, this.onSpecialCollide,null,this);
        game.physics.arcade.collide(this.mario, this.block, this.onSpecialCollide,null,this);
        game.physics.arcade.collide(this.mario, this.discoveredblock);
        game.physics.arcade.collide(this.mario, this.map.layer);
        this.movePlayer();
        this.movecamera();
        
        this.labels.settime(this.countDown);
        
        if(!this.mario.inWorld){
            this.playerDie();
        }
        
        game.debug.body(this.mario);
        //game.debug.body(this.bottom);
        
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
            if(this.supermario.touchingdown()){
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
        if(this.countDown.duration!=0){
            game.global.life--;
        } else{
            game.global.life=-1; 
        }
        game.state.start('loadplay');
    },
    
    onSpecialCollide: function(mario, specialblockitem) {
        if(mario.body.touching.up){
            var twen = this.collisionTween(specialblockitem);
            if(specialblockitem.parent == this.specialblock){
                if(specialblockitem.coin>0){
                    this.labels.updatescore(200);
                    game.global.collectedcoin++;
                    this.labels.updatecollected(game.global.collectedcoin);
                    var coin1 = this.iterategroup(this.ricicla,0);
                    if(coin1==null){
                        coin1 = game.add.sprite(specialblockitem.position.x, specialblockitem.position.y-16, 'animazione','14');
                        coin1.animations.add('flip', [0, 1, 2, 3], 20, true);
                        coin1.animations.play('flip');
                        coin1.coin = true;
                    } else {coin1.reset(specialblockitem.position.x, specialblockitem.position.y-16);}
                    var tween = game.add.tween(coin1).to({y: coin1.position.y-(32*3)}, 250, Phaser.Easing.Linear.none).to({y:   coin1.position.y-16}, 175,Phaser.Easing.Linear.none);
                    tween.onComplete.add(this.callbackcoin, this);
                    tween.start();
                    specialblockitem.coin--;
                }
                //genera il fungo
                else{specialblockitem.coin = 0; twen.onComplete.add(this.callbackfungo, this);}
                if(specialblockitem.coin==0){
                    specialblockitem.animations.stop();
                    specialblockitem.frame = 7;
        
                    specialblockitem.parent.remove(specialblockitem,false,false);
                    this.discoveredblock.add(specialblockitem);
                    specialblockitem.body.immovable = true;
                }
            }   
            twen.start();
        }
    },
    
    callbackcoin: function(currentTarget, currentTween){
        this.pointtext(currentTarget.position.x,currentTarget.position.y,200);
        currentTarget.kill();
        this.ricicla.add(currentTarget);
    },
        
    callbackfungo: function(currentTarget, currentTween){
        var fungo = null;
        if(!currentTarget.vita){
            //identifica che si tratta di un fungo ed il tipo di fungo
            fungo = this.iterategroup(this.ricicla,2);
            if(fungo == null){
                fungo = game.add.sprite(currentTarget.position.x, currentTarget.position.y, 'animazione', 9);
                fungo.revive(currentTarget.position.x, currentTarget.position.y);
            } else{fungo.reset(currentTarget.position.x, currentTarget.position.y); console.log('ahah');}
            //fungo.vita=false;
            fungo.isFungo = true;
            fungo.scrivi = '1000';
        } else{
            fungo = this.iterategroup(this.ricicla,1);
            if(fungo == null){
                fungo = game.add.sprite(currentTarget.position.x, currentTarget.position.y, 'animazione', 10);
            } else{fungo.reset(currentTarget.position.x, currentTarget.position.y); console.log('ah');}
            fungo.vita = true;
            fungo.scrivi = '1UP';
        }
        
        fungo.coin = false;
        this.special.add(fungo);
        var ypos = currentTarget.position.y-32;
        var tween1 = game.add.tween(fungo).to({y: ypos}, 500, Phaser.Easing.Linear.none,false);
        tween1.onComplete.add(function move(currentTarget, currentTween) { 
            currentTarget.body.gravity.y = 1600;
            currentTarget.body.velocity.x = 150;
        });
        tween1.start();
    },
    
    timeout: function(){
        this.playerDie();
    },
    
    enemymove: function(tomove, block){
        if(tomove.body.blocked.right){tomove.body.velocity.x = -this.velocity;}
        else if(tomove.body.blocked.left){tomove.body.velocity.x = this.velocity;}
    },
    
    onOverlap: function(mario, movingTarget){
        movingTarget.body.gravity.y = 0;
        movingTarget.body.velocity.x = 0;
        movingTarget.kill();
        this.ricicla.add(movingTarget);
        var xpos = mario.scale.x * (mario.width+16);
        this.pointtext(mario.position.x-xpos,mario.position.y-mario.height-32,movingTarget.scrivi);
        if(movingTarget.isFungo){this.labels.updatescore(1000);}
        else{mario.body.touching.up=false;}
    },
    
    //tween di quando mario sbatte nei blocchi
    collisionTween: function(toTween){
        return game.add.tween(toTween).to({y: toTween.position.y-16}, 200, Phaser.Easing.Linear.none).to({y: toTween.position.y+4}, 125,Phaser.Easing.Linear.none).to({y: toTween.position.y}, 75,Phaser.Easing.Linear.none);
    },
    
    //x,y serve per sapere il punto in cui dovrà apparire il label, 
    //mentre point indica quanti punti deve guadagnare il giocatore
    pointtext(x,y, point){
        var text = game.add.text(x, y, point, game.global.style);
        var ypos = y-(32*2);
        var tween1 = game.add.tween(text).to({y: ypos}, 500, Phaser.Easing.Linear.none,false);
        tween1.onComplete.add(function distruggi() { text.destroy(); });
        tween1.start();
    },
    
    //funzione che serve per recuperare oggetti da riutilizzare
    //element è un intero che serve a specificare se si vuole recuperare un fungo, una moneta etc
    iterategroup(group, oggettoda){
        len = group.length;
        for (var i = 0; i < len; i++) { 
            var element = group.children[i];
            if(oggettoda==0 && element.coin) { return element; }
            else if(oggettoda==1 && element.vita){return element;}
            else if(oggettoda==2 && element.isFungo){return element;}
        }
        return null;
    }
};