<script>
import "bootstrap/dist/css/bootstrap.min.css";
import scriptSrc from "bootstrap/dist/js/bootstrap.bundle.min.js?url";
import "bootstrap-icons/font/bootstrap-icons.css";

import { base } from '$app/paths'
import ThemeToggle from '$lib/ThemeToggle/ThemeToggle.svelte';
</script>

<svelte:head>
	<script src={scriptSrc}></script>
</svelte:head>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
	<div class="container-fluid">
		<a class="navbar-brand" href="{base}/">
			<img src="{base}/favicon.svg" alt="Logo" width="30" height="30" class="d-inline-block align-text-top">
		</a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		  <span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
			</ul>
			<div class="nav-item"><ThemeToggle/></div>
		</div>
	</div>
</nav>

<div class="container-fluid">
	<slot />
</div>
