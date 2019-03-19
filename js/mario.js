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
        this.mario = game.add.sprite(x, y, 'mario_animation', '1.gif');
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
        this.mario.animations.add('walk', [1, 2, 3], 8, true);
        this.mario.animations.add('jump', [4], 8, true);
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
        //per capire se sono nei limiti della camera
        if((this.mario.x+this.mario.width) > game.camera.x){
            if(this.mario.body.velocity.x != -200 && !this.hastouchedup){
                this.mario.body.velocity.x -= 10;
            }
        } 
        else { 
            this.mario.body.velocity.x = 0;
        }
        if(this.touchingdown()){
            //controllo fatto per capire se l'orientamento di marco è quello giusto
            if(this.mario.scale.x>0){
                this.mario.scale.setTo(-1, 1);
                this.mario.anchor.setTo(0, 1);
            }
            if(this.mario.body.velocity.x > 80){
                this.mario.frame = 5;
            } else {this.mario.animations.play('walk');}
        }
    }
    
    moveright(){
        if((this.mario.x-this.mario.width) > game.camera.x){
            if(this.mario.body.velocity.x != 200 && !this.hastouchedup){
                this.mario.body.velocity.x += 10;
            }
        }
        else {
            if(this.mario.body.velocity.x < 0){
                this.mario.body.velocity.x = 0;
            }else if(this.mario.body.velocity.x != 200 && !this.hastouchedup){
                this.mario.body.velocity.x += 10;
            }
        }
        //gestisce l'animazione
        if(this.touchingdown()){
            if(this.mario.scale.x<0){
                this.mario.scale.setTo(1, 1);
                this.mario.anchor.setTo(1, 1);
            }
            if(this.mario.body.velocity.x < -80){
                this.mario.frame = 5;
            } else{this.mario.animations.play('walk');}
        }
    }
    
    jump(){
        // Move the player upward (jump)
        var pos = this.Ystart - this.mario.body.position.y;
        if(!this.mario.isjumping){
            if(this.firstjump){
                if(this.touchingdown()){
                    this.Ystart = this.mario.body.position.y;
                    this.mario.body.velocity.y -= 450;
                    this.mario.animations.play('jump');
                    this.firstjump = false;
                    this.hastouchedup = false;
                }
            } 
            else if(pos <= 112){
                if(!this.touchingup()){
                    this.mario.body.velocity.y -= 20;
                } else{
                    this.mario.body.velocity.y = 0;
                    this.mario.isjumping = true;
                }
            }
        }
        else{
            this.mario.isjumping = true;
            return true;
        }
        return false;
    }
    
    stop(){
        //console.log(this.mario.body.velocity.x);
        if(this.mario.body.velocity.x > 0){
            this.mario.body.velocity.x -= 10;
            if(this.touchingdown() && this.mario.animations.name.includes('jump')){
               this.mario.animations.play('walk');
            }
        } else if(this.mario.body.velocity.x < 0){
            if((this.mario.x-this.mario.width) < game.camera.x){
                this.mario.body.velocity.x = 0;
            } 
            else {this.mario.body.velocity.x += 10;}
            if(this.touchingdown() && this.mario.animations.name.includes('jump')){
               this.mario.animations.play('walk');
            }
        }
        if(this.touchingdown() && this.mario.body.velocity.x == 0){
            this.mario.animations.stop(); // Stop animations
            // Change frame (stand still)
            this.mario.frame = 0;
        }
    }
    
    touchingdown(){
        return this.mario.body.onFloor() || this.mario.body.touching.down;
    }
    
    touchingup(){
        return this.mario.body.blocked.up || this.mario.body.touching.up;
    }
}