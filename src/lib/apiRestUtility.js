const CORS_PROXY = "https://corsproxy.io/?";

export function getProxiedUrl(url) {
    return CORS_PROXY + encodeURIComponent(url)
}

export async function get(path, params = {}) {
    const query = new URLSearchParams({ ...params, format: "json" });
    const url = `${path}?${query.toString()}`;

    const response = await fetch(getProxiedUrl(url));
    if (!response.ok)
        throw new Error(`HTTP error: ${response.status}`);

    return await response.json();
}
