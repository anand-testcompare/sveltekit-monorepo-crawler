<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { ChevronDown } from '@lucide/svelte';
	import { remoteGetAllChannels } from '$lib/remote/channels.remote';
	import { page } from '$app/state';
	import RootLoader from '$lib/components/RootLoader.svelte';

	const { children } = $props();

	const channelId = $derived(page.params.channelId);

	const channels = $derived(await remoteGetAllChannels());

	const selectedChannel = $derived(channels?.find((channel) => channel.ytChannelId === channelId));
</script>

<div class="flex flex-col gap-4 p-8">
	<div class="flex items-center justify-between">
		<a href={`/app/channel/${channelId}`}>
			<h1 class="text-2xl font-bold">{selectedChannel?.name ?? 'Select Channel'}</h1>
		</a>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
			>
				{selectedChannel?.name ?? 'Select Channel'}
				<ChevronDown class="h-4 w-4" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="min-w-[200px]">
				{#each channels as channel}
					<DropdownMenu.Item class={channelId === channel.ytChannelId ? 'bg-accent' : ''}>
						<a href={`/app/channel/${channel.ytChannelId}`} class="w-full">
							{channel.name}
						</a>
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<svelte:boundary>
		{#snippet pending()}
			<RootLoader />
		{/snippet}
		{@render children()}
	</svelte:boundary>
</div>
