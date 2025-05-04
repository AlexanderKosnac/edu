<script>
    let roman = "VII";
    let decimal = "7";

    const romanMap = new Map([
        ["M", 1000], ["CM", 900],
        ["D", 500], ["CD", 400],
        ["C", 100], ["XC", 90],
        ["L", 50], ["XL", 40],
        ["X", 10], ["IX", 9],
        ["V", 5], ["IV", 4],
        ["I", 1]
    ]);

    function toRoman(num) {
        if (num <= 0 || num > 3999) return "";
        let result = "";
        for (const [letter, value] of romanMap) {
            while (num >= value) {
                result += letter;
                num -= value;
            }
        }
        return result;
    }

    function fromRoman(str) {
        str = str.toUpperCase();
        let i = 0, result = 0;
        while (i < str.length) {
            if (i + 1 < str.length && romanMap.has(str[i] + str[i + 1])) { // Special two-character cases
                result += romanMap.get(str[i] + str[i + 1]);
                i += 2;
            } else if (romanMap.has(str[i])) { // Single-character cases
                result += romanMap.get(str[i]);
                i += 1;
            } else {
                return "Invalid Roman numeral.";
            }
        }
        return result;
    }

    function handleDecimalInput() {
        const num = parseInt(decimal);
        roman = isNaN(num) ? '' : toRoman(num);
    }

    function handleRomanInput() {
        decimal = fromRoman(roman);
    }
</script>

<svelte:head>
    <title>Roman Numerals</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Roman Numerals</h1>
    </div>
</div>

<div class="row justify-content-center">
    <div class="col-auto">
        <table class="table table-bordered w-auto mt-1">
            <tbody>
                <tr>
                    <th>Character:</th>
                    <td>I</td>
                    <td>V</td>
                    <td>X</td>
                    <td>L</td>
                    <td>C</td>
                    <td>D</td>
                    <td>M</td>
                </tr>
                <tr>
                    <th>Value:</th>
                    <td>1</td>
                    <td>5</td>
                    <td>10</td>
                    <td>50</td>
                    <td>100</td>
                    <td>500</td>
                    <td>1000</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col">
        <label class="w-100">
            Decimal:
            <input type="number" class="form-control w-100" bind:value={decimal} on:input={handleDecimalInput} min="1" max="3999" />
        </label>
    </div>
    <div class="col">
        <label class="w-100">
            Roman:
            <input type="text" class="form-control w-100" bind:value={roman} on:input={handleRomanInput} />
        </label>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Roman_numerals" target="_blank">Roman numerals</a></li>
        </ul>
    </div>
</div>

<style>
</style>