/*
 * A basic wrapper for the API provided by the Bundestag:
 * https://dip.bundestag.de/%C3%BCber-dip/hilfe/api
 */
import { get } from "./apiRestUtility.js";

const API_KEY = "OSOegLs.PR2lwJ1dwCeje9vTj7FPOt3hvpYKtwKkhw";
const API_BASE = "https://search.dip.bundestag.de/api/v1";

async function getInternal(path, params = {}) {
    const p = { ...params, format: "json", apikey: API_KEY };
    return await get(`${API_BASE}/${path}`, p);
}

async function* curserBasedGenerator(path, params = {}) {
    let cursor = null;

    while (true) {
        const page = await getInternal(path, cursor ? { ...params, cursor } : params);

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
        get: (params = {}) => getInternal(endpoint, params),
        getAll: (params = {}) => flattenCursor(endpoint, params),
        getById: (id, params = {}) => getInternal(`${endpoint}/${id}`, params),
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
