<script>
    import { onMount } from "svelte";
    import SvgDraggablePoint from "$lib/SvgDraggablePoint/SvgDraggablePoint.svelte";

    const N_PIXELS_WIDTH = 20;
    const N_PIXELS_HEIGHT = 20;

    const PIXEL_WIDTH = 35;
    const PIXEL_HEIGHT = 35;

    let pA = { x: 100, y: 200 };
    let pB = { x: 500, y: 500 };

    $: labelA = formatXY(pixelCoord(pA));
    $: labelB = formatXY(pixelCoord(pB));

    let pixels = Array(N_PIXELS_WIDTH).fill().map(()=>Array(N_PIXELS_HEIGHT).fill());

    let showPixelIndices = false;
    let lineColor = "#ffaa00";

    function pixelCoord(point) {
        return {
            x: Math.floor(point.x / PIXEL_WIDTH),
            y: Math.floor(point.y / PIXEL_HEIGHT),
        };
    }

    function formatXY(xy) {
        return `[${xy.x}; ${xy.y}]`;
    }

    function setPixel(x, y) {
        pixels[x][y].style.fill = lineColor;
    }

    function clear() {
        pixels.forEach(row => row.forEach(e => e.style.fill = "transparent"));
    }

    function plotLineLow(x0, y0, x1, y1) {
        let dx = x1 - x0;
        let dy = y1 - y0;
        let yi = 1;
        if (dy < 0) {
            yi = -1;
            dy = -dy;
        }
        let D = (2*dy)-dx;
        let y = y0;

        for (let x=x0; x<=x1; x++) {
            setPixel(x, y);
            if (D > 0) {
                y += yi;
                D += 2*(dy-dx);
            } else {
                D += 2*dy;
            }
        }
    }

    function plotLineHigh(x0, y0, x1, y1) {
        let dx = x1 - x0;
        let dy = y1 - y0;
        let xi = 1
        if (dx < 0) {
            xi = -1;
            dx = -dx;
        }
        let D = (2*dx)-dy
        let x = x0;

        for (let y=y0; y<=y1; y++) {
            setPixel(x, y);
            if (D > 0) {
                x += xi;
                D += 2*(dx-dy);
            } else {
                D += 2*dx;
            }
        }
    }

    function plotLine(x0, y0, x1, y1) {
        if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
            if (x0 > x1) {
                plotLineLow(x1, y1, x0, y0);
            } else {
                plotLineLow(x0, y0, x1, y1);
            }
        } else {
            if (y0 > y1) {
                plotLineHigh(x1, y1, x0, y0);
            } else {
                plotLineHigh(x0, y0, x1, y1);
            }
        }
    }

    function onDragPoint()
    {
        let cA = pixelCoord(pA);
        let cB = pixelCoord(pB);

        clear();
        plotLine(cA.x, cA.y, cB.x, cB.y);
    }

    onMount(()=> {
        onDragPoint();
    });
</script>

<svelte:head>
    <title>Bresenham's Line Algorithm</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Bresenham's Line Algorithm</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <svg width="700" height="700" viewBox="0 0 700 700">
            <g>
            {#each {length: N_PIXELS_WIDTH} as _, i}
                {#each {length: N_PIXELS_HEIGHT} as _, j}
                <rect bind:this={pixels[i][j]} class="pixel" x="{i*PIXEL_WIDTH}" y="{j*PIXEL_HEIGHT}"></rect>
                {#if showPixelIndices}
                    <text x="{i*PIXEL_WIDTH+3}" y="{j*PIXEL_HEIGHT+10}" stroke="white" fill="white" style="font-size: .5em">{i}, {j}</text>
                {/if}
                {/each}
            {/each}
            </g>
            <path class="continuous-line" d="M {pA.x} {pA.y} L {pB.x} {pB.y}"/>
            <SvgDraggablePoint bind:x={pA.x} bind:y={pA.y} bind:label={labelA} drag={onDragPoint} fill="green"/>
            <SvgDraggablePoint bind:x={pB.x} bind:y={pB.y} bind:label={labelB} drag={onDragPoint} fill="blue"/>
        </svg>
    </div>
    <div class="col">
        <h2>Settings</h2>
        <div class="form-check">
            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" bind:checked={showPixelIndices}>
                Show pixel indices
            </label>
        </div>
        <div class="form-color">
            <label for="lineColor">Line color</label>
            <input type="color" class="form-control form-control-color" id="lineColor" on:change={onDragPoint} bind:value={lineColor}>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm" target="_blank">Bresenham's line algorithm</a></li>
        </ul>
    </div>
</div>

<style>
    svg {
        border: 1px solid var(--bs-body-color);
    }
    .pixel {
        width: 35px;
        height: 35px;
        stroke: var(--bs-body-color);
        fill: transparent;
    }
    .continuous-line {
        stroke: var(--bs-body-color);
        stroke-width: 6px;
    }
</style>