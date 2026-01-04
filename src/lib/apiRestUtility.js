const CORS_PROXY = "https://corsproxy.io/?";

export async function get(path, params = {}) {
    const query = new URLSearchParams({ ...params, format: "json" });
    const url = `${path}?${query.toString()}`;

    const response = await fetch(CORS_PROXY + encodeURIComponent(url));
    if (!response.ok)
        throw new Error(`HTTP error: ${response.status}`);

    return await response.json();
}
