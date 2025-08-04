<script>
    import { katexAsHtml, katexAsHtmlInline } from "$lib/katexUtility.js";

    let number = 4;
    let base = 2;
    let useIntegerExponent = true;
    let useIntegerMantissa = false;

    let exponent, mantissa, approximatedNumber, absoluteError, relativeError;
    $: {
        exponent = Math.log(number) / Math.log(base);
        if (useIntegerExponent)
            exponent = Math.floor(exponent)

        mantissa = number / base**exponent;
        if (useIntegerMantissa)
            mantissa = Math.floor(mantissa)

        approximatedNumber = mantissa * base**exponent;
        absoluteError = number - approximatedNumber;
        relativeError = 100 * ((number - approximatedNumber) / number);
    }
</script>

<svelte:head>
    <title>Scientific Notation</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Scientific Notation</h1>
    </div>
</div>

<div class="row mt-1">
    <div class="col">
        <div class="d-flex flex-column align-items-start">
            <div class="d-flex flex-row align-items-center gap-1">
                <label for="numberInput">Number:</label>
                <input type="number" id="numberInput" class="form-control font-monospace number-input" min="0" step="0.1" bind:value="{number}"/>
    
                <label for="baseInput">Base:</label>
                <input type="number" id="baseInput" class="form-control font-monospace number-input" style="width: 80px" min="2" bind:value="{base}"/>
            </div>
            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" value="" bind:checked={useIntegerExponent}/>
                Use only integer exponent.
            </label>
            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" value="" bind:checked={useIntegerMantissa}/>
                Use only integer mantissa.
            </label>
        </div>
    </div>
</div>

<div class="row mt-1">
    <div class="col">
        <table class="table table-bordered result-table">
            <thead>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">Exponent</th>
                    <td>{@html katexAsHtmlInline(`E = log_{${base}}(${number}) = ${exponent}`)}</td>
                </tr>
                <tr>
                    <th scope="row">Mantissa</th>
                    <td>{@html katexAsHtmlInline(`M = \\frac{${number}}{${base}^{${exponent}}} = ${mantissa}`)}</td>
                </tr>
                <tr>
                    <th scope="row">Approximation</th>
                    <td>{@html katexAsHtmlInline(`${mantissa} * {${base}}^{${exponent}} = ${approximatedNumber}`)}</td>
                </tr>
                <tr>
                    <th scope="row">Absolute Error</th>
                    <td>{@html katexAsHtmlInline(`${absoluteError}`)}</td>
                </tr>
                <tr>
                    <th scope="row">Relative Error</th>
                    <td>{@html katexAsHtmlInline(`${relativeError}\\%`)}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<style>
    .result-table > tbody > tr > th {
        width: 100px;
    }
    .number-input:invalid {
        color: red;
    }
</style>