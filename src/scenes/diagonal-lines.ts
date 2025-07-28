import type { GameEngine, Scene } from "zippy-game-engine";

interface DiagonalLinesConfig {
    lineColor: string;
    lineWidth: number;
}

export class DiagonalLinesScene implements Scene {
    private readonly config: DiagonalLinesConfig = {
        lineColor: "red",
        lineWidth: 3,
    };

    public readonly name = "Diagonal Lines";
    public readonly displayName = "Diagonal Lines";

    private game: GameEngine;

    constructor(game: GameEngine) {
        this.game = game;
    }

    public init(): void {
        console.log("Initializing Diagonal Lines Scene");
    }

    public onEnter(): void {
        // Called when scene becomes active
    }

    public onExit(): void {
        // Cleanup if needed
    }

    public update(_deltaTime: number): void {
        // No updates needed for static lines
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.renderBackground(ctx);
        this.renderLines(ctx);
    }

    public resize(): void {
        // Handle canvas resize if needed
    }

    private renderBackground(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    private renderLines(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.config.lineColor;
        ctx.lineWidth = this.config.lineWidth;
        ctx.beginPath();

        // First diagonal (top-left to bottom-right)
        ctx.moveTo(0, 0);
        ctx.lineTo(this.game.canvas.width, this.game.canvas.height);

        // Second diagonal (top-right to bottom-left)
        ctx.moveTo(this.game.canvas.width, 0);
        ctx.lineTo(0, this.game.canvas.height);

        ctx.stroke();
    }
}
