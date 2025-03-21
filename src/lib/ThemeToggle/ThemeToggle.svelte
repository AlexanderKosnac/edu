<script>
    import { browser } from "$app/environment";

    function setTheme(theme) {
        if (browser) {
            localStorage["edu-theme"] = theme;
            document.documentElement.setAttribute("data-bs-theme", theme);
        }
    }
</script>

<div class="btn-group">
    <button type="button" class="btn btn-outline-secondary light-button" on:click={() => setTheme("light")} aria-label="Enable light mode">
        <i class="bi bi-sun"></i>
    </button>
    <button type="button" class="btn btn-outline-secondary dark-button" on:click={() => setTheme("dark")} aria-label="Enable dark mode">
        <i class="bi bi-moon"></i>
    </button>
</div>

<style>
:global(:root[data-bs-theme="dark"]) .dark-button,
:global(:root[data-bs-theme="light"]) .light-button {
    color: #fff;
    background-color: #5c636a;
    border-color: #565e64;
}
</style>
