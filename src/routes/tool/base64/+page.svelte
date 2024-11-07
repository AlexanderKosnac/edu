<script>
    const characters = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
        "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
        "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v",
        "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "+", "/"
    ]
    const padchar = "=";

    let inputString = "Ma";

    let chars = [];
    let octets = [];
    let bits = [];
    let sextetsEnc = [];
    let charsEnc = [];
    let octetsEnc = [];
    let padBlocks = 0;

    $: outputString = charsEnc.join("");

    function encodeData() {
        chars = [];
        octets = [];
        bits = [];
        sextetsEnc = [];
        charsEnc = [];
        octetsEnc = [];
        for (let i = 0; i < inputString.length; i++) {
            const c = inputString.charAt(i);
            chars.push(c);
            octets.push(c.charCodeAt(0));
            bits.push(...c.charCodeAt(0).toString(2).padStart(8, "0").split(""));
        }
        if (bits.length%6) bits.push(...Array(6-bits.length%6).fill("0")); // Padding to have a multiple of 6
        for (let i = 0; i < bits.length; i+=6) {
            const encoded = parseInt(bits.slice(i, i+6).join(""), 2);
            const c = characters[encoded];
            sextetsEnc.push(encoded);
            charsEnc.push(c);
            octetsEnc.push(c.charCodeAt(0));
        }
        padBlocks = (chars.length%3) ? 3-chars.length%3 : 0;

        for (let i = 0; i < padBlocks; i++) {
            charsEnc.push(padchar);
            octetsEnc.push(padchar.charCodeAt(0));
        }
    }
</script>

<svelte:head>
    <title>Base64</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Base64</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        Unencoded Input String:
        <div class="d-flex flex-row gap-1">
            <input type="text" class="form-control font-monospace" bind:value="{inputString}" on:input={encodeData}>
            <button type="button" class="btn btn-primary" on:click={encodeData}>Encode</button>
        </div>

        Base64 Encoded Data:
        <div class="form-group">
            <input type="text" class="form-control font-monospace" bind:value="{outputString}" readonly>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        Detailed Output:
        <table class="table table-bordered w-auto">
            <tbody>
                <tr>
                    <th rowspan="2">Source<br>ASCII text</th>
                    <th>Character</th>
                    {#each chars as c}
                        <td colspan="8"><strong>{c}</strong></td>
                    {/each}
                    {#if (8*chars.length)%6}
                        <td rowspan="2" colspan="{6-(8*chars.length)%6}"></td>
                    {/if}
                    {#if padBlocks}
                        <td rowspan="2" colspan="{padBlocks*6}"></td>
                    {/if}
                </tr>
                <tr>
                    <th>Octets</th>
                    {#each octets as o}
                        <td colspan="8">{o} (0x{o.toString(16)})</td>
                    {/each}
                </tr>
                <tr>
                    <th colspan="2">Bits</th>
                    {#each bits as b}
                        <td>{b}</td>
                    {/each}
                    {#each {length: padBlocks*6} as _}
                        <td></td>
                    {/each}
                </tr>
                <tr>
                    <th rowspan="3">Base64<br>encoded</th>
                    <th>Sextets</th>
                    {#each sextetsEnc as se}
                        <td colspan="6">{se}</td>
                    {/each}
                    {#each {length: padBlocks} as _}
                        <td colspan="6"></td>
                    {/each}
                </tr>
                <tr>
                    <th>Character</th>
                    {#each charsEnc as ce}
                        <td colspan="6"><strong>{ce}</strong></td>
                    {/each}
                </tr>
                <tr>
                    <th>Octets</th>
                    {#each octetsEnc as oe}
                        <td colspan="6">{oe} (0x{oe.toString(16)})</td>
                    {/each}
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <h2>Base 64 Alphabet</h2>
        <div class="d-flex gap-2">
            {#each {length: 4} as _, i}
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Binary</th>
                        <th>Char</th>
                    </tr>
                </thead>
                <tbody>
                    {#each {length: 16} as _, j}
                    <tr>
                        <td>{i*16+j}</td>
                        <td>{(i*16+j).toString(2).padStart(6, "0")}</td>
                        <td><kbd>{characters[i*16+j]}</kbd></td>
                    </tr>
                    {/each}
                </tbody>
            </table>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Base64" target="_blank">Base64 (Wikipedia)</a></li>
            <li><a href="https://datatracker.ietf.org/doc/html/rfc4648" target="_blank">RFC 4648</a></li>
        </ul>
    </div>
</div>

<style>
    th, td {
        vertical-align: middle;
        text-align: center;
    }
</style>