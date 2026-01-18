<script>
    const COLORS = ["red", "yellow", "green", "cyan", "blue", "magenta"];

    let data = {
        "flex-direction": "column",
        "flex-wrap": "wrap",
        "flex-grow": { "red": 1, "yellow": 2, "green": 0 },
        "flex-shrink": 0,
        "justify-content": "center",
        "align-self": "auto",
        "align-items": "stretch",
    }
</script>

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
                <input type="radio" name="flex-direction" value={val} bind:group={data["flex-direction"]}/>
                <tt>{val}</tt>
            </label>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <h2><tt>flex-wrap</tt></h2>
    <div class="col">
        <div class="">
            <div class="d-flex gap-1 resizable" style="flex-wrap: {data["flex-wrap"]}">
                {#each COLORS as c}
                <div class="element {c}"></div>
                {/each}
            </div>
        </div>
    </div>
    <div class="col">
        <div class="d-flex flex-column">
            {#each ["wrap", "wrap-reverse", "nowrap"] as val}
            <label>
                <input type="radio" name="flex-wrap" value={val} bind:group={data["flex-wrap"]}/>
                <tt>{val}</tt>
            </label>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <h2><tt>flex-grow</tt></h2>
    <div class="col">
        <div class="d-flex gap-1">
            <div class="element {COLORS[0]}" style="flex-grow: {data["flex-grow"][COLORS[0]]}"></div>
            <div class="element {COLORS[1]}" style="flex-grow: {data["flex-grow"][COLORS[1]]}"></div>
            <div class="element {COLORS[2]}" style="flex-grow: {data["flex-grow"][COLORS[2]]}"></div>
        </div>
    </div>
    <div class="col">
        <div class="d-flex flex-column">
            {#each ["red", "yellow", "green"] as i}
            <div class="d-flex gap-4">
                <strong>{i[0].toUpperCase()}{i.substring(1)}:</strong>
                {#each [0, 1, 2, 3] as val}
                <label>
                    <input type="radio" name="flex-grow-{i}" value={val} bind:group={data["flex-grow"][i]}/>
                    <tt>{val}</tt>
                </label>
                {/each}
            </div>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <h2><tt>flex-shrink</tt></h2>
    <div class="col">
        <div class="d-flex gap-1">
            <div class="element {COLORS[0]}" style="width: 50%"></div>
            <div class="element {COLORS[1]}" style="width: 50%; flex-shrink: {data["flex-shrink"]}"></div>
            <div class="element {COLORS[2]}" style="width: 50%"></div>
        </div>
    </div>
    <div class="col">
        <div class="d-flex flex-row gap-4">
            <strong>Yellow:</strong>
            {#each [0, 1, 2, 3] as val}
            <label>
                <input type="radio" name="flex-shrink" value={val} bind:group={data["flex-shrink"]}/>
                <tt>{val}</tt>
            </label>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <h2><tt>justify-content</tt></h2>
    <div class="col">
        <div class="d-flex gap-1" style="justify-content: {data["justify-content"]}">
            <div class="element {COLORS[0]}"></div>
            <div class="element {COLORS[1]}"></div>
            <div class="element {COLORS[2]}"></div>
        </div>
    </div>
    <div class="col">
        <div class="d-flex flex-column">
            <div class="d-flex flex-column">
                {#each Object.entries({
                    "Positional alignment": ["center", "start", "end", "flex-start", "flex-end", "left", "right"],
                    "Normal alignment": ["normal"],
                    "Distributed alignment": ["space-between", "space-around", "space-evenly", "stretch"],
                    "Overflow alignment": ["safe center", "unsafe center"],
                    "Global values": ["inherit", "initial", "revert", "revert-layer", "unset"],
                }) as [group, values]}
                    <strong>{group}:</strong>
                    {#each values as val}
                    <label>
                        <input type="radio" name="justify-content" value={val} bind:group={data["justify-content"]}/>
                        <tt>{val}</tt>
                    </label>
                    {/each}
                {/each}
            </div>
        </div>
    </div>
</div>

<div class="row">
    <h2><tt>align-items</tt> and <tt>align-self</tt></h2>
    <div class="col">
        <div class="d-flex gap-1 border" style="height: 240px; align-items: {data["align-items"]}">
            <div class="element {COLORS[0]}"></div>
            <div class="element {COLORS[1]}" style="align-self: {data["align-self"]}"></div>
            <div class="element {COLORS[2]}"></div>
        </div>
    </div>
    <div class="col">
        <div class="d-flex flex-row">
            <div class="d-flex flex-column">
                <strong>align-items</strong>
                {#each ["stretch", "flex-start", "flex-end", "center", "baseline", "first baseline", "last baseline", "start", "end", "self-start", "self-end"] as val}
                    <label>
                        <input type="radio" name="align-items" value={val} bind:group={data["align-items"]}/>
                        <tt>{val}</tt>
                    </label>
                {/each}
            </div>

            <div class="d-flex flex-column">
                <strong>align-self</strong>
                {#each ["auto", "flex-start", "flex-end", "center", "baseline", "stretch"] as val}
                    <label>
                        <input type="radio" name="align-self" value={val} bind:group={data["align-self"]}/>
                        <tt>{val}</tt>
                    </label>
                {/each}
            </div>
        </div>
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

    .resizable {
        border: 1px solid var(--bs-body-color);
        resize: both;
        overflow: auto;
    }
</style>