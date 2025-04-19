<script>
import { onMount } from "svelte";
import Chart from "chart.js/auto";

export let canvas;

export const addDatapoint = (label, data) => {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);
};

export function clearData() {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
}

export function update() {
    chart.update();
}

let chart;

const data = {
    labels: [],
    datasets: [{
        label: "Stoppingtime by Start Value",
        data: [],
        pointRadius: 2,
        backgroundColor: "#0d6efd",
    }]
};

onMount(()=> {
    chart = new Chart(canvas.getContext("2d"), {
        type: "scatter",
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

<canvas bind:this={canvas} height={400}></canvas>

<style>
</style>