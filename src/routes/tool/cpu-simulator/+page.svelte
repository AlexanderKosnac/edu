<script>
    import { toHex } from "$lib/hexUtility";

    import { OPCODES, assemble } from "./assembler.js";
    import { Cpu } from "./cpu.js";

    const asmFiles = import.meta.glob("./*.asm", { query: "?raw", import: "default", eager: true });

    let cpu = new Cpu(1024);

    let src = asmFiles["./small-gauss.asm"];

    let assembly;
    let srcAssembled = "";

    function doAssemble() {
        try {
            assembly = assemble(src);
            srcAssembled = JSON.stringify(assembly, null, 2);
            cpu.loadProgram(assembly.bytes);
            cpu = cpu;
        } catch (error) {
            alert(`Failed to assemble source: ${error}`);
        }
    }

    function doStep() {
        cpu.step();
        cpu = cpu;
    }

    function doReset() {
        cpu.reset();
        cpu = cpu;
    }

    function loadFile(file) {
        src = asmFiles[file];
    }

    function getMemoryIndexColor(i) {
        if (i === cpu.pc )
            return "red";
        else if (i >= cpu.sp)
            return "yellow";
        return "currentColor";
    }
</script>

<div class="row">
    <div class="col-auto">
        <div class="d-flex flex-column gap-1">
            <button type="button" class="btn btn-primary" onclick={doStep} disabled={cpu.halted}>Step</button>
            <button type="button" class="btn btn-primary" onclick={doReset}>Reset</button>
            <button type="button" class="btn btn-primary" onclick={doAssemble}>Assemble and load</button>
        </div>
    </div>
    <div class="col-auto">
        <svg width="100%" height="516" viewBox="0 0 1600 516" xmlns="http://www.w3.org/2000/svg">
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
                <text x="175" y="10" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">0x{toHex(cpu.pc)}</text>
            </g>

            <g>
                <rect x="150" y="25" width="20" height="20" stroke="currentColor" fill="transparent"/>
                <text x="150" y="35" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">SP</text>

                <rect x="175" y="25" width="80" height="20" stroke="currentColor" fill="transparent"/>
                <text x="175" y="35" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">0x{toHex(cpu.sp)}</text>
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
                <rect x="150" y="75" width="50" height="20" stroke="currentColor" fill="{cpu.halted ? "red" : "transparent"}"/>
                <text x="150" y="85" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">Halted</text>
            </g>

            <g>
                <rect x="150" y="100" width="200" height="200" stroke="currentColor" fill="transparent"/>
                <text x="150" y="110" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="middle">{cpu.output}</text>
            </g>

            <foreignObject x="500" y="0" width="100%" height="100%">
                <div class="overflow-auto" style="max-height: 500px">
                    <svg width="400" height="2048" viewBox="0 0 400 2048" xmlns="http://www.w3.org/2000/svg">
                        {#each assembly?.program as e, i}
                            <text x="0" y="{12*i}" font-size="12" fill={cpu.pc === e.addr ? "red" : "currentColor"}
                                text-anchor="start" dominant-baseline="hanging">
                                {toHex(e.addr, 8)}: {e.source}
                            </text>
                        {/each}
                    </svg>
                </div>
            </foreignObject>

            <foreignObject x="1000" y="0" width="100%" height="100%">
                <div class="overflow-auto" style="max-height: 500px">
                    <svg width="400" height="2048" viewBox="0 0 400 2048" xmlns="http://www.w3.org/2000/svg">
                        {#each cpu.memory as m, i}
                            {@const col = i % 16}
                            {@const row = Math.floor(i / 16)}
                            {#if col == 0}
                                <text x="0" y="{12*row}" font-size="12" fill="currentColor" text-anchor="start" dominant-baseline="hanging">
                                    {toHex(row * 16, 4)}
                                </text>
                            {/if}
                            <text x="{50+20*col}" y="{12*row}" font-size="12" fill={getMemoryIndexColor(i)} text-anchor="start" dominant-baseline="hanging">
                                {toHex(m)}
                            </text>
                        {/each}        
                    </svg>
                </div>
            </foreignObject>
        </svg>
    </div>
</div>
<div class="row pt-1">
    <div class="col-auto">
        <strong>Examples:</strong>
        <ul>
            {#each Object.entries(asmFiles) as [file, _]}
                <li>
                    <button type="button" class="btn btn-link" onclick={() => loadFile(file)}>
                        <samp>{file}</samp>
                    </button>
                </li>
            {/each}
        </ul> 
    </div>
    <div class="col">
        <textarea class="form-control font-monospace" rows="20" bind:value={src}></textarea>
    </div>
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
        font-family: monospace;
        white-space: pre;
    }
</style>
