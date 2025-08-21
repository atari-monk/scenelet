import "./style.css";
import "fullscreen-canvas-vanilla";
import { createGameCanvas } from "fullscreen-canvas-vanilla";
import { GameEngineFactory, GameEngine } from "zippy-game-engine";
import { AnimatedCirclesScene } from "./scenes/animated-circles";
import { BouncingBallScene } from "./scenes/bouncing-ball";
import { CrossLinesScene } from "./scenes/cross-lines";
import { DiagonalLinesScene } from "./scenes/diagonal-lines";
import { GravityBallScene } from "./scenes/gravity-ball";
import { ParticleSystemScene } from "./scenes/particle-system";
import { PulsingCircleScene } from "./scenes/pulsing-circle";
import { RandomCirclesScene } from "./scenes/random-circles";
import { RedBallScene } from "./scenes/red-ball";

export function getCanvasSizeById(canvasId: string): {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
} {
    const canvas = document.getElementById(canvasId);

    if (!canvas) {
        throw new Error(`Canvas element with ID '${canvasId}' not found`);
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error(
            `Element with ID '${canvasId}' is not a canvas element`
        );
    }

    return {
        canvas,
        width: canvas.width,
        height: canvas.height,
    };
}

window.addEventListener("load", async () => {
    const gameEngine = setupEngine();
    createGameCanvas("canvas-container", "game-canvas", gameEngine);
    const { canvas, width, height } = getCanvasSizeById("game-canvas");
    //testSingleScene(gameEngine, canvas, width, height);
    registerScenes(gameEngine, canvas, width, height);
    startSceneRotation(gameEngine);
});

// function testSingleScene(gameEngine: GameEngine, canvas: HTMLCanvasElement, width: number, height: number) {
//     gameEngine.registerScene(
//         "Particle System",
//         new ParticleSystemScene(canvas, width, height)
//     );
//     gameEngine.transitionToScene("Particle System");
// }

function setupEngine() {
    const gameEngineFactory = new GameEngineFactory();
    const gameEngine = gameEngineFactory.getGameEngine();
    return gameEngine;
}

function registerScenes(
    gameEngine: GameEngine,
    canvas: HTMLCanvasElement,
    width: number,
    height: number
) {
    gameEngine.registerScene(
        "Animated Circles",
        new AnimatedCirclesScene(width, height)
    );
    gameEngine.registerScene(
        "Bouncing Ball",
        new BouncingBallScene(width, height)
    );
    gameEngine.registerScene("Cross Lines", new CrossLinesScene());
    gameEngine.registerScene("Diagonal Lines", new DiagonalLinesScene());
    gameEngine.registerScene(
        "Gravity Ball",
        new GravityBallScene(width, height)
    );
    gameEngine.registerScene(
        "Particle System",
        new ParticleSystemScene(canvas, width, height)
    );
    gameEngine.registerScene("Pulsing Circle", new PulsingCircleScene());
    gameEngine.registerScene(
        "Random Circles",
        new RandomCirclesScene(width, height)
    );
    gameEngine.registerScene(
        "Red Ball",
        new RedBallScene(canvas, width, height)
    );
}

function startSceneRotation(gameEngine: GameEngine) {
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
        gameEngine.transitionToScene(currentScene.name);

        // Set timeout for next transition
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % scenes.length;
            transitionToNextScene();
        }, currentScene.duration * 1000); // Convert seconds to milliseconds
    };

    // Start the rotation
    transitionToNextScene();
}
