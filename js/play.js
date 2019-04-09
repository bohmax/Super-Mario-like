var playState = {

    create: function() {

        game.stage.backgroundColor = '#3498db';
        this.labels = new Label();
        this.labels.draw();

        //array che contiene il punto di spwan dei nemici
        this.map = new Map();
        this.enemypoint = this.map.map.objects.enemy;
        //indica la posizione dell'ultimo nemico spawnato
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
        //gruppo usato per immagazzinare i nemici
        this.enemy = game.add.group();
        //gruppo usato per reciclare gli oggetti già utilizzati
        this.ricicla = game.add.group();
        //gruppo per inserire temporaneamente oggetti
        this.temporaneo = game.add.group();
        this.temp = game.add.group();
        this.tempenem = game.add.group();
        this.todelete = game.add.group();

        this.specialblock.enableBody = true;
        this.discoveredblock.enableBody = true;
        this.block.enableBody = true;
        this.extraobject.enableBody = true;
        this.special.enableBody = true;
        this.temporaneo.enableBody = true;
        this.enemy.enableBody = true;
        this.temp.enableBody = true;
        game.world.sendToBack(this.temporaneo);
        game.world.bringToTop(this.special);
        game.world.bringToTop(this.mario);

        this.map.map.createFromObjects('Special', 1, 'animazione', 0, true, false, this.specialblock);
        this.map.map.createFromObjects('block', 5, 'animazione', 8, true, false, this.block);

        this.specialblock.callAll('animations.add', 'animations', 'bling', [4, 5, 6, 5,4,4], 8, true);
        this.specialblock.callAll('animations.play', 'animations', 'bling');
        this.map.map.createFromObjects('Invisible', 1, 'animazione', 26,true,false,this.specialblock);
        this.map.map.createFromObjects('Special', 5, 'animazione', 8, true, false, this.specialblock);
        this.specialblock.setAll('body.immovable', true);
        this.block.setAll('body.immovable', true);

        //per rendere i muri invisibili colpibili solo dal basso
        this.specialblock.forEach(function(blocco){
            if(blocco.vita){
                blocco.body.checkCollision.up = false;
                blocco.body.checkCollision.left = false;
                blocco.body.checkCollision.right = false;
            }
        }, this)

        this.arraychildren = new Array(this.specialblock.children,this.block.children,this.temp.children,this.discoveredblock.children);
        this.special.children.sort(this.sortfunction);
        this.block.children.sort(this.sortfunction);
        this.enemypoint.sort(this.sortfunction);
        this.temp.children.sort(this.sortfunction);

        // Create a custom timer
        this.countDown = game.time.create(false);

        // Set our initial event
        this.countDown.add(Phaser.Timer.SECOND * 400, this.timeout, this);

        // Start the timer
        this.countDown.start();

        //imposto i muri per distruggere gli oggetti bonus
        var left = game.add.sprite(-64, game.height,null,0,this.extraobject);
        var bottom = game.add.sprite(-32, game.height+32,null,0,this.extraobject);
        left.scale.y = -game.height-32;
        bottom.scale.x = game.width+96;
        this.extraobject.setAll('fixedToCamera', true);

        //animazioni nemici
        this.mario.animations.add('walk', [1, 2, 3], 8, true);
        this.mario.animations.add('walkbig', [8, 9, 10], 8, true);
        this.mario.animations.add('walkfury', [15, 16, 17], 8, true);
    },

    update: function() {
        this.mario.speed = this.mario.body.velocity.x;
        if(this.special.length>0){
            game.physics.arcade.collide(this.special, this.map.layer,this.enemymove,null,this);
            game.physics.arcade.collide(this.special, this.specialblock,this.itemCollision,this.preventCollision,this);
            game.physics.arcade.collide(this.special, this.block,this.itemCollision,this.preventCollision,this);
            game.physics.arcade.collide(this.special, this.temp,this.itemCollision,this.preventCollision,this);
            game.physics.arcade.collide(this.special, this.discoveredblock);
            game.physics.arcade.overlap(this.mario, this.special, this.onOverlap,null,this);
            game.physics.arcade.overlap(this.special, this.extraobject, 
                                        function(r,s){console.log('delete from special');r.parent.remove(r);this.ricicla.add(r);r.kill();},null,this);
        }
        if(this.enemy.length>0){
            game.physics.arcade.collide(this.enemy, this.map.layer,this.enemymove,null,this);
            game.physics.arcade.collide(this.enemy, this.enemy,this.enemytouch,null,this);
            game.physics.arcade.overlap(this.enemy, this.tempenem,this.enemytouch,null,this);
            game.physics.arcade.collide(this.enemy, this.specialblock,this.itemCollision,this.preventCollision,this);
            game.physics.arcade.collide(this.enemy, this.block,this.itemCollision,this.preventCollision,this);
            game.physics.arcade.collide(this.enemy, this.temp,this.itemCollision,this.preventCollision,this);
            game.physics.arcade.collide(this.enemy, this.discoveredblock);
            game.physics.arcade.overlap(this.enemy, this.extraobject, 
                                        function(r,s){console.log('delete from enemy');r.parent.remove(r);this.ricicla.add(r);r.kill();},null,this);
            if(!this.hit){game.physics.arcade.collide(this.mario, this.enemy,this.onEnemyCollision,null,this);}
        }
        game.physics.arcade.collide(this.mario, this.specialblock, this.onSpecialCollide,null,this);
        game.physics.arcade.collide(this.mario, this.block, this.onSpecialCollide,null,this);
        game.physics.arcade.collide(this.mario, this.discoveredblock);
        game.physics.arcade.collide(this.mario, this.map.layer);
        game.physics.arcade.overlap(this.mario, this.temp,function(r,s){r.body.touching.up=true; r.body.velocity.y=50;},null,this);
        game.physics.arcade.overlap(this.todelete, this.extraobject, 
                                    function(r,s){console.log('delete from world');r.parent.remove(r);this.ricicla.add(r);r.kill();},null,this);

        if(!this.stop){
            this.movePlayer();
            this.enemySpawn();
        }
        this.movecamera();

        this.labels.settime(this.countDown);
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
                if(this.supermario.touchingdown()){
                    this.mario.isjumping = false;
                    this.mario.firstjump = true;
                }
                this.release = this.supermario.jump();
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
        this.stop = false;
        game.time.events.remove(this.timer);
        this.timer = null;
        this.hit = false;
        if(this.countDown.duration!=0){
            game.global.life--;
        } else{
            game.global.life=-1; 
        }
        game.state.start('loadplay');
    },

    enemySpawn: function(){
        var originaly = 0,originalx =this.enemypoint[0].x,cameraposition = game.camera.position.x+game.camera.width,consecutive=0,repeat=1;
        while(this.enemypoint.length>consecutive && originalx===this.enemypoint[0].x && repeat!=0){
            repeat = 0;
            originaly = this.enemypoint[0].y;
            while(this.enemypoint.length>consecutive && cameraposition+96 >= (this.enemypoint[consecutive].x-(64*repeat))){
                if(originaly===this.enemypoint[consecutive].y){
                    var goomba;
                    if(this.enemypoint[consecutive].properties.goomba){
                        goomba = this.createobject(this.enemypoint[consecutive].x,originaly-32,5,19);
                        if(!goomba.isGoomba){
                            goomba.animations.add('walk',[19,20],4,true);
                            goomba.animations.play('walk');
                            goomba.isGoomba = true;
                            goomba.myvelocity = 60;
                        } else {goomba.animations.play('walk'); goomba.body.moves = true;goomba.body.immovable = false;}
                        this.enemy.add(goomba);
                        goomba.body.velocity.x = -60;
                    } 
                    else{
                        goomba = this.createobject(this.enemypoint[consecutive].x,originaly-48,6,22);
                        if(!goomba.isTartaGoomba){
                            goomba.animations.add('walk',[22,23],4,true);
                            goomba.animations.add('scudo',[24,25],4,true);
                            goomba.isTartaGoomba = true;
                        }
                        goomba.timer = null;
                        goomba.myvelocity = 45;
                        goomba.attacked = false;
                        goomba.isDead = false;
                        goomba.animations.play('walk');
                        this.enemy.add(goomba);
                        goomba.body.setSize(32,48);
                        goomba.body.velocity.x = -45;
                    }
                    goomba.scale.setTo(1,1);
                    goomba.anchor.setTo(0, 0);
                    goomba.body.gravity.y = 1800;
                    goomba.direction = -1;
                    this.enemypoint.splice(consecutive,1);
                    repeat++;
                } else{consecutive++;}
            }
        }
    },

    onSpecialCollide: function(mario, specialblockitem) {
        if(mario.body.touching.up){
            var twen = this.collisionTween(specialblockitem);
            twen.onComplete.add(function(r,s){r.isTweening=false; this.block.add(r);},this);
            if(specialblockitem.parent == this.specialblock && !specialblockitem.isTweening){
                if(specialblockitem.coin>0){
                    this.labels.updatescore(200);
                    game.global.collectedcoin++;
                    this.labels.updatecollected(game.global.collectedcoin);
                    var coin1 = this.createobject(specialblockitem.position.x,specialblockitem.position.y,0,'14');
                    if(!coin1.coin){
                        coin1.animations.add('flip', [0, 1, 2, 3], 20, true);
                        coin1.animations.play('flip');
                        coin1.coin = true;
                    }
                    var tween = game.add.tween(coin1).to({y: coin1.position.y-(32*3)}, 250, Phaser.Easing.Linear.none).to({y:   coin1.position.y-16}, 175,Phaser.Easing.Linear.none);
                    tween.onComplete.add(this.callbackcoin, this);
                    tween.start();
                    specialblockitem.coin--;
                    twen.onComplete.add(function(r,s){
                        r.isTweening=false;
                        if(r.coin==0){
                            this.discoveredblock.add(r);
                        }
                        r.body.immovable = true;},this);
                }
                //genera il fungo o la stella
                else if(specialblockitem.coin!=0){
                    specialblockitem.coin = 0;
                    if(specialblockitem.stella){twen.onComplete.add(this.callbackstella, this);}
                    else {twen.onComplete.add(this.callbackfungo, this);}
                }
                if(specialblockitem.coin==0){
                    specialblockitem.animations.stop();
                    specialblockitem.frame = 7;
                }
            }   
            twen.start();
            this.temp.add(specialblockitem);
            this.temp.children.sort(this.sortfunction);
            specialblockitem.isTweening = true;
        }
    },

    callbackcoin: function(currentTarget, currentTween){
        this.pointtext(currentTarget.position.x,currentTarget.position.y,200);
        currentTarget.kill();
        this.ricicla.add(currentTarget);
    },

    callbackfungo: function(currentTarget, currentTween){
        currentTarget.parent.remove(currentTarget,false,false);
        this.discoveredblock.add(currentTarget);
        currentTarget.body.immovable = true;
        currentTarget.isTweening = false;
        var fungo = null;
        if(!currentTarget.vita){
            //identifica che si tratta di un fungo ed il tipo di fungo
            if(!this.supermario.isBigger){
                fungo = this.createobject(currentTarget.position.x,currentTarget.position.y,2,'10');
                if(!fungo.isFungo){
                    fungo.isFungo = true;
                    fungo.scrivi = '1000';
                    fungo.myvelocity = 150;
                }
            } else{
                fungo = this.createobject(currentTarget.position.x,currentTarget.position.y,3,'12');
                if(!fungo.isPianta){
                    fungo.isPianta = true;
                    fungo.animations.add('spling', [11, 12, 13, 14,13,12], 8, true);
                    fungo.animations.play('spling');
                    fungo.myvelocity = 150;
                }
            }
            fungo.scrivi = '1000';
        } else{
            fungo = this.createobject(currentTarget.position.x,currentTarget.position.y,1,'11');
            currentTarget.body.checkCollision.up = true;
            currentTarget.body.checkCollision.left = true;
            currentTarget.body.checkCollision.right = true;
            if(!fungo.vita){
                fungo.vita = true;
                fungo.scrivi = '1UP';
                fungo.myvelocity = 150;
            }
        }
        this.temporaneo.add(fungo);
        fungo.body.gravity.y = 0;
        fungo.coin = false;
        var ypos = currentTarget.position.y-32;
        var tween1 = game.add.tween(fungo).to({y: ypos}, 500, Phaser.Easing.Linear.none,false);
        tween1.onComplete.add(function (currentTarget, currentTween) {
            this.special.add(currentTarget);
            if(!fungo.isPianta){
                currentTarget.body.gravity.y = 1800;
                currentTarget.body.velocity.x = 150;
            }
        },this);
        tween1.start();
    },

    callbackstella: function(currentTarget, currentTween){
        currentTarget.isTweening = false;
        var stella = this.createobject(currentTarget.position.x,currentTarget.position.y,4,'16');
        if(!stella.stella){
            stella.animations.add('lampeggia', [15, 16, 17, 18,17,16], 8, true);
            stella.animations.play('lampeggia');
            stella.scrivi = '1000';
            stella.isStella=true;
            stella.myvelocity = 150;
        }
        this.temporaneo.add(stella);
        var ypos = currentTarget.position.y-32;
        var tween1 = game.add.tween(stella).to({y: ypos}, 500, Phaser.Easing.Linear.none,false);
        tween1.onComplete.add(function move(currentTarget, currentTween) { 
            this.special.add(currentTarget);
            currentTarget.body.gravity.y = 1000;
            currentTarget.body.velocity.x = 150;
            currentTarget.body.velocity.y = -250;
            currentTarget.body.bounce.x=1;
            currentTarget.body.bounce.y=1;
            currentTarget.body.checkCollision.up = false;
        },this);
        tween1.start();
        currentTarget.parent.remove(currentTarget,false,false);
        this.discoveredblock.add(currentTarget);
        currentTarget.body.immovable = true;
    },

    timeout: function(){
        this.playerDie();
    },

    enemytouch: function(enemy1, enemy2){
        //non è una tartaruga che rotola oppure rotolano entrambe
        if((!enemy1.isDead && !enemy2.isDead) || (enemy1.isDead && enemy2.isDead)){ 
            if(enemy1.position.x<enemy2.position.x){
                enemy1.body.velocity.x = -enemy1.myvelocity;
                enemy2.body.velocity.x = enemy2.myvelocity;
                this.changedirectionleft(enemy2);
                this.changedirectionright(enemy1);
            }
            else if(enemy1.position.x>=enemy2.position.x){
                enemy1.body.velocity.x = enemy1.myvelocity; 
                enemy2.body.velocity.x = -enemy2.myvelocity;
                this.changedirectionleft(enemy1);
                this.changedirectionright(enemy2);
            }
            enemy1.direction = enemy1.direction*-1;
            enemy2.direction = enemy2.direction*-1;
        } else{
            var tarta,enemy;
            if(enemy1.isDead){
                tarta = enemy1;
                enemy = enemy2;
            } else{
                tarta = enemy2;
                enemy = enemy1;
            }
            var direction = 1;
            enemy.body.velocity.y=-350;
            if(tarta.position.x<enemy.position.x+10)
                direction = -1;        
            else if(tarta.body.velocity.x<0) {direction = -1;}
            enemy.body.velocity.x=enemy.myvelocity*direction;
            if(enemy.position.x+16 > tarta.position.x ){
                tarta.body.velocity.x = 400;
                tarta.direction = 1;
            } else{ tarta.body.velocity.x = -400; tarta.direction = -1;}
            this.pointtext(enemy.position.x,enemy.position.y,'100');
            this.labels.updatescore(100);
            this.todelete.add(enemy);
            enemy.scale.setTo(1, -1);
            enemy.anchor.setTo(0, 1);
            enemy.body.velocity.y=-550;
            enemy.body.velocity.x=150*direction;
            enemy.direction = direction;
        }
    },

    enemymove: function(tomove, block){
        if(tomove.body.blocked.right){
            tomove.body.velocity.x = -tomove.myvelocity; 
            this.changedirectionright(tomove);
            tomove.direction =-1;
        }
        else if(tomove.body.blocked.left){
            tomove.body.velocity.x = tomove.myvelocity; 
            this.changedirectionleft(tomove);
            tomove.direction =1;
        }
    },

    onOverlap: function(mario, movingTarget){
        movingTarget.body.gravity.y = 0;
        movingTarget.body.velocity.x = 0;
        movingTarget.kill();
        this.ricicla.add(movingTarget);
        this.pointtext(movingTarget.position.x,movingTarget.position.y,movingTarget.scrivi);
        if(!movingTarget.vita){this.labels.updatescore(1000);}
        if(!movingTarget.vita){
            if(!movingTarget.isStella){
                //animazione di gigantificazione di mario
                if(movingTarget.isFungo && !this.supermario.isBigger){ this.stopgame(); this.supermario.biganimation(this);}
                else if(movingTarget.isPianta && this.supermario.isBigger && !this.supermario.isFury){
                    this.stopgame();
                    this.supermario.isFury = true;
                    this.supermario.standstill();
                    var twen = game.add.tween(this.mario).to( {tint: 0x656363}, 400,null,true, 0, 1, true);
                    twen.onComplete.add(function(r,s){this.resumegame();},this);}
            } else{
                this.mario.invincibile = true;
                var twen = game.add.tween(this.mario).to( {tint: 0x656363}, 950,null,true, 0, 5, true);
                twen.onComplete.add(function(r,s){this.mario.invincibile = false; this.resumegame();},this);
            }
        }
        else{
            mario.body.touching.up=false;
            if(movingTarget.vita){game.global.life++;}
        }
    },

    onEnemyCollision: function(mario, enemy){
        if(mario.body.touching.down){
            mario.body.touching.down = false;
            if(enemy.isGoomba){
                enemy.animations.stop();
                enemy.frame = 21;
                enemy.body.moves = false;
                this.tempenem.add(enemy);
                enemy.position.y = enemy.position.y+16;
                this.pointtext(enemy.position.x,enemy.position.y,'100');
                this.labels.updatescore(100);
                game.time.events.add(850, function () {
                    enemy.kill();
                    this.ricicla.add(enemy);
                },this);
            } else{
                if(!enemy.attacked){
                    enemy.attacked = true;
                    enemy.animations.play('scudo');
                    enemy.myvelocity = 0;
                    enemy.body.velocity.x = 0;
                    enemy.body.setSize(32,28);
                    enemy.position.y += 20;
                    enemy.timer = game.time.events.add(7950, function () {
                        if(!enemy.isDead){
                            enemy.attacked = false;
                            enemy.myvelocity = 50;
                            enemy.animations.play('walk');
                            if(enemy.scale.x>0)
                                enemy.body.velocity.x = -enemy.myvelocity;
                            else enemy.body.velocity.x = enemy.myvelocity;
                            enemy.position.y -= 20;
                            enemy.body.setSize(32,48);
                        }
                    },this);
                } else{
                    this.tartadead(mario,enemy);
                }
            }
            mario.body.velocity.y = -400;
            if(enemy.position.x+16>mario.position.x) {mario.body.velocity.x = -200;}
            else{mario.body.velocity.x = 200;}
        } else{
            console.log(this.supermario.isBigger);
            if(enemy.attacked && !enemy.isDead){
                mario.body.touching.down = false;
                this.tartadead(mario,enemy);
            }else{
                if(!this.mario.invincibile){
                    if(!enemy.attacked){
                        if(enemy.position.x+16>mario.position.x){
                            this.changedirectionright(enemy);
                        } else this.changedirectionleft(enemy);
                    }
                    if(!this.supermario.isBigger){
                        this.stopgame();
                        this.supermario.standdead();
                        mario.body.checkCollision.none = true;
                        mario.body.checkCollision.down = false;
                        enemy.timer = game.time.events.add(100, function () {
                            mario.body.moves = true;
                            mario.body.gravity.y = 1000;
                            mario.body.velocity.y = -450; 
                        },this);
                    } else{
                        this.hit = true;
                        this.stopgame();
                        this.supermario.smallanimation(this,enemy);
                        var twe = game.add.tween(this.mario).to( { alpha: 0.25 }, 500, "Linear", false,0,5,false).to({ alpha: 1 }, 500, "Linear",true);
                        twe.onComplete.add(function(r,s){
                            var tween = game.add.tween(this.mario).to({ alpha: 1 }, 500, "Linear",true);
                            tween.onComplete.add(function(r,s){
                                this.hit = false; 
                                this.timer = null;
                            },this);
                        },this);
                        twe.start();
                    }
                } else{
                    this.deleteenemy(enemy,mario);
                    this.mario.body.velocity.x = this.mario.speed;
                }
            }
        }
    },

    //tween di quando mario sbatte nei blocchi
    collisionTween: function(toTween){
        var start = toTween.position.y
        return game.add.tween(toTween).to({y: start-16}, 200, Phaser.Easing.Linear.none).to({y: start+4}, 125,Phaser.Easing.Linear.none).to({y: start}, 75,Phaser.Easing.Linear.none);
    },

    preventCollision: function(special, blocco){
        if(!special.isStella){
            if(blocco.isTweening || special.position.x<=blocco.position+16 || special.isStella){return true;}
            //fungo è oltre la metà del blocco
            if(special.position.x>blocco.position.x+16){ 
                return this.nextblock(this.arraychildren,blocco.position.x+32,blocco.position.y+32,3);
            }
            else {return true;}
        } else{
            if(blocco.object){
                if(blocco.position.y>=special.position.y){return false}
                else{
                    this.arraychildren[2].sort(this.sortfunction);
                    if(special.body.velocity.x>0)  
                        return this.nextblock(this.arraychildren,blocco.position.x-32,blocco.position.y,4);
                    else return this.nextblock(this.arraychildren,blocco.position.x+32,blocco.position.y,4);
                }
                return true;
            }
        }
    },

    itemCollision: function(special, blocco){
        if(!(special.parent == this.enemy)){
            if(!special.isStella){
                if(special.body.velocity.x==0){
                    if(special.body.touching.right)
                        special.body.velocity.x=-150;
                    else special.body.velocity.x=150;
                }else if(blocco.isTweening){
                    var direction = 1;
                    special.body.velocity.y=-350;
                    if(special.position.x<blocco.position.x+10 && special.body.velocity.x>0){
                        direction = -1;        
                    } else if(special.body.velocity.x<0) {direction = -1;}
                    special.body.velocity.x=special.myvelocity*direction;
                }
            }
        } 
        else{
            if(special.body.velocity.x==0){
                if(special.body.touching.right)
                    special.body.velocity.x=-special.myvelocity;
                else special.body.velocity.x=special.myvelocity;
            }else if(blocco.isTweening){
                this.deleteenemy(special,blocco);
            }
        }
    },

    //funzione che serve per bloccare gli altri oggetti in movimento nel gioco
    stopgame: function(){
        game.tweens.pauseAll();
        this.special.setAll('body.moves',false);
        this.enemy.setAll('body.moves',false);
        this.enemy.setAll('animations.paused',true);
        this.countDown.pause();
        this.specialblock.forEach(function(blocco){
            blocco.animations.stop();
        }, this);
        this.mario.body.moves = false;
        this.supermario.lastframe = this.mario.frame; 
        this.mario.animations.stop();
        this.mario.body.velocity.x=0;
        this.stop = true;
        this.mario.play = false;
    },

    resumegame: function(){
        game.tweens.resumeAll();
        this.special.setAll('body.moves',true);
        this.enemy.setAll('body.moves',true);
        this.enemy.setAll('animations.paused',false);
        this.specialblock.forEach(function(blocco){
            if((blocco.frame-4)<2)
                blocco.animations.play('bling');
        }, this);
        this.mario.body.moves = true;
        this.stop = false;
        if(this.supermario.lastframe===4){this.mario.frame = 13;}
        this.countDown.resume();
    },

    tartadead: function(mario, enemy){
        enemy.isDead = true;
        game.time.events.remove(enemy.timer);
        enemy.timer = null;
        this.pointtext(enemy.position.x,enemy.position.y,'500');
        this.labels.updatescore(500);
        enemy.animations.stop();
        enemy.frame = 24;
        enemy.myvelocity = 400;
        if(enemy.position.x+16 > mario.position.x ){
            enemy.body.velocity.x = 400;
        } else enemy.body.velocity.x = -400; 
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
            else if(oggettoda==3 && element.isPianta){return element;}
            else if(oggettoda==4 && element.isStella){return element;}
            else if(oggettoda==5 && element.isGoomba){return element}
            else if(oggettoda==6 && element.isTartaGoomba){return element}
        }
        return null;
    },

    changedirectionright(object){
        if(object.isTartaGoomba){
            object.scale.x=1;
            object.anchor.setTo(0, 0); 
        }  
    },

    changedirectionleft(object){
        if(object.isTartaGoomba){
            object.scale.x=-1;
            object.anchor.setTo(1, 0);
        }  
    },

    //funzione utilizzata per creare e reciclare gli oggetti già utilizzat
    //currenttarget è per la posizione,
    //i l'indice da passare a iterate group
    //j il frame da visualizzare
    createobject(x,y,i,j){
        var object = this.iterategroup(this.ricicla,i);
        if(object == null){
            object = game.add.sprite(x, y, 'animazione', j);
        } else{object.reset(x, y);}
        return object;
    },

    deleteenemy(enemy,second){
        var direction = 1;
        if(enemy.position.x<second.position.x+10 && enemy.body.velocity.x>0){
            direction = -1;        
        } else if(enemy.body.velocity.x<0) {direction = -1;}
        this.pointtext(enemy.position.x,enemy.position.y,'100');
        this.labels.updatescore(100);
        this.todelete.add(enemy);
        enemy.scale.setTo(1, -1);
        enemy.anchor.setTo(0, 1);
        enemy.body.velocity.y=-550;
        enemy.body.velocity.x=150*direction;
    },

    binarysearch(arr, x,y, start, end) { 

        // Base Condtion 
        if (start > end) return false; 

        // Find the middle index 
        let mid=Math.floor((start + end)/2); 
        //console.log(mid);
        // Compare mid with given key x 
        if (arr[mid].position.x===x) {
            if(arr[mid].position.y===y)return true;
            else if(arr[mid].position.y>y) return binarysearch(arr, x,y, start, mid-1);
            else return this.binarysearch(arr, x,y, mid+1, end);

        }

        // If element at mid is greater than x, 
        // search in the left half of mid 
        if(arr[mid].position.x > x)  
            return this.binarysearch(arr, x,y, start, mid-1); 
        else

            // If element at mid is smaller than x, 
            // search in the right half of mid 
            return this.binarysearch(arr, x,y, mid+1, end); 
    },

    //ritorna false se è presente un blocco con cui colliderà
    nextblock(array,x,y,lenght){
        var i = 0;
        for(i=0;i<lenght;i++)
            if(this.binarysearch(array[i],x,y,0,array[i].length-1)) return false;
        return true;
    },

    sortfunction(a,b){
        var xa,xb,ya,yb;
        if(a.position!=undefined){
            xa = a.position.x; 
            xb = b.position.x;
            ya = a.position.y;
            yb = b.position.y;
        } else {xa = a.x;xb = b.x;ya = a.y;yb = b.y;}
        if(xa===xb) 
            return ya-b.yb;
        else return xa-xb;
    }
};