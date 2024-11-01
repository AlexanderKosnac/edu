<script>
    let fileInput;

    let bagOfWords = {};
    let files = {};

    async function loadFiles() {
        bagOfWords = {};
        if (fileInput.files.length < 1) return;

        files = {};
        for (const file of fileInput.files) {
            const text = await readFileAsText(file);
            files[file.name] = {
                text: text,
                tokens: tokenize(text),
            };
        }

        for (const [filename, data] of Object.entries(files)) {
            for (const token of data.tokens) {
                bagOfWords[token] ||= {};
                bagOfWords[token][filename] = (bagOfWords[token][filename] || 0) + 1;
            }
        }
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

    function rawTf(term, filename) {
        return bagOfWords[term][filename];
    }

    let tfVariants = {
        "binary": (term, filename) => rawTf(term, filename) > 0 ? 1 : 0,
        "raw count": (term, filename) => rawTf(term, filename),
        "term frequency": (term, filename) => {
            const nTokensInFile = files[filename].tokens.length;
            return rawTf(term, filename)/nTokensInFile;
        },
        "log normalization": (term, filename) => Math.log(1 + rawTf(term, filename)),
        "double normalization 0.5": (term, filename) => {
            let maxTf = 0.0;
            for (const token of files[filename].tokens) {
                let tokenTf = rawTf(token, filename);
                if (tokenTf > maxTf) maxTf = tokenTf;
            }
            return 0.5 + 0.5 * (rawTf(term, filename)/maxTf);
        },
        //"double normalization K": (term, filename) => 0,
    };

    let tfFunction = tfVariants["term frequency"];

    function filesWithTerm(term) {
        return Object.keys(bagOfWords[term]).length;
    }

    function corpusSize() {
        return Object.keys(files).length;
    }

    let idfVariants = {
        "unary": (_) => 1,
        "idf": (term) => Math.log(corpusSize()/filesWithTerm(term)),
        "idf smooth": (term) => Math.log(corpusSize()/(1 + filesWithTerm(term))) + 1,
        "idf max": (term) => {
            const tokens = files[filename].tokens;
            const maxDF = tokens.reduce((max, obj) => (bagOfWords[obj].length > max ? obj : max), tokens[0]);
            return Math.log(maxDF/(1 + filesWithTerm(term)));
        },
        "probabilistic idf": (term) => Math.log((corpusSize() - filesWithTerm(term))/filesWithTerm(term)),
    };

    let idfFunction = idfVariants["idf"];

    function tfidf(term, filename) {
        return tfFunction(term, filename) * idfFunction(term);
    }

    let tfidfScoresPerFile = {};

    function calculateTfidfResults() {
        for (const [filename, data] of Object.entries(files)) {
            tfidfScoresPerFile[filename] = {};
            for (const token of data.tokens) {
                tfidfScoresPerFile[filename][token] ||= tfidf(token, filename);
            }
        }
    }
</script>

<svelte:head>
    <title>TF-IDF</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>TF-IDF</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        You can select multiple plaintext files:
        <div class="d-flex flex-row gap-1">
            <input type="file" class="form-control" id="img" name="img" accept="text/plain" multiple bind:this={fileInput}>
            <button type="button" class="btn btn-primary" on:click={loadFiles}>Load</button>
        </div>
        {#if Object.keys(files).length > 0}
        Files loaded:
        <ul>
            {#each Object.entries(files) as [name, data]}
            <li>{name} ({data.tokens.length} tokens)</li>
            {/each}
        </ul>
        {/if}
    </div>
</div>

<div class="row">
    <h2>Configuration</h2>
    <div class="col">
        <h5>Term Frequency</h5>
        <div class="d-flex flex-row">
            <div class="d-flex flex-column">
                {#each Object.entries(tfVariants) as [name, func]}
                <label>
                    <input type="radio" name="tfVariant" bind:group={tfFunction} value={func}>
                    {name}
                </label>
                {/each}
            </div>
        </div>
    </div>
    <div class="col">
        <h5>Inverse Document Frequency</h5>
        <div class="d-flex flex-row">
            <div class="d-flex flex-column">
                {#each Object.entries(idfVariants) as [name, func]}
                <label>
                    <input type="radio" name="idfVariant" bind:group={idfFunction} value={func}>
                    {name}
                </label>
                {/each}
            </div>
        </div>
    </div>
</div>

{#if Object.keys(files).length > 0}
<div class="row">
    <div class="col">
        <button type="button" class="btn btn-primary" on:click={calculateTfidfResults}>Calculate TF-IDF</button>
        {#each Object.entries(tfidfScoresPerFile) as [file, tokenScores]}
        <h3>{file}</h3>
        <ul>
            {#each Object.entries(tokenScores) as [token, score]}
                <li>"{token}" = {score}</li>
            {/each}
        </ul>
        {/each}
    </div>
</div>
{/if}

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Tf%E2%80%93idf" target="_blank">tf-idf (Wikipedia)</a></li>
        </ul>
    </div>
</div>

<style>
</style>