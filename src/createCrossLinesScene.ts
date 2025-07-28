import { GameEngine } from "zippy-game-engine";
import type { Scene } from "zippy-game-engine";

interface CrossLinesSceneConfig {
    lineColor: string;
    lineWidth: number;
}

export const createCrossLinesScene = (game: GameEngine): Scene => {
    const config: CrossLinesSceneConfig = {
        lineColor: "green",
        lineWidth: 3,
    };

    const renderBackground = (ctx: CanvasRenderingContext2D): void => {
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    };

    const renderLines = (ctx: CanvasRenderingContext2D): void => {
        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = config.lineWidth;
        ctx.beginPath();

        drawHorizontalLine();
        drawVerticalLine();

        ctx.stroke();

        function drawHorizontalLine() {
            ctx.moveTo(0, game.canvas.height / 2);
            ctx.lineTo(game.canvas.width, game.canvas.height / 2);
        }

        function drawVerticalLine() {
            ctx.moveTo(game.canvas.width / 2, 0);
            ctx.lineTo(game.canvas.width / 2, game.canvas.height);
        }
    };

    return {
        name: "Cross Lines",

        init(): void {
            console.log("Initializing Cross Lines Scene");
        },

        onEnter(): void {},

        onExit(): void {},

        update(_deltaTime: number): void {},

        render(ctx: CanvasRenderingContext2D): void {
            renderBackground(ctx);
            renderLines(ctx);
        },

        resize(): void {},
    };
};
