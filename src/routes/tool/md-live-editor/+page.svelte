<script>
    import { marked } from "marked";

    let mdInput = `\
# Markdown Live Editor

This is a basic Markdown editor with a live preview.

---

In the following basic components are displayed:

## Level 2 Header

**Bold text**, *italic text*.

> This is a quote block.
>
> It has multiple paragraphs.
>> And there are also nested components.
>> Like this here.

Ordered lists:
1. one
2. two
3. three

And unordered lists:
- A
- B
- C
`;

    function printMarkdown(nodeId) {
        window.print();
    }
</script>

<div class="row gap-1 p-1">
    <div class="col">
        <label for="inputText">Markdown Input:</label>
        <textarea class="form-control" id="inputText" rows="20" bind:value={mdInput}></textarea>
    </div>

    <div class="col">
        <div class="d-flex flex-row">
            <button type="button" class="btn btn-secondary" onclick={printMarkdown}>Print</button>
        </div>
        <div class="printable">{@html marked(mdInput)}</div>
    </div>
</div>

<style>
    #inputText {
        font-family: "Courier New", monospace;
    }
    @media print {
        :global(body *) {
            visibility: hidden;
        }

        :global(.printable),
        :global(.printable *) {
            visibility: visible;
        }

        :global(.printable) {
            position: absolute;
            left: 0;
            top: 0;
        }
    }
</style>
