<script>
    const EMPTY_PAGE = "∅";

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
            description: "Discards the least recently used page first.",
            newPage: () => ({page: undefined, age: 0}),
            onPageInFrame: (page) => {page.age = 0},
            getRemovalCandidate: (frames) => frames.reduce((max, obj) => obj.age > max.age ? obj : max, frames[0]),
            replacePage: (frame, page) => {
                frame.page = page;
                frame.age = 0;
            },
        },
    ];

    let algorithm = implementations[3];

    let history = [{
        request: undefined,
        frames: Array.from({ length: 3 }, () => algorithm.newPage()),
    }];

    let pageFaults = 0;

    function isPageInFrames(page, frames) {
        return frames.find(f => f.page === page);
    }

    function requestPage(e) {
        let page = e.target.getAttribute("value");
        page ??= document.querySelector("#custom-page-request").value.trim();
        if (page.length === 0) return;

        let timestep = {
            request: page,
            frames: [],
        };
        history[history.length - 1].frames.forEach(it => timestep.frames.push(structuredClone(it)));
        timestep.frames.forEach(it => it.age++);

        let frame = isPageInFrames(page, timestep.frames);
        if (frame) {
            algorithm.onPageInFrame(frame);
        } else {
            let candidate = algorithm.getRemovalCandidate(timestep.frames);
            algorithm.replacePage(candidate, page);
            pageFaults += 1;
        }
        history = [...history, timestep];
    }
</script>

<svelte:head>
    <title>Page Replacement Algorithm</title> 
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Page Replacement Algorithm</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex flex-row gap-3">
            <strong>Algorithm to use:</strong>
            {#each implementations as implementation, idx}
            <div>
                <input type="radio" class="form-check-input" name="algorithm" id="alg{idx}" autocomplete="off" checked="{idx === 0}"
                    bind:group={algorithm} value={implementations[idx]}>
                <label class="form-check-label" for="alg{idx}">{implementation.abbrev}</label>
            </div>
            {/each}
        </div>
        <div class="mb-3">
            <span>{algorithm.full} ({algorithm.abbrev}):</span> {algorithm.description}
        </div>

        <strong class="text-nowrap">Request Page:</strong>
        <div class="d-flex align-items-center gap-1">
            <button type="button" class="btn btn-outline-primary page-request-button btn-request" on:click={requestPage} value="1"/>
            <button type="button" class="btn btn-outline-primary page-request-button btn-request" on:click={requestPage} value="2"/>
            <button type="button" class="btn btn-outline-primary page-request-button btn-request" on:click={requestPage} value="3"/>
            <button type="button" class="btn btn-outline-primary page-request-button btn-request" on:click={requestPage} value="4"/>
            <button type="button" class="btn btn-outline-primary page-request-button btn-request" on:click={requestPage} value="5"/>
            <button type="button" class="btn btn-outline-primary page-request-button btn-request" on:click={requestPage} value="6"/>
            <button type="button" class="btn btn-outline-primary page-request-button btn-request" on:click={requestPage} value="7"/>
            <button type="button" class="btn btn-outline-primary page-request-button btn-request" on:click={requestPage} value="8"/>
            <button type="button" class="btn btn-outline-primary page-request-button btn-request" on:click={requestPage} value="9"/>

            <div class="input-group">
                <input id="custom-page-request" type="text" class="form-control" style="max-width: 50px">
                <button type="button" class="btn btn-outline-primary" on:click={requestPage}>Request</button>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="mw-100 overflow-auto">
            <table class="table table-bordered mt-3 page-table">
                <tbody>
                    <tr>
                        <th class="text-center">Request</th>
                        {#each history as timestep}
                            <td>{timestep.request ?? EMPTY_PAGE}</td>
                        {/each}
                    </tr>
                    {#each {length: 3} as _, i}
                    <tr>
                        <th class="text-center">Slot {i+1}</th>
                        {#each history as timestep}
                            <td>{timestep.frames[i].page ?? EMPTY_PAGE} ({timestep.frames[i].age})</td>
                        {/each}
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
            <li><a href="https://en.wikipedia.org/wiki/Page_replacement_algorithm" target="_blank">Page replacement algorithm</a></li>
        </ul>
    </div>
</div>

<style>
.page-request-button::after {
    content: attr(value);
}
.page-table tbody > tr > td:last-child {
    width: 100%;
}
.btn-request {
    width: 50px;
}
</style>