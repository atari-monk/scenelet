import type { GameEngine, Scene } from "zippy-game-engine";

interface CrossLinesConfig {
    lineColor: string;
    lineWidth: number;
}

export class CrossLinesScene implements Scene {
    private readonly config: CrossLinesConfig = {
        lineColor: "green",
        lineWidth: 3,
    };

    public readonly name = "Cross Lines";
    public readonly displayName = "Cross Lines";

    private game: GameEngine;

    constructor(game: GameEngine) {
        this.game = game;
    }

    public init(): void {
        console.log("Initializing Cross Lines Scene");
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

        // Horizontal line
        ctx.moveTo(0, this.game.canvas.height / 2);
        ctx.lineTo(this.game.canvas.width, this.game.canvas.height / 2);

        // Vertical line
        ctx.moveTo(this.game.canvas.width / 2, 0);
        ctx.lineTo(this.game.canvas.width / 2, this.game.canvas.height);

        ctx.stroke();
    }
}
