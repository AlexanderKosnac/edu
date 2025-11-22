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

    let results = {};

    async function handleFile(event) {
        results = {};

        const files = event.target.files;
        if (!files.length)
            return;

        for (let file of files) {
            const buffer = await file.arrayBuffer();
            const bytes = new Uint8Array(buffer);

            results[file.name] = {
                adler32: await adler32(bytes),
                md4: await md4(bytes),
                md5: await md5(bytes),
                ripemd160: await ripemd160(bytes),
                sha1: await sha1(bytes),
                sha224: await sha224(bytes),
                sha256: await sha256(bytes),
                sha384: await sha384(bytes),
                sha512: await sha512(bytes),
                sm3: await sm3(bytes),
                whirlpool: await whirlpool(bytes),
            };
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
        <input type="file" class="form-control" id="img" name="img" accept="*/*" multiple onchange={handleFile}>

        {#if Object.keys(results).length > 0}
            {#each Object.entries(results) as [file, crcs]}
                <h2>Results for: {file}</h2>
                {#each Object.entries(crcs) as [name, value]}
                    {name}: {value}<br>
                {/each}
            {/each}
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