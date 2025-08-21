import type { FrameContext } from "zippy-shared-lib";
import type { Scene } from "zippy-game-engine";

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

    public init(): void {
        console.log("Initializing Diagonal Lines Scene");
    }

    public onEnter(): void {
        // Called when scene becomes active
    }

    public onExit(): void {
        // Cleanup if needed
    }

    public update(_context: FrameContext): void {
        // No updates needed for static lines
    }

    public render(context: FrameContext): void {
        this.renderBackground(context);
        this.renderLines(context);
    }

    public resize(): void {
        // Handle canvas resize if needed
    }

    private renderBackground(context: FrameContext): void {
        const { ctx, height, width } = context;
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, width, height);
    }

    private renderLines(context: FrameContext): void {
        const { ctx, height, width } = context;
        ctx.strokeStyle = this.config.lineColor;
        ctx.lineWidth = this.config.lineWidth;
        ctx.beginPath();

        // First diagonal (top-left to bottom-right)
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height);

        // Second diagonal (top-right to bottom-left)
        ctx.moveTo(width, 0);
        ctx.lineTo(0, height);

        ctx.stroke();
    }
}
