import type { GameEngine } from "zippy-game-engine";

interface ClickCircle {
    x: number;
    y: number;
    radius: number;
    color: string;
}

interface RedBallSceneConfig {
    mainBallRadius: number;
    mainBallColor: string;
    clickCircleMinRadius: number;
    clickCircleMaxRadius: number;
    clickCircleDecayRate: number;
    removalThreshold: number;
    mainBallSpeed: number;
    background: string;
}

interface RedBallSceneState {
    x: number;
    y: number;
    circles: ClickCircle[];
}

export class RedBallScene {
    private readonly config: RedBallSceneConfig = {
        mainBallRadius: 30,
        mainBallColor: "red",
        clickCircleMinRadius: 10,
        clickCircleMaxRadius: 40,
        clickCircleDecayRate: 0.98,
        removalThreshold: 2,
        mainBallSpeed: 100,
        background: "#222",
    };

    private state: RedBallSceneState = {
        x: 0,
        y: 0,
        circles: [],
    };

    public readonly name = "Red Ball";

    private game: GameEngine;

    constructor(game: GameEngine) {
        this.game = game;
    }

    public init(): void {
        console.log("Initializing Red Ball Scene");
    }

    public onEnter(): void {
        this.state.x = this.game.canvas.width / 2;
        this.state.y = this.game.canvas.height / 2;
        this.state.circles = [];
        this.game.canvas.addEventListener("click", this.handleClick.bind(this));
    }

    public onExit(): void {
        this.game.canvas.removeEventListener(
            "click",
            this.handleClick.bind(this)
        );
    }

    public update(deltaTime: number): void {
        // Update main ball position
        this.state.x += this.config.mainBallSpeed * deltaTime;
        if (this.state.x > this.game.canvas.width) {
            this.state.x = 0;
        }

        // Update and filter circles
        this.state.circles.forEach((circle) => {
            circle.radius *= this.config.clickCircleDecayRate;
        });
        this.state.circles = this.state.circles.filter(
            (circle) => circle.radius > this.config.removalThreshold
        );
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.renderBackground(ctx);
        this.renderClickCircles(ctx);
        this.renderMainBall(ctx);
    }

    public resize(): void {
        this.state.x = Math.min(this.state.x, this.game.canvas.width);
        this.state.y = Math.min(this.state.y, this.game.canvas.height);
    }

    private handleClick(e: MouseEvent): void {
        const rect = this.game.canvas.getBoundingClientRect();
        this.state.circles.push({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            radius:
                this.config.clickCircleMinRadius +
                Math.random() *
                    (this.config.clickCircleMaxRadius -
                        this.config.clickCircleMinRadius),
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        });
    }

    private renderBackground(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.config.background;
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    private renderMainBall(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.config.mainBallColor;
        ctx.beginPath();
        ctx.arc(
            this.state.x,
            this.state.y,
            this.config.mainBallRadius,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    private renderClickCircles(ctx: CanvasRenderingContext2D): void {
        this.state.circles.forEach((circle) => {
            ctx.fillStyle = circle.color;
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
