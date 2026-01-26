<script>
    let inputText = `Apples
Bananas
Apples
chapter-1
Pears
Chapter-3
chapter-10
apples
chapter-5`;

    let inputSeparatorRaw = "\\n";
    $: inputSeparator = parseSeparator(inputSeparatorRaw);

    let outputSeparatorRaw = "\\n";
    $: outputSeparator = parseSeparator(outputSeparatorRaw);

    let makeUnique = true;

    let lcLocals = ["en", "de"];
    let lcOptions = {
        numeric: true,
        caseFirst: "upper",
        sensitivity: "base",
        ignorePunctuation: false,
    };

    let inputElements = [];
    let outputElements = [];
    $: outputText = outputElements.join(outputSeparator);

    function parseSeparator(input) {
        return input.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\r/g, "\r");
    }

    function run() {
        inputElements = inputText.split(inputSeparator);
        outputElements = [...inputElements];
        if (makeUnique) {
            outputElements = [...new Set(outputElements)];
        }
        outputElements = outputElements.sort((a, b) => a.localeCompare(b, lcLocals, lcOptions));
    }
</script>

<div class="row">
    <div class="col-12 col-md-auto">
        <h2>Settings</h2>
        <div class="d-flex flex-column gap-1">
            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" bind:checked={lcOptions.numeric} />
                Numeric sorting
            </label>

            <label class="form-check-label">
                Case First:
                <select class="form-select unitDropdown" bind:value={lcOptions.caseFirst}>
                    <option value="upper">upper</option>
                    <option value="lower">lower</option>
                    <option value="false">false</option>
                </select>
            </label>

            <label class="form-check-label">
                Sensitivity:
                <select class="form-select unitDropdown" bind:value={lcOptions.sensitivity}>
                    <option value="base">base</option>
                    <option value="accent">accent</option>
                    <option value="case">case</option>
                    <option value="variant">variant</option>
                </select>
            </label>

            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" bind:checked={lcOptions.ignorePunctuation} />
                Ignore punctuation
            </label>

            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" bind:checked={makeUnique} />
                Make unique
            </label>

            <button type="button" class="btn btn-primary align-self-start" onclick={run}>Run</button>
        </div>

        <strong>Statistics:</strong>
        <ul>
            <li>Number of input elements: {inputElements.length}</li>
            <li>Number of output elements: {outputElements.length}</li>
        </ul>
    </div>

    <div class="col-12 col-md">
        <h2>Input</h2>
        <div class="d-flex flex-column gap-1">
            <lable>
                Separator:
                <input type="text" class="form-control font-monospace align-self-start" bind:value={inputSeparatorRaw} />
            </lable>
            <textarea class="form-control" rows="20" bind:value={inputText}></textarea>
        </div>
    </div>
    <div class="col-12 col-md">
        <h2>Output</h2>
        <div class="d-flex flex-column gap-1">
            <lable>
                Separator:
                <input type="text" class="form-control font-monospace align-self-start" bind:value={outputSeparatorRaw} />
            </lable>
            <textarea class="form-control" rows="20" bind:value={outputText} readonly></textarea>
        </div>
    </div>
</div>

<style>
</style>
