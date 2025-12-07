/*
 * A basic wrapper for the API provided by the Bundestag:
 * https://dip.bundestag.de/%C3%BCber-dip/hilfe/api
 */
const CORS_PROXY = "https://corsproxy.io/?";

const API_KEY = "OSOegLs.PR2lwJ1dwCeje9vTj7FPOt3hvpYKtwKkhw";
const API_BASE = "https://search.dip.bundestag.de/api/v1";

async function get(path, params = {}) {
    const query = new URLSearchParams({ ...params, format: "json", apikey: API_KEY });
    const url = `${API_BASE}/${path}?${query.toString()}`;

    const response = await fetch(CORS_PROXY + encodeURIComponent(url));
    if (!response.ok)
        throw new Error(`HTTP error: ${response.status}`);

    return await response.json();
}

async function* curserBasedGenerator(path, params = {}) {
    let cursor = null;

    while (true) {
        const page = await get(path, cursor ? { ...params, cursor } : params);

        yield page.documents;

        if (!page.cursor || page.cursor === cursor)
            break;

        cursor = page.cursor;
    }
}

async function flattenCursor(path, params = {}) {
    const all = [];
    for await (const docs of curserBasedGenerator(path, params)) {
        all.push(...docs);
    }
    return all;
}

function createEndpoint(endpoint) {
    return {
        get: (params = {}) => get(endpoint, params),
        getAll: (params = {}) => flattenCursor(endpoint, params),
        getById: (id, params = {}) => get(`${endpoint}/${id}`, params),
    };
}

export const vorgang = createEndpoint("vorgang");
export const vorgangsposition = createEndpoint("vorgangsposition");
export const drucksache = createEndpoint("drucksache");
export const drucksacheText = createEndpoint("drucksache-text");
export const plenarprotokoll = createEndpoint("plenarprotokoll");
export const plenarprotokollText = createEndpoint("plenarprotokoll-text");
export const aktivitaet = createEndpoint("aktivitaet");
export const person = createEndpoint("person");
