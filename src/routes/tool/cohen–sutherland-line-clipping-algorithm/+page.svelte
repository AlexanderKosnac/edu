<script>
    import { onMount } from "svelte";
    import InputPoint from "./InputPoint.svelte";

    let width = 700;
    let width3 = width / 3;
    let width32 = width3 / 2;
    let height = 700;
    let height3 = height / 3;
    let height32 = height3 / 2;

    let pA = { x: 100, y: 200 };
    let pB = { x: 500, y: 500 };

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
    <title>Cohen-Sutherland Algorithm</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Cohen-Sutherland Algorithm</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <svg {width} {height} viewBox="0 0 {width} {height}">
            <line class="clipping-edge" x1="{width3}" y1="0" x2="{height3}" y2="{height}"/>
            <line class="clipping-edge" x1="{width3 * 2}" y1="0" x2="{height3 * 2}" y2="{height}"/>
            <line class="clipping-edge" x1="0" y1="{height3}" x2="{width}" y2="{height3}"/>
            <line class="clipping-edge" x1="0" y1="{height3 * 2}" x2="{height}" y2="{height3 * 2}"/>

            <rect class="screen" x="{width3}" y="{height3}" width="{height3}" height="{height3}"/>

            <text class="region-label" x="{width32 + 0}"          y="{height32 + 0}">1001</text>
            <text class="region-label" x="{width32 + width3}"     y="{height32 + 0}">1000</text>
            <text class="region-label" x="{width32 + width3 * 2}" y="{height32 + 0}">1010</text>
            <text class="region-label" x="{width32 + 0}"          y="{height32 + height3}">0001</text>
            <text class="region-label" x="{width32 + width3}"     y="{height32 + height3}">0000</text>
            <text class="region-label" x="{width32 + width3 * 2}" y="{height32 + height3}">0010</text>
            <text class="region-label" x="{width32 + 0}"          y="{height32 + height3 * 2}">0101</text>
            <text class="region-label" x="{width32 + width3}"     y="{height32 + height3 * 2}">0100</text>
            <text class="region-label" x="{width32 + width3 * 2}" y="{height32 + height3 * 2}">0110</text>

            <path class="continuous-line" d="M {pA.x} {pA.y} L {pB.x} {pB.y}"/>
            <InputPoint bind:x={pA.x} bind:y={pA.y} drag={onDragPoint} fill="green"/>
            <InputPoint bind:x={pB.x} bind:y={pB.y} drag={onDragPoint} fill="blue"/>
        </svg>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm" target="_blank">Cohen-Sutherland algorithm</a></li>
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
    .screen {
        fill: none;
        stroke: blue;
        stroke-width: 3;
    }
    .region-label {
        fill: var(--bs-body-color);
        font-size: 24px;
        text-anchor: middle;
        dominant-baseline: middle;
    }
    .clipping-edge {
        stroke: var(--bs-body-color);
        stroke-width: 2px;
        stroke-dasharray: 5;
    }
</style>