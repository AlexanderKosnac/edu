<script>
    import { XMLParser } from 'fast-xml-parser';

    let data = [];
    let members = [];

    let fileInput;

    let error;
    let loading = false;

    let selectedMember;

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        trimValues: true,
    });

    async function loadFile() {
        error = null;
        members = [];
        loading = true;

        if (!fileInput.files || fileInput.files.length === 0) {
            loading = false;
            return;
        }

        const file = fileInput.files[0];

        try {
            const xmlText = await file.text();
            const d = parser.parse(xmlText);

            const mdb = d?.DOCUMENT?.MDB;
            if (!mdb)
                throw new Error("No MDB nodes found.");

            data = asArray(mdb);
            members = data;
        } catch (e) {
            error = `Failed to parse the XML file. ${e}`;
        } finally {
            loading = false;
        }
    }

    function asArray(value) {
        if (!value) return [];
        return Array.isArray(value) ? value : [value];
    }
</script>

{#snippet name(obj)}
    {obj.VORNAME} {obj.NACHNAME}
{/snippet}

{#snippet wahlperiode(obj)}
    [Periode {obj.WP}]
    {obj.MDBWP_VON}
    {#if obj.MDBWP_BIS != ""}
        - {obj.MDBWP_BIS}
    {:else}
        ongoing
    {/if}
{/snippet}

<div class="row">
    <div class="col">
        <input type="file" class="form-control" accept=".xml" onchange={loadFile} bind:this={fileInput}>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        {#if loading}
            <p>Parsing XML ...</p>
        {/if}

        {#if error}
            <p>{error}</p>
        {/if}

        {#if members.length}
            <p>{members.length} members loaded</p>
            <div class="overflow-auto" style="max-height: 500px">
                <ul>
                    {#each members as m, i}
                        <li>
                            <button class="list-group-item list-group-item-action border-0 w-100 text-start" onclick={() => selectedMember = m}>
                                {i}:
                                {#if m.NAMEN.NAME.length > 1}
                                    {@render name(m.NAMEN.NAME.at(-1))}
                                {:else}
                                    {@render name(m.NAMEN.NAME)}
                                {/if}

                                {#if m.NAMEN.NAME.length > 1}
                                    ({m.NAMEN.NAME.length} other)
                                {/if}
                            </button>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>

    <div class="col">
        {#if selectedMember}
            <h3>
                {#if selectedMember.NAMEN.NAME.length > 1}
                    {@render name(selectedMember.NAMEN.NAME.at(-1))}
                {:else}
                    {@render name(selectedMember.NAMEN.NAME)}
                {/if}
                ({selectedMember.BIOGRAFISCHE_ANGABEN.PARTEI_KURZ})
            </h3>
            <div class="d-flex flex-column gap-1">
                <span>
                    {selectedMember.BIOGRAFISCHE_ANGABEN.GEBURTSDATUM} in {selectedMember.BIOGRAFISCHE_ANGABEN.GEBURTSORT}
                    {#if selectedMember.BIOGRAFISCHE_ANGABEN.GEBURTSLAND != ""}
                        ({selectedMember.BIOGRAFISCHE_ANGABEN.GEBURTSLAND})
                    {/if}

                    {#if selectedMember.BIOGRAFISCHE_ANGABEN.STERBEDATUM != ""}
                     - {selectedMember.BIOGRAFISCHE_ANGABEN.STERBEDATUM}
                    {/if}
                </span>
                <span>{selectedMember.BIOGRAFISCHE_ANGABEN.BERUF}</span>
                <span>
                    Election Period:
                    <ul>
                        {#if selectedMember.WAHLPERIODEN.WAHLPERIODE.length > 1}
                            {#each selectedMember.WAHLPERIODEN.WAHLPERIODE as wp}
                                <li>{@render wahlperiode(wp)}</li>
                            {/each}
                        {:else}
                            <li>{@render wahlperiode(selectedMember.WAHLPERIODEN.WAHLPERIODE)}</li>
                        {/if}
                    </ul>
                </span>
            </div>
        {/if}
    </div>

    <div class="col">
        <pre>{JSON.stringify(selectedMember, null, 2)}</pre>
    </div>
</div>

<style>
</style>
