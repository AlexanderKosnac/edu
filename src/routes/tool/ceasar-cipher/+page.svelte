<script>
    let cypherShift = 23;

    function letterAsInteger(l) {
        return l.charCodeAt(0) - 0x41;
    }

    function integerAsLetter(i) {
        return String.fromCharCode((i % 26) + 0x41);
    }


</script>

<svelte:head>
    <title>Caesar cipher</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Caesar cipher</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <label>
            Shift:
            <input type="number" class="form-control" bind:value={cypherShift} min="0"/>
        </label>
        <table class="table table-bordered w-auto mt-1">
            <tbody>
                <tr>
                    <th></th>
                    {#each { length: 26 } as _, i}
                        <td>{i + 1}</td>
                    {/each}
                </tr>
                <tr>
                    <th>Plain</th>
                    {#each { length: 26 } as _, i}
                        <td>{integerAsLetter(i)}</td>
                    {/each}
                </tr>
                <tr>
                    <th>Cipher ({cypherShift})</th>
                    {#each { length: 26 } as _, i}
                        <td>{integerAsLetter(i + cypherShift)}</td>
                    {/each}
                </tr>
            </tbody>
        </table>

    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Caesar_cipher" target="_blank">Caesar cipher</a></li>
        </ul>
    </div>
</div>

<style>
</style>
