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

var enemy;
var player;
var platforms;
var cursors;
var bloco;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('background', 'assets/background/montanhas.png');
    this.load.image('platform', 'assets/Platform/platform.png');
    this.load.spritesheet('player', 'assets/Player/player.png', { frameWidth: 32});
    this.load.image('bloco', 'assets/Blocos/BRICKS.png');
    this.load.spritesheet('enemy', 'assets/Enemy/frog_left.png', { frameWidth: 32});

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

    enemy = this.physics.add.sprite(700, 450, 'enemy');


    //Colisão do player com o ecrã
    player.setCollideWorldBounds(true);
    //bloco.setCollideWorldBounds(true);
    //Colisão player com as plataformas
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.collider(player, enemy);


    //Gravidade a que o player cai
    player.body.setGravityY(300);


    //Animações do player
    this.anims.create ({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start:23, end: 34 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create ({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start:11, end: 22 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create ({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player', { start:0, end: 10 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create ({
        key: 'jump',
        frames: [{key: 'player', frame:35}],
        frameRate: 10,
        repeat: -1
    })

    //Animação do inimigo
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('enemy', {start:0, end: 11}),
        frameRate: 10,
        repeat: -1
    });

    //Adicionar as teclas para os inputs do jogo
    cursors = this.input.keyboard.createCursorKeys();


    this.physics.add.collider(player, enemy, hitEnemy, null, this);

    //Caso o jogador toque nas bombas

    function hitEnemy (player, bomb){

        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('idle');

        gameOver = true;
    }

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
        player.anims.play('jump', true);
    }
    else if (cursors.down.isDown){
        player.setVelocityY(400);
    }

    //Movimento e animação do inimigo
    enemy.setVelocityX(-80);
    enemy.anims.play('run', true);
}
