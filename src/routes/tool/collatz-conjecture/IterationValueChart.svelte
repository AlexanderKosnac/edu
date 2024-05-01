<script>
import { onMount } from "svelte";
import Chart from "chart.js/auto";

export let canvas;

export const addDatapoint = (iteration, value) => {
    chart.data.labels.push(iteration);
    chart.data.datasets[0].data.push(value);
    chart.update();
};

export function clearData() {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update();
}

let chart;

const data = {
    labels: [],
    datasets: [{
        label: "Iteration Value",
        data: [],
        backgroundColor: "#0d6efd",
        borderWidth: 2,
        borderColor: "#0d6efd",
    }]
};

onMount(()=> {
    chart = new Chart(canvas.getContext("2d"), {
        type: "line",
        data: data,
        options: {
            maintainAspectRatio: false,
            animation: {
                duration: 0
            }
        }
    });
});
</script>

<canvas bind:this={canvas} height={400}/>

<style>
</style>