import type { FrameContext } from "zippy-shared-lib";
import type { Scene } from "zippy-game-engine";

interface CircleConfig {
    x: number;
    y: number;
    radius: number;
    color: string;
}

interface SceneConfig {
    count: number;
    minRadius: number;
    maxRadius: number;
    colors: string[];
    strokeWidth: number;
    strokeColor: string;
    background: string;
}

export class RandomCirclesScene implements Scene {
    private readonly config: SceneConfig = {
        count: 15,
        minRadius: 10,
        maxRadius: 40,
        colors: ["#FF5252", "#4CAF50", "#2196F3", "#FFC107", "#9C27B0"],
        strokeWidth: 2,
        strokeColor: "#333",
        background: "#222",
    };

    private state = {
        circles: [] as CircleConfig[],
    };

    public readonly name = "Random Circles";
    public readonly displayName = "Random Circles";

    constructor(
        private readonly width: number,
        private readonly height: number
    ) {}

    public init(): void {
        console.log("Initializing Random Circles Scene");
    }

    public onEnter(): void {
        this.generateCircles();
    }

    public onExit(): void {
        // Cleanup if needed
    }

    public update(_context: FrameContext): void {
        // Static circles don't need updates
    }

    public render(context: FrameContext): void {
        this.renderBackground(context);
        this.state.circles.forEach((circle) =>
            this.renderCircle(context, circle)
        );
    }

    public resize(): void {
        this.generateCircles();
    }

    private generateCircles(): void {
        this.state.circles = Array.from({ length: this.config.count }, () => ({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            radius:
                this.config.minRadius +
                Math.random() * (this.config.maxRadius - this.config.minRadius),
            color: this.config.colors[
                Math.floor(Math.random() * this.config.colors.length)
            ],
        }));
    }

    private renderBackground(context: FrameContext): void {
        const { ctx, height, width } = context;
        ctx.fillStyle = this.config.background;
        ctx.fillRect(0, 0, width, height);
    }

    private renderCircle(context: FrameContext, circle: CircleConfig): void {
        const { ctx } = context;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();

        // Add subtle stroke
        ctx.lineWidth = this.config.strokeWidth;
        ctx.strokeStyle = this.config.strokeColor;
        ctx.stroke();
    }
}
