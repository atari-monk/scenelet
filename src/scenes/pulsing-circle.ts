import type { GameEngine, Scene } from "zippy-game-engine";

interface PulsingCircleConfig {
    minSize: number;
    maxSize: number;
    growthRate: number;
    colorChangeSpeed: number; // milliseconds per hue cycle
    debugInfo: boolean;
}

interface PulsingCircleState {
    size: number;
    growing: boolean;
    color: string;
}

export class PulsingCircleScene implements Scene {
    private readonly config: PulsingCircleConfig = {
        minSize: 10,
        maxSize: 100,
        growthRate: 0.05,
        colorChangeSpeed: 50,
        debugInfo: true,
    };

    private state: PulsingCircleState = {
        size: this.config.minSize,
        growing: true,
        color: "purple",
    };

    public readonly name = "Pulsing Circle";
    public readonly displayName = "Pulsing Circle";

    private game: GameEngine;

    constructor(game: GameEngine) {
        this.game = game;
    }

    public init(): void {
        console.log("Initializing Pulsing Circle Scene");
    }

    public onEnter(): void {
        this.resetState();
    }

    public onExit(): void {
        // Cleanup if needed
    }

    public update(deltaTime: number): void {
        this.updateSize(deltaTime);
        this.updateColor();
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.renderBackground(ctx);
        this.renderCircle(ctx);

        if (this.config.debugInfo) {
            this.renderDebugInfo(ctx);
        }
    }

    public resize(): void {
        // Handle canvas resize if needed
    }

    private resetState(): void {
        this.state = {
            size: this.config.minSize,
            growing: true,
            color: "purple",
        };
    }

    private updateSize(deltaTime: number): void {
        // Update size with frame-rate independent calculation
        const growthDirection = this.state.growing ? 1 : -1;
        this.state.size +=
            growthDirection * this.config.growthRate * deltaTime * 60;

        // Toggle growth direction at boundaries
        if (this.state.size > this.config.maxSize) this.state.growing = false;
        if (this.state.size < this.config.minSize) this.state.growing = true;
    }

    private updateColor(): void {
        // Color pulsing effect
        const hue = (Date.now() / this.config.colorChangeSpeed) % 360;
        this.state.color = `hsl(${hue}, 100%, 50%)`;
    }

    private renderBackground(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    private renderCircle(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(
            this.game.canvas.width / 2,
            this.game.canvas.height / 2,
            this.state.size,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = this.state.color;
        ctx.fill();
    }

    private renderDebugInfo(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            `Size: ${this.state.size.toFixed(1)}`,
            this.game.canvas.width / 2,
            this.game.canvas.height / 2
        );
    }
}
