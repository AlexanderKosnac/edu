<script>
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    let {
        width = 24,
        height = 24,
        ...others
    } = $props();

    const light = "light";
    const dark = "dark";

    let theme = $state();

    function toggleTheme() {
        if (browser) {
            theme = theme === light ? dark : light;
            localStorage["edu-theme"] = theme;
            document.documentElement.setAttribute("data-bs-theme", theme);
        }
    }

	onMount(() => {
		if (browser) {
			theme = localStorage["edu-theme"] || light;
			document.documentElement.setAttribute("data-bs-theme", theme);
		}
	});
</script>

{#if theme}
<div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24"
        fill="currentColor" on:click={toggleTheme} aria-label="Toggle theme">
        <g id="moon" class="theme-toggle" class:invisible={theme === dark}>
            <path d="M21 12a9 9 0 1 1-9-9c0 0 0 0 0 0a7 7 0 1 0 9 9z"/>
        </g>
        <g id="sun" class="theme-toggle" class:invisible={theme === light}>
            <circle cx="12" cy="12" r="5"/>
            <g stroke="currentColor" stroke-width="2">
                {#each { length: 8 } as _, i}
                    <line x1="12" y1="1" x2="12" y2="5" transform="rotate({i * 45}, 12, 12)"/>
                {/each}
            </g>
        </g>
    </svg>
</div>
{/if}

<style>
    div {
        display: flex;
        align-items: center;
    }
    .theme-toggle {
        transition: opacity 0.5s ease;
    }
    .invisible {
        opacity: 0;
    }
</style>
