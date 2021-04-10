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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('background', 'assets/background/montanhas.png');
    this.load.image('platform', 'assets/Platform/platform.png');
    this.load.spritesheet('player', 'assets/Player/run.png', { frameWidth: 32, framHeight: 48});
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
        frames: this.anims.generateFrameNumbers('player', { start:1, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create ({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start:1, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create ({
        key: 'idle',
        frames: [ { key: 'player', frame: 0}],
        frameRate: 20
    });

    //Adicionar as teclas para os inputs do jogo
    cursors = this.input.keyboard.createCursorKeys();

    //Obstáculos ----------- Tentativa de adicionar blocos
    //this.blocks = game.add.group();

     //function makeblocks () {
       // var wallHeight=game.rnd.integerInRange(2, 6);
        //for (var i = 0; i < wallHeight; i++) {
          //  var block = game.add.sprite(0, -i * 25, "bloco");
            //blocks.add(block);
        //}
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

        player.anims.play('idle');
    }

    if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-400);
    }

}
