var playState = {

    init: function(map,backcolor,memory,afterscenechange,x,y) {
        this.mapname = map;
        if(backcolor!=undefined)
            this.backcolor = backcolor;
        else this.backcolor = '#3498db';
        if(afterscenechange != undefined){ //variabile che mi indica se devo solo spostare mario
            //dopo il livello sotteraneo
            this.mario.body.velocity.x = 0;
            this.mario.body.velocity.y = 0;
            this.map.map.destroy();
            this.map.layer.destroy();
            if(afterscenechange)
                this.moveoncreate = true;
            else this.moveoncreate = false;
            this.transfer.destroy();
            this.coin.destroy();
            this.blocco1.destroy();
            this.mario.position.x = x;
            this.mario.position.y = y;
            this.specialblock.setAll('alpha', 1);
            this.discoveredblock.setAll('alpha', 1);
        } 
        else if(memory != undefined){ //variabile che mi indica se devo inizializzare tutto
            //livello sotteraneo
            this.mario.body.velocity.x = 0;
            this.mario.body.velocity.y = 0;
            this.memory = true;
            this.map.map.destroy();
            this.map.layer.destroy();
        } else this.memory = false; //iniziale
    },

    create: function() {

        game.stage.backgroundColor = this.backcolor;

        //array che contiene il punto di spwan dei nemici
        this.map = new Map(this.mapname);
        //game.physics.arcade.forceX = true;
        game.physics.arcade.OVERLAP_BIAS = 12;
        if(!this.memory){
            this.labels = new Label();
            this.labels.draw();
            this.enemypoint = [...this.map.map.objects.enemy];
            //indica la posizione dell'ultimo nemico spawnato
            this.supermario = new Mario(this.map);
            this.mario = this.supermario.mario;

            //gravity & movements animation
            this.supermario.gravity();
            this.supermario.animation();
            this.labels.followcamera();

            this.cursor = game.input.keyboard.createCursorKeys();
            this.a = {a: game.input.keyboard.addKey(Phaser.Keyboard.A)};

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
            this.transfer = game.add.group();
            //gruppo usato per memorizzare i punti che verrano usati per cambiare la mappa
            this.enemy = game.add.group();
            //gruppo usato per reciclare gli oggetti già utilizzati
            this.ricicla = game.add.group();
            //gruppo per inserire temporaneamente oggetti
            this.temporaneo = game.add.group();
            //gruppo in cui sono inserite le sfere di fuoco di mario
            this.fireball = game.add.group();
            //gruppo usato quando si distrugge un blocco
            this.rotate = game.add.group();
            this.temp = game.add.group();
            this.tempenem = game.add.group();
            this.todelete = game.add.group();
            this.toTween = game.add.group();
            this.getqueen = game.add.group();

            this.specialblock.enableBody = true;
            this.discoveredblock.enableBody = true;
            this.block.enableBody = true;
            this.extraobject.enableBody = true;
            this.special.enableBody = true;
            this.temporaneo.enableBody = true;
            //this.transfer.enableBody = true;
            this.enemy.enableBody = true;
            this.temp.enableBody = true;
            this.toTween.enableBody = true;
            this.fireball.enableBody = true;

            game.world.sendToBack(this.temporaneo);
            game.world.bringToTop(this.special);

            this.map.map.createFromObjects('Special', 1, 'animazione', 0, true, false, this.specialblock);
            this.map.map.createFromObjects('block', 5, 'animazione', 8, true, false, this.block);
            this.map.map.createFromObjects('endgame', 43, 'animazione', 35, true, false,this.getqueen);

            if(this.map.map.objects.transfer!=undefined){
                this.map.map.objects.transfer.forEach(function(item){
                    var sprite = game.add.sprite(item.x,item.y-32,'animazione',37);
                    sprite.levelname = item.levelname;
                    this.transfer.add(sprite);
                    game.physics.arcade.enable(sprite);
                    sprite.body.immovable = true;
                    sprite.body.moves = false;
                },this);

            }


            this.specialblock.callAll('animations.add', 'animations', 'bling', [4, 5, 6, 5,4,4], 8, true);
            this.specialblock.callAll('animations.play', 'animations', 'bling');
            this.map.map.createFromObjects('Invisible', 1, 'animazione', 26,true,false,this.specialblock);
            this.map.map.createFromObjects('Special', 5, 'animazione', 8, true, false, this.specialblock);
            this.specialblock.setAll('body.immovable', true);
            this.block.setAll('body.immovable', true);

            this.queen = this.getqueen.getFirstAlive();
            this.queen.scale.y=1;
            this.queen.position.y -= 32;
            game.physics.arcade.enable(this.queen);
            this.queen.body.setSize(256,game.world.height*4,-256,-2*game.world.height); 

            //per rendere i muri invisibili colpibili solo dal basso
            this.specialblock.forEach(function(blocco){
                if(blocco.vita){
                    blocco.body.checkCollision.up = false;
                    blocco.body.checkCollision.left = false;
                    blocco.body.checkCollision.right = false;
                    blocco.body.checkCollision.down = true;
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
            this.stop = false;

            //imposto i muri per distruggere gli oggetti bonus
            var left = game.add.sprite(-64, game.height,null,0,this.extraobject);
            var bottom = game.add.sprite(-32, game.height+32,null,0,this.extraobject);
            left.scale.y = -game.height-32;
            bottom.scale.x = game.width+96;
            this.hit = false;
            this.finito = false;
            this.end = false;
            this.uscito = false;
            this.extraobject.setAll('fixedToCamera', true);

            //sound
            this.volumemusic = game.global.music;
            if(game.global.rip_musica) this.volumemusic = 0;
            var volumesound = game.global.sound;
            if(game.global.rip_sound) volumesound = 0;

            this.sounds = game.add.audio('music');
            this.musica = game.add.audio('music');
            // Tell Phaser that it contains multiple sounds
            this.sounds.allowMultiple = true;
            // Split the audio. The last 2 paramters are:
            // The start position and the duration of the sound 
            this.sounds.addMarker('dead', 3.663, 2.682,volumesound); 
            this.sounds.addMarker('win', 6.345, 5.524,volumesound);
            this.sounds.addMarker('life', 11.864, 0.81,volumesound);
            this.sounds.addMarker('spacca', 12.692, 0.512,volumesound);
            this.sounds.addMarker('colpo_blocco', 13.220, 0.185,volumesound);
            this.sounds.addMarker('monetina', 13.405, 0.902,volumesound);
            this.sounds.addMarker('fireball', 14.333, 0.08,volumesound);
            this.sounds.addMarker('scalcia', 14.444, 0.149,volumesound);
            this.sounds.addMarker('power_up', 14.607, 0.924,volumesound);
            this.sounds.addMarker('uscita_power_up', 15.567, 0.555,volumesound);
            this.sounds.addMarker('jump', 16.130, 0.555,volumesound);
            this.sounds.addMarker('power_down', 47.573, 0.784,volumesound);
            this.sounds.addMarker('esplosione', 48.330, 0.391,volumesound);
            this.sounds.addMarker('timeout', 48.717, 2.823,volumesound);
            this.sounds.addMarker('starpower', 48.717, 2.823,volumesound);

            this.musica.addMarker('musica', 16.682, 28.739,this.volumemusic,true);
            this.musica.addMarker('musica_power_up', 14.607, 0.924,volumesound,false);
            this.musica.addMarker('musica_underground', 51.540, 13.997);
            this.musica.addMarker('musica_invincibile', 65.537, 9.491,volumesound,false);
            this.musica.play('musica');

            game.time.advancedTiming = true;
        } 
        else if(this.moveoncreate == undefined){
            var mariocopy = [...this.map.map.objects.endgame];
            //game.world.add(this.mario);
            this.mario.position.x = mariocopy[0].x+32;
            this.mario.position.y = mariocopy[0].y+32;
            var monete = [...this.map.map.objects.coin];
            this.blocco1 = game.add.group();
            this.coin = game.add.group();
            this.blocco1.enableBody = true;
            this.coin.enableBody = true;
            var transfer = [...this.map.map.objects.transfer];
            this.map.map.createFromObjects('coin', 51, 'animazione', 0, true, false, this.coin);
            this.map.map.createFromObjects('blocco', 12, 'animazione', 39, true, false, this.blocco1);
            this.coin.callAll('animations.add', 'animations', 'flip', [0, 1, 2, 3], 39, true);
            this.blocco1.forEach(function(item){
                game.physics.arcade.enable(item);
                item.body.immovable = true;
                //item.body.allowGravity = false;
            });
            this.specialblock.setAll('alpha', 0);
            this.discoveredblock.setAll('alpha', 0);
            transfer.forEach(function(item){
                var sprite = game.add.sprite(item.x,item.y-32,'animazione',38);
                sprite.PosX = item.properties.PosX+48;
                sprite.PosY = item.properties.PosY-32;
                this.transfer.add(sprite);
                game.physics.arcade.enable(sprite);
                sprite.body.immovable = true;
                sprite.body.setSize(32,64);
                this.check = sprite;
            },this);
            
            var cont = game.time.create(false);
            this.countDown.start();
            cont.add(Phaser.Timer.SECOND * this.countDown.duration / Phaser.Timer.SECOND, this.timeout, this);
            var temp = this.countDown;
            this.countDown = cont;
            this.countDown.start();
            temp.destroy();
        } 
        else {
            var cont = game.time.create(false);
            this.countDown.start();
            cont.add(Phaser.Timer.SECOND * this.countDown.duration / Phaser.Timer.SECOND, this.timeout, this);
            var temp = this.countDown;
            this.countDown = cont;
            this.countDown.start();
            temp.destroy();
            for (var i = 0;i<this.enemypoint.length;i++){
               if(this.enemypoint[i].x<this.mario.position.x){
                   this.enemypoint.splice(i,1);
                i--;
               }
            };
        }
        game.world.sendToBack(this.map.map);
        game.world.sendToBack(this.map.layer);
        game.world.bringToTop(this.mario);
    },

    /*render: function() {
        //game.debug.text(game.time.fps, 2, 14, "#00ff00");
        //game.debug.soundInfo(this.sounds);
        game.debug.body(this.mario);
        game.debug.body(this.queen);
        //this.enemy.forEach(function(item) {
        //    game.debug.body(item);
        //});
        if(this.block!=undefined)
        this.block.forEach(function(item) {
            game.debug.body(item);
        });
    },*/

    update: function() {
        this.mario.speed = this.mario.body.velocity.x;
        this.toTween.forEach(function(item) {
            var pos = item.padre.position;
            item.position.x = pos.x;
            item.position.y = pos.y;
            //game.debug.body(item);
        });
        this.rotate.forEach(function(item) {
            item.angle += 1;
        });

        //------------collisioni degli oggetti---------
        game.physics.arcade.collide(this.special, this.map.layer,this.enemymove,null,this);
        game.physics.arcade.collide(this.special, this.specialblock,this.itemCollision,this.preventCollision,this);
        game.physics.arcade.collide(this.special, this.block,this.itemCollision,this.preventCollision,this);
        game.physics.arcade.collide(this.special, this.temp,this.itemCollision,this.preventCollision,this);
        game.physics.arcade.collide(this.special, this.discoveredblock);
        game.physics.arcade.overlap(this.mario, this.special, this.onOverlap,null,this);
        game.physics.arcade.overlap(this.special, this.extraobject, 
                                    function(r,s){console.log('delete from special');r.parent.remove(r);this.ricicla.add(r);r.kill();},null,this);
        //--------------------------------------------

        //------------collisioni dei nemici ---------
        game.physics.arcade.collide(this.enemy, this.map.layer,this.enemymove,null,this);
        game.physics.arcade.collide(this.enemy, this.enemy,this.enemytouch,null,this);
        game.physics.arcade.overlap(this.enemy, this.tempenem,this.enemytouch,null,this);
        game.physics.arcade.collide(this.enemy, this.specialblock,this.itemCollision,this.preventCollision,this);
        game.physics.arcade.collide(this.enemy, this.block,this.itemCollision,this.preventCollision,this);
        game.physics.arcade.collide(this.enemy, this.temp,this.itemCollision,this.preventCollision,this);
        game.physics.arcade.collide(this.enemy, this.discoveredblock);
        game.physics.arcade.overlap(this.enemy, this.extraobject, 
                                    function(r,s){console.log('delete from enemy');r.parent.remove(r);this.ricicla.add(r);r.kill();},null,this);
        //--------------------------------------------

        //------------collisioni fireball--------- 
        game.physics.arcade.collide(this.fireball, this.map.layer,this.firewithwall,null,this);
        game.physics.arcade.collide(this.fireball, this.block,this.firewithwall,null,this);
        game.physics.arcade.collide(this.fireball, this.discoveredblock,this.firewithwall,null,this);
        game.physics.arcade.collide(this.fireball, this.specialblock,this.firewithwall,null,this);
        game.physics.arcade.overlap(this.fireball, this.enemy,this.firewithenemy,null,this);
        game.physics.arcade.overlap(this.fireball, this.extraobject, 
                                    function(r,s){console.log('delete from fire');r.parent.remove(r);this.ricicla.add(r);r.kill();},null,this);                 
        //--------------------------------------------

        //------------collisioni mario---------
        game.physics.arcade.collide(this.mario, this.specialblock, this.onSpecialCollide,this.preventMarioCollision,this);
        game.physics.arcade.collide(this.mario, this.block, this.onSpecialCollide,this.preventMarioCollision,this);
        game.physics.arcade.collide(this.mario, this.discoveredblock,null,this.preventMarioCollision,this);
        game.physics.arcade.collide(this.mario, this.map.layer);
        game.physics.arcade.collide(this.mario, this.toTween,null,this.preventMarioCollision,this);
        if(!this.hit){game.physics.arcade.collide(this.mario, this.enemy,this.onEnemyCollision,null,this);}
        game.physics.arcade.overlap(this.mario, this.queen,this.endgame,null,this);
        game.physics.arcade.overlap(this.todelete, this.extraobject, 
                                    function(r,s){console.log('delete from world');r.parent.remove(r);this.ricicla.add(r);r.kill();},null,this);
        if(this.memory){//se mi trovo nel livello sotteraneo
            game.physics.arcade.collide(this.mario, this.blocco1,null,this.preventMarioCollision,this);
            game.physics.arcade.collide(this.mario, this.transfer,function(mario,altro){
                if(this.cursor.right.isDown && this.mario.body.touching.right){
                    console.log(altro.PosX)
                    var x = altro.PosX;
                    var y = altro.PosY;
                    game.state.start('play', false, false, 'map','#3498db',false,true,x,y);
                }
            },null,this); 
            game.physics.arcade.overlap(this.mario, this.coin,function(mario,coin){
                mario.body.touching.up=false;
                this.sounds.play('monetina');
                this.pointtext(coin.position.x,coin.position.y,200);
                game.global.collectedcoin++;
                this.labels.updatecollected(game.global.collectedcoin);
                coin.kill();
                this.ricicla.add(coin);
            },null,this);
        } else {
            game.physics.arcade.collide(this.mario, this.transfer,function(mario,altro){
                if(mario.position.x-32>altro.position.x+8 && mario.position.x-32 < altro.position.x+38){
                    if(this.cursor.down.isDown){
                        this.sounds.play('life');
                        this.mario.position.y = 64;
                        game.state.start('play', false, false, 'underworld','#000000',true);
                    }
                }
            },null,this);                       
        }
        //--------------------------------------------
        //console.log(this.stop);
        if(!this.stop){
            this.movePlayer();
            if(this.enemypoint.length>0)
                this.enemySpawn();
            this.labels.settime(this.countDown);
        } else if(this.end){this.playerDie();}
        this.movecamera();

        if(!this.mario.inWorld){
            if(!this.uscito){
                this.musica.stop();
                this.sounds.play('dead').onMarkerComplete.add(function(){this.end = true;},this);
                this.uscito = true;
                this.stop = true;
                this.mario.body.velocity.x = 0;
            }
        }
    },

    movePlayer: function() {
        // If the left arrow key is pressed 
        if (this.cursor.left.isDown) {
            // Move the player to the left
            // The velocity is in pixels per second
            if(this.time)
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
                this.release = this.supermario.jump(this);
            }
        }
        else if(!this.cursor.up.isDown){
            if(this.supermario.touchingdown()){
                this.mario.isjumping = false;
                this.release = false;
                this.supermario.firstjump = true;
            } else
                this.release = true;
        }
        if(this.a.a.isDown){
            this.supermario.spara(this);
        }
    },

    movecamera: function(){
        var x = game.camera.x + (game.width/2);
        if(this.mario.x > x )
            game.camera.x -= (-this.supermario.mario.x + x);
    },

    playerDie: function() {
        // When the player dies, we go to the menu
        this.stop = false;
        game.time.events.remove(this.timer);
        this.timer = null;
        this.hit = false;
        this.musica.destroy();
        this.sounds.destroy();
        this.specialblock.destroy();        
        this.discoveredblock.destroy();
        this.block.destroy();        
        this.extraobject.destroy();        
        this.special.destroy();
        this.transfer.destroy();
        this.enemy.destroy();       
        this.ricicla.destroy();
        this.fireball.destroy();
        this.rotate.destroy();        
        this.temp.destroy();      
        this.temporaneo.destroy();
        this.todelete.destroy();
        this.toTween.destroy();        
        this.getqueen.destroy();
        this.memory = undefined
        this.moveoncreate = undefined
        if(this.finito){
            this.finito = false;
            game.state.start('menu');   
        } else{
            if(this.countDown.duration!=0){
                game.global.life--;
            } else{
                game.global.life=-1; 
            }
            game.state.start('loadplay',true,false,this.mapname);
        }
    },

    enemySpawn: function(){
        var originaly = 0,originalx = this.enemypoint[0].x,cameraposition = game.camera.position.x+game.camera.width,consecutive=0,repeat=1;
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
                        goomba.body.setSize(32,28,0,4);
                    } 
                    else{ //tartuga
                        goomba = this.createobject(this.enemypoint[consecutive].x,originaly-64,6,22);
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
                        goomba.body.setSize(32,44,0,20);
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
            //spacca il muro se mario è grande
            if(this.supermario.isBigger && specialblockitem.brake && this.mario.body.touching.up){
                this.sounds.play('spacca');
                var start = specialblockitem.position.y;
                var twen = game.add.tween(specialblockitem).to({y: start-8}, 50, Phaser.Easing.Linear.none);
                twen.onComplete.add(function(specialblockitem,s){
                    specialblockitem.isTweening = false;
                    var posy = specialblockitem.position.y+8,posx = specialblockitem.position.x+16;
                    var sprite = [
                        game.add.sprite(specialblockitem.position.x, posy, 'animazione', 34),
                        game.add.sprite(posx, posy, 'animazione', 34),
                        game.add.sprite(specialblockitem.position.x, specialblockitem.position.y-8, 'animazione', 34),
                        game.add.sprite(posx, specialblockitem.position.y-8, 'animazione', 34)
                    ];
                    specialblockitem.destroy();
                    var group = this.rotate;
                    sprite.forEach(function(entry) {
                        group.add(entry);
                        game.physics.arcade.enable(entry);
                        entry.body.setSize(16,16);
                        if(entry.position.y==posy){entry.body.velocity.y = -550;}
                        else{entry.body.velocity.y = -250;}
                        if(entry.position.x==posx){entry.body.velocity.x = 100;}
                        else{entry.body.velocity.x = -100;}
                        entry.body.gravity.y = 1000;
                        game.time.events.add(1500, function () {
                            entry.parent.remove(entry);
                            entry.destroy();
                        },entry);
                    },posy,posx,group);
                },this);
                specialblockitem.isTweening = true;
                this.temp.add(specialblockitem);
                this.temp.children.sort(this.sortfunction);
                twen.start();
            } else{
                var twen = this.collisionTween(specialblockitem);
                if(specialblockitem.parent == this.specialblock && !specialblockitem.isTweening){
                    if(specialblockitem.coin>0){
                        this.sounds.play('colpo_blocco');
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
                        this.sounds.play('monetina');
                        specialblockitem.coin--;
                        twen.onComplete.add(function(r,s){
                            r.isTweening=false;
                            if(r.coin==0){
                                this.discoveredblock.add(specialblockitem);
                            } else{
                                this.specialblock.add(specialblockitem);
                                this.specialblock.children.sort(this.sortfunction);
                            }
                            r.body.immovable = true;
                            this.removefromgroup(r);
                        },this);
                    }
                    //genera il fungo o la stella
                    else if(specialblockitem.coin<0){
                        this.sounds.play('uscita_power_up');
                        specialblockitem.coin = 0;
                        this.discoveredblock.add(specialblockitem);
                        if(specialblockitem.stella){twen.onComplete.add(this.callbackstella, this);}
                        else {twen.onComplete.add(this.callbackfungo, this);}
                    }
                    if(specialblockitem.coin==0){
                        specialblockitem.animations.stop();
                        specialblockitem.frame = 7;
                    }
                } else{
                    this.sounds.play('colpo_blocco');
                    twen.onComplete.add(function(r,s){
                        r.isTweening=false; 
                        if(r.coin==undefined)
                            this.block.add(r); 
                        this.removefromgroup(specialblockitem);
                    },this);
                }   
                specialblockitem.isTweening = true;
                if(specialblockitem.rect == null){
                    specialblockitem.rect = game.add.sprite(specialblockitem.position.x, specialblockitem.position.y, null);
                    this.toTween.add(specialblockitem.rect);
                    specialblockitem.rect.body.setSize(32, 32, 0, 0);
                    specialblockitem.rect.body.immovable = true;
                    specialblockitem.rect.padre = specialblockitem;
                }
                twen.start();
                this.temp.add(specialblockitem);
                this.temp.children.sort(this.sortfunction);
            }
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
        this.stopgame();
        this.supermario.standdead();
        this.mario.body.checkCollision.none = true;
        this.mario.body.checkCollision.down = false;
        this.musica.stop();
        this.sounds.play('timeout').onMarkerComplete.add(function(){this.end = true;},this);
        this.uscito = true;
        this.mario.body.moves = true;
        this.mario.body.gravity.y = 1000;
        this.mario.body.velocity.y = -450;
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
        if(!movingTarget.vita){
            this.labels.updatescore(1000);
            if(!movingTarget.isStella){
                this.sounds.play('power_up');
                //animazione di gigantificazione di mario
                if(movingTarget.isFungo && !this.supermario.isBigger){ this.stopgame(); this.supermario.biganimation(this);}
                else if(movingTarget.isPianta && this.supermario.isBigger && !this.supermario.isFury){
                    this.stopgame();
                    this.supermario.isFury = true;
                    this.supermario.standstill();
                    var twen = game.add.tween(this.mario).to( {tint: 0x656363}, 400,null,true, 0, 1, true);
                    twen.onComplete.add(function(r,s){
                        if(!this.supermario.touchingdown()){
                            this.supermario.fermo = false;
                            this.mario.frame = 21;
                        }
                        this.resumegame();
                    },this);}
            } else{
                if(!this.mario.invincibile){
                    this.mario.invincibile = true;
                    mario.body.touching.up=false;
                    var twen = game.add.tween(this.mario).to( {tint: 0x656363}, 850,null,true, 0, 5, true);
                    twen.onComplete.add(function(r,s){
                        this.mario.invincibile = false;
                        this.musica.stop();
                    },this);
                    this.musica.play('musica_power_up').onStop.addOnce(function(){ 
                        this.musica.play('musica_invincibile').onStop.addOnce(
                            function(){this.musica.play('musica');},this);
                    },this);
                }
            }
        }
        else{
            this.sounds.play('life');
            mario.body.touching.up=false;
            if(movingTarget.vita){game.global.life++;}
        }
    },

    onEnemyCollision: function(mario, enemy){
        if(mario.body.touching.down){
            mario.body.touching.down = false;
            this.sounds.play('scalcia');
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
                    enemy.body.setSize(32,28,0,0);
                    enemy.position.y += 28;
                    enemy.timer = game.time.events.add(7950, function () {
                        if(!enemy.isDead){
                            enemy.attacked = false;
                            enemy.myvelocity = 50;
                            enemy.animations.play('walk');
                            if(enemy.scale.x>0)
                                enemy.body.velocity.x = -enemy.myvelocity;
                            else enemy.body.velocity.x = enemy.myvelocity;
                            enemy.position.y -= 28;
                            enemy.body.setSize(32,44,0,20);
                        }
                    },this);
                } else{
                    this.tartadead(mario,enemy);
                }
            }
            mario.body.velocity.y = -200;
            if(enemy.position.x+16>mario.position.x) {mario.body.velocity.x = -200;}
            else{mario.body.velocity.x = 200;}
        } else{
            if(enemy.attacked && !enemy.isDead){
                this.sounds.play('scalcia');
                mario.body.touching.down = false;
                this.tartadead(mario,enemy);
            }else{
                if(!this.mario.invincibile){
                    if(!enemy.attacked){
                        this.sounds.play('scalcia');
                        if(enemy.position.x+16>mario.position.x){
                            this.changedirectionright(enemy);
                        } else this.changedirectionleft(enemy);
                    }
                    if(!this.supermario.isBigger){
                        this.stopgame();
                        this.supermario.standdead();
                        mario.body.checkCollision.none = true;
                        mario.body.checkCollision.down = false;
                        this.musica.stop();
                        this.sounds.play('dead').onMarkerComplete.add(function(){this.end = true;},this);
                        this.uscito = true;
                        enemy.timer = game.time.events.add(100, function () {
                            mario.body.moves = true;
                            mario.body.gravity.y = 1000;
                            mario.body.velocity.y = -450; 
                        },this);
                    } else{
                        //this.musica.resume();
                        game.sound.pauseAll();
                        this.sounds.play('power_down').onMarkerComplete.add(function(){game.sound.resumeAll();},this);
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
        var start = toTween.position.y;
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

    preventMarioCollision: function(mario, blocco){
        if(mario.frame ===4 || mario.frame ===11){
            var pos = blocco.position.x;
            var diff = mario.position.x-(pos+blocco.width);
            diff = Math.abs(diff);
            if(diff>=26 && !blocco.vita) {
                mario.body.velocity.x = 0;
                return false;
            }
            else{return true;}
        } else return true;
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

    firewithwall: function(fire, blocco){        
        if(!fire.body.touching.down && !fire.body.blocked.down){
            this.sounds.play('esplosione');
            fire.body.gravity.y = 0;
            fire.body.velocity.x = 0;
            fire.body.velocity.y = 0;
            fire.animations.play('esplodi');   
        }
    },

    firewithenemy: function(fire, enemy){
        this.sounds.play('esplosione');
        this.deleteenemy(enemy,fire,350);

        fire.body.gravity.y = 0;
        fire.body.velocity.x = 0;
        fire.body.velocity.y = 0;
        fire.animations.play('esplodi');
    },

    //funzione che serve per bloccare gli altri oggetti in movimento nel gioco
    stopgame: function(){
        game.tweens.pauseAll();
        this.special.setAll('body.moves',false);
        this.enemy.setAll('body.moves',false);
        this.enemy.setAll('animations.paused',true);
        this.fireball.setAll('body.moves',false);
        this.fireball.setAll('animations.paused',true);
        this.countDown.pause();
        this.specialblock.forEach(function(blocco){
            if(blocco.animations.name!=undefined)
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
        this.fireball.setAll('body.moves',true);
        this.fireball.setAll('animations.paused',false);
        this.specialblock.forEach(function(blocco){
            if(blocco.animations.name!=undefined)
                blocco.animations.play('bling');
        }, this);
        this.mario.body.moves = true;
        this.stop = false;
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

    endgame: function(mario, queen){
        if(!this.finito){
            game.tweens.pauseAll();
            this.special.setAll('body.moves',false);
            this.enemy.setAll('body.moves',false);
            this.enemy.setAll('animations.paused',true);
            this.fireball.setAll('body.moves',false);
            this.fireball.setAll('animations.paused',true);
            this.fireball.destroy(true,false);
            this.countDown.pause();
            this.specialblock.forEach(function(blocco){
                if(blocco.animations.name!=undefined)
                    blocco.animations.stop();
            }, this);
            this.musica.stop();
            this.sounds.play('win');
            this.finito = true;
            this.stop = true;
            this.punteggio = false;
            mario.body.checkCollision.up = false;
            mario.body.checkCollision.left = false;
            mario.body.checkCollision.right = false;
        } else{
            if(mario.position.y >= game.world._height-5){
                mario.body.gravity.y = 0;
                mario.body.velocity.y = 0
            }
            if(queen.position.x-32>mario.position.x){
                this.supermario.moveright();
            }
            else{
                if(this.mario.body.velocity.x != 0)
                    this.supermario.stop();
                else if(!this.punteggio){//mario ha raggiunto la regina
                    this.pointtext(queen.position.x,queen.position.y,500);
                    this.labels.updatescore(500);
                    var style = { font: '12px fontmario', fill: '#ffffff', wordWrap: true, wordWrapWidth: game.camera.width, align: "center" };
                    var text = game.add.text(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2, 'grazie cisternino per aver salvato me\nla principessa Gervasin', style);
                    text.anchor.set(0.5);
                    this.punteggio = true;
                    this.timetoend = Math.ceil(this.countDown.duration / Phaser.Timer.SECOND);
                    this.supermario.standstill();
                } else if(this.timetoend > 0){
                    this.timetoend--;
                    this.labels.settimeend(this.timetoend);
                    this.labels.updatescore(1);
                } else{
                    this.timetoend--;
                    if(this.timetoend==-120)
                        this.playerDie();
                }

            }
        }
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
            else if(oggettoda==7 && element.isFuoco){return element;}
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

    deleteenemy(enemy,second,speed){
        this.sounds.play('scalcia');
        var direction = 1;
        var pos = second.position.x;
        if(second == this.mario) pos = second.position.x-16;
        if(enemy.position.x<pos){
            direction = -1;        
        }
        this.pointtext(enemy.position.x,enemy.position.y,'100');
        this.labels.updatescore(100);
        this.todelete.add(enemy);
        enemy.scale.setTo(1, -1);
        enemy.anchor.setTo(0, 1);
        if(speed==undefined)enemy.body.velocity.y=-550;
        else enemy.body.velocity.y=-speed;
        enemy.body.velocity.x=150*direction;
    },

    removefromgroup(item){
        this.toTween.remove(item.rect);
        item.rect.destroy();
        item.rect = null;
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