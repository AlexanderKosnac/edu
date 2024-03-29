<script>
	import { base } from '$app/paths'
    import ThemeToggle from '$lib/ThemeToggle/ThemeToggle.svelte';
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">
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
