import type { FrameContext } from "zippy-shared-lib";
import type { Scene } from "zippy-game-engine";

interface Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    vx: number;
    vy: number;
    life: number;
    decay: number;
}

interface MousePosition {
    x: number;
    y: number;
}

interface ParticleSystemConfig {
    maxParticles: number;
    spawnRate: number;
    baseSize: number;
    sizeVariation: number;
    baseSpeed: number;
    colorThemes: string[][];
    mouseRepelRadius: number;
    background: string;
}

interface ParticleSystemState {
    particles: Particle[];
    currentTheme: number;
    mouse: MousePosition;
}

export class ParticleSystemScene implements Scene {
    private readonly config: ParticleSystemConfig = {
        maxParticles: 500,
        spawnRate: 5,
        baseSize: 5,
        sizeVariation: 15,
        baseSpeed: 50,
        colorThemes: [
            ["#FF5252", "#FF4081", "#E040FB", "#7C4DFF", "#536DFE"],
            ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107"],
            ["#00BCD4", "#03A9F4", "#2196F3", "#3F51B5", "#673AB7"],
        ],
        mouseRepelRadius: 100,
        background: "#121212",
    };

    private state: ParticleSystemState = {
        particles: [],
        currentTheme: 0,
        mouse: { x: -100, y: -100 },
    };

    public readonly name = "Particle System";
    public readonly displayName = "Particle System";

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly width: number,
        private readonly height: number
    ) {}

    public init(): void {
        console.log("Initializing Particle System Scene");
    }

    public onEnter(): void {
        // Initial particles
        while (this.state.particles.length < this.config.maxParticles / 2) {
            this.state.particles.push(this.createParticle());
        }

        // Event listeners
        this.canvas.addEventListener("mousemove", this.handleMouseMove);
        this.canvas.addEventListener("click", this.handleClick);
    }

    public onExit(): void {
        this.canvas.removeEventListener("mousemove", this.handleMouseMove);
        this.canvas.removeEventListener("click", this.handleClick);
    }

    public update(context: FrameContext): void {
        const { deltaTime, width, height } = context;
        // Spawn new particles
        for (let i = 0; i < this.config.spawnRate; i++) {
            if (this.state.particles.length < this.config.maxParticles) {
                this.state.particles.push(
                    this.createParticle(this.state.mouse.x, this.state.mouse.y)
                );
            }
        }

        // Update existing particles
        this.state.particles.forEach((p, index, arr) => {
            // Movement
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;

            // Lifecycle
            p.life -= p.decay;

            // Remove dead or out-of-bounds particles
            if (
                p.life <= 0 ||
                p.x < -p.size ||
                p.x > width + p.size ||
                p.y < -p.size ||
                p.y > height + p.size
            ) {
                arr.splice(index, 1);
                return;
            }

            // Mouse interaction
            const dx = p.x - this.state.mouse.x;
            const dy = p.y - this.state.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.config.mouseRepelRadius) {
                const force = this.config.mouseRepelRadius / distance;
                p.vx += (dx / distance) * force * deltaTime;
                p.vy += (dy / distance) * force * deltaTime;
            }
        });
    }

    public render(context: FrameContext): void {
        this.renderBackground(context);
        this.renderParticles(context);
        this.renderUI(context);
    }

    public resize(): void {
        this.state.particles.forEach((p) => {
            p.x = Math.max(p.size, Math.min(this.width - p.size, p.x));
            p.y = Math.max(p.size, Math.min(this.height - p.size, p.y));
        });
    }

    private createParticle(x?: number, y?: number): Particle {
        const theme = this.config.colorThemes[this.state.currentTheme];
        return {
            x: x ?? Math.random() * this.width,
            y: y ?? Math.random() * this.height,
            size:
                this.config.baseSize +
                Math.random() * this.config.sizeVariation,
            color: theme[Math.floor(Math.random() * theme.length)],
            vx: (Math.random() - 0.5) * this.config.baseSpeed,
            vy: (Math.random() - 0.5) * this.config.baseSpeed,
            life: 1,
            decay: 0.001 + Math.random() * 0.005,
        };
    }

    private handleMouseMove = (e: MouseEvent): void => {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        this.state.mouse.x = (e.clientX - rect.left) * scaleX;
        this.state.mouse.y = (e.clientY - rect.top) * scaleY;
    };

    private handleClick = (): void => {
        this.state.currentTheme =
            (this.state.currentTheme + 1) % this.config.colorThemes.length;
    };

    private renderBackground(context: FrameContext): void {
        const { ctx, height, width } = context;
        ctx.fillStyle = this.config.background;
        ctx.fillRect(0, 0, width, height);
    }

    private renderParticles(context: FrameContext): void {
        const { ctx } = context;
        this.state.particles.forEach((p) => {
            // Main particle
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Glow effect for "fresh" particles
            if (p.life > 0.7) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 1.5 * p.life, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(
                    p.x,
                    p.y,
                    0,
                    p.x,
                    p.y,
                    p.size * 1.5 * p.life
                );
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        });
        ctx.globalAlpha = 1;
    }

    private renderUI(context: FrameContext): void {
        const { ctx } = context;
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`Particles: ${this.state.particles.length}`, 20, 30);
        ctx.fillText(`Click to change color theme`, 20, 60);
    }
}
