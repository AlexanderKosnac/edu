<script>
    const width = 600;
    const height = 600;
    const svgWidth = width;
    const svgHeight = height;

    let centroids = [
        { x: 250, y: 150 },
    ];

    let points = [
        { x: 100, y: 200 },
    ];

    let kCentroids = 3;

    let selectedCentroidPicker = "Random Positions";

    const centroidPickers = {
        "Random Positions": (k) => {
            const min = 0;
            const maxX = width;
            const maxY = height;
            const points = [];
            for (let i = 0; i < k; i++) {
                const x = Math.round(Math.random() * (maxX - min) + min);
                const y = Math.round(Math.random() * (maxY - min) + min);
                points.push({ x, y });
            }
            return points;
        },
    };

    function kMeansClustering() {
        centroids = centroidPickers[selectedCentroidPicker](kCentroids);
    }

    /*
    def k_means_cluster(k, points):
        # Initialization: choose k centroids (Forgy, Random Partition, etc.)
        centroids = [c1, c2, ..., ck]
        
        # Initialize clusters list
        clusters = [[] for _ in range(k)]
        
        # Loop until convergence
        converged = false
        while not converged:
            # Clear previous clusters
            clusters = [[] for _ in range(k)]
        
            # Assign each point to the "closest" centroid 
            for point in points:
                distances_to_each_centroid = [distance(point, centroid) for centroid in centroids]
                cluster_assignment = argmin(distances_to_each_centroid)
                clusters[cluster_assignment].append(point)
            
            # Calculate new centroids
            #   (the standard implementation uses the mean of all points in a
            #     cluster to determine the new centroid)
            new_centroids = [calculate_centroid(cluster) for cluster in clusters]
            
            converged = (new_centroids == centroids)
            centroids = new_centroids
            
            if converged:
                return clusters
    */
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
            <label>
                k (Number of Centroid):
                <input type="number" class="form-control" bind:value={kCentroids} min="1"/>
            </label>

            <label>
                Method to pick starting centroids:
                <select class="form-select" bind:value={selectedCentroidPicker}>
                    {#each Object.entries(centroidPickers) as [name, _]}
                        <option value={name}>{name}</option>
                    {/each}
                </select>
            </label>

            <button type="button" class="btn btn-sm btn-primary" on:click={kMeansClustering}>Cluster!</button>
        </div>

        Centroids:
        <ul>
            {#each centroids as centroid}
                <li>({centroid.x}, {centroid.y})</li>
            {/each}
        </ul>

        Points:
        <ul>
            {#each points as point}
                <li>({point.x}, {point.y})</li>
            {/each}
        </ul>
    </div>
    <div class="col">
        <svg id="canvas2d" {width} {height} viewBox="0 0 {svgWidth} {svgHeight}">
            {#each points as point}
                <circle class="point" cx="{point.x}" cy="{point.y}" r="10"></circle>
            {/each}

            {#each centroids as centroid}
                <circle class="point centroid" cx="{centroid.x}" cy="{centroid.y}" r="10"></circle>
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
    .point {
        stroke: var(--bs-body-color);
        stroke-width: 3px;
        fill: grey;
    }
    .point.centroid{
        fill: red;
    }
</style>