//export let proxyUrl = "https://corsproxy.io/?";
//export let proxyUrl = "https://api.allorigins.win/get?url=";
export let proxyUrl = "https://api.cors.lol/?url=";

export function getProxiedUrl(url) {
    return proxyUrl === "" ? url : `${proxyUrl}${encodeURIComponent(url)}`;
}

export async function get(path, params = {}) {
    const query = new URLSearchParams({ ...params, format: "json" });
    const url = `${path}?${query.toString()}`;

    const response = await fetch(getProxiedUrl(url));
    if (!response.ok)
        throw new Error(`HTTP error: ${response.status}`);

    return await response.json();
}
