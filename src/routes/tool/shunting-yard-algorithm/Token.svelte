<script>
    export let data;
    export let size = 100;

    const breakpoint = 60;
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100">
    <rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" stroke-width="5" rx="10"/>
    <text x="50" y="{size >= breakpoint ? 40 : 50}" fill="currentColor" text-anchor="middle" dominant-baseline="middle" font-size="3.5em">{data.symbol}</text>
    {#if size >= breakpoint}
        <text x="50" y="80" fill="currentColor" text-anchor="middle" dominant-baseline="middle">{data.type.name}</text>
    {/if}
</svg>

<style>
</style>
