<script>

    const characters = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
        "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
        "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v",
        "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "+", "/"
    ]
</script>

<svelte:head>
    <title>Base64</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Base64</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <h2>Base 64 Alphabet</h2>
        <div class="d-flex gap-2">
            {#each {length: 4} as _, i}
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Binary</th>
                        <th>Char</th>
                    </tr>
                </thead>
                <tbody>
                    {#each {length: 16} as _, j}
                    <tr>
                        <td>{i*16+j}</td>
                        <td>{(i*16+j).toString(2).padStart(6, "0")}</td>
                        <td><kbd>{characters[i*16+j]}</kbd></td>
                    </tr>
                    {/each}
                </tbody>
            </table>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Base64" target="_blank">Base64 (Wikipedia)</a></li>
            <li><a href="https://datatracker.ietf.org/doc/html/rfc4648" target="_blank">RFC 4648</a></li>
        </ul>
    </div>
</div>

<style>
</style>