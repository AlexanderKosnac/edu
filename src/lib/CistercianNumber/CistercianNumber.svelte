<script>
    let {
        number = $bindable(),
        size = 256,
        strokeWidth = 4,
        borderWidth = 0,
        ...others
    } = $props();

    const paddingFraction = 0.2;
    const paddedSize = $derived(size * (1 - paddingFraction));
    const size2 = $derived(size / 2);
    const paddedSize2 = $derived(paddedSize / 2);
    const u = $derived(0.3 * paddedSize);

    const baseUnits = {
        1: [[0, 0, 1, 0]],
        2: [[0, 1, 1, 1]],
        3: [[0, 0, 1, 1]],
        4: [[0, 1, 1, 0]],
        5: [[0, 0, 1, 0], [1, 0, 0, 1]],
        6: [[1, 0, 1, 1]],
        7: [[0, 0, 1, 0], [1, 0, 1, 1]],
        8: [[0, 1, 1, 1], [1, 1, 1, 0]],
        9: [[0, 1, 1, 1], [1, 1, 1, 0], [1, 0, 0, 0]],
    };

    const strokes = $derived(() => {
        const s = { units: {}, tens: {}, hundreds: {}, thousands: {} };

        for (let i = 1; i <= 9; i++) {
            const uStrokes = baseUnits[i];
            s.units[i] = uStrokes;
            s.tens[i] = uStrokes.map(([x1, y1, x2, y2]) => [-x1, y1, -x2, y2]);
            s.hundreds[i] = uStrokes.map(([x1, y1, x2, y2]) => [ x1, -y1, x2, -y2]);
            s.thousands[i] = uStrokes.map(([x1, y1, x2, y2]) => [-x1, -y1, -x2, -y2]);
        }

        return s;
    });

    const pathData = $derived(() => {
        let d = `M0,${-paddedSize2} l0,${paddedSize}`;
        if (number < 1 || number > 9999)
            return d;

        const digits = {
            units: number % 10,
            tens: Math.floor(number / 10) % 10,
            hundreds: Math.floor(number / 100) % 10,
            thousands: Math.floor(number / 1000) % 10,
        };

        const quadrantOffset = {
            units: -paddedSize2,
            tens: -paddedSize2,
            hundreds: paddedSize2,
            thousands: paddedSize2,
        };

        for (const [place, digit] of Object.entries(digits)) {
            if (digit === 0) continue;

            const yOffset = quadrantOffset[place];
            for (const [x1, y1, x2, y2] of strokes()[place][digit]) {
                d += ` M${x1 * u},${y1 * u + yOffset} L${x2 * u},${y2 * u + yOffset}`;
            }
        }

        return d.trim();
    });
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="{-size2} {-size2} {size} {size}" stroke="currentColor" {...others}>
    {#if borderWidth > 0}
        <rect x="{-size2}" y="{-size2}" width={size} height={size} stroke="currentColor" stroke-width={borderWidth} fill="none"/>
    {/if}
    <path d={pathData()} stroke={number < 1 || number > 9999 ? "red" : "currentColor"} stroke-width={strokeWidth} stroke-linecap="round" fill="none"/>
</svg>

<style>
</style>
