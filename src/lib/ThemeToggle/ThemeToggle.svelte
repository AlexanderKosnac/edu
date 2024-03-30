<script>
    function setTheme(theme) {
        document.documentElement.dataset.theme = theme;
        document.documentElement.setAttribute("data-bs-theme", theme);
        document.cookie = `siteTheme=${theme};max-age=31536000;path="/"`;
    }
</script>

<div class="btn-group">
    <button type="button" class="btn btn-outline-secondary light-button" on:click={() => setTheme("light")}><i class="bi bi-brightness-high"></i></button>
    <button type="button" class="btn btn-outline-secondary dark-button" on:click={() => setTheme("dark")}><i class="bi bi-moon"></i></button>
</div>

<style>
:global(:root[data-bs-theme="dark"]) .dark-button,
:global(:root[data-bs-theme="light"]) .light-button {
    color: #fff;
    background-color: #5c636a;
    border-color: #565e64;
}
</style>
