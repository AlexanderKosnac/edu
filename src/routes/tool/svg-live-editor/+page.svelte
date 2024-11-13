<script>
    let svgInput = `\
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid red">
    <circle cx="100" cy="80" r="40" stroke="cornflowerblue" stroke-width="4" fill="deepskyblue" />
    <rect x="100" y="100" width="100" height="100" rx="15" stroke="crimson" stroke-width="4" fill="coral" />
    <path d="M 60,200 l 110,-40 l -60,-60 z" stroke="limegreen" stroke-width="4" fill="lime"/>
</svg>
`;
</script>

<svelte:head>
    <title>SVG Live Editor</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>SVG Live Editor</h1>
    </div>
</div>

<div class="row gap-1 p-1">
    <div class="col">
        <div class="form-group">
            <label for="inputText">SVG Input:</label>
            <textarea class="form-control" id="inputText" rows="20" bind:value="{svgInput}"></textarea>
        </div>
    </div>

    <div class="col">
        <div class="svg-container">{@html svgInput}</div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/SVG" target="_blank">SVG (Wikipedia)</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element" target="_blank">SVG Element Reference</a></li>
        </ul>
    </div>
</div>

<style>
    #inputText {
      font-family: "Courier New", monospace;
    }
</style>