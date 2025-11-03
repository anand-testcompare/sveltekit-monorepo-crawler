<script lang="ts">
	import ChannelVideos from '$lib/components/ChannelVideos.svelte';
	import ChannelNotifications from '$lib/components/ChannelNotifications.svelte';
	import { Spinner } from '$lib/components/ui/spinner';

	const { channelId } = $props<{ channelId: string }>();
</script>

<div class="flex flex-col gap-8">
	<svelte:boundary>
		{#snippet pending()}
			<div class="flex items-center justify-center rounded-lg border border-border bg-muted p-8">
				<Spinner class="size-6 text-muted-foreground" />
			</div>
		{/snippet}
		{#snippet failed()}
			<div class="flex items-center justify-center rounded-lg border border-border bg-muted p-8">
				<p class="text-muted-foreground">Failed to load videos</p>
			</div>
		{/snippet}
		<ChannelVideos {channelId} />
	</svelte:boundary>

	<svelte:boundary>
		{#snippet pending()}
			<div class="flex items-center justify-center rounded-lg border border-border bg-muted p-8">
				<Spinner class="size-6 text-muted-foreground" />
			</div>
		{/snippet}
		{#snippet failed()}
			<div class="flex items-center justify-center rounded-lg border border-border bg-muted p-8">
				<p class="text-muted-foreground">Failed to load notifications</p>
			</div>
		{/snippet}
		<ChannelNotifications {channelId} />
	</svelte:boundary>
</div>
