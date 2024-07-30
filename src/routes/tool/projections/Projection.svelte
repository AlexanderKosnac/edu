<script>
	import { onMount } from "svelte";
    import { matMult } from "$lib/math";
    import { field, formatterFixed } from "$lib/Matrix/matrix";
    import Matrix from "$lib/Matrix/Matrix.svelte";
    import Range from "./Range.svelte";

    const DEFAULT_RESULT = [[field(0)], [field(0)], [field(0)], [field(0)]];

    let r = 1;
    let l = -1;
    let t = 1;
    let b = -1;
    let n = 1;
    let f = -1;

    export let displayMatrix;
    export let discreteMatrix;

    $: inputMatrixDiscrete = discreteMatrix(r, l, t, b, n, f);

    let x = 0;
    let y = 0;
    let z = 0;

    $: point = [
        [field(x)],
        [field(y)],
        [field(z)],
        [field(1)],
    ];

    let matrixInput;
    let pointInput;
    let result = DEFAULT_RESULT;

    function validMatrix(arr) {
        return arr.flat(Infinity).every(i => isFinite(i));
    }

    function onInput() {
        const m = matrixInput.getEvalMatrix();
        const p = pointInput.getEvalMatrix();

        if (!validMatrix(m)) return DEFAULT_RESULT;
        result = matMult(m, p).map(row => row.map(e => field(e)));
    }

    onMount(async () => {
        onInput()
	});
</script>

<div class="d-flex align-items-center">
    <div>
        <Range identifier="r" min="-10" max="10" bind:value={r} on:input={onInput}/>
        <Range identifier="l" min="-10" max="10" bind:value={l} on:input={onInput}/>
        <Range identifier="t" min="-10" max="10" bind:value={t} on:input={onInput}/>
        <Range identifier="b" min="-10" max="10" bind:value={b} on:input={onInput}/>
        <Range identifier="n" min="-10" max="10" bind:value={n} on:input={onInput}/>
        <Range identifier="f" min="-10" max="10" bind:value={f} on:input={onInput}/>
    </div>
    <div>
        <Matrix inputs={displayMatrix}/>
    </div>
</div>

<div class="d-flex align-items-center">
    <div>
        <Range identifier="x" min="-2" max="2" step="0.1" bind:value={x} on:input={onInput}/>
        <Range identifier="y" min="-2" max="2" step="0.1" bind:value={y} on:input={onInput}/>
        <Range identifier="z" min="-2" max="2" step="0.1" bind:value={z} on:input={onInput}/>
    </div>
</div>

<div class="d-flex align-items-center gap-2">
    <Matrix bind:this={matrixInput} inputs={inputMatrixDiscrete} formatter={val => formatterFixed(val, 3)}/>
    <span class="symbol">*</span>
    <Matrix bind:this={pointInput} inputs={point} formatter={val => formatterFixed(val, 1)}/>
    <span class="symbol">=</span>
    <Matrix inputs={result} formatter={val => formatterFixed(val, 3)}/>
</div>

<style>
    .symbol {
        font-weight: 600;
        font-size: 1.5em;
    }
</style>