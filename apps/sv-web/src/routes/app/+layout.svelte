<script lang="ts">
	import { goto } from '$app/navigation';
	import { getAuthStore } from '$lib/auth/AuthStore.svelte';
	import RootLoader from '$lib/components/RootLoader.svelte';

	const { children } = $props();

	const authStore = getAuthStore();

	$effect(() => {
		if (!authStore.isLoading && !authStore.isAuthenticated) {
			goto('/');
		}
	});
</script>

{#if authStore.isLoading}
	<RootLoader />
{:else if authStore.isAuthenticated}
	<main class="flex grow flex-col items-center justify-center gap-4">
		{@render children()}
	</main>
{:else}
	<p>You are not authenticated</p>
{/if}
