<script>
	import { onMount } from "svelte";

    class Element {
        constructor(value, direction) {
            this.value = value;
            this.direction = direction;
            this.active = false;
        }
    }

    let gridSize = 40;
    $: svgWidth = (sequence2.length + 2) * gridSize;
    $: svgHeight = (sequence1.length + 2) * gridSize;

    const D = "diagonal";
    const U = "up";
    const L = "left";

    let sequence1 = "ACGTC";
    let sequence2 = "AGTC";

    let gapCost = -1;

    $: m = getAlignmentArray(sequence1.length + 1, sequence2.length + 1)

    function getAlignmentArray(height, width) {
        let arr = Array.from(Array(height), _ => Array(width).fill(NaN));
        arr[0][0] = new Element(0, null);
        for (let i=1; i<height; i++) arr[i][0] = new Element(arr[i-1][0].value + gapCost, U);
        for (let j=1; j<width;  j++) arr[0][j] = new Element(arr[0][j-1].value + gapCost, L);
        return arr;
    }

    function w(a, b) {
        return (a === b) ? 1 : -1;
    }

    let alignment = {
        seq1: "",
        seq2: "",
        seqR: "",
        add(one, two, res) {
            this.seq1 = one + this.seq1;
            this.seq2 = two + this.seq2;
            this.seqR = res + this.seqR;
        },
        clear() {
            this.seq1 = "";
            this.seq2 = "";
            this.seqR = "";
        },
    }

    function align() {
        // Fill rest of table
        for (let i=1; i<sequence1.length + 1; i++) {
            for (let j=1; j<sequence2.length + 1; j++) {
                m[i][j] = [
                    new Element(m[i-1][j-1].value + w(sequence1.charAt(i-1), sequence2.charAt(j-1)), D),
                    new Element(m[i-1][j].value + gapCost, U),
                    new Element(m[i][j-1].value + gapCost, L),
                ].reduce((max, obj) => obj.value > max.value ? obj : max);
            }
        }

        // Backtrace through table
        alignment.clear();
        let i = sequence1.length + 1;
        let j = sequence2.length + 1;
        while (i > 0 && j > 0) {
            let e = m[i-1][j-1];
            e.active = true;
            const seq1Char = sequence1.charAt(i-2);
            const seq2Char = sequence2.charAt(j-2);

            switch (e.direction) {
                case null:
                    i--;
                    j--;
                    break;
                case D:
                    alignment.add(seq1Char, seq2Char, "+");
                    i--;
                    j--;
                    break;
                case U:
                    alignment.add(seq1Char, "-", "-");
                    i--;
                    break;
                case L:
                    alignment.add("-", seq2Char, "-");
                    j--;
                    break;
            }
        }
        alignment = alignment;
    }

    function getAlignmentPath(startX, startY, matrix, cellSize) {
        const points = [];
        matrix.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell.active) {
                    points.push({ x: x * cellSize, y: y * cellSize });
                }
            });
        });

        return points.length ? `M ${startX} ${startY} ${points.map(p => `${startX + p.x} ${startY + p.y}`).join(" L ")}` : "";
    }

    onMount(() => {
        align();
	});
</script>

<svelte:head>
    <title>Needleman-Wunsch Algorithm</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Needleman-Wunsch Algorithm</h1>
    </div>
</div>

{#snippet cell(i, j, data)}
    {@const x = i * gridSize}
    {@const y = j * gridSize}
    {@const arrowSize = 0.2 * gridSize}
    <g>
        <rect x="{x}" y="{y}" width={gridSize} height={gridSize}
            stroke="currentColor" stroke-width="1" fill="none"/>

        {#if data.arrow}
            <path d="M {x} {y} h {arrowSize} M {x} {y} v {arrowSize} M {x} {y}"
                fill="transparent" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                opacity={data.active ? 1.0 : 0.3}
                transform={
                    data.arrow === D ? "" :
                    data.arrow === U ? `translate(${gridSize / 2}, 0) rotate(45, ${x}, ${y})` :
                    data.arrow === L ? `translate(0, ${gridSize / 2}) rotate(-45, ${x}, ${y})` :
                    ""}/>
        {/if}

        <text x="{x + (gridSize / 2.0)}" y="{y + (gridSize / 2.0)}"
            fill="currentColor" text-anchor="middle" dominant-baseline="middle"
            font-size={data.fontSize ?? 16} font-weight={data.fontWeight ?? "normal"}>
            {data.value}
        </text>
    </g>
{/snippet}

<div class="row">
    <div class="col">
        <div class="d-flex flex-column gap-1">
            <div class="input-group flex-nowrap">
                <span class="input-group-text font-monospace" id="sequence1">Sequence 1</span>
                <input type="text" class="form-control font-monospace" bind:value="{sequence1}" onchange={align}>
                <span class="input-group-text">{sequence1.length}</span>
            </div>

            <div class="input-group flex-nowrap">
                <span class="input-group-text font-monospace" id="sequence1">Sequence 2</span>
                <input type="text" class="form-control font-monospace" bind:value="{sequence2}" onchange={align}>
                <span class="input-group-text">{sequence2.length}</span>
            </div>

            <div>
                <button type="button" class="btn btn-primary" onclick={align}>Align</button>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>Alignment:</h2>
        <div class="overflow-auto font-monospace">
            Sequence 1:&nbsp;{alignment.seq1}<br>
            Sequence 2:&nbsp;{alignment.seq2}<br>
            Alignment&nbsp;:&nbsp;{alignment.seqR}<br>
        </div>
    </div>
</div>

<div class="row">
    <div class="col overflow-auto">
        <svg width="{svgWidth}" height="{svgHeight}" viewBox="0 0 {svgWidth} {svgHeight}" xmlns="http://www.w3.org/2000/svg">
            <path d="{getAlignmentPath(gridSize * 1.5, gridSize * 1.5, m, gridSize)}" fill="transparent" stroke="blue" stroke-width="10" stroke-linecap="round"/>

            {@render cell(0, 0, "")}
            {@render cell(1, 0, "")}
            {@render cell(0, 1, "")}

            {#each sequence1 as s, i}
                {@render cell(0, i + 2, { value: s, fontSize: 18, fontWeight: "bold" })}
            {/each}

            {#each sequence2 as s, i}
                {@render cell(i + 2, 0, { value: s, fontSize: 18, fontWeight: "bold" })}
            {/each}

            {#each m as row, i}
                {#each row as c, j}
                    {@render cell(j + 1, i + 1, {
                        value: c.value,
                        arrow: c.direction,
                        active: c.active,
                    })}
                {/each}
            {/each}
        </svg>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Needleman%E2%80%93Wunsch_algorithm" target="_blank">Needleman-Wunsch algorithm</a></li>
        </ul>
    </div>
</div>

<style>
</style>