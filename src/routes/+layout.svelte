<script lang="ts">
	import '../styles/app.css';
</script>

<svelte:head>
	<title>Hyezotype</title>
</svelte:head>

<div class="layout">
	<nav>
		<h1>hyezotype</h1>
	</nav>
	<main>
		<slot />
	</main>
</div>

<style lang="postcss">
	h1 {
		font-size: 1.8rem;
		color: var(--fg-200);
		letter-spacing: 0.1rem;
	}

	.layout {
		min-height: 100vh;
		display: grid;
		grid-template-rows: repeat(auto-fit, minmax(100px, 1fr));
		align-items: start;
		padding: 1.5rem;
	}
</style>
