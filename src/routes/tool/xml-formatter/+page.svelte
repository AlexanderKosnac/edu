<script>
    import xmlFormat from 'xml-formatter';

    let xmlString = `\
<Person>
    <Name>George Washington</Name>
    <Birth>
        <Date>1732-02-22</Date>
        <Place>Westmoreland County, Virginia</Place>
    </Birth>
    <Roles>
        <Role>General</Role>
        <Role>President</Role>
    </Roles>
    <Presidency>
        <TermStart>1789-04-30</TermStart>
        <TermEnd>1797-03-04</TermEnd>
        <Number>1</Number>
    </Presidency>
</Person>`;
    $: xmlPretty = (() => {
        try {
            return xmlFormat(xmlString, {
                indentation: '  ', 
                filter: (node) => node.type !== 'Comment', 
                collapseContent: true, 
                lineSeparator: '\n'
            });
        } catch (err) {
            return `Invalid XML. ${err}`;
        }
    })();

</script>

<svelte:head>
    <title>XML Formatter</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>XML Formatter</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="form-group">
            <label for="inputText">XML Input:</label>
            <textarea class="form-control font-monospace" id="inputText" rows="20" bind:value="{xmlString}"></textarea>
        </div>
    </div>

    <div class="col">
        <label for="outputText">XML Formatted:</label>
        <textarea class="form-control font-monospace" id="outputText" rows="20" bind:value="{xmlPretty}" readonly="true"></textarea>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://www.npmjs.com/package/xml-formatter" target="_blank">xml-formatter npm package</a></li>
        </ul>
    </div>
</div>

<style>
</style>