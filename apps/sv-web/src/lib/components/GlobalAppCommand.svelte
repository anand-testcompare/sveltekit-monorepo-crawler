<script lang="ts">
	import z from 'zod';
	import Button from './ui/button/button.svelte';
	import { useSearchParams } from 'runed/kit';
	import { remoteGetAllChannels, remoteSearchVideosAndSponsors } from '$lib/remote/channels.remote';

	let open = $state(false);
	let value = $state('');
	let selectedIndex = $state(-1);

	const searchParamsSchema = z.object({
		channelId: z.string().default('')
	});

	const params = useSearchParams(searchParamsSchema);

	const allChannels = await remoteGetAllChannels();

	const channelId = $derived(params.channelId);

	const searchResults = $derived(
		channelId && value
			? await remoteSearchVideosAndSponsors({
					channelId: channelId,
					searchQuery: value
				})
			: null
	);

	const results = $derived(searchResults?.results ?? []);

	// Determine which items to show: channels (if no channelId) or search results
	const displayItems = $derived(!channelId ? allChannels : results);

	// Reset selected index when display items change
	$effect(() => {
		selectedIndex = -1;
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
			selectedIndex = -1;
		}
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if (!open) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (displayItems.length > 0) {
				selectedIndex = (selectedIndex + 1) % displayItems.length;
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (displayItems.length > 0) {
				selectedIndex = selectedIndex <= 0 ? displayItems.length - 1 : selectedIndex - 1;
			}
		} else if (e.key === 'Enter' && selectedIndex >= 0) {
			e.preventDefault();
			clickItem(selectedIndex);
		} else if (e.key === 'Escape') {
			e.preventDefault();
			closeDialog();
		}
	}

	function clickItem(index: number) {
		const link = document.querySelector(`[data-result-index="${index}"]`) as HTMLAnchorElement;
		link?.click();
	}

	function closeDialog() {
		open = false;
		selectedIndex = -1;
		value = '';
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<Button onclick={() => (open = !open)} size="sm" variant="ghost"
	>Search
	<kbd
		class="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none"
	>
		<span class="text-md">⌘</span>k
	</kbd>
</Button>

{#if open}
	<div
		class="fixed inset-0 z-50 bg-black/50"
		onclick={closeDialog}
		role="presentation"
		aria-hidden="true"
	>
		<div
			class="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background shadow-lg"
			role="dialog"
			aria-modal="true"
			aria-label={!channelId ? 'Select a channel' : 'Search for videos and sponsors'}
		>
			<div class="border-b p-4">
				<input
					type="text"
					placeholder={!channelId ? 'Select a channel...' : 'Search for a video or sponsor...'}
					bind:value
					onkeydown={handleSearchKeydown}
					{@attach (el) => el.focus()}
					class="w-full bg-transparent text-sm outline-none"
				/>
			</div>

			<div class="max-h-96 overflow-y-auto text-start">
				{#if !channelId}
					{#if allChannels.length > 0}
						<div>
							<div class="px-4 py-2 text-xs font-semibold text-muted-foreground">Channels</div>
							{#each allChannels as channel, index}
								<a
									data-result-index={index}
									href="/app/view/channel?channelId={channel.ytChannelId}"
									onclick={closeDialog}
									class="block cursor-pointer px-4 py-2 text-sm hover:bg-accent {selectedIndex ===
									index
										? 'bg-accent'
										: ''}"
								>
									{channel.name}
								</a>
							{/each}
						</div>
					{/if}
				{:else if results.length > 0}
					<div class="border-b">
						<div class="px-4 py-2 text-xs font-semibold text-muted-foreground">Results</div>
						{#each results as item, index}
							{#if item.type === 'sponsor'}
								<a
									data-result-index={index}
									href="/app/view/sponsor?channelId={channelId}&sponsorId={item.data.sponsorId}"
									onclick={closeDialog}
									class="block cursor-pointer px-4 py-2 text-sm hover:bg-accent {selectedIndex ===
									index
										? 'bg-accent'
										: ''}"
								>
									SPONSOR: {item.data.name}
								</a>
							{:else}
								<a
									data-result-index={index}
									href="/app/view/video?channelId={channelId}&videoId={item.data.ytVideoId}"
									onclick={closeDialog}
									class="block cursor-pointer px-4 py-2 text-sm hover:bg-accent {selectedIndex ===
									index
										? 'bg-accent'
										: ''}"
								>
									VIDEO: {item.data.title}
								</a>
							{/if}
						{/each}
					</div>
				{:else if value}
					<div class="px-4 py-8 text-center text-sm text-muted-foreground">No results found</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
