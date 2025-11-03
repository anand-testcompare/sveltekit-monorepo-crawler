<script lang="ts">
	import { Spinner } from '$lib/components/ui/spinner';
	import ChannelSponsorsTable from '$lib/components/ChannelSponsorsTable.svelte';

	const { channelId } = $props<{ channelId: string }>();
</script>

<svelte:boundary>
	{#snippet pending()}
		<div class="flex items-center justify-center rounded-lg border border-border bg-muted p-8">
			<Spinner class="size-6 text-muted-foreground" />
		</div>
	{/snippet}
	{#snippet failed()}
		<div class="flex items-center justify-center rounded-lg border border-border bg-muted p-8">
			<p class="text-muted-foreground">Failed to load sponsors</p>
		</div>
	{/snippet}
	<ChannelSponsorsTable {channelId} />
</svelte:boundary>
