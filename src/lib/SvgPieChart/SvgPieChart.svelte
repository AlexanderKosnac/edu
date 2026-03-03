<script>
    let {
        data = $bindable(), // Array: [{ label, value, color }]
        radius = $bindable(100),
        onClick = () => {},
        onMouseover = () => {},
        ...others
    } = $props();

    const center = radius;
    console.log(radius);
    const pad = radius * 0.1;
    const strokeWidth = radius * 0.03;

    const total = $derived(() => data.reduce((sum, item) => sum + item.value, 0));

    const paths = $derived(() => {
        let angleStart = 0;
        return data.map((item) => {
            const angle = (item.value / total()) * 360;
            const angleEnd = angleStart + angle;

            const radStart = (Math.PI / 180) * angleStart;
            const radEnd = (Math.PI / 180) * angleEnd;

            const x1 = center + radius * Math.cos(radStart);
            const y1 = center + radius * Math.sin(radStart);
            const x2 = center + radius * Math.cos(radEnd);
            const y2 = center + radius * Math.sin(radEnd);

            const largeArc = angle > 180 ? 1 : 0;

            const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            angleStart = angleEnd;
            return { ...item, path };
        });
    });
</script>

<svg width={radius * 2} height={radius * 2} viewBox="-{pad} -{pad} {(radius + pad) * 2} {(radius + pad) * 2}">
    {#each paths() as slice}
        <path d={slice.path} fill={slice.color} stroke="currentColor" stroke-width={strokeWidth} onclick={() => onClick(slice)} onkeydown={(e) => (e.key === "Enter" || e.key === " " ? onClick(slice) : "")} onmouseover={() => onMouseover(slice)} onfocus={() => onMouseover(slice)} role="button" tabindex="0" aria-label="Select slice {slice.label}" />
    {/each}
</svg>

<style>
    svg > path {
        cursor: pointer;
    }
    path:hover,
    path:focus {
        filter: saturate(1.5);
    }
</style>
