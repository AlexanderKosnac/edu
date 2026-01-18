<script>
    let indentSpaces = 4;

    let jsonString = '{ "name": "George Washington", "birth": { "date": "1732-02-22", "place": "Westmoreland County, Virginia" }, "roles": ["General", "President"], "presidency": { "term_start": "1789-04-30", "term_end": "1797-03-04", "number": 1 } }';
    $: jsonPretty = (() => {
        try {
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed, null, indentSpaces);
        } catch (err) {
            return `Invalid JSON. ${err}`;
        }
    })();
</script>

<div class="row">
    <div class="col">
        <div class="form-group">
            <label for="inputText">JSON Input:</label>
            <textarea class="form-control font-monospace" id="inputText" rows="20" bind:value="{jsonString}"></textarea>
        </div>
    </div>

    <div class="col">
        <label for="outputText">JSON Formatted:</label>
        <textarea class="form-control font-monospace" id="outputText" rows="20" bind:value="{jsonPretty}" readonly="true"></textarea>

        <div class="d-flex flex-column gap-1">
            <label>
                Indent spaces:
                <input type="number" class="form-control" min="0" bind:value={indentSpaces}/>
            </label>    
        </div>
    </div>
</div>

<style>
</style>