<script>
    import { charIsIgnored, letterAsInteger, encodeLetter, decodeLetter } from "$lib/cipherUtility.js";

    let key = "vigenere";

    let plaintext = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG";
    let ciphertext = "OPK UHMTO WZUAA JFB ECSTF SMIM BNI YEQC YWM";

    function encodePlaintext(plaintext, key) {
        let ciphertext = "";
        let i = 0;
        key = key.toUpperCase();
        for (const c of plaintext.toUpperCase()) {
            const shift = letterAsInteger(key.charAt(i));
            ciphertext += encodeLetter(c, shift);
            if (!charIsIgnored(c))
                i = (i + 1) % key.length;
        }
        return ciphertext;
    }

    function decodeCiphertext(ciphertext, key) {
        let plaintext = "";
        let i = 0;
        key = key.toUpperCase();
        for (const c of ciphertext.toUpperCase()) {
            const shift = letterAsInteger(key.charAt(i));
            plaintext += decodeLetter(c, shift);
            if (!charIsIgnored(c))
                i = (i + 1) % key.length;
        }
        return plaintext;
    }

    function onPlaintextChanged() {
        if (key.length < 1)
            return;
        ciphertext = encodePlaintext(plaintext, key);
    }

    function onCiphertextChanged() {
        if (key.length < 1)
            return;
        plaintext = decodeCiphertext(ciphertext, key);
    }
</script>

<div class="row">
    <div class="col">
        <label>
            Key:
            <input type="text" class="form-control" bind:value={key} oninput={onPlaintextChanged}/>
        </label>
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

<style>
</style>