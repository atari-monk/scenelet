import "./style.css";
import { GameAppFactory, GameEngine } from "zippy-game-engine";
import { AnimatedCirclesScene } from "./scenes/animated-circles";
import { BouncingBallScene } from "./scenes/bouncing-ball";
import { CrossLinesScene } from "./scenes/cross-lines";
import { DiagonalLinesScene } from "./scenes/diagonal-lines";
import { GravityBallScene } from "./scenes/gravity-ball";
import { ParticleSystemScene } from "./scenes/particle-system";
import { PulsingCircleScene } from "./scenes/pulsing-circle";

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
    gameApp.registerScene("Animated Circles", new AnimatedCirclesScene(game));
    gameApp.registerScene("Bouncing Ball", new BouncingBallScene(game));
    gameApp.registerScene("Cross Lines", new CrossLinesScene(game));
    gameApp.registerScene("Diagonal Lines", new DiagonalLinesScene(game));
    gameApp.registerScene("Gravity Ball", new GravityBallScene(game));
    gameApp.registerScene("Particle System", new ParticleSystemScene(game));
    gameApp.registerScene("Pulsing Circle", new PulsingCircleScene(game));
}

function setScene(gameApp: GameAppFactory) {
    gameApp.transitionToScene("Pulsing Circle");
}
