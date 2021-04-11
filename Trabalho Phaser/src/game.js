var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


var player;
var platforms;
var cursors;
var blocos;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('background', 'assets/background/montanhas.png');
    this.load.image('platform', 'assets/Platform/platform.png');
    this.load.spritesheet('player', 'assets/Player/player.png', { frameWidth: 32});
    this.load.image('bloco', 'assets/Blocos/BRICKS.png');

}

function create () {

    // Criar o background
    let bg = this.add.sprite(0, 0, 'background');
    // change origin to the top-left of the sprite
    bg.setOrigin(0,0);

    //Criar plataformas
    platforms = this.physics.add.staticGroup();

    //Criar o chão
    platforms.create(400, 568, 'platform').setScale(2).refreshBody();


    //Criar o player
    player = this.physics.add.sprite(100,450, 'player');


    //Colisão do player com o ecrã
    player.setCollideWorldBounds(true);
    //Colisão player com as plataformas
    this.physics.add.collider(player, platforms);

    //Gravidade a que o player cai
    player.body.setGravityY(300);


    //Animações do player
    this.anims.create ({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start:23, end: 33 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create ({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start:12, end: 22 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create ({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player', { start:1, end: 10 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create ({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('player', { start:34, end: 34 }),
        frameRate: 20,
        repeat: -1
    })

    //Adicionar as teclas para os inputs do jogo
    cursors = this.input.keyboard.createCursorKeys();

    //Obstáculos ----------- Tentativa de adicionar blocos  NÃO ESTÁ FUNCIONAL!!
    this.blocos = this.physics.add.group();

     function makeblocks () {
       var wallHeight = game.rnd.integerInRange(2, 6);
        for (var i = 0; i < wallHeight; i++) {
            var bloco = game.add.sprite(0, -i * 25, "bloco");
            this.blocos.add(bloco);
        }
        this.blocos.x = game.width - this.blocos.width
         this.blocos.y = this.platforms.y - 50;

        this.blocos.forEach(function(bloco){
            game.physics.enable(bloco, Phaser.Physics.ARCADE);
            bloco.body.velocity.x = -160;
             bloco.body.gravity.y = 4;
             bloco.body.bounce.set(1,1);
         });
    }

    //COLISÕES
    //game.physics.arcade.collide(this.player, this.blocos);
    //game.physics.arcade.collide(this.platforms, this.blocos);
    //game.physics.arcade.collide(this.blocos);

    //Resetar os blocos  CRASHA O JOGO
    //var fchild = this.blocos.getChildAt(0);
    //if off the screen reset the blocks
    //if (fchild.x < -game.width) {
        //this.makeblocks();
    //}

}

function update () {

    if (cursors.left.isDown) {

        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown){

        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else{
        player.setVelocityX(0);
        player.anims.play('idle', true);
    }

    if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-400);
    }
    else if (cursors.down.isDown){
        player.setVelocityY(400);
    }
}
