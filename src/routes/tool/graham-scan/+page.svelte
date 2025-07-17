<script>
    import { onMount } from "svelte";
    import SvgDraggablePoint from "$lib/SvgDraggablePoint/SvgDraggablePoint.svelte";

    const width = 600;
    const height = 600;
    const svgWidth = width;
    const svgHeight = height;

    let points = [];

    let n = 5;

    function getRandomPoints(k, minX, maxX, minY, maxY) {
        const points = [];
        for (let i = 0; i < k; i++) {
            const x = Math.round(Math.random() * (maxX - minX) + minX);
            const y = Math.round(Math.random() * (maxY - minY) + minY);
            points.push({ x, y });
        }
        return points;
    }

    function generateRandomPoints() {
        const padding = 0.1;
        points = getRandomPoints(
            n,
            width * padding,
            width * (1 - padding),
            height * padding,
            height * (1 - padding)
        );
    }

    function grahamScan() {
    }

    onMount(()=> {
        generateRandomPoints();
        grahamScan();
    });
</script>

<svelte:head>
    <title>Graham Scan</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Graham Scan</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex gap-1">
            <button type="button" class="btn btn-sm btn-primary" on:click={generateRandomPoints}>Random Points</button>
            <button type="button" class="btn btn-sm btn-primary" on:click={grahamScan}>Scan</button>
        </div>
    </div>

    <div class="col">
        <svg id="canvas2d" {width} {height} viewBox="0 0 {svgWidth} {svgHeight}">
            {#each points as point, i}
                <SvgDraggablePoint bind:x={point.x} bind:y={point.y} drag={grahamScan} fill="blue"/>
            {/each}
        </svg>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://de.wikipedia.org/wiki/Graham_Scan" target="_blank">Graham Scan</a></li>
        </ul>
    </div>
</div>

<style>
    #canvas2d {
        border: 1px solid var(--bs-body-color);
    }
</style>