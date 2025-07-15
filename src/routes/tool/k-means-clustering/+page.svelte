<script>
    const width = 600;
    const height = 600;
    const svgWidth = width;
    const svgHeight = height;

    let points = [
        { x: 100, y: 200 },
    ];

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
        Points:
        <ul>
            {#each points as point}
                <li>({point.x}, {point.y})</li>
            {/each}
        </ul>
    </div>
    <div class="col">
        <svg id="canvas2d" {width} {height} viewBox="0 0 {svgWidth} {svgHeight}">
            <line class="axis" x1="0" y1="0" x2="20" y2="60"/>

            {#each points as point}
                <circle class="point" cx="{point.x}" cy="{point.y}" r="10"></circle>
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
</style>