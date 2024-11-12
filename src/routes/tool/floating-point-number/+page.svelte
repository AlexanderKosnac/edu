<script>
    import katex from "katex";
    import "katex/dist/katex.min.css";

    let signBits = 1;
    let exponentBits = 8;
    let mantissaBits = 23;

    let bits = [];
    $: {
        bits = Array(signBits + exponentBits + mantissaBits).fill(0);
    }

    function flipBit(idx) {
        bits[idx] = bits[idx] ? 0 : 1;
    }

    let parts, signValue, exponentValue, mantissaValue;
    $: {
        parts = [0, signBits, signBits + exponentBits, signBits + exponentBits + mantissaBits];
        signValue = parseInt(bits.slice(parts[0], parts[1]).join(""), 2);
        exponentValue = parseInt(bits.slice(parts[1], parts[2]).join(""), 2);
        mantissaValue = parseInt(bits.slice(parts[2], parts[3]).join(""), 2);
    }

    const base = 2;
    let sign, exponent, mantissa, result, katexHtml;
    $: {
        sign = signValue == 0 ? +1 : -1;
        exponent = exponentValue;
        mantissa = mantissaValue;
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
                <input type="number" class="form-control w-auto" step="1" bind:value={exponentBits} min="0">
            </div>
            <div>
                <span>Mantissa (bits)</span>
                <input type="number" class="form-control w-auto" step="1" bind:value={mantissaBits} min="0">    
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
                    {#each {length: exponentBits} as _, idx}
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
                    {#each {length: mantissaBits} as _, idx}
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
    <div class="col justify-content-center align-items-center">
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
</style>