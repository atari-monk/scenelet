import "./style.css";
import { createCrossLinesScene } from "./createCrossLinesScene";
import { GameAppFactory, GameEngine } from "zippy-game-engine";
import { AnimatedCirclesScene } from "./scenes/animated-circles";
import { BouncingBallScene } from "./scenes/bouncing-ball";
import { CrossLinesScene } from "./scenes/cross-lines";

window.addEventListener("load", async () => {
    const { gameApp, game } = await initEngine();
    registerScenes(gameApp, game);
    setScene(gameApp);
});

async function initEngine() {
    const gameApp = new GameAppFactory();
    await gameApp.initialize();
    const game = gameApp.getGameEngine();
    return { gameApp, game };
}

function registerScenes(gameApp: GameAppFactory, game: GameEngine) {
    gameApp.registerScene("Cross Lines", createCrossLinesScene(game));
    gameApp.registerScene("Animated Circles", new AnimatedCirclesScene(game));
    gameApp.registerScene("Bouncing Ball", new BouncingBallScene(game));
    gameApp.registerScene("Cross Lines", new CrossLinesScene(game));
}

function setScene(gameApp: GameAppFactory) {
    gameApp.transitionToScene("Cross Lines");
}
