<script>
    import { onMount } from "svelte";

    let canvasWidth = 100;
    let canvasHeight = 100;

    let canvas, ctx, imageData;

    const MATERIAL = {
        EMPTY: 0,
        SAND: 1,
        WATER: 2,
        PLANT: 3,
        FIRE: 4,
        LAVA: 5,
        STONE: 6,
        OIL: 7,
        GAS: 8,
    };

    const MATERIAL_NAME = Object.fromEntries(Object.entries(MATERIAL).map(([k, v]) => [v, k]));

    const downMoves = [
        [0, 1],
        [-1, 1],
        [1, 1],
    ];
    const liquidMoves = [
        [0, 1],
        [-1, 1],
        [1, 1],
        [-1, 0],
        [1, 0],
    ];
    const neighbors = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];

    const materials = {
        [MATERIAL.SAND]: {
            color: [194, 178, 128],
            density: 3,
            update(x, y) {
                tryMove(x, y, downMoves);
            },
        },
        [MATERIAL.WATER]: {
            color: [64, 128, 255],
            density: 1,
            update(x, y) {
                tryMove(x, y, liquidMoves);
            },
        },
        [MATERIAL.PLANT]: {
            color: [50, 200, 50],
            density: 2,
            update(x, y) {
                for (const [dx, dy] of neighbors) {
                    const n = get(x + dx, y + dy);
                    if (n === MATERIAL.WATER && Math.random() < 0.01) {
                        set(x + dx, y + dy, MATERIAL.PLANT);
                    }
                    if (n === MATERIAL.FIRE) set(x, y, MATERIAL.FIRE);
                }
            },
        },
        [MATERIAL.FIRE]: {
            color: [255, 100, 20],
            density: 0,
            update(x, y) {
                if (Math.random() < 0.05) {
                    set(x, y, MATERIAL.EMPTY);
                    return;
                }
                for (const [dx, dy] of neighbors) {
                    if (get(x + dx, y + dy) === MATERIAL.PLANT) {
                        set(x + dx, y + dy, MATERIAL.FIRE);
                    }
                }
            },
        },
        [MATERIAL.LAVA]: {
            color: [255, 60, 0],
            density: 4,
            update(x, y) {
                for (const [dx, dy] of neighbors) {
                    if (get(x + dx, y + dy) === MATERIAL.WATER && Math.random() < 0.02) {
                        set(x, y, MATERIAL.STONE);
                        return;
                    }
                }

                tryMove(x, y, liquidMoves);

                for (const [dx, dy] of neighbors) {
                    if (get(x + dx, y + dy) === MATERIAL.WATER) {
                        set(x, y, MATERIAL.STONE);
                        set(x + dx, y + dy, MATERIAL.STONE);
                    }
                }
            },
        },
        [MATERIAL.STONE]: {
            color: [100, 100, 100],
            density: 5,
            update() {},
        },
        [MATERIAL.OIL]: {
            color: [80, 60, 30],
            density: 0.8,
            update(x, y) {
                tryMove(x, y, liquidMoves);
                for (const [dx, dy] of neighbors) {
                    if (get(x + dx, y + dy) === MATERIAL.FIRE) {
                        set(x, y, MATERIAL.FIRE);
                    }
                }
            },
        },
        [MATERIAL.GAS]: {
            color: [180, 180, 180],
            density: -1,
            update(x, y) {
                if (Math.random() < 0.002) {
                    set(x, y, MATERIAL.EMPTY);
                    return;
                }

                const moves = [[0, -1], Math.random() < 0.5 ? [-1, -1] : [1, -1], Math.random() < 0.5 ? [-1, 0] : [1, 0], Math.random() < 0.5 ? [-1, 0] : [1, 0]];

                tryMove(x, y, moves);

                for (const [dx, dy] of neighbors) {
                    if (get(x + dx, y + dy) === MATERIAL.FIRE) {
                        set(x, y, MATERIAL.FIRE);
                        return;
                    }
                }
            },
        },
    };

    let grid = new Uint8Array(canvasWidth * canvasHeight);
    let visited = new Uint8Array(canvasWidth * canvasHeight);

    function resizeGrid() {
        grid = new Uint8Array(canvasWidth * canvasHeight);
        visited = new Uint8Array(canvasWidth * canvasHeight);
        imageData = ctx.createImageData(canvasWidth, canvasHeight);
    }

    function idx(x, y) {
        return y * canvasWidth + x;
    }

    function inBounds(x, y) {
        return x >= 0 && x < canvasWidth && y >= 0 && y < canvasHeight;
    }

    function get(x, y) {
        return inBounds(x, y) ? grid[idx(x, y)] : MATERIAL.EMPTY;
    }

    function set(x, y, v) {
        if (inBounds(x, y)) grid[idx(x, y)] = v;
    }

    function swap(x1, y1, x2, y2) {
        const a = grid[idx(x1, y1)];
        const b = grid[idx(x2, y2)];
        grid[idx(x1, y1)] = b;
        grid[idx(x2, y2)] = a;
    }

    function tryMove(x, y, moves) {
        const p = grid[idx(x, y)];
        const mat = materials[p];

        for (let i = 0; i < moves.length; i++) {
            const [dx, dy] = moves[(Math.random() * moves.length) | 0];
            const nx = x + dx;
            const ny = y + dy;

            if (!inBounds(nx, ny)) continue;

            const t = grid[idx(nx, ny)];
            if (t === MATERIAL.EMPTY) {
                grid[idx(nx, ny)] = p;
                grid[idx(x, y)] = MATERIAL.EMPTY;
                visited[idx(nx, ny)] = 1;
                return;
            }

            if (materials[t].density < mat.density) {
                swap(x, y, nx, ny);
                visited[idx(nx, ny)] = 1;
                return;
            }
        }
    }

    function step() {
        visited.fill(0);

        for (let y = canvasHeight - 1; y >= 0; y--) {
            for (let x = 0; x < canvasWidth; x++) {
                const i = idx(x, y);
                const p = grid[i];
                if (!p || visited[i]) continue;

                materials[p].update(x, y);
                visited[i] = 1;
            }
        }
    }

    function nextGeneration() {
        step();
        render();
    }

    function render() {
        const data = imageData.data;

        for (let i = 0; i < grid.length; i++) {
            const c = materials[grid[i]]?.color ?? [0, 0, 0];
            const di = i * 4;
            data[di] = c[0];
            data[di + 1] = c[1];
            data[di + 2] = c[2];
            data[di + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    let currentMaterial = MATERIAL.SAND;
    let brushSize = 2;
    let painting = false;

    function paint(e) {
        const rect = canvas.getBoundingClientRect();
        const sx = canvas.width / rect.width;
        const sy = canvas.height / rect.height;

        const cx = ((e.clientX - rect.left) * sx) | 0;
        const cy = ((e.clientY - rect.top) * sy) | 0;

        for (let dy = -brushSize; dy <= brushSize; dy++) {
            for (let dx = -brushSize; dx <= brushSize; dx++) {
                const x = cx + dx;
                const y = cy + dy;
                if (get(x, y) === MATERIAL.EMPTY || currentMaterial === MATERIAL.EMPTY) {
                    set(x, y, currentMaterial ?? MATERIAL.EMPTY);
                }
            }
        }
    }

    function delay(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }

    async function run() {
        const frame = 1000 / 60;
        while (true) {
            const t = performance.now();
            nextGeneration();
            await delay(Math.max(0, frame - (performance.now() - t)));
        }
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
        resizeGrid();
        render();
        run();
    });
</script>

<div class="row mt-1">
    <div class="col-auto">
        <canvas
            bind:this={canvas}
            width={canvasWidth}
            height={canvasHeight}
            on:mousedown={(e) => {
                painting = true;
                paint(e);
            }}
            on:mousemove={(e) => painting && paint(e)}
            on:mouseup={() => (painting = false)}
            on:mouseleave={() => (painting = false)}
        ></canvas>
    </div>

    <div class="col d-flex flex-column gap-1">
        <div class="d-flex flex-column gap-1">
            {#each Object.values(MATERIAL) as material}
                <label>
                    <input type="radio" class="form-check-input" value={material} bind:group={currentMaterial} />
                    {MATERIAL_NAME[material]}
                </label>
            {/each}
        </div>

        <label class="align-self-start">
            Brush
            <input type="range" class="form-range" min="1" max="10" bind:value={brushSize} />
        </label>
    </div>
</div>

<style>
    canvas {
        image-rendering: pixelated;
        width: 600px;
        height: 600px;
        border: 1px solid var(--bs-body-color);
    }
</style>
