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

    const formats = [
        {
            name: "ASCII",
            getBits: (input) => {
                const result = { chars: [], octets: [], bits: [] };
                for (let i = 0; i < input.length; i++) {
                    const c = input.charAt(i);
                    result.chars.push(c);
                    result.octets.push(c.charCodeAt(0));
                    result.bits.push(...c.charCodeAt(0).toString(2).padStart(8, "0").split(""));
                }
                return result;
            },
        },
        {
            name: "Binary",
            getBits: (input) => {
                const result = { chars: [], octets: [], bits: [] };
                const clean = input.replace(/[^01]/g, "");

                for (let i = 0; i < clean.length; i += 8) {
                    let byte = clean.slice(i, i + 8);
                    if (byte.length < 8)
                        byte = byte.padEnd(8, "0");

                    const value = parseInt(byte, 2);

                    result.bits.push(...byte.split(""));
                    result.octets.push(value);
                    result.chars.push(String.fromCharCode(value));
                }

                return result;
            },
        },
    ];

    let selectedFormat = formats[0];
    let inputString = "Man";

    let chars = [];
    let octets = [];
    let bits = [];
    let sextetsEnc = [];
    let charsEnc = [];
    let octetsEnc = [];
    let padBlocks = 0;

    $: outputString = charsEnc.join("");

    function encodeData() {
        sextetsEnc = [];
        charsEnc = [];
        octetsEnc = [];

        const r = selectedFormat.getBits(inputString);
        chars = r.chars;
        octets = r.octets;
        bits = r.bits;

        if (bits.length % 6) // Padding to have a multiple of 6
            bits.push(...Array(6 - bits.length % 6).fill("0"));

        for (let i = 0; i < bits.length; i+=6) {
            const encoded = parseInt(bits.slice(i, i+6).join(""), 2);
            const c = characters[encoded];
            sextetsEnc.push(encoded);
            charsEnc.push(c);
            octetsEnc.push(c.charCodeAt(0));
        }
        padBlocks = (chars.length % 3) ? 3 - chars.length % 3 : 0;

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
        <div class="d-flex flex-row gap-2">
            Unencoded Input:
            {#each formats as format}
                <label class="text-nowrap">
                    <input type="radio" class="form-check-input" value={format} bind:group={selectedFormat}/>
                    {format.name}
                </label>
            {/each}
        </div>
        <div class="d-flex flex-row gap-1">
            <input type="text" class="form-control font-monospace" bind:value="{inputString}" oninput={encodeData}>
            <button type="button" class="btn btn-primary" onclick={encodeData}>Encode</button>
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
        <div class="mw-100 overflow-auto">
            <table class="table table-bordered w-auto">
                <tbody>
                    <tr>
                        <th rowspan="2" class="position-sticky">Source<br>ASCII text</th>
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