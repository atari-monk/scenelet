import type { FrameContext } from "zippy-shared-lib";
import type { Scene } from "zippy-game-engine";

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

export class RedBallScene implements Scene {
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

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly width: number,
        private readonly height: number
    ) {}

    public init(): void {
        console.log("Initializing Red Ball Scene");
    }

    public onEnter(): void {
        this.state.x = this.width / 2;
        this.state.y = this.height / 2;
        this.state.circles = [];
        this.canvas.addEventListener("click", this.handleClick.bind(this));
    }

    public onExit(): void {
        this.canvas.removeEventListener("click", this.handleClick.bind(this));
    }

    public update(context: FrameContext): void {
        const { deltaTime, width } = context;
        // Update main ball position
        this.state.x += this.config.mainBallSpeed * deltaTime;
        if (this.state.x > width) {
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

    public render(context: FrameContext): void {
        this.renderBackground(context);
        this.renderClickCircles(context);
        this.renderMainBall(context);
    }

    public resize(): void {
        this.state.x = Math.min(this.state.x, this.width);
        this.state.y = Math.min(this.state.y, this.height);
    }

    private handleClick(e: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
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

    private renderBackground(context: FrameContext): void {
        const { ctx, height, width } = context;
        ctx.fillStyle = this.config.background;
        ctx.fillRect(0, 0, width, height);
    }

    private renderMainBall(context: FrameContext): void {
        const { ctx } = context;
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

    private renderClickCircles(context: FrameContext): void {
        const { ctx } = context;
        this.state.circles.forEach((circle) => {
            ctx.fillStyle = circle.color;
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
