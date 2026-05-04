class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image("player", "assets/player.png");
        this.load.image("ui", "assets/ui.png");

        // стандартная пуля Phaser
        this.load.image("bullet", "https://labs.phaser.io/assets/sprites/bullets/bullet7.png");

        // фон видео
        this.load.video("bg", "assets/bg.mp4", "loadeddata", false, true);
    }

    create() {

        // ===== BACKGROUND VIDEO =====
        this.bg = this.add.video(200, 300, "bg");
        this.bg.play(true);
        this.bg.setMute(true);
        this.bg.setLoop(true);
        this.bg.setDepth(-1);

        // ===== PLAYER =====
        this.player = this.add.image(200, 300, "player");
        this.player.setScale(1);

        this.input.setDefaultCursor("none");
        this.pointer = this.input.activePointer;

        this.smooth = 0.15;

        // ===== BULLETS =====
        this.bullets = this.physics.add.group({
            defaultKey: "bullet",
            maxSize: 50
        });

        // ===== SHOOT SETTINGS =====
        this.shootMode = 0; // 0 = fast, 1 = spread

        this.timeSinceLastShot = 0;
        this.fireRate = 150;

        // ===== INPUT =====
        this.input.on("pointerdown", () => {
            this.switchMode();
        });

        // ===== UI =====
        this.ui = this.add.image(200, 300, "ui");
        this.ui.setDepth(9999);

        this.modeText = this.add.text(10, 10, "MODE: FAST", {
            fontSize: "14px",
            fill: "#ffffff"
        }).setDepth(10000);

        // авто-стрельба таймер
        this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => this.shoot()
        });
    }

    switchMode() {
        this.shootMode = this.shootMode === 0 ? 1 : 0;
        this.modeText.setText(this.shootMode === 0 ? "MODE: FAST" : "MODE: SPREAD");
    }

    shoot() {
        if (this.shootMode === 0) {
            this.fireBullet(0);
        } else {
            this.fireBullet(-0.2);
            this.fireBullet(0);
            this.fireBullet(0.2);
        }
    }

    fireBullet(angleOffset) {
        let bullet = this.bullets.get();

        if (!bullet) return;

        bullet.setActive(true);
        bullet.setVisible(true);

        bullet.x = this.player.x;
        bullet.y = this.player.y;

        let angle = Phaser.Math.Angle.Between(
            this.player.x,
            this.player.y,
            this.pointer.x,
            this.pointer.y
        );

        angle += angleOffset;

        this.physics.velocityFromRotation(angle, 400, bullet.body.velocity);

        // удалить за экраном
        this.time.delayedCall(2000, () => {
            bullet.destroy();
        });
    }

    update() {

        // ===== PLAYER FOLLOW MOUSE =====
        let targetX = this.pointer.x;
        let targetY = this.pointer.y;

        this.player.x += (targetX - this.player.x) * this.smooth;
        this.player.y += (targetY - this.player.y) * this.smooth;
    }
}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: "#0b0b0b",
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: MainScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
