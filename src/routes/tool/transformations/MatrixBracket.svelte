<script>
    export let height;
    export let direction;
</script>
<svg width="10" height="{height+2}" transform="scale({direction === "r" ? -1 : 1})">
    <path d="M 6 2 h -4 v {height-2} h 4" stroke="white" stroke-width="2" fill="transparent" stroke-linecap="round"/>
</svg>
