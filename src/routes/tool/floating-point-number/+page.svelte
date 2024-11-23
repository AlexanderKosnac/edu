<script>
    import katex from "katex";
    import "katex/dist/katex.min.css";

    let nSignBits = 1;
    let nExponentBits = 8;
    let nMantissaBits = 23;

    let bits = [];
    $: {
        bits = Array(nSignBits + nExponentBits + nMantissaBits).fill(0);
    }

    $: binaryRepresentation = bits.join("");
    $: decimalRepresentation = parseInt(binaryRepresentation, 2);
    $: hexadecimalRepresentation = decimalRepresentation.toString(16).padStart(Math.ceil(bits.length/4), "0");
    // floatRepresentation =

    function flipBit(idx) {
        bits[idx] = bits[idx] ? 0 : 1;
    }

    let parts, signBits, exponentBits, mantissaBits, signValue, exponentValue, mantissaValue;
    $: {
        parts = [0, nSignBits, nSignBits + nExponentBits, nSignBits + nExponentBits + nMantissaBits];
        signBits = bits.slice(parts[0], parts[1]);
        exponentBits = bits.slice(parts[1], parts[2]);
        mantissaBits = bits.slice(parts[2], parts[3]);
        signValue = parseBinary(signBits.join(""));
        exponentValue = parseBinary(exponentBits.join(""));
        mantissaValue = parseBinary(mantissaBits.join(""));
    }

    const base = 2;
    let sign, exponent, mantissa, result, katexHtml;
    $: {
        sign = signValue == 0 ? +1 : -1;
        exponent = exponentValue - ((2**nExponentBits)/2)+1;
        mantissa = parseBinary(`${exponentValue == 0 ? 0 : 1}.${bits.slice(parts[2], parts[3]).join("")}`);
        result = exponent * (base**exponent);
        katexHtml = katex.renderToString(`${exponent} * {${base}}^{${exponent}}`, {
            throwOnError: false
        });
    }

    function parseBinary(string) {
        const [integerPart, fractionalPart] = string.split(".");

        let integerDecimal = parseInt(integerPart, 2);

        let fractionalDecimal = 0;
        if (fractionalPart) {
            for (let i = 0; i < fractionalPart.length; i++) {
                fractionalDecimal += parseInt(fractionalPart[i], 2) * Math.pow(2, -(i + 1));
            }
        }

        return integerDecimal + fractionalDecimal;
    }
</script>

<svelte:head>
    <title>Floating Point Number</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Floating Point Number</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex gap-1">
            <div>
                <span>Exponent (bits)</span>
                <input type="number" class="form-control w-auto" step="1" bind:value={nExponentBits} min="0">
            </div>
            <div>
                <span>Mantissa (bits)</span>
                <input type="number" class="form-control w-auto" step="1" bind:value={nMantissaBits} min="0">    
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
                <div>{signValue}</div>
                <div class="d-flex flex-row gap-1">
                    <button class="bit border" on:click={() => flipBit(parts[0])}>{bits[parts[0]]}</button>
                </div>
            </div>

            <div class="d-flex flex-column gap-1 justify-content-center align-items-center bordered area exponent">
                <strong>Exponent</strong>
                <div>{exponent}</div>
                <div>{exponentValue}</div>
                <div class="d-flex flex-row gap-1">
                    {#each {length: nExponentBits} as _, idx}
                        {@const idxOffset = idx + parts[1]}
                        <button class="bit border" on:click={() => flipBit(idxOffset)}>{bits[idxOffset]}</button>
                    {/each}
                </div>
            </div>

            <div class="d-flex flex-column gap-1 justify-content-center align-items-center bordered area mantissa">
                <strong>Mantissa</strong>
                <div>{mantissa}</div>
                <div>{mantissaValue}</div>
                <div class="d-flex flex-row gap-1">
                    {#each {length: nMantissaBits} as _, idx}
                        {@const idxOffset = idx + parts[2]}
                        <button class="bit border" on:click={() => flipBit(idxOffset)}>{bits[idxOffset]}</button>
                    {/each}
                </div>
            </div>
            <div class="byte-separator"/>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <table class="output-fields">
            <tr>
                <td>Decimal Representation</td>
                <td><input type="text" class="form-control" readonly bind:value={decimalRepresentation}></td>
            </tr>
            <tr>
                <td>Binary Representation</td>
                <td><input type="text" class="form-control" readonly bind:value={binaryRepresentation}></td>
            </tr>
            <tr>
                <td>Hexadecimal Representation</td>
                <td><input type="text" class="form-control" readonly bind:value={hexadecimalRepresentation}></td>
            </tr>
        </table>
        <div>
            {@html katexHtml}
        </div>
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
        width: 40px;
        height: 40px;
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
    .byte-separator {
        width: 2px;
        background-color: var(--bs-body-color);
    }
    .output-fields {
        width: 100%;
        table-layout: auto;
        border-collapse: separate;
    }
    .output-fields > tr td:first-child {
        white-space: nowrap;
        padding-right: 5px;
    }
    .output-fields > tr td:last-child {
        width: 100%;
    }
</style>