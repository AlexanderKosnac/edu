<script>
    import { integerAsLetter, encodePlaintext, decodeCiphertext } from "$lib/cipherUtility.js";

    let cipherShift = 23;

    let plaintext = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG";
    let ciphertext = "QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD";

    function onPlaintextChanged() {
        ciphertext = encodePlaintext(plaintext, cipherShift);
    }

    function onCiphertextChanged() {
        plaintext = decodeCiphertext(ciphertext, cipherShift);
    }
</script>

<div class="row">
    <div class="col">
        <label>
            Shift:
            <input type="number" class="form-control" bind:value={cipherShift} min="0" oninput={onPlaintextChanged}/>
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
                    <th>Cipher ({cipherShift})</th>
                    {#each { length: 26 } as _, i}
                        <td>{integerAsLetter(i + cipherShift)}</td>
                    {/each}
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col">
        <label for="inputText">Plaintext:</label>
        <textarea class="form-control font-monospace" id="inputText" pattern="[A-Za-z0-9]+" rows="20" bind:value="{plaintext}" oninput={onPlaintextChanged}></textarea>
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
