export class Particle {
    constructor(color, behavior) {
        this.color = color;       // array [r, g, b], e.g., [255, 128, 0]
        this.behavior = behavior; // function (grid, x, y)
    }
}