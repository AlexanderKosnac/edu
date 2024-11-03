<script>
    import katex from "katex";
    import "katex/dist/katex.min.css";

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

    function latexRender(texMath) {
        return katex.renderToString(texMath, {
            throwOnError: false
        });
    }

    function rawTf(term, filename) {
        return bagOfWords[term][filename];
    }

    let tfVariants = {
        "binary": {
            eval: (term, filename) => rawTf(term, filename) > 0 ? 1 : 0,
            latex: "0, 1",
        },
        "raw count": {
            eval: (term, filename) => rawTf(term, filename),
            latex: "f_{t,d}",
        },
        "term frequency": {
            eval: (term, filename) => {
                const nTokensInFile = files[filename].tokens.length;
                return rawTf(term, filename)/nTokensInFile;
            },
            latex: "f_{t,d} / \\sum_{t' \\in d} f_{t',d}",
        },
        "log normalization": {
            eval: (term, filename) => Math.log(1 + rawTf(term, filename)),
            latex: "\\log(1 + f_{t,d})",
        },
        "log normalization (2)": {
            eval: (term, filename) => 1 + Math.log(rawTf(term, filename)),
            latex: "1 + \\log{f_{t,d}}",
        },
        "double normalization 0.5": {
            eval: (term, filename) => {
                let maxTf = 0.0;
                for (const token of files[filename].tokens) {
                    let tokenTf = rawTf(token, filename);
                    if (tokenTf > maxTf) maxTf = tokenTf;
                }
                return 0.5 + 0.5 * (rawTf(term, filename)/maxTf);
            },
            latex: "0.5 + 0.5 * \\frac{f_{t,d}}{\\max_{\{t' \\in d\}} f_{t', d}}",
        },
        /*
        "double normalization K": {
            f: (term, filename) => 0,
            latex: "0",
        }
        */
    };

    let tfVariant = tfVariants["term frequency"];

    function filesWithTerm(term) {
        return Object.keys(bagOfWords[term]).length;
    }

    function corpusSize() {
        return Object.keys(files).length;
    }

    let idfVariants = {
        "unary": {
            eval: (_) => 1,
            latex: "1",
        },
        "idf": {
            eval: (term) => Math.log(corpusSize()/filesWithTerm(term)),
            latex: "\\log{\\frac{N}{n_t}}",
        },
        "idf smooth": {
            eval: (term) => Math.log(corpusSize()/(1 + filesWithTerm(term))) + 1,
            latex: "\\log({\\frac{N}{1+ n_t}}) + 1",
        },
        "idf max": {
            eval: (term) => {
                const tokens = files[filename].tokens;
                const maxDF = tokens.reduce((max, obj) => (bagOfWords[obj].length > max ? obj : max), tokens[0]);
                return Math.log(maxDF/(1 + filesWithTerm(term)));
            },
            latex: "\\log({\\frac{\\max_{\{t' \\in d\}} n_{t'}}{1+ n_t}})",
        },
        "probabilistic idf": {
            eval: (term) => Math.log((corpusSize() - filesWithTerm(term))/filesWithTerm(term)),
            latex: "\\log{\\frac{N - n_t}{n_t}}",
        }
    };

    let idfVariant = idfVariants["idf"];

    let tfIdfPresets = {
        "count-idf": ["raw count", "idf"],
        "double normalization-idf": ["double normalization 0.5", "idf"],
        "log normalization-idf": ["log normalization (2)", "idf"],
    }

    function loadTfIdfPreset(presetKey) {
        tfVariant = tfVariants[tfIdfPresets[presetKey][0]];
        idfVariant = idfVariants[tfIdfPresets[presetKey][1]];
    }

    function tfidf(term, filename) {
        return tfVariant.eval(term, filename) * idfVariant.eval(term);
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
                <table class="table">
                    <thead>
                    </thead>
                    <tbody>
                        {#each Object.entries(tfVariants) as [name, data]}
                        <tr>
                            <td>
                                <label>
                                    <input type="radio" name="tfVariant" bind:group={tfVariant} value={data}>
                                    {name}
                                </label>
                            </td>
                            <td>{@html latexRender(data.latex)}</td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="col">
        <h5>Inverse Document Frequency</h5>
        <div class="d-flex flex-row">
            <div class="d-flex flex-column">
                <table class="table">
                    <thead>
                    </thead>
                    <tbody>
                        {#each Object.entries(idfVariants) as [name, data]}
                        <tr>
                            <td>
                                <label>
                                    <input type="radio" name="idfVariant" bind:group={idfVariant} value={data}>
                                    {name}
                                </label>
                            </td>
                            <td>{@html latexRender(data.latex)}</td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="col">
        <h5>Common TF-IDF Presets</h5>
        <div class="d-flex flex-row">
            <div class="d-flex flex-column">
                <table class="table">
                    <thead>
                    </thead>
                    <tbody>
                        {#each Object.entries(tfIdfPresets) as [name, data]}
                        <tr>
                            <td><button type="button" class="btn btn-secondary" on:click={() => loadTfIdfPreset(name)}>Load</button></td>
                            <td>{name}</td>
                            <td>{@html latexRender(`(${tfVariants[data[0]].latex}) * ${idfVariants[data[1]].latex}`)}</td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
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