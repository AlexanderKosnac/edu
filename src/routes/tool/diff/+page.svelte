<script>
    let text1 = "";
    let text2 = "";
</script>

<svelte:head>
    <title>Diff</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Diff</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <label for="inputText">Text 1:</label>
        <textarea class="form-control font-monospace" rows="20" bind:value="{text1}"></textarea>
    </div>

    <div class="col">
        <label for="outputText">Text 2:</label>
        <textarea class="form-control font-monospace" rows="20" bind:value="{text2}"></textarea>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Diff" target="_blank">Diff</a></li>
            <li><a href="http://www.xmailserver.org/diff2.pdf" target="_blank">"An O(ND) Difference Algorithm and Its Variations" by Eugene W. Myers</a></li>
        </ul>
    </div>
</div>

<style>
</style>