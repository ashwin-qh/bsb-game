import { Scene } from "phaser";

export class Leaderboard extends Scene {
  constructor() {
    super("Leaderboard");
  }

  create() {
    const bg = this.add.image(512, 384, "background_shop");
    const scaleX = this.sys.game.config.width / bg.width;
    const scaleY = this.sys.game.config.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);

    this.add.rectangle(512, 384, 600, 500, 0x000000, 0.7);
    this.add
      .text(512, 170, "Leaderboard", {
        fontSize: 48,
        color: "#ffff00" /* ...styles... */,
      })
      .setOrigin(0.5);

    const leaderboard = JSON.parse(
      localStorage.getItem("baristaLeaderboard") || "[]"
    );
    let yPos = 250;

    if (leaderboard.length === 0) {
      this.add
        .text(512, 384, "No scores yet. Play a game!", {
          fontSize: 24,
          color: "#cccccc",
        })
        .setOrigin(0.5);
    } else {
      leaderboard.forEach((entry, index) => {
        const rankText = `${index + 1}. ${entry.name}`;
        this.add
          .text(320, yPos, rankText, { fontSize: 28, color: "#ffffff" })
          .setOrigin(0, 0.5);
        this.add
          .text(700, yPos, entry.score, { fontSize: 28, color: "#ffffff" })
          .setOrigin(1, 0.5);
        yPos += 50;
      });
    }

    const backBtn = this.add
      .text(512, 580, "Back to Home", {
        /* ...button styles... */
      })
      .setOrigin(0.5)
      .setInteractive();
    backBtn.on("pointerdown", () => this.scene.start("HomePage"));
  }
}
