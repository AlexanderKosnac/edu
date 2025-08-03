<script>
    let {
        number = $bindable(),
        size = 256,
        strokeWidth = 4,
        borderWidth = 0,
        ...others
    } = $props();
    let pathData = $state();

    const paddingFraction = 0.2;
    const paddedSize = size * (1 - paddingFraction);

    const size2 = size / 2;
    const paddedSize2 = paddedSize / 2;

    const u = 0.3 * paddedSize;

    // Strokes are used as 'M{0},{1} L{2},{3}'
    const strokes = {
        units: {
            1: [[0, 0, u, 0]],
            2: [[0, u, u, u]],
            3: [[0, 0, u, u]],
            4: [[0, u, u, 0]],
            5: [[0, 0, u, 0], [u, 0, 0, u]],
            6: [[u, 0, u, u]],
            7: [[0, 0, u, 0], [u, 0, u, u]],
            8: [[0, u, u, u], [u, u, u, 0]],
            9: [[0, u, u, u], [u, u, u, 0], [u, 0, 0, 0]],
        },
        tens: {},
        hundreds: {},
        thousands: {},
    };

    // Stroked can be mirrored based on one instance.
    for (let i = 1; i <= 9; i++) {
        const s = strokes.units[i];
        strokes.tens[i] = s.map(([x1, y1, x2, y2]) => [-x1, y1, -x2, y2]);
        strokes.hundreds[i] = s.map(([x1, y1, x2, y2]) => [x1, -y1, x2, -y2]);
        strokes.thousands[i] = s.map(([x1, y1, x2, y2]) => [-x1, -y1, -x2, -y2]);
    }

    $effect(() => {
        let digits = {
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

        let d = `M0,${-paddedSize2} l0,${paddedSize}`;
        for (const [place, digit] of Object.entries(digits)) {
            if (digit === 0) continue;

            const yOffset = quadrantOffset[place];
            for (const [x1, y1, x2, y2] of strokes[place][digit]) {
                d += ` M${x1},${y1 + yOffset} L${x2},${y2 + yOffset}`;
            }
        }
        pathData = d.trim();
    });
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="{-size2} {-size2} {size} {size}" stroke="currentColor">
    {#if borderWidth > 0}
        <rect x="{-size2}" y="{-size2}" width={size} height={size} stroke="currentColor" stroke-width="{borderWidth}" fill="none"/>
    {/if}
    <path d={pathData} stroke={(number < 1 || number > 9999) ? "red" : "currentColor"} stroke-width="{strokeWidth}" stroke-linecap="round" fill="none"/>
</svg>

<style>
</style>
