<script>
    import {
        adler32,
        md4, md5,
        ripemd160,
        sha1, sha224, sha256, sha384, sha512,
        sm3,
        whirlpool,
        crc32, crc64,
        xxhash32, xxhash64, xxhash3, xxhash128,
        keccak, sha3,
        blake2b, blake2s, blake3,
    } from "hash-wasm";

    let crcs = {
        adler32: {
            name: "Adler-32",
            func: adler32,
            use: true,
        },
        md4: {
            name: "MD4",
            func: md4,
            use: true,
        },
        md5: {
            name: "MD5",
            func: md5,
            use: true,
        },
        ripemd160: {
            name: "RIPEMD-160",
            func: ripemd160,
            use: true,
        },
        sha1: {
            name: "SHA-1",
            func: sha1,
            use: true,
        },
        sha224: {
            name: "SHA-224",
            func: sha224,
            use: true,
        },
        sha256: {
            name: "SHA-256",
            func: sha256,
            use: true,
        },
        sha384: {
            name: "SHA-384",
            func: sha384,
            use: true,
        },
        sha512: {
            name: "SHA-512",
            func: sha512,
            use: true,
        },
        sm3: {
            name: "sm3",
            func: sm3,
            use: true,
        },
        whirlpool: {
            name: "Whirlpool",
            func: whirlpool,
            use: true,
        },
        crc32: {
            name: "CRC32",
            func: crc32,
            use: true,
            params: [
                {
                    name: "Polynomial",
                    type: "number",
                    value: 0xedb88320,
                },
            ],
        },
        crc64: {
            name: "CRC64",
            func: crc64,
            use: true,
            params: [
                {
                    name: "Polynomial",
                    type: "text",
                    value: "c96c5795d7870f42",
                },
            ],
        },
        xxhash32: {
            func: xxhash32,
            use: true,
            params: [
                {
                    name: "Seed",
                    type: "number",
                },
            ],
        },
        xxhash64: {
            func: xxhash64,
            use: true,
            params: [
                {
                    name: "Seed Low",
                    type: "number",
                },
                {
                    name: "Seed High",
                    type: "number",
                },
            ],
        },
        xxhash3: {
            func: xxhash3,
            use: true,
            params: [
                {
                    name: "Seed Low",
                    type: "number",
                },
                {
                    name: "Seed High",
                    type: "number",
                },
            ],
        },
        xxhash128: {
            func: xxhash128,
            use: true,
            params: [
                {
                    name: "Seed Low",
                    type: "number",
                },
                {
                    name: "Seed High",
                    type: "number",
                },
            ],
        },
        blake2b: {
            name: "BLAKE2b",
            func: blake2b,
            use: true,
            params: [
                {
                    name: "Bits",
                    type: "number",
                    value: 512,
                },
            ],
        },
        blake2s: {
            name: "BLAKE2s",
            func: blake2s,
            use: true,
            params: [
                {
                    name: "Bits",
                    type: "number",
                    value: 256,
                },
            ],
        },
        blake3: {
            name: "BLAKE3",
            func: blake3,
            use: true,
            params: [
                {
                    name: "Bits",
                    type: "number",
                    value: 256,
                },
            ],
        },
        keccak: {
            name: "Keccak",
            func: keccak,
            use: true,
            params: [
                {
                    name: "Bits",
                    type: "select",
                    options: [224, 256, 384, 512],
                    value: 256,
                },
            ],
        },
        sha3: {
            name: "SHA-3",
            func: sha3,
            use: true,
            params: [
                {
                    name: "Bits",
                    type: "select",
                    options: [224, 256, 384, 512],
                    value: 256,
                },
            ],
        },
    };

    let fileInput;

    let results = {};

    async function calculateCrcs() {
        results = {};

        const files = fileInput.files;
        if (!files?.length)
            return;

        for (let file of files) {
            const buffer = await file.arrayBuffer();
            const bytes = new Uint8Array(buffer);

            results[file.name] = {};
            for (let [key, crc] of Object.entries(crcs)) {
                if (!crc.use)
                    continue;

                let params = [];
                if (crc.params?.length) {
                    for (let p of crc.params) {
                        params.push(p.value ?? p.default);
                    }
                }

                results[file.name][key] = await crc.func(bytes, ...params);
            }
        }
    }

    function deselectAll() {
        Object.values(crcs).forEach(crc => crc.use = false);
        crcs = {...crcs};
    }

    function selectAll() {
        Object.values(crcs).forEach(crc => crc.use = true);
        crcs = {...crcs};
    }

    function selectBasic() {
        Object.values(crcs).forEach(crc => crc.use = crc.params === undefined);
        crcs = {...crcs};
    }

    function downloadFile(filename, text) {
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    function downloadCrcJson() {
        downloadFile("crcs.json", JSON.stringify(results, null, 4));
    }

    function downloadCrcCsv() {
        const sepratator = ",";

        const files = Object.keys(results);

        const columns = ["file", ...Object.keys(results[files[0]])];

        const rows = [columns.join(sepratator)];

        for (const file of files) {
            const row = [file];
            for (let i = 1; i < columns.length; i++) {
                const key = columns[i];
                row.push(results[file][key] || "");
            }
            rows.push(row.join(sepratator));
        }

        let csv = rows.join("\n");
        downloadFile("crcs.csv", csv);
    }
</script>

<svelte:head>
    <title>File CRCs</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>File CRCs</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex flex-column gap-1">
            <input type="file" class="form-control" id="img" name="img" accept="*/*" multiple bind:this={fileInput}>
            <div class="d-flex gap-1">
                <button type="button" class="btn btn-secondary" onclick={deselectAll}>Deselect All</button>
                <button type="button" class="btn btn-secondary" onclick={selectAll}>Select All</button>
                <button type="button" class="btn btn-secondary" onclick={selectBasic}>Select Basic</button>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <div class="d-flex flex-column gap-1 p-1">
            {#each Object.entries(crcs).filter(([_, value]) => !value.params) as [key, crc]}
                <label>
                    <input type="checkbox" class="form-check-input" bind:checked={crc.use}/>
                    {crc.name ?? key}
                </label>
            {/each}
        </div>
    </div>
    <div class="col">
        <div class="d-flex flex-row gap-1 flex-wrap p-1">
            {#each Object.entries(crcs).filter(([_, value]) => value.params) as [key, crc]}
            <div class="p-1" class:border={crc.use}>
                <label>
                    <input type="checkbox" class="form-check-input" bind:checked={crc.use}/>
                    {crc.name ?? key}
                </label>

                {#if crc.use && crc.params && crc.params.length}
                    {#each crc.params as param}
                        <div>
                            <label>
                                {param.name}:
                                {#if param.type === "select"}
                                    <select class="form-select" bind:value={param.value}>
                                        {#each param.options as opt}
                                            <option value={opt}>{opt}</option>
                                        {/each}
                                    </select>
                                {:else}
                                    <input type={param.type} class="form-control" bind:value={param.value}>
                                {/if}
                            </label>
                        </div>
                    {/each}
                {/if}
            </div>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <button type="button" class="btn btn-primary" onclick={calculateCrcs}>Calculate CRCs</button>
        <button type="button" class="btn btn-secondary" onclick={downloadCrcJson}>JSON</button>
        <button type="button" class="btn btn-secondary" onclick={downloadCrcCsv}>CSV</button>
    </div>
</div>

<div class="row">
    <div class="col">
        {#if Object.keys(results).length > 0}
        <ul>
            {#each Object.entries(results) as [file, fileChecksums]}
                <li>{file}</li>
                <ul>
                    {#each Object.entries(fileChecksums) as [key, crc]}
                        <li>{crcs[key].name ?? key}: <samp>{crc}</samp></li>
                    {/each}
                </ul>
            {/each}
        </ul>
        {/if}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Checksum" target="_blank">Checksum</a></li>
            <li><a href="https://www.npmjs.com/package/hash-wasm" target="_blank">hash-wasm npm package</a></li>
        </ul>
    </div>
</div>

<style>
</style>