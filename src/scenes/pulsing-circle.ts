import type { FrameContext } from "zippy-shared-lib";
import type { Scene } from "zippy-game-engine";

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

    public init(): void {
        console.log("Initializing Pulsing Circle Scene");
    }

    public onEnter(): void {
        this.resetState();
    }

    public onExit(): void {
        // Cleanup if needed
    }

    public update(context: FrameContext): void {
        this.updateSize(context);
        this.updateColor();
    }

    public render(context: FrameContext): void {
        this.renderBackground(context);
        this.renderCircle(context);

        if (this.config.debugInfo) {
            this.renderDebugInfo(context);
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

    private updateSize(context: FrameContext): void {
        // Update size with frame-rate independent calculation
        const growthDirection = this.state.growing ? 1 : -1;
        this.state.size +=
            growthDirection * this.config.growthRate * context.deltaTime * 60;

        // Toggle growth direction at boundaries
        if (this.state.size > this.config.maxSize) this.state.growing = false;
        if (this.state.size < this.config.minSize) this.state.growing = true;
    }

    private updateColor(): void {
        // Color pulsing effect
        const hue = (Date.now() / this.config.colorChangeSpeed) % 360;
        this.state.color = `hsl(${hue}, 100%, 50%)`;
    }

    private renderBackground(context: FrameContext): void {
        const { ctx, height, width } = context;
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, width, height);
    }

    private renderCircle(context: FrameContext): void {
        const { ctx, height, width } = context;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, this.state.size, 0, Math.PI * 2);
        ctx.fillStyle = this.state.color;
        ctx.fill();
    }

    private renderDebugInfo(context: FrameContext): void {
        const { ctx, height, width } = context;
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            `Size: ${this.state.size.toFixed(1)}`,
            width / 2,
            height / 2
        );
    }
}
