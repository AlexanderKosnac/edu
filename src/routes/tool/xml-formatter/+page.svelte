<script>
    import xmlFormat from 'xml-formatter';

    let indentSpaces = 4;
    let doWhiteSpaceAtEndOfSelfclosingTag = true;
    let doForceSelfClosingEmptyTag = true;

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
                indentation: " ".repeat(indentSpaces),
                collapseContent: true,
                lineSeparator: "\n",
                whiteSpaceAtEndOfSelfclosingTag: doWhiteSpaceAtEndOfSelfclosingTag,
                forceSelfClosingEmptyTag: doForceSelfClosingEmptyTag,
            });
        } catch (err) {
            return `Invalid XML. ${err}`;
        }
    })();

</script>

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

        <div class="d-flex flex-column gap-1">
            <label>
                Indent spaces:
                <input type="number" class="form-control" min="0" bind:value={indentSpaces}/>
            </label>
    
            <label>
                White-space at end of self-closing tag:
                <input class="form-check-input" type="checkbox" value="" bind:checked={doWhiteSpaceAtEndOfSelfclosingTag}/>
            </label>
    
            <label>
                Force self-closing empty tag:
                <input class="form-check-input" type="checkbox" value="" bind:checked={doForceSelfClosingEmptyTag}/>
            </label>
        </div>
    </div>
</div>

<style>
</style>