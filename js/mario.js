class Mario{
    constructor(world){
        var x = null;
        var y = null;
        if(world != null){
            var position = this.position(world.map);
            var starttile = world.map.getTile(3,position);
            x= starttile.worldX;
            y = starttile.worldY;
        }
        else {
            x = game.width/2-100; 
            y = game.height/2;
        }
        this.mario = game.add.sprite(x, y, 'animazione', '1');
        // Set the anchor point to the top right
        this.mario.anchor.setTo(1, 1);
        
        //servono per evitare salti ripetuti o movimenti insoliti
        this.firstjump = true;
        this.hastouchedup = false;
    }
    
    setPosition(width, height){
        this.mario.x = width;
        this.mario.y = height;
    }
    
    gravity(){
        game.physics.arcade.enable(this.mario);
        this.mario.body.gravity.y = 1600;
    }
    
    animation(){
        // Create the 'right' animation by looping the frames 1 and 2
        this.mario.animations.add('walkright', [1, 2, 3], 8, true);
        // Create the 'left' animation by looping the frames 3 and 4
        this.mario.animations.add('walkleft', [7, 8, 9], 8, true);
        this.mario.animations.add('jumpright', [4], 8, true);
        this.mario.animations.add('jumpleft', [10], 8, true);
        this.mario.animations.add('turnleft', [5], 8, true);
        this.mario.animations.add('turnright', [11], 8, true);
    }
    
    position(map){
        var i = map.height-1;
        while(i > 0) {
            if(map.getTile(3,i-1).index != 6){
                break;
            }
        i--;
        }
        return i;
    }
    
    moveleft(){
        if((this.mario.x-this.mario.width) > game.camera.x){
            if(this.mario.body.velocity.x > 0){
                this.mario.body.velocity.x -= 5;
            }
            else if(this.mario.body.velocity.x != -200 && !this.hastouchedup){
                this.mario.body.velocity.x -= 5;
            }
        } 
        else { 
            this.mario.body.velocity.x = 0;
        }
        if(this.mario.body.blocked.down){
            if(this.mario.body.velocity.x > 80){
                this.mario.animations.play('turnleft');
            } else {this.mario.animations.play('walkleft');}
        }
    }
    
    moveright(){
        if(this.mario.body.velocity.x < 0){
            if((this.mario.x-this.mario.width) > !game.camera.x){
                this.mario.body.velocity.x += 5;
            } else {this.mario.body.velocity.x = 0;}
        } 
        else if(this.mario.body.velocity.x != 200 && !this.hastouchedup){
            this.mario.body.velocity.x += 5;
        }
        if(this.mario.body.blocked.down){
            if(this.mario.body.velocity.x < -80){
                this.mario.animations.play('turnright');
            } else{this.mario.animations.play('walkright');}
        }
    }
    
    jump(){
        // Move the player upward (jump)
        var pos = this.Ystart - this.mario.body.position.y;
        if(!this.isjumping){
            if(this.firstjump){
                if(this.mario.body.blocked.down){
                    this.Ystart = this.mario.body.position.y;
                    this.mario.body.velocity.y -= 450;
                    if(this.mario.frame>4 && this.mario.frame < 11){this.mario.animations.play('jumpleft');}
                    else {this.mario.animations.play('jumpright');}
                    this.firstjump = false;
                    this.hastouchedup = false;
                }
            } 
            else if(pos <= 112){
                if(!this.mario.body.blocked.up){
                    this.mario.body.velocity.y -= 20;
                } else{this.isjumping = true;}
            }
        }
        else{
            this.isjumping = true;
            return true;
        }
        return false;
    }
    
    stop(){
        if(this.mario.body.velocity.x > 0){
            this.mario.body.velocity.x -= 5;
            if(this.mario.body.blocked.down && this.mario.animations.name.includes('jump')){
               this.mario.animations.play('walkright');
            }
        } else if(this.mario.body.velocity.x < 0){
            if((this.mario.x-this.mario.width) < game.camera.x){
                this.mario.body.velocity.x = 0;
            } 
            else {this.mario.body.velocity.x += 5;}
            if(this.mario.body.blocked.down && this.mario.animations.name.includes('jump')){
               this.mario.animations.play('walkleft');
            }
        }
        if(this.mario.body.blocked.down && this.mario.body.velocity.x == 0){
            this.mario.animations.stop(); // Stop animations
            // Change frame (stand still)
            if(this.mario.frame>5){this.mario.frame = 6;}
            else {this.mario.frame = 0;}
        }
    }
}