import type { GameEngine, Scene } from "zippy-game-engine";

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

    private game: GameEngine;

    constructor(game: GameEngine) {
        this.game = game;
    }

    public init(): void {
        console.log("Initializing Particle System Scene");
    }

    public onEnter(): void {
        // Initial particles
        while (this.state.particles.length < this.config.maxParticles / 2) {
            this.state.particles.push(this.createParticle());
        }

        // Event listeners
        this.game.canvas.addEventListener("mousemove", this.handleMouseMove);
        this.game.canvas.addEventListener("click", this.handleClick);
    }

    public onExit(): void {
        this.game.canvas.removeEventListener("mousemove", this.handleMouseMove);
        this.game.canvas.removeEventListener("click", this.handleClick);
    }

    public update(deltaTime: number): void {
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
                p.x > this.game.canvas.width + p.size ||
                p.y < -p.size ||
                p.y > this.game.canvas.height + p.size
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

    public render(ctx: CanvasRenderingContext2D): void {
        this.renderBackground(ctx);
        this.renderParticles(ctx);
        this.renderUI(ctx);
    }

    public resize(): void {
        this.state.particles.forEach((p) => {
            p.x = Math.max(
                p.size,
                Math.min(this.game.canvas.width - p.size, p.x)
            );
            p.y = Math.max(
                p.size,
                Math.min(this.game.canvas.height - p.size, p.y)
            );
        });
    }

    private createParticle(x?: number, y?: number): Particle {
        const theme = this.config.colorThemes[this.state.currentTheme];
        return {
            x: x ?? Math.random() * this.game.canvas.width,
            y: y ?? Math.random() * this.game.canvas.height,
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
        const rect = this.game.canvas.getBoundingClientRect();
        this.state.mouse.x = e.clientX - rect.left;
        this.state.mouse.y = e.clientY - rect.top;
    };

    private handleClick = (): void => {
        this.state.currentTheme =
            (this.state.currentTheme + 1) % this.config.colorThemes.length;
    };

    private renderBackground(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.config.background;
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    private renderParticles(ctx: CanvasRenderingContext2D): void {
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

    private renderUI(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`Particles: ${this.state.particles.length}`, 20, 30);
        ctx.fillText(`Click to change color theme`, 20, 60);
    }
}
