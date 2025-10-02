<script>
    import { toHex } from "$lib/hexUtility";

    import { OPCODES, assemble } from "./assembler.js";
    import { Cpu } from "./cpu.js";

    let cpu = new Cpu();

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
        let a = assemble(src);
        srcAssembled = JSON.stringify(a, null, 2);
        cpu.loadProgram(a.bytes);
        cpu = cpu;
    }

    function doStep() {
        cpu.step();
        cpu = cpu;
    }

    function doReset() {
        cpu.reset();
        cpu = cpu;
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
    <div class="col-auto">
        <div class="d-flex flex-column gap-1">
            <button type="button" class="btn btn-primary" onclick={doStep}>Step</button>
            <button type="button" class="btn btn-primary" onclick={doReset}>Reset</button>
            <button type="button" class="btn btn-primary" onclick={doAssemble}>Assemble and load</button>
        </div>
    </div>
    <div class="col">
        {cpu.memory}
        <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            {#each cpu.regs as reg, i}
                <g>
                    <rect x="0" y="{25*i}" width="20" height="20" stroke="currentColor" fill="transparent"/>
                    <text x="0" y="{10+25*i}" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">R{i}</text>

                    <rect x="25" y="{25*i}" width="80" height="20" stroke="currentColor" fill="transparent"/>
                    <text x="25" y="{10+25*i}" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">{reg}</text>
                </g>
            {/each}
            <g>
                <rect x="150" y="0" width="20" height="20" stroke="currentColor" fill="transparent"/>
                <text x="150" y="10" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">PC</text>

                <rect x="175" y="0" width="80" height="20" stroke="currentColor" fill="transparent"/>
                <text x="175" y="10" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">0x{cpu.pc.toString(16)}</text>
            </g>

            <g>
                <rect x="150" y="25" width="20" height="20" stroke="currentColor" fill="transparent"/>
                <text x="150" y="35" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">SP</text>

                <rect x="175" y="25" width="80" height="20" stroke="currentColor" fill="transparent"/>
                <text x="175" y="35" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">0x{cpu.sp.toString(16)}</text>
            </g>

            <g>
                <rect x="150" y="50" width="40" height="20" stroke="currentColor" fill="transparent"/>
                <text x="150" y="60" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">Flags</text>

                {#each Object.entries(cpu.flags) as [f, v], i}
                    <rect x="{195+25*i}" y="50" width="20" height="20" stroke="currentColor" fill="{v === 0 ? "transparent" : "red"}"/>
                    <text x="{195+25*i}" y="60" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">{f}</text>
                {/each}
            </g>

            <g>
                <rect x="150" y="75" width="50" height="20" stroke="currentColor" fill="{cpu.halted === 0 ? "transparent" : "red"}"/>
                <text x="150" y="85" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">Halted</text>
            </g>

            <g>
                <rect x="150" y="100" width="200" height="200" stroke="currentColor" fill="transparent"/>
                <text x="150" y="110" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">{cpu.output}</text>
            </g>

            <g>
                <rect x="0" y="320" width="200" height="200" stroke="currentColor" fill="transparent"/>
                <text x="0" y="320" font-size="12" fill="currentColor">{cpu.memory}</text>
            </g>
        </svg>
    </div>
</div>

<div class="row">
    <div class="col">
        <textarea class="form-control font-monospace" rows="20" bind:value={src}></textarea>
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
    svg {
        border: 1px solid var(--bs-body-color);
    }
</style>