<script>
    import InputPoint from "./InputPoint.svelte";

    const PIXEL_WIDTH = 35;
    const PIXEL_HEIGHT = 35;

    let pA = { x: 100, y: 200 };
    let pB = { x: 200, y: 500 };

    $: labelA = formatXY(pixelCoord(pA));
    $: labelB = formatXY(pixelCoord(pB));

    function pixelCoord(point) {
        return {
            x: Math.floor(point.x / PIXEL_WIDTH),
            y: Math.floor(point.y / PIXEL_HEIGHT),
        };
    }

    function formatXY(xy) {
        return `[${xy.x}; ${xy.y}]`
    }

    function onChange() {
        pA = pA;
        pB = pB;
    }
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
    <div class="col">
        <svg width="700" height="700" viewBox="0 0 700 700">
            <g>
            {#each {length: 20} as _, i}
                {#each {length: 20} as _, j}
                <rect class="pixel" x="{i*PIXEL_WIDTH}" y="{j*PIXEL_HEIGHT}"></rect>
                {/each}
            {/each}
            </g>
            <path class="continuous-line" d="M {pA.x} {pA.y} L {pB.x} {pB.y}"/>
            <InputPoint point={pA} label={labelA} on:change={onChange} fill="green"/>
            <InputPoint point={pB} label={labelB} on:change={onChange} fill="blue"/>
        </svg>
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