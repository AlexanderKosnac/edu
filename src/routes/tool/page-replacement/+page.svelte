<script>
    let pageRequests = [];

    function requestPage(e) {
        let pageNumber = e.target.getAttribute("value");
        pageNumber ??= document.querySelector("#custom-page-request").value.trim();
        if (pageNumber.length === 0) return;
        pageRequests.push(pageNumber);
    }

    const implementations = [
        {
            abbrev: "OPT",
            full: "Optimal",
            description: "",
            f: () => {
                console.log("OPT")
            },
        },
        {
            abbrev: "NRU",
            full: "Not recently used",
            description: "",
            f: () => {
                console.log("NRU")
            },
        },
        {
            abbrev: "FIFO",
            full: "First-in, first-out",
            description: "",
            f: () => {
                console.log("FIFO")
            },
        },
        {
            abbrev: "LRU",
            full: "Least recently used",
            description: "",
            f: () => {
                console.log("LRU")
            },
        },
    ];

    let algorithm = implementations[0];
</script>

<div class="row">
    <div class="col">
        <h1>Page Replacement Algorithm</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <strong>Request Page:</strong><br>
        explain here what this does
        <div class="d-flex gap-1">
            <button type="button" class="btn btn-secondary page-request-button" on:click={requestPage} value="1"/>
            <button type="button" class="btn btn-secondary page-request-button" on:click={requestPage} value="2"/>
            <button type="button" class="btn btn-secondary page-request-button" on:click={requestPage} value="3"/>
            <button type="button" class="btn btn-secondary page-request-button" on:click={requestPage} value="4"/>
            <button type="button" class="btn btn-secondary page-request-button" on:click={requestPage} value="5"/>
            <button type="button" class="btn btn-secondary page-request-button" on:click={requestPage} value="6"/>
            <button type="button" class="btn btn-secondary page-request-button" on:click={requestPage} value="7"/>
            <button type="button" class="btn btn-secondary page-request-button" on:click={requestPage} value="8"/>
            <button type="button" class="btn btn-secondary page-request-button" on:click={requestPage} value="9"/>

            <div class="input-group">
                <input id="custom-page-request" type="text" class="form-control" style="max-width: 50px">
                <button type="button" class="btn btn-secondary" on:click={requestPage}>Request</button>
            </div>
        </div>
    </div>

    <div class="col">
        <strong>Algorithm:</strong>
        <div class="d-flex flex-row gap-5">
            <div class="d-flex flex-column gap-2">
            {#each implementations as implementation, idx}
                <div>
                    <input type="radio" class="form-check-input" name="algorithm" id="alg{idx}" autocomplete="off" checked="{idx === 0}"
                        bind:group={algorithm} value={implementations[idx]}>
                    <label class="form-check-label" for="alg{idx}">{implementation.abbrev}</label>
                </div>
            {/each}
            </div>
            <div>
                <strong>{algorithm.full} ({algorithm.abbrev}):</strong> {algorithm.description}
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <table class="table table-bordered mt-3">
        <tbody>
            <tr id="page-request-history">
                <th>Page Request</th>
            </tr>
            <tr>
                <td>a</td>
            </tr>
            <tr>
                <td>a</td>
            </tr>
            <tr>
                <td>a</td>
            </tr>
        </tbody>
        </table>
        
        <div>A {pageRequests.toString()} B</div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Page_replacement_algorithm" target="_blank">Page replacement algorithm</a></li>
        </ul>
    </div>
</div>

<style>
.page-request-button::after {
    content: attr(value);
}
</style>