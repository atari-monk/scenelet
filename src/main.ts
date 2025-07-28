import "./style.css";
import { GameAppFactory, GameEngine } from "zippy-game-engine";
import { AnimatedCirclesScene } from "./scenes/animated-circles";
import { BouncingBallScene } from "./scenes/bouncing-ball";
import { CrossLinesScene } from "./scenes/cross-lines";
import { DiagonalLinesScene } from "./scenes/diagonal-lines";
import { GravityBallScene } from "./scenes/gravity-ball";
import { ParticleSystemScene } from "./scenes/particle-system";
import { PulsingCircleScene } from "./scenes/pulsing-circle";
import { RandomCirclesScene } from "./scenes/random-circles";
import { RedBallScene } from "./scenes/red-ball";

window.addEventListener("load", async () => {
    const { gameApp, game } = await initEngine();
    registerScenes(gameApp, game);
    startSceneRotation(gameApp);
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
    gameApp.registerScene("Random Circles", new RandomCirclesScene(game));
    gameApp.registerScene("Red Ball", new RedBallScene(game));
}

function startSceneRotation(gameApp: GameAppFactory) {
    // Define scenes with their durations in seconds
    const scenes = [
        { name: "Animated Circles", duration: 15 },
        { name: "Bouncing Ball", duration: 10 },
        { name: "Cross Lines", duration: 3 },
        { name: "Diagonal Lines", duration: 3 },
        { name: "Gravity Ball", duration: 8 },
        { name: "Particle System", duration: 15 },
        { name: "Pulsing Circle", duration: 20 },
        { name: "Random Circles", duration: 5 },
        { name: "Red Ball", duration: 5 },
    ];

    let currentIndex = 0;

    const transitionToNextScene = () => {
        // Get current scene info
        const currentScene = scenes[currentIndex];

        // Transition to current scene
        gameApp.transitionToScene(currentScene.name);

        // Set timeout for next transition
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % scenes.length;
            transitionToNextScene();
        }, currentScene.duration * 1000); // Convert seconds to milliseconds
    };

    // Start the rotation
    transitionToNextScene();
}
