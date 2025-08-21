import type { FrameContext } from "zippy-shared-lib";
import type { Scene } from "zippy-game-engine";

interface BallState {
    x: number;
    y: number;
    dx: number; // normalized direction x
    dy: number; // normalized direction y
    color: string;
}

interface BallConfig {
    speed: number; // pixels per second (physics-based)
    radius: number;
}

export class BouncingBallScene implements Scene {
    private readonly config: BallConfig = {
        speed: 200,
        radius: 20,
    };

    private state: BallState = {
        x: 50,
        y: 50,
        dx: 1,
        dy: 1,
        color: "blue",
    };

    public readonly name = "Bouncing Ball";
    public readonly displayName = "Bouncing Ball";

    constructor(
        private readonly width: number,
        private readonly height: number
    ) {}

    public init(): void {
        console.log("Initializing Bouncing Ball Scene");
    }

    public onEnter(): void {
        // Reset position when entering scene
        this.state = {
            x: this.width / 2,
            y: this.height / 2,
            dx: 1,
            dy: 1,
            color: "blue",
        };
    }

    public onExit(): void {
        // Cleanup if needed
    }

    public update(context: FrameContext): void {
        const { deltaTime, width, height } = context;

        // Physics-based movement: distance = velocity × time
        this.state.x += this.state.dx * this.config.speed * deltaTime;
        this.state.y += this.state.dy * this.config.speed * deltaTime;

        // Bounce logic (with edge clamping to prevent sticking)
        if (this.state.x + this.config.radius > width) {
            this.state.x = width - this.config.radius;
            this.state.dx *= -1;
            this.state.color = this.getRandomColor();
        } else if (this.state.x - this.config.radius < 0) {
            this.state.x = this.config.radius;
            this.state.dx *= -1;
            this.state.color = this.getRandomColor();
        }

        if (this.state.y + this.config.radius > height) {
            this.state.y = height - this.config.radius;
            this.state.dy *= -1;
            this.state.color = this.getRandomColor();
        } else if (this.state.y - this.config.radius < 0) {
            this.state.y = this.config.radius;
            this.state.dy *= -1;
            this.state.color = this.getRandomColor();
        }
    }

    public render(context: FrameContext): void {
        this.renderBackground(context);
        this.renderBall(context);
    }

    public resize(): void {
        // Keep ball on screen if canvas resizes
        this.state.x = Math.min(this.state.x, this.width - this.config.radius);
        this.state.y = Math.min(this.state.y, this.height - this.config.radius);
    }

    private getRandomColor(): string {
        return `hsl(${Math.random() * 360}, 70%, 50%)`;
    }

    private renderBackground(context: FrameContext): void {
        const { ctx, height, width } = context;
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, width, height);
    }

    private renderBall(context: FrameContext): void {
        const { ctx } = context;
        ctx.beginPath();
        ctx.arc(this.state.x, this.state.y, this.config.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.state.color;
        ctx.fill();
    }
}
