import type { GameEngine, Scene } from "zippy-game-engine";

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
    private game: GameEngine;

    constructor(game: GameEngine) {
        this.game = game;
    }

    private getRandomColor(): string {
        return `hsl(${Math.random() * 360}, 70%, 50%)`;
    }

    private renderBackground(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    private renderBall(ctx: CanvasRenderingContext2D): void {
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
            x: this.game.canvas.width / 2,
            y: this.game.canvas.height / 4, // Start higher to see gravity effect
            speedX: this.config.speedX,
            speedY: 0,
            color: "blue",
        };
    }

    public onExit(): void {
        // Cleanup if needed
    }

    public update(deltaTime: number): void {
        // Apply gravity (changes speedY over time)
        this.state.speedY += this.config.gravity * deltaTime;

        // Update position
        this.state.x += this.state.speedX * deltaTime;
        this.state.y += this.state.speedY * deltaTime;

        // Bounce logic (with energy loss)
        if (
            this.state.x + this.config.radius > this.game.canvas.width ||
            this.state.x - this.config.radius < 0
        ) {
            this.state.speedX *= -this.config.bounceFactor;
            this.state.x = Math.max(
                this.config.radius,
                Math.min(
                    this.game.canvas.width - this.config.radius,
                    this.state.x
                )
            );
            this.state.color = this.getRandomColor();
        }

        if (this.state.y + this.config.radius > this.game.canvas.height) {
            this.state.speedY *= -this.config.bounceFactor;
            this.state.y = this.game.canvas.height - this.config.radius;

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

    public render(ctx: CanvasRenderingContext2D): void {
        this.renderBackground(ctx);
        this.renderBall(ctx);
    }

    public resize(): void {
        // Keep ball on screen if canvas resizes
        this.state.x = Math.min(
            this.state.x,
            this.game.canvas.width - this.config.radius
        );
        this.state.y = Math.min(
            this.state.y,
            this.game.canvas.height - this.config.radius
        );
    }
}
