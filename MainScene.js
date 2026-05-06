class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image("player", "assets/player.png");
        this.load.image("ui", "assets/ui.png");
        this.load.video("bg", "assets/bg.mp4", "loadeddata", false, true);
    }

    create() {
        this.bg = this.add.video(GAME_WIDTH / 2, GAME_HEIGHT / 2, "bg");
        this.bg.play(true);
        this.bg.setMute(true);
        this.bg.setLoop(true);
        this.bg.setDepth(-1);

        this.player = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "player");
        this.player.setScale(1);

        this.input.setDefaultCursor("none");
        this.pointer = this.input.activePointer;

        this.smooth = 0.15;

        this.ui = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "ui");
        this.ui.setDepth(9999);
    }

    update() {
        const targetX = this.pointer.x;
        const targetY = this.pointer.y;

        this.player.x += (targetX - this.player.x) * this.smooth;
        this.player.y += (targetY - this.player.y) * this.smooth;
    }
}
