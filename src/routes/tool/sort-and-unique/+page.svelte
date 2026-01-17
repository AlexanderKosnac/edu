<script>
    let inputText = "Apples\nBananas\nApples\nPears";
    let splitCharacter = "\\n";
    let makeUnique = true;

    let inputElements = [] 
    let outputElements = [];

    function run() {
        const c = splitCharacter.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        inputElements = inputText.split(c);
        outputElements = [... inputElements];
        if (makeUnique) {
            outputElements = [...new Set(outputElements)];
        }
        outputElements = outputElements.sort();
        outputElements = elements;
    }
</script>

<div class="row">
    <div>
        A basic tool that allows to sort and extract unique elements from a text.
    </div>
    <div class="col">
        <h2>Input</h2>
        <div class="d-flex flex-column gap-1 mb-1">
            <lable>
                Split on
                <input type="text" class="form-control font-monospace" bind:value="{splitCharacter}"/>
            </lable>

            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" bind:checked={makeUnique}/>
                Only show unique elements
            </label>
            
            <button type="button" class="btn btn-primary" onclick={run}>Extract</button>
        </div>
        <textarea class="form-control" rows="20" bind:value="{inputText}"></textarea>
    </div>
    <div class="col">
        <h2>Output</h2>
        <ul>
            Number of input elements: {inputElements.length}<br>
            Number of output elements: {outputElements.length}<br>
            {#each outputElements as e}
                <li>{e}</li>
            {/each}
        </ul>
    </div>
</div>

<style>
</style>