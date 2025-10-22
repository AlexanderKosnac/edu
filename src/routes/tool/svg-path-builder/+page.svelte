<script>
    let width = 516;
    let height = 516;

    let vp0 = 0;
    let vp1 = 0;
    let vp2 = width;
    let vp3 = height;

    let strokeColor = "";
    let strokeWidth = 5;
    let strokeLinecap = "butt";

    let fillColor = "transparent";

    function clearFillColor() {
        fillColor = "transparent";
    }
</script>

<svelte:head>
    <title>SVG path builder</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>SVG path builder</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <div class="d-flex flex-column gap-1">
            <div class="input-group">
                <span class="input-group-text">Width:</span>
                <input type="number" class="form-control" placeholder="Width" aria-label="Grid Width" step="1" bind:value={width} min="0" style="width: 8em"/>
                <span class="input-group-text">Height:</span>
                <input type="number" class="form-control" placeholder="Height" aria-label="Grid Height" step="1" bind:value={height} min="0" style="width: 8em"/>
            </div>

            <div class="input-group">
                <span class="input-group-text">Viewport:</span>
                <input type="number" class="form-control" bind:value={vp0} style="width: 6em"/>
                <input type="number" class="form-control" bind:value={vp1} style="width: 6em"/>
                <input type="number" class="form-control" bind:value={vp2} style="width: 6em"/>
                <input type="number" class="form-control" bind:value={vp3} style="width: 6em"/>
            </div>

            <div class="input-group">
                <span class="input-group-text">Stroke:</span>
                <input type="color" class="form-control form-control-color" bind:value={strokeColor}/>
                <input type="number" class="form-control" placeholder="Height" aria-label="Grid Height" step="1" bind:value={strokeWidth} min="0" style="width: 8em"/>
                <select class="form-select" bind:value={strokeLinecap}>
                    <option value="butt" selected>butt</option>
                    <option value="round">round</option>
                    <option value="square">square</option>
                </select>
            </div>

            <div class="input-group">
                <span class="input-group-text">Fill:</span>
                <input type="color" class="form-control form-control-color" bind:value={fillColor}/>
                <button type="button" class="btn btn-secondary" onclick={clearFillColor}>
                    <i class="bi bi-x"></i>
                </button>
            </div>
        </div>
    </div>
    <div class="col">
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="{vp0} {vp1} {vp2} {vp3}" stroke="currentColor">
            <path
                stroke="{strokeColor}" stroke-width="{strokeWidth}px" stroke-linecap="{strokeLinecap}"
                fill="{fillColor}"
                d="M 50 80 h 50 v 50 h -50 l 25 -25" />
        </svg>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Paths" target="_blank">MDN SVG Path documentation</a></li>
        </ul>
    </div>
</div>

<style>
    svg {
        border: 1px solid var(--bs-body-color);
    }
</style>