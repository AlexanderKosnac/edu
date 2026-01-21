/*
 * A wrapper for the pegel-online API found at:
 * https://pegel-online.api.bund.dev/
 */
import { get } from "./apiRestUtility.js";

const API_BASE = "https://www.pegelonline.wsv.de/webservices/rest-api/v2"

async function getInternal(path, params = {}) {
    return await get(`${API_BASE}/${path}`, params);
}

export function getStations() {
    return getInternal("stations.json");
}

export function getStation(uuid) {
    return getInternal(`stations/${uuid}.json`, {
        includeTimeseries: true,
        includeCurrentMeasurement: true,
        includeCharacteristicValues: true,
    });
}

export function getMeasurementsPngUrl(stationUuid, timeseries, params = {}) {
    const p = new URLSearchParams({ ...params, format: "json" });
    return `${API_BASE}/stations/${stationUuid}/${timeseries}/measurements.png?${p.toString()}`;
}

export function getWaters(id = null) {
}

export function getTimeseries(stationUuid, timeseries) {
}
