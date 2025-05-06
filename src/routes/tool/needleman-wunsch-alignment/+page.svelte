<script>
	import { onMount } from "svelte";
    import Cell from "./Cell.svelte";

    class Element {
        constructor(value, direction) {
            this.value = value;
            this.direction = direction;
            this.active = false;
        }
    }

    const D = "diagonal";
    const U = "up";
    const L = "left";

    let sequence1 = "ACGTC";
    let sequence2 = "AGTC";

    let gapCost = -1;

    $: tableWidth = sequence2.length+1
    $: tableHeight = sequence1.length+1

    $: m = getAlignmentArray(tableHeight, tableWidth)

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
        for (let i=1; i<tableHeight; i++) {
            for (let j=1; j<tableWidth; j++) {
                m[i][j] = [
                    new Element(m[i-1][j-1].value + w(sequence1.charAt(i-1), sequence2.charAt(j-1)), D),
                    new Element(m[i-1][j].value + gapCost, U),
                    new Element(m[i][j-1].value + gapCost, L),
                ].reduce((max, obj) => obj.value > max.value ? obj : max);
            }
        }

        // Backtrace through table
        alignment.clear();
        let i = tableHeight;
        let j = tableWidth;
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

<div class="row">
    <div class="col">
        <div class="d-flex flex-column gap-1">
            <div class="input-group flex-nowrap">
                <span class="input-group-text font-monospace" id="sequence1">Sequence 1</span>
                <input type="text" class="form-control font-monospace" bind:value="{sequence1}" on:change={align}>
                <span class="input-group-text">{sequence1.length}</span>
            </div>

            <div class="input-group flex-nowrap">
                <span class="input-group-text font-monospace" id="sequence1">Sequence 2</span>
                <input type="text" class="form-control font-monospace" bind:value="{sequence2}" on:change={align}>
                <span class="input-group-text">{sequence2.length}</span>
            </div>

            <div>
                <button type="button" class="btn btn-primary" on:click={align}>Align!</button>
            </div>
        </div>
    </div>
</div>

<h2>Alignment:</h2>
<div class="overflow-auto font-monospace">
Sequence 1:&nbsp;{alignment.seq1}<br>
Sequence 2:&nbsp;{alignment.seq2}<br>
Alignment&nbsp;:&nbsp;{alignment.seqR}<br>
</div>

<div class="row">
    <div class="col">
        <div class="overflow-auto">
            <table>
                <tbody>
                    <tr>
                        <Cell type="header"/>
                        {#each " "+sequence2 as s}
                            <Cell type="header" value={s}/>
                        {/each}
                    </tr>
                    {#each m as row, i}
                        <tr>
                            <Cell type="header" value={(" "+sequence1).charAt(i)}/>
                            {#each row as e}
                                <Cell value={isNaN(e.value) ? "?" : e.value} direction={e.direction} active={e.active}/>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
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