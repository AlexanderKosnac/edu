<script>
    import katex from "katex";
    import "katex/dist/katex.min.css";

    function asHtmlLatex(latex) {
        return katex.renderToString(latex, {
            throwOnError: false
        });
    }

    let inputX, inputY;
    let points = [];

    function addPoint() {
        if (inputX.length == 0 || inputY.length == 0) return;
        points.push([inputX, inputY]);
        points = [...points];
    }

    function removePoint(i) {
        points.splice(i, 1);
        points = [...points];
    }

    let chartCanvas;
</script>

<svelte:head>
    <title>Lagrange Polynomial Interpolation</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Lagrange Polynomial Interpolation</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        The goal of Lagrange interpolation is to find the polynomial {@html asHtmlLatex("p \\in P_n")} for
        {@html asHtmlLatex("n+1")} interpolation points {@html asHtmlLatex("x_0, \\dots, x_n \\in \\R")} and
        associated values {@html asHtmlLatex("y_0, \\dots, y_n \\in \\R")} so that:
        {@html asHtmlLatex("p(x_i) = y_i \\quad{} \\text{for } i=0, \\dots , n")}.
    </div>
</div>

<div class="row">
    <div class="col">
        <canvas bind:this={chartCanvas}/>
    </div>
    <div class="col-auto" style="width: 400px">
        <h4>Interpolation Points</h4>
        <table class="table w-auto">
        <thead>
            <tr>
                <th scope="col">{@html asHtmlLatex("i")}</th>
                <th scope="col">{@html asHtmlLatex("x_i")}</th>
                <th scope="col">{@html asHtmlLatex("y_i")}</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            {#each points as _, i}
            <tr>
                <td>{@html asHtmlLatex(`${i}`)}</td>
                <td><input type="number" class="form-control point-input" placeholder="x" bind:value={points[i][0]}></td>
                <td><input type="number" class="form-control point-input" placeholder="y" bind:value={points[i][1]}></td>
                <td><button type="button" class="btn btn-secondary" on:click={() => removePoint(i)}>Remove</button></td>
            </tr>
            {/each}
            <tr>
                <td>{@html asHtmlLatex("i")}</td>
                <td><input type="number" class="form-control point-input" placeholder="x" bind:value={inputX}></td>
                <td><input type="number" class="form-control point-input" placeholder="y" bind:value={inputY}></td>
                <td><button type="button" class="btn btn-primary" on:click={addPoint}>Add</button></td>
            </tr>
        </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Lagrange_polynomial" target="_blank">Lagrange polynomial</a></li>
        </ul>
    </div>
</div>

<style>
    .point-input {
        width: 100px;
    }
</style>