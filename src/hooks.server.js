/** @type {import('@sveltejs/kit').Handle} */
export const handle = async({ event, resolve }) => {
    const theme = event.cookies.get("siteTheme");

    const response = await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('data-bs-theme=""', `data-bs-theme="${theme}"`),
    });
    return response;
}