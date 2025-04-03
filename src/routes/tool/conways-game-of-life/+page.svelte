<script>
    let canvas;
</script>

<svelte:head>
    <title>Conway's Game of Life</title>
</svelte:head>

<div class="row">
    <div class="col">
        Controls
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <canvas bind:this={canvas}/>
    </div>
    <div class="col">
        Conway's Game of Life operates on a grid of cells that can either be alive, or dead.
        In which state they are, is determined by the following four rules:
        <ul>
            <li>Any live cell with fewer than two live neighbours dies.</li>
            <li>Any live cell with two or three live neighbours lives on.</li>
            <li>Any live cell with more than three live neighbours dies.</li>
            <li>Any dead cell with exactly three live neighbours becomes a live cell.</li>
        </ul>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">Conway's Game of Life (Wikipedia)</a></li>
        </ul>
    </div>
</div>

<style>
    canvas {
        image-rendering: pixelated;
        width: 600px;
        height: 600px;
        border: 1px solid var(--bs-body-color)
    }
</style>