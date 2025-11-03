<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toggleMode } from 'mode-watcher';
	import { mode } from 'mode-watcher';
	import { Moon, Sun } from '@lucide/svelte';
	import { getAuthStore } from '$lib/auth/AuthStore.svelte';
	import RootLoader from '$lib/components/RootLoader.svelte';

	const authStore = getAuthStore();

	const { children } = $props();

	$effect(() => {
		if (!authStore.isLoading && !authStore.isAuthenticated) {
			goto('/');
		}
	});
</script>

{#if authStore.isLoading}
	<RootLoader />
{:else if authStore.isAuthenticated}
	<div class="flex h-screen w-full flex-col">
		<nav
			class="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-1.5"
		>
			<Button href="/app/channel/all" variant="ghost">All Channels</Button>
			<div class="flex gap-2">
				<Button onclick={toggleMode} variant="outline" size="icon-sm">
					{#if mode.current === 'dark'}
						<Sun />
					{:else}
						<Moon />
					{/if}
				</Button>
				<Button onclick={authStore.handleSignOut} size="sm">Sign Out</Button>
			</div>
		</nav>

		<main class="h-full w-full overflow-auto">
			{@render children()}
		</main>
	</div>
{:else}
	<p>You are not authenticated</p>
{/if}
