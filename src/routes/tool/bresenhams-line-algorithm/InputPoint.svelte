<script>
    let {
        x = $bindable(),
        y = $bindable(),
        label = $bindable(),
        drag,
        ...others
    } = $props();
    let moving = $state(false);

    function onMouseDown() {
        moving = true;
    }

    function onMouseMove(e) {
        if (!moving) return;

        x = x + e.movementX;
        y = y + e.movementY;

        drag();
    }

    function onMouseUp() {
        moving = false;
    }
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<circle class="point" class:active={moving} cx={x} cy={y} r="15"
    onmousedown={onMouseDown}
    role="button" tabindex="0"
    aria-grabbed="false" aria-label="Draggable point" {...others}/>

<rect class="label-bg" x={x - 40} y={y + 20} width="80" height="30" />
<text class="label" x={x} y={y + 40} text-anchor="middle">{label}</text>

<style>
    .label {
        fill: white;
        stroke: white;
        font-size: 1.4em;
    }
    .label-bg {
        fill: black;
    }
    .point {
        cursor: move;
        stroke: var(--bs-body-color);
        stroke-width: 6px;
    }
    .point.active {
        stroke-width: 8px;
    }
</style>
