export const prerender = true;

// Load all overview.json files at build time
const overviews = import.meta.glob("./**/overview-data.json", { query: "?raw", import: "default", eager: true });

export function load({ route }) {
    const path = route.id.replace(/^\/tool/, '');
    const key = path === '' ? './overview-data.json' : `.${path}/overview-data.json`;

    const overview = JSON.parse(overviews[key] ?? "{}");
    return { overview };
}
