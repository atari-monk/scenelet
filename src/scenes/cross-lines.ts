import type { FrameContext } from "zippy-shared-lib";
import type { Scene } from "zippy-game-engine";

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

    public init(): void {
        console.log("Initializing Cross Lines Scene");
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

        // Horizontal line
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);

        // Vertical line
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);

        ctx.stroke();
    }
}
