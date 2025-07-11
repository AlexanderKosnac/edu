<script>
import "bootstrap/dist/css/bootstrap.min.css";
import scriptSrc from "bootstrap/dist/js/bootstrap.bundle.min.js?url";
import "bootstrap-icons/font/bootstrap-icons.css";

import MiniSearch from 'minisearch';

import { base } from '$app/paths';
import ThemeToggle from '$lib/ThemeToggle/ThemeToggle.svelte';

import data from "./aggregate-overview-data.json";

let minisearch = new MiniSearch({
    fields: ["name", "description"],
    storeFields: ["name", "url", "description", "usable"],
});

let i = 0;
minisearch.addAll(data.map(e => { return {...e, id: i++} }));

let search = "";
$: results = minisearch.search(search);

function clearSearch() {
	search = "";
}
</script>

<svelte:head>
	<script src={scriptSrc}></script>
</svelte:head>

<nav class="navbar navbar-expand-lg bg-body-tertiary flex-nowrap">
	<div class="container-fluid">
		<a class="navbar-brand" href="{base}/" draggable="false" on:click={clearSearch}>
			<img src="{base}/favicon.svg" alt="Logo" width="30" height="30" class="d-inline-block align-text-top" draggable="false">
		</a>
		<input class="form-control search-bar mr-1rem" type="search" placeholder="Search..." aria-label="Search" bind:value={search}>
		<div class="nav-item"><ThemeToggle/></div>
	</div>
</nav>

<div class="container-fluid">
	{#if search}
	<div class="row justify-content-center mt-2">
		<div class="col-lg-10">
			<div class="d-flex flex-column gap-2">
				{#each results as entry}
				{#if entry.usable ?? true}
				<div class="card tool-card">
					<div class="card-body">
						<h5 class="card-title">
							<a class="icon-link icon-link-hover" href="{base}/{entry.url}" on:click={clearSearch}>
								{entry.name}
								<i class="bi bi-arrow-right-short"></i>
							</a>
						</h5>
						<p class="card-text">{entry.description}</p>
					</div>
				</div>
				{/if}
				{/each}
			</div>
		</div>
	</div>
	{:else}
	<slot />
	{/if}
</div>

<style>
	.mr-1rem {
		margin-right: 1rem;
	}
	.search-bar {
		max-width: 800px;
	}
</style>