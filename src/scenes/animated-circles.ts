import type { GameEngine, Scene } from "zippy-game-engine";

interface Circle {
    x: number;
    y: number;
    radius: number;
    color: string;
    vx: number;
    vy: number;
}

interface SceneConfig {
    count: number;
    minRadius: number;
    maxRadius: number;
    speed: number;
    gravity: number;
    bounce: number;
}

export class AnimatedCirclesScene implements Scene {
    private readonly config: SceneConfig = {
        count: 10,
        minRadius: 15,
        maxRadius: 50,
        speed: 30,
        gravity: 9.8,
        bounce: 0.7,
    };

    private state = {
        circles: [] as Circle[],
        lastFrameTime: 0,
    };

    public readonly name = "Animated Circles";
    public readonly displayName = "Animated Circles";

    private game: GameEngine;

    constructor(game: GameEngine) {
        this.game = game;
    }

    public init(): void {
        console.log("Initializing Animated Circles Scene");
    }

    public onEnter(): void {
        this.generateCircles();
        this.state.lastFrameTime = performance.now();
    }

    public onExit(): void {
        // Cleanup if needed
    }

    public update(deltaTime: number): void {
        this.updatePhysics(deltaTime);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.renderBackground(ctx);
        this.state.circles.forEach((circle) => this.renderCircle(ctx, circle));
    }

    public resize(): void {
        this.generateCircles();
    }

    private generateCircles(): void {
        this.state.circles = Array.from({ length: this.config.count }, () => {
            const radius =
                this.config.minRadius +
                Math.random() * (this.config.maxRadius - this.config.minRadius);

            return {
                x:
                    Math.random() * (this.game.canvas.width - radius * 2) +
                    radius,
                y: Math.random() * (this.game.canvas.height / 2),
                radius,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                vx: (Math.random() - 0.5) * this.config.speed,
                vy: (Math.random() - 0.5) * this.config.speed,
            };
        });
    }

    private updatePhysics(deltaTime: number): void {
        this.state.circles.forEach((circle) => {
            // Apply gravity
            circle.vy += this.config.gravity * deltaTime;

            // Update position
            circle.x += circle.vx * deltaTime;
            circle.y += circle.vy * deltaTime;

            // Boundary collision
            if (circle.x - circle.radius < 0) {
                circle.x = circle.radius;
                circle.vx *= -this.config.bounce;
            } else if (circle.x + circle.radius > this.game.canvas.width) {
                circle.x = this.game.canvas.width - circle.radius;
                circle.vx *= -this.config.bounce;
            }

            if (circle.y - circle.radius < 0) {
                circle.y = circle.radius;
                circle.vy *= -this.config.bounce;
            } else if (circle.y + circle.radius > this.game.canvas.height) {
                circle.y = this.game.canvas.height - circle.radius;
                circle.vy *= -this.config.bounce;
                circle.vx *= 0.99; // Friction
            }
        });
    }

    private renderBackground(ctx: CanvasRenderingContext2D): void {
        const bgGradient = ctx.createLinearGradient(
            0,
            0,
            0,
            this.game.canvas.height
        );
        bgGradient.addColorStop(0, "#1A2980");
        bgGradient.addColorStop(1, "#26D0CE");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    private renderCircle(ctx: CanvasRenderingContext2D, circle: Circle): void {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;

        // Main circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(
            circle.x - circle.radius / 4,
            circle.y - circle.radius / 4,
            circle.radius / 3,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fill();

        ctx.restore();
    }
}
