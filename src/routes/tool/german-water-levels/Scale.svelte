<script lang="ts">
    export let min: number = 0;
    export let max: number = 200;
    export let step: number = 10;
    export let marks: { label: string; value: number }[] = [];
    export let width: number = 80;
    export let height: number = 400;
    export let fontSize: number = 10;
    export let padding: number = 10;
    export let orientation: "vertical" | "horizontal" = "vertical";
    export let secondaryColor: string = "red";
    export let offset: number = 20;

    const stepMarks = [];
    for (let v = min; v <= max; v += step) {
        stepMarks.push(v);
    }

    function valueToPos(value: number) {
        const ratio = (value - min) / (max - min);
        return orientation === "vertical" ? height - ratio * height : ratio * width;
    }
</script>

<svg {width} {height} viewBox="{-padding} {-padding} {width} {height + 2 * padding}">
    {#if orientation === "vertical"}
        <line x1={offset} y1={0} x2={offset} y2={height} stroke="currentColor" stroke-width="2" />
    {:else}
        <line x1={0} y1={offset} x2={width} y2={offset} stroke="currentColor" stroke-width="2" />
    {/if}

    {#each stepMarks as val}
        {#if orientation === "vertical"}
            <line x1={offset - 5} y1={valueToPos(val)} x2={offset + 5} y2={valueToPos(val)} stroke="currentColor" />
            <text x={offset - 8} y={valueToPos(val) + 4} font-size={fontSize} text-anchor="end" fill="currentColor">{val}</text>
        {:else}
            <line x1={valueToPos(val)} y1={offset - 5} x2={valueToPos(val)} y2={offset + 5} stroke="currentColor" />
            <text x={valueToPos(val)} y={offset - 8} font-size={fontSize} text-anchor="middle" fill="currentColor">{val}</text>
        {/if}
    {/each}

    {#each marks as mark}
        {#if orientation === "vertical"}
            <circle cx={offset} cy={valueToPos(mark.value)} r="4" fill={secondaryColor} />
            <text x={offset + 8} y={valueToPos(mark.value) + 4} font-size={fontSize} text-anchor="start" fill="currentColor">{mark.label}</text>
        {:else}
            <circle cy={offset} cx={valueToPos(mark.value)} r="4" fill={secondaryColor} />
            <text x={valueToPos(mark.value)} y={offset + 18} font-size={fontSize} text-anchor="middle" fill="currentColor">{mark.label}</text>
        {/if}
    {/each}
</svg>

<style>
</style>
