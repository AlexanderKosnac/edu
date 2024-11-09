<script>
    let fileInput;

    let invertedIndex = {};
    let files = [];

    async function loadFiles() {
        invertedIndex = {};
        files = [];
        if (fileInput.files.length < 1) return;
        let id = 0;
        for (const file of fileInput.files) {
            files.push(file.name);
            id++;
            const text = await readFileAsText(file);
            for (const token of tokenize(text)) {
                if (token in invertedIndex && !invertedIndex[token].includes(id)) {
                    invertedIndex[token].push(id);
                } else {
                    invertedIndex[token] = [id];
                }
            }
        }
        files = [...files];
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
    <title>Inverted Index</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Inverted Index</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        You can select multiple plaintext files:
        <div class="d-flex flex-row gap-1">
            <input type="file" class="form-control" id="img" name="img" accept="text/plain" multiple bind:this={fileInput}>
            <button type="button" class="btn btn-primary" on:click={loadFiles}>Load</button>
        </div>
        {#if files.length > 0}
        <ul>
            {#each files as file, id}
            <li>[ID: {id+1}] {file}</li>
            {/each}
        </ul>
        {/if}
    </div>
</div>

{#if files.length > 0}
<div class="row">
    <div class="col-auto">
        <div class="m-2"></div>
        <div class="d-flex flex-column gap-1">
            <div class="d-flex flex-row gap-1 align-items-center">
                <div class="entry"><strong>Token</strong></div>
                <div class="entry">Doc. Freq.</div>
                <div>&#8594;</div>
                <div class="entry">File ID</div>
                <div class="entry">File ID</div>
                <div class="entry">...</div>
            </div>
    
            {#each Object.entries(invertedIndex).sort() as [token, filesWithToken]}
            <div class="d-flex flex-row gap-1 align-items-center">
                <div class="entry"><strong>{token}</strong></div>
                <div class="entry">{filesWithToken.length}</div>
                <div>&#8594;</div>
                {#each filesWithToken as file}
                    <div class="entry">{file}</div>
                {/each}
            </div>
            {/each}
        </div>
    </div>
</div>
{/if}

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://nlp.stanford.edu/IR-book/pdf/01bool.pdf" target="_blank">Information Retrieval book by Stanford University (Section1.2)</a></li>
        </ul>
    </div>
</div>

<style>
    div.entry {
        border: 1px solid var(--bs-body-color);
        padding: 5px;
        display: inline-block;
    }
</style>