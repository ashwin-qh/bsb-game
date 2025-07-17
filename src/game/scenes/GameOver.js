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

    const yPos = 280;
    this.add
      .text(512, yPos, "Your Score: " + this.finalScore, {
        fontFamily: "Arial, sans-serif",
        fontSize: 48,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(512, yPos + 60, "High Score: " + this.highScore, {
        fontFamily: "Arial, sans-serif",
        fontSize: 48,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // --- Player Rank and High Score Celebration ---
    const leaderboard = JSON.parse(
      localStorage.getItem("baristaLeaderboard") || "[]"
    );
    const playerName = localStorage.getItem("currentPlayerName") || "Player";

    // More robustly find the player's rank by checking name and score
    const rankIndex = leaderboard.findIndex(
      (entry) => entry.score === this.finalScore && entry.name === playerName
    );

    if (rankIndex !== -1) {
      this.add
        .text(512, yPos + 110, `Your Rank: #${rankIndex + 1}`, {
          fontFamily: "Arial, sans-serif",
          fontSize: 32,
          color: "#00ff00",
          align: "center",
        })
        .setOrigin(0.5);

      // --- New High Score Animation ---
      if (rankIndex === 0 && this.finalScore > 0) {
        const congratsText = this.add
          .text(512, yPos + 160, "New High Score!", {
            fontFamily: "Arial, sans-serif",
            fontSize: 32,
            color: "#ff8c00",
            align: "center",
          })
          .setOrigin(0.5);
        this.tweens.add({
          targets: congratsText,
          scale: 1.2,
          duration: 500,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });

        this.add.particles(0, 0, ['icon_blue', 'icon_green'], {
            speed: { min: 200, max: 400 },
            angle: { min: 0, max: 90 }, // Shoots right and down
            scale: { start: 1, end: 0 },
            lifespan: 1500,
            gravityY: 400,
            frequency: 100,
            duration: 3000, // Stop emitting after 3 seconds
            blendMode: 'ADD'
        });

        // Emitter for the top-right corner
        this.add.particles(this.sys.game.config.width, 0, ['icon_red', 'icon_yellow'], {
            speed: { min: 200, max: 400 },
            angle: { min: 90, max: 180 }, // Shoots left and down
            scale: { start: 1, end: 0 },
            lifespan: 1500,
            gravityY: 400,
            frequency: 100,
            duration: 3000, // Stop emitting after 3 seconds
            blendMode: 'ADD'
        });
        
      }
    }

    const playAgainButton = this.add
      .text(380, 550, "Play Again", {
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
      this.scene.start("HomePage");
    });

    const leaderboardBtn = this.add
      .text(640, 550, "Leaderboard", {
        fontFamily: "Arial, sans-serif",
        fontSize: 38,
        color: "#00ff00",
        backgroundColor: "#111111",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
        cornerRadius: 10,
      })
      .setOrigin(0.5)
      .setInteractive();

    leaderboardBtn.on("pointerdown", () => {
      this.scene.start("Leaderboard");
    });

    [playAgainButton, leaderboardBtn].forEach((button) => {
      button.on("pointerdown", () => {
        this.tweens.add({
          targets: button,
          scale: 0.95,
          duration: 100,
          ease: "Power1",
          yoyo: true,
        });
        this.sound.play("sfx_tap");
      });
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
