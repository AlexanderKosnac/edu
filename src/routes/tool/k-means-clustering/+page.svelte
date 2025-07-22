<script>
    import { onMount } from "svelte";

    const width = 600;
    const height = 600;
    const svgWidth = width;
    const svgHeight = height;

    let kCentroids = 3;
    let nPoints = 500;

    let selectedCentroidPicker = "Random Positions";
    let selectedDistanceMeasure = "Euclidean Distance (L2-Norm)";
    let selectedNextCentroidCalculator = "Mean Point";
    let selectedEmptyClusterHandler = "Random Position";

    let centroids = [];

    let points = [];
    $: points = getRandomPoints(nPoints, 0, width, 0, height);

    let clusters = [];

    let clusterColors = [];
    $: clusterColors = generateDistinctColors(kCentroids);

    const centroidPickers = {
        "Random Positions": (k) => {
            return getRandomPoints(k, 0, width, 0, height);
        },
        "Random Point in Dataset": (k) => {
            const ps = [];
            for (let i = 0; i < k; i++) {
                const idx = Math.floor(Math.random() * points.length);
                const point = points[idx];
                ps.push({ x: point.x, y: point.y });
            }
            return ps;
        },
    };

    const distanceMeasures = {
        "Euclidean Distance (L2-Norm)": (p1, p2) => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            return Math.sqrt(dx * dx + dy * dy);
        },
        "L1-Norm": (p1, p2) => {
            const dx = Math.abs(p1.x - p2.x);
            const dy = Math.abs(p1.y - p2.y);
            return dx + dy;
        },
        "Cosine Distance (with L2)": (p1, p2) => {
            const dot = p1.x * p2.x + p1.y * p2.y;
            const norm1 = Math.sqrt(p1.x * p1.x + p1.y * p1.y);
            const norm2 = Math.sqrt(p2.x * p2.x + p2.y * p2.y);
            if (norm1 === 0 || norm2 === 0)
                return 1;
            return 1 - (dot / (norm1 * norm2));
        },
    };

    const nextCentroidCalculator = {
        "Mean Point": (cluster) => {
            let sum = { x: 0, y: 0 };
            for (const point of cluster) {
                sum.x += point.x;
                sum.y += point.y;
            }
            return { x: sum.x / cluster.length, y: sum.y / cluster.length };
        },
    };

    const emptyClusterHandler = {
        "Random Position": () => {
            let pp = getRandomPoints(1, 0, width, 0, height)[0];
            console.log(pp);
            return pp;
        },
    };

    function kMeansClustering() {
        centroids = centroidPickers[selectedCentroidPicker](kCentroids);

        clusters = Array.from({ length: kCentroids }, () => []);

        let converged = false;

        let sanityThreshold = 1000;

        while (!converged && sanityThreshold) {
            sanityThreshold--;

            clusters = Array.from({ length: kCentroids }, () => []);

            for (let p of points) {
                const distances = centroids.map(c => distanceMeasures[selectedDistanceMeasure](p, c));
                const clusterAssignment = distances.indexOf(Math.min(...distances));
                clusters[clusterAssignment].push(p);
            }

            const newCentroids = clusters.map(cluster => {
                if (cluster.length > 0) {
                    return nextCentroidCalculator[selectedNextCentroidCalculator](cluster);
                } else {
                    return emptyClusterHandler[selectedEmptyClusterHandler]();
                }
            });

            converged = newCentroids.every((newC, i) => distanceMeasures[selectedDistanceMeasure](newC, centroids[i]) < 0.0001);
            centroids = newCentroids;

            if (sanityThreshold <= 0) {
                console.error("Broke off k-means clustering because it is likely an infinite loop.");
                break;
            }
        }
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

    function generateDistinctColors(n) {
        const colors = [];
        for (let i = 0; i < n; i++) {
            const hue = i * (360 / n);
            colors.push(`hsl(${hue}, 100%, 50%)`);
        }
        return colors;
    }

    onMount(()=> {
        kMeansClustering();
    });
</script>

<svelte:head>
    <title>k-means Clustering</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>k-means Clustering</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex flex-column gap-1">
            <div class="d-flex gap-1">
                <label>
                    k (Number of Centroids):
                    <input type="number" class="form-control" bind:value={kCentroids} min="1" on:change={kMeansClustering}/>
                </label>
                <label>
                    n (Number of Points):
                    <input type="number" class="form-control" bind:value={nPoints} min="1" on:change={kMeansClustering}/>
                </label>
            </div>

            <label>
                Method to pick starting centroids:
                <select class="form-select" bind:value={selectedCentroidPicker}>
                    {#each Object.entries(centroidPickers) as [name, _]}
                        <option value={name}>{name}</option>
                    {/each}
                </select>
            </label>

            <label>
                Distance Measure:
                <select class="form-select" bind:value={selectedDistanceMeasure}>
                    {#each Object.entries(distanceMeasures) as [name, _]}
                        <option value={name}>{name}</option>
                    {/each}
                </select>
            </label>

            <label>
                Method to determine centroids for next iteration:
                <select class="form-select" bind:value={selectedNextCentroidCalculator}>
                    {#each Object.entries(nextCentroidCalculator) as [name, _]}
                        <option value={name}>{name}</option>
                    {/each}
                </select>
            </label>

            <label>
                Method to handle empty clusters:
                <select class="form-select" bind:value={selectedEmptyClusterHandler}>
                    {#each Object.entries(emptyClusterHandler) as [name, _]}
                        <option value={name}>{name}</option>
                    {/each}
                </select>
            </label>

            <button type="button" class="btn btn-sm btn-primary" on:click={kMeansClustering}>Cluster!</button>
        </div>
    </div>

    <div class="col">
        <svg id="canvas2d" {width} {height} viewBox="0 0 {svgWidth} {svgHeight}">
            {#each clusters as cluster, i}
                {#each cluster as point}
                    <line class="themed-stroke" x1="{centroids[i].x}" y1="{centroids[i].y}" x2="{point.x}" y2="{point.y}" />
                    <circle class="themed-stroke point" cx="{point.x}" cy="{point.y}" r="5" fill="{clusterColors[i]}"></circle>
                {/each}
            {/each}

            {#each centroids as centroid, i}
                <circle class="themed-stroke point" cx="{centroid.x}" cy="{centroid.y}" r="8" fill="{clusterColors[i]}"></circle>
            {/each}
        </svg>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/K-means_clustering" target="_blank">k-means clustering</a></li>
        </ul>
    </div>
</div>

<style>
    #canvas2d {
        border: 1px solid var(--bs-body-color);
    }
    .themed-stroke {
        stroke: var(--bs-body-color);
    }
    .point {
        stroke-width: 2px;
    }
</style>