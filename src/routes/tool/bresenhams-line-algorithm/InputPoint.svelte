<script>
    import { createEventDispatcher } from 'svelte'

    export let point = { x: 0, y: 0 };
    export let label = "";

    let moving = false;

	function onMouseDown() {
		moving = true;
	}
	
	function onMouseMove(e) {
		if (!moving) return;
        point.x += e.movementX;
        point.y += e.movementY;
        dispatch("change");
	}
	
	function onMouseUp() {
		moving = false;
	}

    const dispatch = createEventDispatcher();
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<circle class="point" class:active={moving} cx="{point.x}" cy="{point.y}" r="15" on:mousedown={onMouseDown} {...$$restProps}
    role="button" tabindex="0" aria-grabbed="false" aria-label="Draggable point"/>
<rect class="label-bg" x="{point.x-40}" y="{point.y+20}" width="80" height="30"/>
<text class="label" x="{point.x}" y="{point.y+40}" text-anchor="middle">{label}</text>

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