import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
    //  Set the path for all assets
    this.load.setPath("assets/");
    this.load.image("background_shop", "image/background_shop.png");
  }

  create() {
    this.registry.set("isMuted", false);
    this.scene.start("Preloader");
  }
}
