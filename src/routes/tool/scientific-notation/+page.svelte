<script>
    import katex from "katex";
    import "katex/dist/katex.min.css";

    function getKatexHtml(katexString) {
        return katex.renderToString(katexString, {
            throwOnError: false
        });
    }

    let number = 4;
    let base = 2;

    let exponent, mantissa, approximatedNumber, absoluteError, relativeError;
    let exponentKatex, mantissaKatex, approximatedNumberKatex, absoluteErrorKatex, relativeErrorKatex;
    $: {
        if (!isNaN(parseFloat(number)) && !isNaN(parseFloat(base))) {
            exponent = Math.floor(Math.log(number) / Math.log(base));
            exponentKatex = getKatexHtml(`E = log_{${base}}(${number}) = ${exponent}`);

            mantissa = Math.floor(number / base**exponent);
            mantissaKatex =  getKatexHtml(`M = \\frac{${number}}{${base}^${exponent}} = ${mantissa}`);

            approximatedNumber = mantissa * base**exponent;
            approximatedNumberKatex = getKatexHtml(`${mantissa} * {${base}}^{${exponent}} = ${approximatedNumber}`);

            absoluteError = number - approximatedNumber;
            absoluteErrorKatex = getKatexHtml(`${absoluteError}`);

            relativeError = 100 * ((number - approximatedNumber) / number);
            relativeErrorKatex = getKatexHtml(`${relativeError}\\%`);
        }
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
        <div class="d-flex flex-row align-items-center gap-2">
            <label for="bitInput">Number:</label>
            <input type="number" class="form-control font-monospace number-input" min="1" pattern="\d+" bind:value="{number}"/>

            <label for="bitInput">Base:</label>
            <input type="number" class="form-control font-monospace number-input" style="width: 80px" min="2" pattern="\d+" bind:value="{base}"/>
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
                    <th scope="row">Approximation</th>
                    <td>{@html approximatedNumberKatex}</td>
                </tr>
                <tr>
                    <th scope="row">Exponent</th>
                    <td>{@html exponentKatex}</td>
                </tr>
                <tr>
                    <th scope="row">Mantissa</th>
                    <td>{@html mantissaKatex}</td>
                </tr>
                <tr>
                    <th scope="row">Absolute Error</th>
                    <td>{@html absoluteErrorKatex}</td>
                </tr>
                <tr>
                    <th scope="row">Relative Error</th>
                    <td>{@html relativeErrorKatex}</td>
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