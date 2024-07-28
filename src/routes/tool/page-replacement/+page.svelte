<script>
    const EMPTY_PAGE = "∅";

    let nSlots = 3;

    const implementations = [
        {
            abbrev: "FIFO",
            full: "First-in, first-out",
            description: "The first page loaded is the first page to be discarded.",
            pos: 1,
            newPage: function() { return { page: undefined, pos: 0 } },
            onPageInFrame: function(_) { },
            onTick: function(_) { },
            getRemovalCandidate: function(frames) { return frames.reduce((min, obj) => obj.pos < min.pos ? obj : min, frames[0]) },
            replacePage: function(frame, page) {
                frame.page = page;
                frame.pos = this.pos++;
            },
        }, {
            abbrev: "FIFO SC",
            full: "Second-chance",
            description: "Like FIFO, but pages can be prevented from being swapped out by being recently referenced.",
            pos: 1,
            newPage: function() { return { page: undefined, pos: 0, referenced: true } },
            onPageInFrame: function(page) { page.referenced = true },
            onTick: function(_) { },
            getRemovalCandidate: function(frames) {
                let candidate = frames.reduce((min, obj) => obj.pos < min.pos ? obj : min, frames[0]);
                while (candidate.referenced) {
                    candidate.pos = Math.min(...frames.map(f => f.pos)) - 1;
                    candidate.referenced = false;
                    candidate = frames.reduce((min, obj) => obj.pos < min.pos ? obj : min, frames[0]);
                }
                return candidate;
            },
            replacePage: function(frame, page) {
                frame.page = page;
                frame.pos = this.pos++;
                frame.referenced = true;
            },
        }, {
            abbrev: "LRU",
            full: "Least recently used",
            description: "Discards the least recently used page first.",
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

    let algorithm = implementations[0];

    function setupHistory() {
        history = [{
            request: undefined,
            frames: Array.from({ length: nSlots }, () => algorithm.newPage()),
        }];
    }

    let history;
    setupHistory();

    let pageFaults = 0;

    function isPageInFrames(page, frames) {
        return frames.find(f => f.page === page);
    }

    function onRequestPage(e) {
        let page = e.target.getAttribute("value").trim();
        if (page.length === 0) return;
        requestPage(page);
    }

    function onRequestPageKey(e) {
        const page = e.key;
        if (isNaN(parseInt(page))) return;
        e.preventDefault();
        requestPage(page);
    }

    function requestPage(page) {
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

<svelte:window on:keydown={onRequestPageKey} />

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
            <button type="button" class="btn btn-outline-primary page-request-button btn-request" on:click={onRequestPage} value="{i}"/>
            {/each}

            <div class="input-group">
                <input type="text" class="form-control" bind:value="{customRequestValue}" style="max-width: 50px">
                <button type="button" class="btn btn-outline-primary" on:click={requestPage} value="{customRequestValue}">Request</button>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <strong>Page faults:</strong> {pageFaults}
        <div class="d-flex overflow-auto">
            <div class="d-flex flex-column">
                <div class="page slot">Request</div>
                {#each {length: nSlots} as _, i}
                <div class="page slot">Slot {i+1}</div>
                {/each}
            </div>

            {#each history as timestep}
            <div class="d-flex flex-column ml-1">
                <div class="page">{timestep.request ?? EMPTY_PAGE}</div>
                {#each {length: nSlots} as _, i}
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
            <li><a href="https://en.wikipedia.org/wiki/Memory_paging" target="_blank">Memory paging</a></li>
            <li><a href="https://www.youtube.com/watch?v=P1icI9X3sR4" target="_blank">Second-chance explained</a></li>
        </ul>
    </div>
</div>

<style>
.page-request-button::after {
    content: attr(value);
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
    font-weight: 900;
    margin: 1px;

    overflow: hidden;
}

.page.translucent {
    opacity: .5;
}

.page.slot {
    min-width: 80px;
    max-width: 80px;
    font-weight: 800;
    font-size: 1em;
}
</style>