<script>
    let fileInput;

    let tokens = [];
    let matrix = {};

    async function loadFiles() {
        matrix = {};
        if (fileInput.files.length < 1) return;
        for (const file of fileInput.files) {
            const text = await readFileAsText(file);
            matrix[file.name] = {};
            for (const token of tokenize(text)) {
                if (token in matrix[file.name]) {
                    matrix[file.name][token] += 1;
                } else {
                    matrix[file.name][token] = 1;
                    tokens.push(token);
                }
            }
        }
        tokens = [...new Set(tokens)].sort();
    }

    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    function tokenize(input) {
        const tokens = [];
        const regex = /\b\w+\b/g;
        let match;

        while ((match = regex.exec(input)) !== null) {
            tokens.push(normalize(match[0]));
        }

        return tokens;
    }

    function normalize(token) {
        return token.toLowerCase();
    }
</script>

<svelte:head>
    <title>Term Incidence Matrix</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Term Incidence Matrix</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        You can select multiple plaintext files:
        <div class="d-flex flex-row gap-1">
            <input type="file" class="form-control" id="img" name="img" accept="text/plain" multiple bind:this={fileInput}>
            <button type="button" class="btn btn-primary" on:click={loadFiles}>Load</button>
        </div>
        <ul>
            {#each Object.entries(matrix) as [filename, data]}
                <li><strong>{filename}</strong> ({Object.keys(data).length} tokens): {Object.keys(data).join(", ")}</li>
            {/each}
        </ul>
    </div>
</div>

{#if tokens.length > 0}
<div class="row">
    <div class="col">
        <table class="table w-auto">
            <thead>
                <tr>
                    <th>Term</th>
                    {#each Object.entries(matrix) as [key, _]}
                        <th>{key}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each tokens as token}
                <tr>
                    <th>"{token}"</th>
                    {#each Object.entries(matrix) as [_, data]}
                        <td>{data[token] ?? "-"}</td>
                    {/each}
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
{/if}

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://nlp.stanford.edu/IR-book/pdf/01bool.pdf" target="_blank">Information Retrieval book by Stanford University (Section1.1)</a></li>
        </ul>
    </div>
</div>

<style>
</style>