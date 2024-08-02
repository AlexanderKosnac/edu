<script>
    import { tokenize, shuntingYard, getAvailableOperators } from "./shunting-yard";

    let inputString = "2 + 3";

    $: tokens = tokenize(inputString);

    let history = [];
    let storeInHistory = (token, action, rpn, opStack) => {
        history = [...history, {
            token: token,
            action: action,
            rpn: rpn,
            opStack: opStack,
        }];
    }

    function run() {
        shuntingYard(tokens, storeInHistory);
    }
</script>

<svelte:head>
    <title>Shunting yard algorithm</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Shunting yard algorithm</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="form-floating">
            <input type="text" class="form-control" id="input" placeholder="2 + 3" on:input={run} bind:value={inputString}>
            <label for="input">Input String</label>
            <div class="form-text">Available operators:
                {#each getAvailableOperators() as op, i}
                {#if i},{/if}
                <tt>{op}</tt>
                {/each}
            </div>
        </div>
        <button on:click={run}>RUN</button>
    </div>
</div>

<div class="row">
    <div class="col">
        <h4>Tokenized Input:</h4>
        <div class="d-flex gap-1">
            {#each tokens as token}
            <div class="token">
                <div class="symbol">{token.symbol}</div>
                <div class="type">{token.type.name}</div>
            </div>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h4>Shunting yard:</h4>
        <div class="d-flex gap-1">
            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th class="text-center">Token</th>
                        <th class="text-center">Action</th>
                        <th class="text-center">RPN</th>
                        <th class="text-center">Op. Stack</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                {#each history as entry}
                <tr>
                    <td class="text-center">{entry.token.symbol}</td>
                    <td class="text-start">{entry.action}</td>
                    <td class="text-start">{entry.rpn}</td>
                    <td class="text-end">{entry.opStack}</td>
                </tr>
                {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Shunting_yard_algorithm" target="_blank">Shunting yard algorithm</a></li>
            <li><a href="https://www.youtube.com/watch?v=unh6aK8WMwM" target="_blank">Video on Shunting yard by Javid9x</a></li>
        </ul>
    </div>
</div>

<style>
    .token {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        position: relative;

        min-width: 40px;
        height: 40px;
        border: 1px solid var(--bs-body-color);
        border-radius: 5px;
    }
    .token > .symbol {
        padding: 0px 5px 15px;
        font-size: 1.4em;
        font-weight: 900;
    }
    .token > .type {
        position: absolute;
        top: 65%;
        font-size: .5em;
        font-weight: 900;
    }
</style>