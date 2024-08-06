<script>
    import { onMount } from "svelte";
    import { tokenize, shuntingYard, getAvailableOperators } from "./shunting-yard";
    import Token from "./Token.svelte";

    let inputString = "3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3";

    $: tokens = tokenize(inputString);

    let historyRpn = [];
    let historySolve = [];
    let result;

    let storeInRpnHistory = (token, action, rpn, opStack) => {
        historyRpn = [...historyRpn, {
            token: structuredClone(token),
            action: action,
            rpn: structuredClone(rpn),
            opStack: structuredClone(opStack),
        }];
    }

    let storeInSolveHistory = (token, action, rpn, nums) => {
        historySolve = [...historySolve, {
            token: structuredClone(token),
            action: action,
            rpn: structuredClone(rpn),
            nums: structuredClone(nums),
        }];
    }

    let error;

    function run() {
        historyRpn = [];
        historySolve = [];
        try {
            result = shuntingYard(tokenize(inputString), storeInRpnHistory, storeInSolveHistory);
            error = undefined;
        } catch (e) {
            error = e;
        }
    }

    onMount(()=> {
        run();
    });
</script>

<svelte:head>
    <title>Shunting yard algorithm</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Shunting yard algorithm</h1>
    </div>
</div>

<div class="row mb-3">
    <div class="col">
        <div class="form-floating">
            <input type="text" class="form-control" class:error={error} id="input" placeholder=" " bind:value={inputString} on:input={run}>
            <label for="input">Input String</label>
            <div class="form-text">Available operators:
                {#each getAvailableOperators() as op, i}
                {#if i},{/if}
                <tt>{op}</tt>
                {/each}
                <span class="text-danger" style="margin-left: 30px">{error ?? ""}</span>
            </div>
        </div>
    </div>
</div>

<div class="row mb-3">
    <div class="col">
        <h4>Tokenized Input:</h4>
        <div class="d-flex gap-1">
            {#each tokens as token}
            <Token data={token}/>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h4>Compute Reverse Polish Notation (RPN):</h4>
        <div class="d-flex gap-1">
            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th class="text-center">Token</th>
                        <th class="text-center">Action</th>
                        <th class="text-center">Reverse Polish Notation (RPN)</th>
                        <th class="text-center">Op. Stack</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                {#each historyRpn as entry}
                <tr>
                    <td class="text-center">{entry.token.symbol ?? ""}</td>
                    <td>{entry.action}</td>
                    <td>
                        <div class="d-flex gap-1">
                            {#each entry.rpn as token}
                            <Token data={token} size="small"/>
                            {/each}
                        </div>
                    </td>
                    <td>
                        <div class="d-flex gap-1">
                            {#each entry.opStack as token}
                            <Token data={token} size="small"/>
                            {/each}
                        </div>
                    </td>
                </tr>
                {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h4>Resolve RPN to Result:</h4>
        <div class="d-flex gap-1">
            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th class="text-center">Token</th>
                        <th class="text-center">Action</th>
                        <th class="text-center">Reverse Polish Notation (RPN)</th>
                        <th class="text-center">Number Storage</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                {#each historySolve as entry}
                <tr>
                    <td class="text-center">{entry.token.symbol}</td>
                    <td>{entry.action}</td>
                    <td>
                        <div class="d-flex gap-1">
                            {#each entry.rpn as token}
                            <Token data={token} size="small"/>
                            {/each}
                        </div>
                    </td>
                    <td>{JSON.stringify(entry.nums)}</td>
                </tr>
                {/each}
                </tbody>
            </table>
        </div>
        <div class="result-display">Result: {result}</div>
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
    input.error {
        border: 1px solid red;
        font: red;
    }
    .result-display {
        font-size: 1.5em;
        font-weight: 900;
    }
</style>