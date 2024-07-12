<script>
    const EMPTY_PAGE = "∅";

    const implementations = [
        {
            abbrev: "NRU",
            full: "Not recently used",
            description: "",
            implemented: false,
            f: () => {
                console.log("NRU")
            },
        },
        {
            abbrev: "FIFO",
            full: "First-in, first-out",
            description: "The first page loaded is the first page to be discarded.",
            implemented: true,
            pos: 1,
            newPage: function() { return { page: undefined, pos: 0 } },
            onPageInFrame: function(_) { },
            onTick: function(_) { },
            getRemovalCandidate: function(frames) { return frames.reduce((min, obj) => obj.pos < min.pos ? obj : min, frames[0]) },
            replacePage: function(frame, page) {
                frame.page = page;
                frame.pos = this.pos++;
            },
        },
        {
            abbrev: "LRU",
            full: "Least recently used",
            description: "Discards the least recently used page first.",
            implemented: true,
            newPage: function() { return { page: undefined, age: 0 } },
            onPageInFrame: function(page) { page.age = 0 },
            onTick: function(frames) { frames.forEach(it => it.age++) },
            getRemovalCandidate: function(frames) { return frames.reduce((max, obj) => obj.age > max.age ? obj : max, frames[0]) },
            replacePage: function(frame, page) {
                frame.page = page;
                frame.age = 0;
            },
        },
    ];

    let algorithm = implementations[1];

    function setupHistory() {
        history = [{
            request: undefined,
            frames: Array.from({ length: 3 }, () => algorithm.newPage()),
        }];
    }

    let history;
    setupHistory();

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
            frames: structuredClone(history[history.length - 1].frames),
        };
        algorithm.onTick(timestep.frames);

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
                    bind:group={algorithm} value={implementations[idx]} on:change={setupHistory} disabled="{!implementation.implemented}">
                <label class="form-check-label" for="alg{idx}">{implementation.abbrev}</label>
            </div>
            {/each}
        </div>
        <div class="mb-3">
            <span>{algorithm.full} ({algorithm.abbrev}):</span> {algorithm.description}
        </div>

        <strong class="text-nowrap">Request Page:</strong>
        <div class="d-flex align-items-center gap-1">
            {#each {length: 9} as _, i}
            <button type="button" class="btn btn-outline-primary page-request-button btn-request" on:click={requestPage} value="{i}"/>
            {/each}

            <div class="input-group">
                <input id="custom-page-request" type="text" class="form-control" style="max-width: 50px">
                <button type="button" class="btn btn-outline-primary" on:click={requestPage}>Request</button>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex flex-column overflow-auto">
            <div class="d-flex gap-1 mt-1">
                <div class="page slot">Request</div>
                {#each history as timestep}
                    <div class="page">{timestep.request ?? EMPTY_PAGE}</div>
                {/each}
            </div>
            {#each {length: 3} as _, i}
            <div class="d-flex gap-1 mt-1">
                <div class="page slot">Slot {i+1}</div>
                {#each history as timestep}
                    <div class="page">
                        <div>{timestep.frames[i].page ?? EMPTY_PAGE}</div>
                    </div>
                {/each}
            </div>
            {/each}
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
.btn-request {
    width: 50px;
}

.page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    min-width: 50px;
    min-height: 50px;
    max-width: 50px;
    max-height: 50px;
    border: 2px solid #8b8b8b;
    border-radius: 5px;

    font-size: 1.2em;
}

.page.slot {
    min-width: 80px;
    max-width: 80px;
    font-weight: 800;
    font-size: 1em;
}
</style>