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
	<div class="flex h-screen w-full">
		<aside class="flex w-64 flex-col border-r border-sidebar-border bg-sidebar p-4">
			<nav class="flex flex-col gap-2">
				<Button href="/app/channel/all" variant="ghost" class="justify-start">All Channels</Button>
			</nav>
			<div class="mt-auto flex flex-col gap-2">
				<div class="flex gap-2">
					<Button onclick={toggleMode} variant="outline" size="icon" class="flex-1">
						{#if mode.current === 'dark'}
							<Sun />
						{:else}
							<Moon />
						{/if}
					</Button>
					<Button onclick={authStore.handleSignOut} class="flex-1">Sign Out</Button>
				</div>
			</div>
		</aside>

		<main class="h-screen w-full overflow-auto">
			{@render children()}
		</main>
	</div>
{:else}
	<p>You are not authenticated</p>
{/if}
