import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    const bg = this.add.image(512, 384, "background_shop");
    const scaleX = this.sys.game.config.width / bg.width;
    const scaleY = this.sys.game.config.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);
    bg.setAlpha(1);

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in width as the assets load.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the bar
    this.load.on("progress", (progress) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Set the path for all assets
    this.load.setPath("assets/");

    // --- All game assets are loaded here ---

    this.load.image('logo', 'image/logo.png');
    
    this.load.image("cup", "image/cup.png");
    this.load.image("icon_blue", "image/icon_blue.png");
    this.load.image("icon_red", "image/icon_red.png");
    this.load.image("icon_green", "image/icon_green.png");
    this.load.image("icon_yellow", "image/icon_yellow.png");
    this.load.image("icon_espresso", "image/icon_espresso.png");

    this.load.image("icon_sound_on", "image/sound_on.png");
    this.load.image("icon_sound_off", "image/sound_off.png");

    // --- Load all audio ---
    this.load.audio("sfx_tap", "audio/tap.wav");
    this.load.audio("sfx_success", "audio/success.wav");
    this.load.audio("sfx_failure", "audio/failure.wav");
    this.load.audio("bgm", "audio/music.mp3");
  }

  create() {
    //  When all the assets have loaded, move to the Main Menu.
    this.scene.start("MainMenu");

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
