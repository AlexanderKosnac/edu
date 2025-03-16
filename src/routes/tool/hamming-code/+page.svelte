<script>
    let bitInput = "11111111";
    $: rawBits = bitStringAsBits(bitInput);

    let nParityBits = 3;
    $: nTotalBits = 2**nParityBits - 1;
    $: nDataBits = 2**nParityBits - nParityBits - 1;

    $: encodedBits = encode(rawBits, nDataBits);
    $: encodedBitsChunked = chunkArray(encodedBits, nTotalBits);

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

    function encode(data, blockSize) {
        data = padBitsToBlockSizeMultiple(data, blockSize);
        let parityBits = getNumberOfParityBitsInBlockSize(blockSize);

        let totalBlockSize = blockSize + parityBits;
        let encodedBits = [];
        
        for (let i = 0; i < data.length; i += blockSize) {
            let blockData = data.slice(i, i + blockSize);
            let encodedBlock = new Array(totalBlockSize).fill(0);

            // Insert placeholders for parity bits.
            let dataIndex = 0;
            for (let j = 0; j < totalBlockSize; j++) {
                if (isPowerOfTwo(j + 1)) {
                    continue;
                }
                encodedBlock[j] = blockData[dataIndex++];
            }

            // Fill parity bits.
            for (let p = 0; p < parityBits; p++) {
                let pos = 2 ** p;
                let parity = 0;
                for (let j = pos - 1; j < totalBlockSize; j += 2 * pos) {
                    for (let k = 0; k < pos && j + k < totalBlockSize; k++) {
                        parity ^= encodedBlock[j + k];
                    }
                }
                encodedBlock[pos - 1] = parity;
            }

            encodedBits.push(...encodedBlock);
        }

        return encodedBits;
    }

    function isBinaryString(str) {
        return /^[01]*$/.test(str);
    }

    function bitStringAsBits(input) {
        return isBinaryString(input) ? Array.from(input, Number) : [];
    }

    function onInputChanged() {
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
        {#each chunkArray(rawBits, nTotalBits) as block}
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