<script>
    let inputText = "Apples\nBananas\nApples\nPears";
    let splitCharacter = "\\n";
    let makeUnique = true;

    let inputElements = [];
    let outputElements = [];
    $: outputText = outputElements.join(splitCharacter);

    function run() {
        const c = splitCharacter.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
        inputElements = inputText.split(c);
        outputElements = [...inputElements];
        if (makeUnique) {
            outputElements = [...new Set(outputElements)];
        }
        outputElements = outputElements.sort();
    }
</script>

<div class="row">
    <div class="col-12 col-md-auto">
        <h2>Input</h2>
        <div class="d-flex flex-column gap-1 mb-1">
            <lable>
                Split on
                <input type="text" class="form-control font-monospace" bind:value={splitCharacter} />
            </lable>

            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" bind:checked={makeUnique} />
                Only show unique elements
            </label>

            <button type="button" class="btn btn-primary" onclick={run}>Extract</button>

            <strong>Statistics:</strong>
            <ul>
                <li>Number of input elements: {inputElements.length}</li>
                <li>Number of output elements: {outputElements.length}</li>
            </ul>
        </div>
    </div>
    <div class="col-12 col-md">
        <h2>Input</h2>
        <textarea class="form-control" rows="20" bind:value={inputText}></textarea>
    </div>
    <div class="col-12 col-md">
        <h2>Output</h2>
        <textarea class="form-control" rows="20" bind:value={outputText}></textarea>
    </div>
</div>

<style>
</style>
