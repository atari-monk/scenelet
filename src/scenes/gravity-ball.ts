import type { FrameContext } from "zippy-shared-lib";
import type { Scene } from "zippy-game-engine";

interface BallState {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
    color: string;
}

interface BallConfig {
    speedX: number;
    radius: number;
    gravity: number;
    bounceFactor: number;
    minSpeed: number;
}

export class GravityBallScene implements Scene {
    private readonly config: BallConfig = {
        speedX: 150, // horizontal speed (pixels/sec)
        radius: 20,
        gravity: 500, // acceleration (pixels/sec²)
        bounceFactor: 0.7, // energy retained after bounce (0-1)
        minSpeed: 5, // minimum speed before stopping
    };

    private state: BallState = {
        x: 50,
        y: 50,
        speedX: this.config.speedX,
        speedY: 0, // vertical speed (starts at 0)
        color: "blue",
    };

    public readonly name = "Gravity Ball";
    public readonly displayName = "Gravity Ball";

    constructor(
        private readonly width: number,
        private readonly height: number
    ) {}

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

    public init(): void {
        console.log("Initializing Gravity Ball Scene");
    }

    public onEnter(): void {
        // Reset position when entering scene
        this.state = {
            x: this.width / 2,
            y: this.height / 4, // Start higher to see gravity effect
            speedX: this.config.speedX,
            speedY: 0,
            color: "blue",
        };
    }

    public onExit(): void {
        // Cleanup if needed
    }

    public update(context: FrameContext): void {
        const { deltaTime, width, height } = context;
        // Apply gravity (changes speedY over time)
        this.state.speedY += this.config.gravity * deltaTime;

        // Update position
        this.state.x += this.state.speedX * deltaTime;
        this.state.y += this.state.speedY * deltaTime;

        // Bounce logic (with energy loss)
        if (
            this.state.x + this.config.radius > width ||
            this.state.x - this.config.radius < 0
        ) {
            this.state.speedX *= -this.config.bounceFactor;
            this.state.x = Math.max(
                this.config.radius,
                Math.min(width - this.config.radius, this.state.x)
            );
            this.state.color = this.getRandomColor();
        }

        if (this.state.y + this.config.radius > height) {
            this.state.speedY *= -this.config.bounceFactor;
            this.state.y = height - this.config.radius;

            // Stop if speed is very small
            if (Math.abs(this.state.speedX) < this.config.minSpeed) {
                this.state.speedX = 0;
            }
            if (Math.abs(this.state.speedY) < this.config.minSpeed) {
                this.state.speedY = 0;
            }

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
}
