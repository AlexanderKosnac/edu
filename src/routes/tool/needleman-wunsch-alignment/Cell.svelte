<script>
    export let type = "default";
    export let value = "";
    export let direction = "none";
    export let active = false;
</script>

<td class="field {type}" {active}>
    <div class="arrow" {active} {direction}></div>
    {value}
</td>

<style>
:root {
  --arrow-scale: 0.2;
}

.field {
    position: relative;

    width: 55px;
    min-width: 55px;
    height: 55px;

    text-align: center;
    vertical-align: middle;

    border: 1px solid lightgrey;
    box-sizing: border-box;
}

.field.header {
    font-weight: bold;
    font-size: 24px;
}

.field[active="true"] {
    border-width: 3px;
    font-weight: bold;
}

.arrow {
    position: absolute;
    padding: 60px;

    background-color: red;
    -webkit-mask-image: url(arrow.svg);
    mask-image: url(arrow.svg);
}

.arrow:not([direction]), .arrow[direction="none"] {
    display: none;
}

.arrow[direction="left"] {
    top: 50%;
    left: 0%;
    transform: translate(-50%,-50%) scale(var(--arrow-scale), var(--arrow-scale)) rotate(0deg);
}

.arrow[direction="diagonal"] {
    top: 0%;
    left: 0%;
    transform: translate(-50%,-50%) scale(var(--arrow-scale), var(--arrow-scale)) rotate(45deg);
}

.arrow[direction="up"] {
    top: 0%;
    left: 50%;
    transform: translate(-50%,-50%) scale(var(--arrow-scale), var(--arrow-scale)) rotate(90deg);
}

.arrow[active="false"] {
    background-color: grey;
}
</style>