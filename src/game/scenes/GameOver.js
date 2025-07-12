import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  init(data) {
    this.finalScore = data.score;
    this.highScore = data.highScore;
  }

  create() {
    const bg = this.add.image(512, 384, "background_shop");
    const scaleX = this.sys.game.config.width / bg.width;
    const scaleY = this.sys.game.config.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);
    bg.setAlpha(1);

    this.add.rectangle(512, 384, 600, 500, 0x000000, 0.7);

    // --- REFINED FONT STYLES ---
    this.add
      .text(512, 220, "Game Over!", {
        fontFamily: '"Arial Black", Gadget, sans-serif',
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(512, 350, "Your Score: " + this.finalScore, {
        fontFamily: "Arial, sans-serif",
        fontSize: 48,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(512, 420, "High Score: " + this.highScore, {
        fontFamily: "Arial, sans-serif",
        fontSize: 48,
        color: "#ffff00",
        align: "center",
      })
      .setOrigin(0.5);

    const playAgainButton = this.add
      .text(512, 550, "Play Again", {
        fontFamily: "Arial, sans-serif",
        fontSize: 38,
        color: "#00ff00",
        backgroundColor: "#111111",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
        cornerRadius: 10,
      })
      .setOrigin(0.5)
      .setInteractive();

    playAgainButton.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });

    // Add this block at the end of the create() method in each scene

    const isMuted = this.registry.get("isMuted");
    this.sound.mute = isMuted;

    const muteButton = this.add
      .image(
        this.sys.game.config.width - 40, // Position from right edge
        40, // Position from top edge
        isMuted ? "icon_sound_off" : "icon_sound_on"
      )
      .setInteractive()
      .setScale(1.5); // Adjust scale as needed

    muteButton.on("pointerdown", () => {
      const currentMuteState = !this.registry.get("isMuted");
      this.registry.set("isMuted", currentMuteState);
      this.sound.mute = currentMuteState;
      muteButton.setTexture(
        currentMuteState ? "icon_sound_off" : "icon_sound_on"
      );
    });
  }
}
