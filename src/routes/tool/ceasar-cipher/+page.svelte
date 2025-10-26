<script>
    let cypherShift = 23;

    let plaintext = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG";
    let ciphertext = "";

    function charIsIgnored(c) {
        const n = c.charCodeAt(0);
        const isLetter = (n >= 0x41 && n <= 0x5A) || (n >= 0x61 && n <= 0x7A);
        return !isLetter;
    }

    function letterAsInteger(l) {
        return l.charCodeAt(0) + 0x41;
    }

    function integerAsLetter(i) {
        return String.fromCharCode((i % 26) + 0x41);
    }

    function onPlaintextChanged() {
        ciphertext = "";
        for (const c of plaintext.toUpperCase()) {
            ciphertext += charIsIgnored(c) ? c : integerAsLetter(letterAsInteger(c) + cypherShift);
        }
    }

    function onCiphertextChanged() {
        plaintext = "";
        for (const c of ciphertext.toUpperCase()) {
            plaintext += charIsIgnored(c) ? c : integerAsLetter(letterAsInteger(c) - cypherShift);
        }
    }
</script>

<svelte:head>
    <title>Caesar cipher</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Caesar cipher</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <label>
            Shift:
            <input type="number" class="form-control" bind:value={cypherShift} min="0"/>
        </label>
        <table class="table table-bordered w-auto mt-1">
            <tbody>
                <tr>
                    <th></th>
                    {#each { length: 26 } as _, i}
                        <th>{i + 1}</th>
                    {/each}
                </tr>
                <tr>
                    <th>Plain</th>
                    {#each { length: 26 } as _, i}
                        <td>{integerAsLetter(i)}</td>
                    {/each}
                </tr>
                <tr>
                    <th>Cipher ({cypherShift})</th>
                    {#each { length: 26 } as _, i}
                        <td>{integerAsLetter(i + cypherShift)}</td>
                    {/each}
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="form-group">
            <label for="inputText">Plaintext:</label>
            <textarea class="form-control font-monospace" id="inputText" pattern="[A-Za-z0-9]+" rows="20" bind:value="{plaintext}" oninput={onPlaintextChanged}></textarea>
        </div>
    </div>

    <div class="col">
        <label for="outputText">Ciphertext:</label>
        <textarea class="form-control font-monospace" id="outputText" rows="20" bind:value="{ciphertext}" oninput={onCiphertextChanged}></textarea>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Caesar_cipher" target="_blank">Caesar cipher</a></li>
        </ul>
    </div>
</div>

<style>
</style>
