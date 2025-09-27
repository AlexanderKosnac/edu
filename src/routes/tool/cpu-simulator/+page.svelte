<script>
    import { toHex } from "$lib/hexUtility";

    import { OPCODES, assemble } from "./assembler.js";

    let src = `\
; Sum the numbers from N down to 1 and OUT the result
        MOV R0, #10    ; N
        MOV R1, #0     ; sum
loop:   CMP R0, R1
        JZ done
        ADD R1, R0
        DEC R0
        JMP loop
done:   OUT R1
        HALT`;
    let srcAssembled = "";

    function doAssemble() {
        srcAssembled = JSON.stringify(assemble(src), null, 2);
    }
</script>

<svelte:head>
    <title>CPU simulator</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>CPU simulator</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <textarea class="form-control font-monospace" rows="20" value={src}></textarea>
        <button type="button" class="btn btn-primary" onclick={doAssemble}>Assemble</button>
    </div>
    <div class="col">
        <textarea class="form-control font-monospace" rows="20" bind:value="{srcAssembled}" readonly></textarea>
    </div>
</div>

<div class="row">
    <div class="col">
        <table class="table table-bordered w-auto mt-1">
            <thead>
                <tr>
                    <th>Mnemonic</th>
                    <th>Size</th>
                    <th>Opcode</th>
                    <th>Encoding</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {#each Object.entries(OPCODES) as [_, d]}
                <tr>
                    <td>
                        <samp>{d.mnemonic}</samp>
                    </td>
                    <td>
                        <samp>{d.size}</samp>
                    </td>
                    <td>
                        <samp>0x{toHex(d.opcode)}</samp>
                    </td>
                    <td>
                        <samp>{d.encoding}</samp>
                    </td>
                    <td>
                        <samp>{d.description}</samp>
                    </td>
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
            <li><a href="https://www.mathematik.uni-marburg.de/~thormae/lectures/ti1/code/cpusim/index.html" target="_blank">Simulator by Marburg University</a></li>
            <li><a href="https://www.uni-marburg.de/de/fb12/arbeitsgruppen/grafikmultimedia/lehre/ti" target="_blank">TI lecture by Marburg University</a></li>
            <li><a href="https://www.mathematik.uni-marburg.de/~thormae/lectures/ti1/ti_9_1_ger_web.html" target="_blank">Slides related to the CPU simulator</a></li>
        </ul>
    </div>
</div>

<style>
</style>