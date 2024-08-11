<script>
    const COLORS = ["red", "yellow", "green", "cyan", "blue", "magenta"];

    let data = {
        "flex-direction": "column",
    }
</script>

<svelte:head>
    <title>CSS display-flex</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>CSS display-flex</h1>
    </div>
</div>

<div class="row">
    <h2><tt>flex-direction</tt></h2>
    <div class="col">
        <div class="">
            <div class="d-flex gap-1" style="flex-direction: {data["flex-direction"]}">
                {#each COLORS as c}
                <div class="element {c}"></div>
                {/each}
            </div>
        </div>
    </div>
    <div class="col">
        <div class="d-flex flex-column">
            {#each ["row", "row-reverse", "column", "column-reverse"] as val}
            <label>
                <input type="radio" name="scoops" value={val} bind:group={data["flex-direction"]}/>
                <tt>{val}</tt>
            </label>
            {/each}    
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/flex" target="_blank">mdn web docs article on flex</a></li>
            <li><a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank">CSS-Tricks article on Flexbox</a></li>
            <li><a href="https://getbootstrap.com/docs/5.3/utilities/flex/" target="_blank">Bootstrap 5.3 Flex classes</a></li>
        </ul>
    </div>
</div>

<style>
    .element {
        border: 4px solid var(--bs-body-color);
        width: 50px;
        height: 50px;
        --light-stripe: #FFFFFF;
        --dark-stripe: #000000;
        
        background: repeating-linear-gradient(
          60deg,
          var(--light-stripe),
          var(--light-stripe) 10px,
          var(--dark-stripe) 10px,
          var(--dark-stripe) 20px
        );
    }
    .element.red {
        --light-stripe: #FFAAAA;
        --dark-stripe: #FF0000;
    }
    .element.green {
        --light-stripe: #AAFFAA;
        --dark-stripe: #00FF00;
    }
    .element.blue {
        --light-stripe: #AAAAFF;
        --dark-stripe: #0000FF;
    }
    .element.yellow {
        --light-stripe: #FFFFAA;
        --dark-stripe: #FFFF00;
    }
    .element.cyan {
        --light-stripe: #AAFFFF;
        --dark-stripe: #00FFFF;
    }
    .element.magenta {
        --light-stripe: #FFAAFF;
        --dark-stripe: #FF00FF;
    }
</style>