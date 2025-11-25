<script>
/* To be implemented:
    blake2b(data: IDataType, bits?: number, key?: IDataType): Promise<string> // default is 512 bits
    blake2s(data: IDataType, bits?: number, key?: IDataType): Promise<string> // default is 256 bits
    blake3(data: IDataType, bits?: number, key?: IDataType): Promise<string> // default is 256 bits

    crc32(data: IDataType, polynomial?: number): Promise<string> // default polynomial is 0xedb88320, for CRC32C use 0x82f63b78
    crc64(data: IDataType, polynomial?: string): Promise<string> // default polynomial is 'c96c5795d7870f42' (ECMA)

    keccak(data: IDataType, bits?: 224 | 256 | 384 | 512): Promise<string> // default is 512 bits
    sha3(data: IDataType, bits?: 224 | 256 | 384 | 512): Promise<string> // default is 512 bits

    xxhash32(data: IDataType, seed?: number): Promise<string>

    xxhash64(data: IDataType, seedLow?: number, seedHigh?: number): Promise<string>
    xxhash3(data: IDataType, seedLow?: number, seedHigh?: number): Promise<string>
    xxhash128(data: IDataType, seedLow?: number, seedHigh?: number): Promise<string>
*/
    import {
        adler32,
        md4, md5,
        ripemd160,
        sha1, sha224, sha256, sha384, sha512,
        sm3,
        whirlpool,
    } from "hash-wasm";

    const crcs = {
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
                if (crc.use) {
                    results[file.name][key] = await crc.func(bytes);
                }
            }
        }
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
        <input type="file" class="form-control" id="img" name="img" accept="*/*" multiple bind:this={fileInput}>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <div class="d-flex flex-column gap-1">
            {#each Object.entries(crcs) as [key, crc]}
                <label>
                    <input type="checkbox" class="form-check-input" bind:checked={crc.use}/>
                    {crc.name}
                </label>
            {/each}
        </div>
    </div>
    <div class="col">
        Insert CRCs with complex inputs here.
    </div>
</div>

<div class="row">
    <div class="col">
        <button type="button" class="btn btn-primary" onclick={calculateCrcs}>Calculate CRCs</button>
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
                        <li>{crcs[key].name}: <samp>{crc}</samp></li>
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