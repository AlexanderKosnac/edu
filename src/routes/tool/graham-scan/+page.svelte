<script>
    import { onMount } from "svelte";
    import SvgDraggablePoint from "$lib/SvgDraggablePoint/SvgDraggablePoint.svelte";

    const width = 600;
    const height = 600;
    const svgWidth = width;
    const svgHeight = height;

    let points = [];
    let hull = [];

    let n = 5;

    function pointsToSvgPath(points) {
        if (points.length === 0)
            return "";

        const start = points[0];
        const path = [`M ${start.x} ${start.y}`];

        for (let i = 1; i < hull.length; i++) {
            path.push(`L ${hull[i].x} ${hull[i].y}`);
        }

        path.push('Z');
        return path.join(' ');
    }

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
        doGrahamScan();
    }

    function grahamScan() {
        if (points.length < 3)
            return [];

        // Lowest, most-left point as start point.
        const pivot = points.reduce((res, p) => {
            if (p.y < res.y || (p.y === res.y && p.x < res.x))
                return p;
            return res;
        });

        const angle = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);

        // Points by polar angles
        const sorted = points.slice().sort((a, b) => {
            const angleA = angle(pivot, a);
            const angleB = angle(pivot, b);
            if (angleA === angleB) {
                const distA = (pivot.x - a.x) ** 2 + (pivot.y - a.y) ** 2;
                const distB = (pivot.x - b.x) ** 2 + (pivot.y - b.y) ** 2;
                return distA - distB;
            }
            return angleA - angleB;
        });

        // Turn direction
        function cross(o, a, b) {
            return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
        }

        // Build convex hull
        const hull = [];
        for (const pt of sorted) {
            while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], pt) <= 0) {
                hull.pop(); // Non-left turn
            }
            hull.push(pt);
        }

        return hull;
    }

    function doGrahamScan() {
        hull = grahamScan();
    }

    onMount(()=> {
        generateRandomPoints();
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
    <div class="col-auto">
        <svg id="canvas2d" {width} {height} viewBox="0 0 {svgWidth} {svgHeight}">
            <path class="hull" d="{pointsToSvgPath(hull)}"/>

            {#each points as point}
                <SvgDraggablePoint bind:x={point.x} bind:y={point.y} drag={doGrahamScan} fill="blue"/>
            {/each}
        </svg>
    </div>

    <div class="col">
        <div class="d-flex flex-column align-items-start gap-1">
            <label>
                Number of Points:
                <input type="number" class="form-control" bind:value={n} min="3" on:change={generateRandomPoints}/>
            </label>

            <button type="button" class="btn btn-sm btn-primary" on:click={generateRandomPoints}>Random Points</button>
        </div>
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
    .hull {
        stroke: var(--bs-body-color);
        stroke-width: 5;
        fill: transparent;
    }
</style>