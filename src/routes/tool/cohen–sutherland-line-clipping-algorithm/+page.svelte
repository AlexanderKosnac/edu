<script>
    import { onMount } from "svelte";
    import SvgDraggablePoint from "$lib/SvgDraggablePoint/SvgDraggablePoint.svelte";

    const TOP = 0b1000;
    const BOTTOM = 0b0100;
    const RIGHT = 0b0010;
    const LEFT = 0b0001;

    const width = 700;
    const width3 = width / 3;
    const width32 = width3 / 2;
    const height = 700;
    const height3 = height / 3;
    const height32 = height3 / 2;

    const xmin = width3;
    const xmax = width3 * 2;
    const ymin = height3;
    const ymax = height3 * 2;

    const pA = { x: 100, y: 200 };
    const pB = { x: 400, y: 400 };

    $: pAOutcode = getOutcode(pA.x, pA.y);
    $: pBOutcode = getOutcode(pB.x, pB.y);

    let clip = null;

    function getOutcode(x, y)
    {
    	let code = 0b0000;

    	if (x < xmin)
    		code |= LEFT;
    	else if (x > xmax)
    		code |= RIGHT;

        if (y < ymin)
    		code |= TOP;
    	else if (y > ymax)
    		code |= BOTTOM;

    	return code;
    }

    function clipLine(x1, y1, x2, y2) {
        let outcode1 = getOutcode(x1, y1);
        let outcode2 = getOutcode(x2, y2);
        let accept = false;

        while (true) {
            if ((outcode1 | outcode2) === 0) { // Trivial accept
                accept = true;
                break;
            } else if ((outcode1 & outcode2) !== 0) { // Trivial reject
                break;
            } else {
                let outcodeOut = outcode1 !== 0 ? outcode1 : outcode2;
                let x, y;

                let dx = x2 - x1;
                let dy = y2 - y1;

                if (outcodeOut & TOP) {
                    x = x1 + dx * (ymin - y1) / dy;
                    y = ymin;
                } else if (outcodeOut & BOTTOM) {
                    x = x1 + dx * (ymax - y1) / dy;
                    y = ymax;
                } else if (outcodeOut & RIGHT) {
                    y = y1 + dy * (xmax - x1) / dx;
                    x = xmax;
                } else if (outcodeOut & LEFT) {
                    y = y1 + dy * (xmin - x1) / dx;
                    x = xmin;
                }

                if (outcodeOut === outcode1) {
                    x1 = x;
                    y1 = y;
                    outcode1 = getOutcode(x1, y1);
                } else {
                    x2 = x;
                    y2 = y;
                    outcode2 = getOutcode(x2, y2);
                }
            }
        }

        return {
            accepted: accept,
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 }
        };
    }

    function onDragPoint() {
        clip = clipLine(pA.x, pA.y, pB.x, pB.y);
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
    <div class="col-auto">
        <svg {width} {height} viewBox="0 0 {width} {height}">
            <line class="clipping-edge" x1="{xmin}" y1="0"      x2="{xmin}"  y2="{height}"/>
            <line class="clipping-edge" x1="{xmax}" y1="0"      x2="{xmax}"  y2="{height}"/>
            <line class="clipping-edge" x1="0"      y1="{ymin}" x2="{width}" y2="{ymin}"/>
            <line class="clipping-edge" x1="0"      y1="{ymax}" x2="{width}" y2="{ymax}"/>

            <rect class="screen" x="{xmin}" y="{ymin}" width="{width3}" height="{height3}"/>

            <text class="region-label" x="{width32 + 0}"          y="{height32 + 0}">1001</text>
            <text class="region-label" x="{width32 + width3}"     y="{height32 + 0}">1000</text>
            <text class="region-label" x="{width32 + width3 * 2}" y="{height32 + 0}">1010</text>
            <text class="region-label" x="{width32 + 0}"          y="{height32 + height3}">0001</text>
            <text class="region-label" x="{width32 + width3}"     y="{height32 + height3}">0000</text>
            <text class="region-label" x="{width32 + width3 * 2}" y="{height32 + height3}">0010</text>
            <text class="region-label" x="{width32 + 0}"          y="{height32 + height3 * 2}">0101</text>
            <text class="region-label" x="{width32 + width3}"     y="{height32 + height3 * 2}">0100</text>
            <text class="region-label" x="{width32 + width3 * 2}" y="{height32 + height3 * 2}">0110</text>

            <path class="continuous-line" class:rejected={!clip?.accepted} d="M {pA.x} {pA.y} L {pB.x} {pB.y}"/>

            {#if clip?.accepted}
                <circle class="point" cx={clip.p1.x} cy={clip.p1.y} r="10" fill="grey"/>
                <circle class="point" cx={clip.p2.x} cy={clip.p2.y} r="10" fill="grey"/>
            {/if}
        
            <SvgDraggablePoint bind:x={pA.x} bind:y={pA.y} drag={onDragPoint} fill="green"/>
            <SvgDraggablePoint bind:x={pB.x} bind:y={pB.y} drag={onDragPoint} fill="blue"/>
        </svg>
    </div>
    <div class="col">
        <div>
            <span class="">Point 1 Outcode:</span>
            <span class="font-monospace">
                {pAOutcode.toString(2).padStart(4, "0")}
            </span>
        </div>
        <div>
            <span class="">Point 2 Outcode:</span>
            <span class="font-monospace">
                {pBOutcode.toString(2).padStart(4, "0")}
            </span>
        </div>
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
    .continuous-line {
        stroke: var(--bs-body-color);
        stroke-width: 6px;
    }
    .continuous-line.rejected {
        stroke: red;
    }
    .screen {
        fill: none;
        stroke: blue;
        stroke-width: 6px;
    }
    .point {
        stroke: var(--bs-body-color);
        stroke-width: 6px;
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