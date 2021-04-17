

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


let game = new Phaser.Game(config);
let player;
let background;
let platform;
let parede1;
let parede2;
let parede3;
let enemy;

function preload ()
{
    this.load.image('background', 'assets/background/montanhas.png');
    this.load.image('platform', 'assets/Platform/platform.png');
    this.load.image('parede1', 'assets/Blocos/parede1.png');
    this.load.image('parede2', 'assets/Blocos/parede2.png');
    this.load.image('parede3', 'assets/Blocos/parede3.png');
    //teste
    this.load.image("parede", "assets/Blocos/BRICKS.png");
    this.load.spritesheet('player', 'assets/Player/player.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet('enemy', 'assets/Enemy/frog_left.png', {
        frameWidth: 32,
        frameHeight: 32
    });


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
    //Criar inimigo
    enemy = this.physics.add.sprite(700, 450, 'enemy');

    //Criar paredes
    parede1 = this.physics.add.sprite(500, 515, 'parede1');
    parede2 = this.physics.add.sprite(400, 495, 'parede2');
    parede3 = this.physics.add.sprite(300, 475, 'parede3');

//Teste
    //parede1.setPushable(false);
    //parede2.setPushable(false);
    //parede3.setPushable(false);


    //Colisão do player com o ecrã
    player.setCollideWorldBounds(true);
    //bloco.setCollideWorldBounds(true);
    //Colisão player com as plataformas
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.collider(player, enemy);
    this.physics.add.collider(player, parede1);
    this.physics.add.collider(player, parede2);
    this.physics.add.collider(player, parede3);

    //Colisão paredes com inimigo
    this.physics.add.collider(enemy, parede1);
    this.physics.add.collider(enemy, parede2);
    this.physics.add.collider(enemy, parede3);

    //Colisão paredes com plataformas
    this.physics.add.collider(platforms, parede1);
    this.physics.add.collider(platforms, parede2);
    this.physics.add.collider(platforms, parede3);





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

    //Animações do ananás
    this.anims.create({
        key:"move",
        frames: this.anims.generateFrameNumbers("point", {start:0, end:16}),
        frameRate:15,
        repeat:-1
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



    //Movimento das paredes
    parede1.setVelocityX(-80);
    parede2.setVelocityX(-80);
    parede3.setVelocityX(-80);

}
