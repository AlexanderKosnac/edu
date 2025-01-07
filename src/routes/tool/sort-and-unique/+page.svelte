<script>
    let inputText = "Apples\nBananas\nApples\nPears";
    let outputText = "";
    let splitCharacter = "\n";

    function run() {
        const c = splitCharacter.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        outputText = [...new Set(inputText.split(c))].sort().join(c);
    }
</script>

<svelte:head>
    <title>Sort and Unique</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Sort and Unique</h1>
    </div>
</div>

<div class="row">
    <div>
        A basic tool that allows to sort and extract unique elements from a text.
    </div>
    <div class="col">
        <h2>Input</h2>
        <div class="d-flex flex-column gap-1 mb-1">
            <lable>
                Split on:
                <input type="text" class="form-control font-monospace" bind:value="{splitCharacter}"/>
            </lable>
            
            <button type="button" class="btn btn-primary" on:click={run}>Extract</button>
        </div>
        <textarea class="form-control" rows="20" bind:value="{inputText}"></textarea>
    </div>
    <div class="col">
        <h2>Output</h2>
        <textarea class="form-control" rows="20" bind:value="{outputText}" readonly></textarea>
    </div>
</div>

<style>
</style>