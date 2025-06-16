<script>
    import { katexAsHtmlInline } from "$lib/katexUtility.js";

    const base = 2;

    let nSignBits = 1;
    let nExponentBits = 8;
    let nMantissaBits = 23;

    let bits = [];

    function flipBit(idx) {
        bits[idx] = bits[idx] ? 0 : 1;
    }

    function evaluateExponentBits(bits) {
        const raw = parseInt(bits.join(""), 2);

        const bias = Math.pow(2, bits.length - 1) - 1;

        const isAllZeros = raw === 0;
        const isAllOnes = raw === Math.pow(2, bits.length) - 1;

        if (isAllZeros) {
            return 1 - bias;
        } else if (isAllOnes) {
            return null;
        } else {
            return raw - bias;
        }
    }

    function evaluateMantissaBits(bits, isNormalized) {
        let value = isNormalized ? 1 : 0;

        for (let i = 0; i < bits.length; i++) {
            const bit = bits[i];
            value += bit * Math.pow(2, -(i + 1));
        }

        return value;
    }

    $: bits = Array(nSignBits + nExponentBits + nMantissaBits).fill(0);
    $: indices = [0, nSignBits, nSignBits + nExponentBits, nSignBits + nExponentBits + nMantissaBits];

    $: signBits = bits.slice(indices[0], indices[1]);
    $: exponentBits = bits.slice(indices[1], indices[2]);
    $: mantissaBits = bits.slice(indices[2], indices[3]);

    $: sign = signBits[0];
    $: exponent = evaluateExponentBits(exponentBits);
    $: mantissa = evaluateMantissaBits(mantissaBits, parseInt(exponentBits.join(""), 2) !== 0);

    $: result = (-1)**sign * mantissa * (base**exponent);

    $: katex = `(-1)^${signBits[0]} * ${mantissa} * {${base}}^{${exponent}} = ${result}`;
</script>

<svelte:head>
    <title>Floating Point Number</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Floating Point Number</h1>
    </div>
</div>

<div class="row mb-1">
    <div class="col">
        <div class="d-flex gap-1">
            <div>
                <span>Exponent (bits)</span>
                <input type="number" class="form-control w-auto" step="1" bind:value={nExponentBits} min="1">
            </div>
            <div>
                <span>Mantissa (bits)</span>
                <input type="number" class="form-control w-auto" step="1" bind:value={nMantissaBits} min="1">
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex gap-1 overflow-auto">
            <div class="d-flex flex-column gap-1 justify-content-center align-items-center bordered area sign">
                <strong>Sign</strong>
                <div>{sign}</div>
                <div class="d-flex flex-row gap-1">
                    {#each {length: nSignBits} as _, idx}
                        {@const idxOffset = idx + indices[0]}
                        <button class="bit border" on:click={() => flipBit(idxOffset)}>{bits[idxOffset]}</button>
                    {/each}
                </div>
            </div>

            <div class="d-flex flex-column gap-1 justify-content-center align-items-center bordered area exponent">
                <strong>Exponent</strong>
                <div>{exponent}</div>
                <div class="d-flex flex-row gap-1">
                    {#each {length: nExponentBits} as _, idx}
                        {@const idxOffset = idx + indices[1]}
                        <button class="bit border" on:click={() => flipBit(idxOffset)}>{bits[idxOffset]}</button>
                    {/each}
                </div>
            </div>

            <div class="d-flex flex-column gap-1 justify-content-center align-items-center bordered area mantissa">
                <strong>Mantissa</strong>
                <div>{mantissa}</div>
                <div class="d-flex flex-row gap-1">
                    {#each {length: nMantissaBits} as _, idx}
                        {@const idxOffset = idx + indices[2]}
                        <button class="bit border" on:click={() => flipBit(idxOffset)}>{bits[idxOffset]}</button>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <table class="output-fields">
            <tbody>
                <tr>
                    <td>Binary Representation:</td>
                    <td>
                        <span class="font-monospace">{bits.join("")}</span>
                    </td>
                </tr>
                <tr>
                    <td>Decimal Representation:</td>
                    <td>
                        <span class="font-monospace">{parseInt(bits.join(""), 2)}</span>
                    </td>
                </tr>
                <tr>
                    <td>Hexadecimal Representation:</td>
                    <td>
                        <span class="font-monospace">{parseInt(bits.join(""), 2).toString(16).padStart(Math.ceil(bits.length/4), "0")}</span>
                    </td>
                </tr>
                <tr>
                    <td>Value:</td>
                    <td>{@html katexAsHtmlInline(katex)}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Floating-point_arithmetic" target="_blank">Floating-point arithmetic</a></li>
            <li><a href="https://en.wikipedia.org/wiki/IEEE_754" target="_blank">IEEE 754 Wikipedia</a></li>
            <li><a href="https://www.h-schmidt.net/FloatConverter/IEEE754.html" target="_blank">IEEE 754 Float Converter</a></li>
        </ul>
    </div>
</div>

<style>
    .bit {
        width: 35px;
        height: 35px;
    }
    .area {
        padding: 5px;
    }
    .area.sign {
        background-color: red;
    }
    .area.exponent {
        background-color: green;
    }
    .area.mantissa {
        background-color: blue;
    }
    .output-fields {
        width: 100%;
        table-layout: auto;
        border-collapse: separate;
    }
</style>