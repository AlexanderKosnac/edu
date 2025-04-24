<script>
    import { katexAsHtml } from "$lib/katexUtility.js";

    let massKg = 80;
    let heightCm = 180;
    $: heightM = heightCm/100;
    $: bmiBasic = massKg/(heightM**2);
    $: bmiCalculationKatex = katexAsHtml(`\\text{BMI} = \\frac{mass_{kg}}{height_{m}^2} = \\frac{${massKg}}{${heightM}^2} = ${bmiBasic.toFixed(2)} \\frac{kg}{m^2}`)
</script>

<svelte:head>
    <title>Body Mass Index (BMI)</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Body Mass Index (BMI)</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        {@html bmiCalculationKatex}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Body_mass_index" target="_blank">Body mass index</a></li>
        </ul>
    </div>
</div>

<style>
</style>