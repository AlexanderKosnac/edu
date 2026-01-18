<script>
    const total = "Total";

    let fileInput;

    let tokens = [];
    let matrix = {};

    async function loadFiles() {
        matrix = {
            [total]: {},
        };
        if (fileInput.files.length < 1)
            return;
        for (const file of fileInput.files) {
            const text = await readFileAsText(file);
            matrix[file.name] = {};
            for (const token of tokenize(text)) {
                if (token in matrix[total]) {
                    matrix[total][token] += 1;
                } else {
                    matrix[total][token] = 1;
                }

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

    function downloadAsFile(content, filename = "data.txt") {
        const blob = new Blob([content], { type: "text/plain" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;

        link.click();

        URL.revokeObjectURL(link.href);
    }

    function getMatrixAsCsv(separator = ";") {
        let csv = ["Token", ...Object.keys(matrix)].join(separator) + "\n";

        for (const token of tokens) {
            csv += [token, ...Object.values(matrix).map(data => data[token] ?? 0)]
                .join(separator) + "\n";
        }
        return csv;
    }

    function downloadAsCsv() {
        downloadAsFile(getMatrixAsCsv(), "term-incidence-matrix.csv")
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

<div class="row">
    <div class="col">
        <div class="d-flex flex-column gap-1">
            <span>You can select multiple plaintext files:</span>
            <div class="d-flex flex-row gap-1">
                <input type="file" class="form-control" id="img" name="img" accept="text/plain" multiple bind:this={fileInput}>
                <button type="button" class="btn btn-primary" onclick={loadFiles}>Load</button>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
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
        <div class="d-flex flex-row gap-1">
            <button type="button" class="btn btn-secondary" onclick={downloadAsCsv}>Download as CSV</button>
        </div>        
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

<style>
</style>