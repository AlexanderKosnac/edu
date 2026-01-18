<script>
    let bitInput = "01100011";
    let nParityBits = 3;

    $: nTotalBits = (1 << nParityBits) - 1;
    $: nDataBits  = nTotalBits - nParityBits;

    $: rawBits = bitStringAsBits(bitInput);
    $: encodedBits = encode(rawBits, nDataBits, nParityBits);
    $: encodedBitsChunked = chunkArray(encodedBits, nTotalBits);

    function isPowerOfTwo(n) {
        return n > 0 && (n & (n - 1)) === 0;
    }

    function chunkArray(arr, size) {
        return Array.from(
            { length: Math.ceil(arr.length / size) },
            (_, i) => arr.slice(i * size, i * size + size)
        );
    }

    function padArrayWithZeroes(arr, n) {
        return arr.concat(new Array(n).fill(0));
    }

    function padBitsToBlockSizeMultiple(dataBits, blockSize) {
        const missing = (blockSize - (dataBits.length % blockSize)) % blockSize;
        return padArrayWithZeroes(dataBits, missing);
    }

    function isBinaryString(str) {
        return /^[01]*$/.test(str);
    }

    function bitStringAsBits(input) {
        return isBinaryString(input) ? Array.from(input, Number) : [];
    }

    function encode(dataBits, dataBitsPerBlock, parityBits) {
        if ((1 << parityBits) < dataBitsPerBlock + parityBits + 1) {
            throw new Error("Invalid parity/data bit configuration");
        }

        dataBits = padBitsToBlockSizeMultiple(dataBits, dataBitsPerBlock);

        const totalBits = dataBitsPerBlock + parityBits;
        let encoded = [];

        for (let i = 0; i < dataBits.length; i += dataBitsPerBlock) {
            const blockData = dataBits.slice(i, i + dataBitsPerBlock);
            let block = new Array(totalBits).fill(0);

            // Data bits
            let dataIndex = 0;
            for (let j = 0; j < totalBits; j++) {
                if (!isPowerOfTwo(j + 1)) {
                    block[j] = blockData[dataIndex++] ?? 0;
                }
            }

            // Parity bits
            for (let p = 0; p < parityBits; p++) {
                const pos = 1 << p;
                let parity = 0;

                for (let j = pos - 1; j < totalBits; j += 2 * pos) {
                    for (let k = 0; k < pos && j + k < totalBits; k++) {
                        parity ^= block[j + k];
                    }
                }

                block[pos - 1] = parity;
            }

            encoded.push(...block);
        }

        return encoded;
    }
</script>

<div class="row mb-1">
    <div class="col">
        <div class="d-flex flex-column gap-1">
            <div>
                <label for="bitInput">Bit Input:</label>
                <input type="text" id="bitInput" class="form-control font-monospace" pattern="[01]+" bind:value="{bitInput}" />
            </div>

            <div class="d-flex flex-row align-items-center gap-5">
                <div class="d-flex align-items-center gap-1">
                    <label class="text-nowrap" for="parityBits">Parity Bits:</label>
                    <input type="number" id="parityBits" class="form-control bits-input" min="2" bind:value="{nParityBits}" />
                </div>

                <span class="text-nowrap">Total Bits = {nTotalBits}</span>
                <span class="text-nowrap">Data Bits = {nDataBits}</span>
                <span class="text-nowrap">Rate = {nDataBits}/{nTotalBits} = {(nDataBits / nTotalBits).toFixed(3)}</span>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        Encoded Data:
        <span class="font-monospace">
            {#each encodedBitsChunked as block}
                {#each block as bit}{bit}{/each}
                <span> </span>
            {/each}
        </span>
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
                            <th class="text-center" style="min-width: 40px">{i + 1}</th>
                        {/each}
                    </tr>

                    {#each encodedBitsChunked as block, i}
                        <tr>
                            <th class="text-nowrap">Block {i}</th>
                            {#each block as bit, j}
                                <td class="text-center">
                                    <span class:isParity={isPowerOfTwo(j + 1)}>{bit}</span>
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
    #bitInput:invalid {
        color: red;
    }
    .isParity {
        color: red;
        font-weight: bold;
    }
    .bits-input {
        max-width: 100px;
    }
</style>
