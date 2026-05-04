class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {

        // 👤 placeholder игрок
        this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");

        // 🔫 placeholder пуля
        this.load.image("bullet", "https://labs.phaser.io/assets/sprites/bullets/bullet7.png");

        // 🎬 видео фон (оставляем твой локальный, но можно заменить на тест)
        this.load.video("bg", "https://labs.phaser.io/assets/video/earth.mp4", "loadeddata", false, true);

        // 🧩 UI placeholder
        this.load.image("ui", "https://labs.phaser.io/assets/sprites/button-pill-yellow.png");
    }

    create() {

        // 🎥 фон
        this.bg = this.add.video(200, 300, "bg");
        this.bg.setMute(true);
        this.bg.setLoop(true);
        this.bg.play(true);
        this.bg.setDepth(-1);
        this.bg.setDisplaySize(400, 600);

        // 👤 игрок
        this.player = this.add.image(200, 300, "player");
        this.player.setScale(0.7);

        // 🖱 курсор
        this.input.setDefaultCursor("none");
        this.pointer = this.input.activePointer;

        this.smooth = 0.15;

        // 🔫 пули
        this.bullets = [];

        // 🔁 режим стрельбы
        this.fireMode = 0;

        // 🔘 UI кнопка
        this.ui = this.add.image(200, 550, "ui");
        this.ui.setScale(0.6);
        this.ui.setDepth(9999);
        this.ui.setInteractive();

        this.ui.on("pointerdown", () => {
            this.fireMode = (this.fireMode + 1) % 2;
            console.log("Mode:", this.fireMode);
        });

        // 🔥 автострельба
        this.time.addEvent({
            delay: 120,
            loop: true,
            callback: this.shoot,
            callbackScope: this
        });
    }

    shoot() {

        let px = this.player.x;
        let py = this.player.y;

        let dx = this.pointer.x - px;
        let dy = this.pointer.y - py;

        let angle = Math.atan2(dy, dx);

        // 🔹 режим 1: прямая
        if (this.fireMode === 0) {
            this.spawnBullet(px, py, angle);
        }

        // 🔹 режим 2: двойной веер
        if (this.fireMode === 1) {
            this.spawnBullet(px, py, angle - Phaser.Math.DegToRad(30));
            this.spawnBullet(px, py, angle + Phaser.Math.DegToRad(30));
        }
    }

    spawnBullet(x, y, angle) {

        let bullet = this.add.image(x, y + 20, "bullet");

        bullet.setScale(0.5);

        bullet.speed = 7;
        bullet.angleRad = angle;

        this.bullets.push(bullet);
    }

    update() {

        // 👤 движение игрока
        let tx = this.pointer.x;
        let ty = this.pointer.y;

        this.player.x += (tx - this.player.x) * this.smooth;
        this.player.y += (ty - this.player.y) * this.smooth;

        // 🔫 пули
        for (let i = 0; i < this.bullets.length; i++) {

            let b = this.bullets[i];

            b.x += Math.cos(b.angleRad) * b.speed;
            b.y += Math.sin(b.angleRad) * b.speed;

            // удаление
            if (b.x < -50 || b.x > 450 || b.y < -50 || b.y > 650) {
                b.destroy();
                this.bullets.splice(i, 1);
                i--;
            }
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: "#0b0b0b",
    scene: MainScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
