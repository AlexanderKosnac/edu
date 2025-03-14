<script>
    let bitInput = "01010101";
    let nParityBits = 3;
    $: nTotalBits = 2**nParityBits - 1;
    $: nDataBits = 2**nParityBits - nParityBits - 1;

    function isPowerOfTwo(n) {
        return n > 0 && (n & (n - 1)) === 0;
    }

    function chunkArray(arr, size) {
        return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
            arr.slice(i * size, i * size + size)
        );
    }

    function padArrayWithZeroes(arr, n) {
        return arr.concat(new Array(n).fill(0));
    }

    function padBitsToBlockSizeMultiple(dataBits, blockSize) {
        const missingBits = (blockSize - (dataBits.length % blockSize)) % blockSize;
        return padArrayWithZeroes(dataBits, missingBits);
    }

    function getNumberOfParityBitsInBlockSize(blockSize) {
        return Math.ceil(Math.log2(blockSize + Math.ceil(Math.log2(blockSize)) + 1));
    }

    function encode(dataBits, blockSize) {
        dataBits = padBitsToBlockSizeMultiple(dataBits, blockSize);
        let parityBits = getNumberOfParityBitsNeeded(blockSize);
        let encodedBits = padArrayWithZeroes(dataBits, parityBits);

        return encodedBits;
    }

        return encodedBits;
    }

    function isBinaryString(str) {
        return /^[01]+$/.test(str);
    }

    function bitStringAsBits(input) {
        return isBinaryString(input) ? Array.from(input, Number) : [];
    }

    function onInputChanged() {
    }

    let rawBits, encodedBits, encodedBitsChunked;
    $: {
        rawBits = bitStringAsBits(bitInput);
        encodedBits = encode(rawBits, nTotalBits);
        encodedBitsChunked = chunkArray(encodedBits, nTotalBits);
    }
</script>

<svelte:head>
    <title>Hamming Codes</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Hamming Codes</h1>
    </div>
</div>

<div class="row mb-1">
    <div class="col">
        <div class="d-flex flex-column gap-1">
            <div>
                <label for="bitInput">Bit Input:</label>
                <input type="text" id="bitInput" class="form-control font-monospace" pattern="[01]+" bind:value="{bitInput}" on:input={onInputChanged}/>    
            </div>
    
            <div class="d-flex flex-row align-items-center gap-2">
                <label class="text-nowrap" for="parityBits">Parity Bits:</label>
                <input type="number" id="parityBits" class="form-control bits-input" min="2" bind:value="{nParityBits}"/>
        
                <label class="text-nowrap" for="totalBits">Total Bits:</label>
                <input type="number" id="totalBits" class="form-control bits-input" bind:value="{nTotalBits}" readonly/>
        
                <label class="text-nowrap" for="dataBits">Data Bits:</label>
                <input type="number" id="dataBits" class="form-control bits-input" bind:value="{nDataBits}" readonly/>
    
                <span class="text-nowrap">Rate: {nDataBits}/{nTotalBits} = {(nDataBits/nTotalBits).toFixed(3)}</span>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        {#each charsAsBinaryDumpLines(inputAscii) as bits}
            <span class="font-monospace">{bits}</span><br>
        {/each}
    </div>
    <div class="col">
        {#each chunkArray(rawBits, nDataBits) as block}
            {#each block as bit, i}
            <span class="font-monospace">{bit}</span>
            {/each}
            <span> </span>
        {/each}
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="mw-100 overflow-auto">
            <table class="table table-bordered w-auto">
                <tbody>
                    <tr>
                        <th></th>
                        {#each { length: nTotalBits } as _, i}
                            <th>{i+1}</th>
                        {/each}
                    </tr>
                    {#each encodedBitsChunked as _, i}
                        <tr>
                            <th>{i}</th>
                            {#each { length: nTotalBits } as _, j}
                                <td><span class:isParity={isPowerOfTwo(j+1)}>{encodedBitsChunked[i][j] ?? ""}</span></td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Hamming_code" target="_blank">Hamming Codes on Wikipedia</a></li>
        </ul>
    </div>
</div>

<style>
    #bitInput:invalid {
        color: red;
    }
    .isParity {
        color: red;
    }
    .bits-input {
        max-width: 100px;
    }
</style>