import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { Login } from "./scenes/Login"; // New
import { HomePage } from "./scenes/HomePage"; // New
import { Instructions } from "./scenes/Instructions"; // New
import { Leaderboard } from "./scenes/Leaderboard"; // New
import { Game as GameScene } from "./scenes/Game"; // Renamed for clarity
import { GameOver } from "./scenes/GameOver";
import { AUTO, Game } from "phaser";

const config = {
  type: AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: "#028af8",
  // Enable DOM elements for the input form
  dom: {
    createContainer: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    Boot,
    Preloader,
    Login,
    HomePage,
    Instructions,
    Leaderboard,
    GameScene,
    GameOver,
  ],
};

const StartGame = (parent) => {
  return new Game({ ...config, parent });
};

export default StartGame;
