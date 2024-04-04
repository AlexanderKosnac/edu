<script>
    import Cell from "./Cell.svelte";

    class Element {
        constructor(value, direction) {
            this.value = value;
            this.direction = direction;
            this.active = false;
        }
    }

    const D = "diagonal"
    const U = "up"
    const L = "left"

    let sequence1 = "ACGTC";
    let sequence2 = "AGTC";

    let gapCost = -1

    $: tableWidth = sequence2.length+1
    $: tableHeight = sequence1.length+1

    $: m = alignmentArray(tableHeight, tableWidth)

    function alignmentArray(height, width) {
        let arr = Array.from(Array(height), _ => Array(width).fill(NaN));
        arr[0][0] = new Element(0, null);
        for (let i=1; i<height; i++) arr[i][0] = new Element(arr[i-1][0].value + gapCost, U);
        for (let j=1; j<width;  j++) arr[0][j] = new Element(arr[0][j-1].value + gapCost, L);
        return arr;
    }

    function w(a, b) {
        return (a === b) ? 1 : -1;
    }

    let sequence1alignment = "";
    let sequence2alignment = "";
    let sequenceAlignment = "";

    function align() {
        sequence1alignment = "";
        sequence2alignment = "";
        sequenceAlignment = "";
        for (let i=1; i<tableHeight; i++) {
            for (let j=1; j<tableWidth; j++) {
                m[i][j] = [
                    new Element(m[i-1][j-1].value + w(sequence1.charAt(i-1), sequence2.charAt(j-1)), D),
                    new Element(m[i-1][j].value + gapCost, U),
                    new Element(m[i][j-1].value + gapCost, L),
                ].reduce((max, obj) => obj.value > max.value ? obj : max);
            }
        }
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
                    sequence1alignment = seq1Char + sequence1alignment;
                    sequence2alignment = seq2Char + sequence2alignment;
                    sequenceAlignment = "+" + sequenceAlignment;
                    i--;
                    j--;
                    break;
                case U:
                    sequence1alignment = seq1Char + sequence1alignment;
                    sequence2alignment = "-" + sequence2alignment;
                    sequenceAlignment = "-" + sequenceAlignment;
                    i--;
                    break;
                case L:
                    sequence1alignment = "-" + sequence1alignment;
                    sequence2alignment = seq2Char + sequence2alignment;
                    sequenceAlignment = "-" + sequenceAlignment;
                    j--;
                    break;
            }
        }
    }
</script>

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
                <input type="text" class="form-control font-monospace" bind:value="{sequence1}" on:input={align}>
                <span class="input-group-text">{sequence1.length}</span>
            </div>
        
            <div class="input-group flex-nowrap">
                <span class="input-group-text font-monospace" id="sequence1">Sequence 2</span>
                <input type="text" class="form-control font-monospace" bind:value="{sequence2}" on:input={align}>
                <span class="input-group-text">{sequence2.length}</span>
            </div>
        </div>
    </div>
</div>

<h2>Alignment:</h2>
<div class="overflow-auto font-monospace">
Sequence 1:&nbsp;{sequence1alignment}<br>
Sequence 2:&nbsp;{sequence2alignment}<br>
Alignment:&nbsp;&nbsp;{sequenceAlignment}<br>
</div>

<div class="row">
    <div class="col">
        <div class="overflow-auto">
            <table>
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
            </table>
        </div>
    </div>
</div>

<style>
</style>