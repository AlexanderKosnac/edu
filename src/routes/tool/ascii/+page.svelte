<script>
    let explicitMapping = {
         0: "NUL",  1: "SOH",  2: "STX",  3: "ETX",  4: "EOT",  5: "ENQ",  6: "ACK",  7: "BEL",
         8: "BS",   9: "HT",  10: "LF",  11: "VT",  12: "FF",  13: "CR",  14: "SO",  15: "SI",
        16: "DLE", 17: "DC1", 18: "DC2", 19: "DC3", 20: "DC4", 21: "NAK", 22: "SYN", 23: "ETB",
        24: "CAN", 25: "EM",  26: "SUB", 27: "ESC", 28: "FS",  29: "GS",  30: "RS",  31: "US",
        127: "DEL",
    };

    let hexInput = "48656c6c6f";
    let asciiInput = "";

    function onHexChanged() {
        const sanitized = hexInput.replace(/[^0-9a-fA-F]/g, '');
        if (sanitized.length % 2 !== 0)
            return;
        hexInput = sanitized;

        const bytes = hexStringToByteArray(sanitized);
        const asciiChars = Array.from(bytes).map(b => (explicitMapping[b] || b > 0x7F) ? "�" : String.fromCharCode(b));
        asciiInput = asciiChars.join("");
    }

    function onAsciiChanged() {
        const sanitized = asciiInput.replace(/[^\x00-\x7F]/g, '');
        const hexArray = [];
        for (let i = 0; i < sanitized.length; i++) {
            hexArray.push(sanitized.charCodeAt(i).toString(16).padStart(2, "0"));
        }
        hexInput = hexArray.join("");
    }

    function hexStringToByteArray(hexString) {
        if (hexString.length % 2 !== 0) {
            throw new Error("Invalid hex string: length must be even.");
        }

        const byteArray = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i += 2) {
            byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }

        return byteArray;
    }
</script>

<svelte:head>
    <title>ASCII</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>ASCII</h1>
    </div>
</div>

<div class="row">
    <h2>Conversion</h2>
    <div class="col">
        <div class="form-group">
            <label for="hexInput">Hex String:</label>
            <input type="text" id="hexInput" class="form-control" bind:value={hexInput} on:input={onHexChanged}/>
        </div>
        <div class="form-group">
            <label for="asciiIndex">ASCII String:</label>
            <input type="text" id="asciiIndex" class="form-control" bind:value={asciiInput} on:input={onAsciiChanged}/>
        </div>
    </div>
</div>

<div class="row">
    <h2>Table</h2>
    <div class="col">
        <table class="table table-bordered w-auto mt-1">
            <thead>
                <tr>
                    <th></th>
                    {#each { length: 16 } as _, i}
                        <th>{i.toString(16).toUpperCase()}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each { length: 8 } as _, i}
                <tr>
                    <th>{i.toString(16).toUpperCase()}</th>
                    {#each { length: 16 } as _, j}
                    	{@const idx = i * 16 + j}
                        {#if explicitMapping[idx]}
                            <td><kbd>{explicitMapping[idx]}</kbd></td>
                        {:else}
                            <td>{String.fromCharCode(idx)}</td>
                        {/if}
                    {/each}
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/ASCII" target="_blank">ASCII</a></li>
        </ul>
    </div>
</div>

<style>
</style>