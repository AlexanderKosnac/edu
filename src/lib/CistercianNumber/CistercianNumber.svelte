<script>
    let {
        number = $bindable(),
        size,
        ...others
    } = $props();
    let pathData = $state();

    const size2 = size / 2;
    const u = 0.25 * size;

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
            units: -size2,
            tens: -size2,
            hundreds: size2,
            thousands: size2,
        };

        let d = `M0,${-size2} l0,${size}`;
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
    {#if number < 1 || number > 9999}
        <!-- error -->
    {:else}
        <path d={pathData} stroke="currentColor" stroke-width="1" fill="none" />
    {/if}
</svg>

<style>
</style>
