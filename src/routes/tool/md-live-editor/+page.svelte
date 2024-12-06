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
</script>

<svelte:head>
    <title>Markdown Live Editor</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Markdown Live Editor</h1>
    </div>
</div>

<div class="row gap-1 p-1">
    <div class="col">
        <div class="form-group">
            <label for="inputText">Markdown Input:</label>
            <textarea class="form-control" id="inputText" rows="20" bind:value="{mdInput}"></textarea>
        </div>
    </div>

    <div class="col">
        <div>{@html marked(mdInput)}</div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://www.npmjs.com/package/marked" target="_blank">Library: <tt>marked</tt></a></li>
            <li><a href="https://en.wikipedia.org/wiki/Markdown" target="_blank">Markdown (Wikipedia)</a></li>
            <li><a href="https://www.markdownguide.org/" target="_blank">Markdown Guide</a></li>
        </ul>
    </div>
</div>

<style>
    #inputText {
      font-family: "Courier New", monospace;
    }
</style>