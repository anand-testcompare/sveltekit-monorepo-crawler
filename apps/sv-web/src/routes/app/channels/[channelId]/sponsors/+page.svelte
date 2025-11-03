<script lang="ts">
	import { remoteGetChannelDetails } from '$lib/remote/channels.remote';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Spinner } from '$lib/components/ui/spinner';
	import ChannelSponsorsTable from '$lib/components/ChannelSponsorsTable.svelte';

	const { data } = $props();

	const channel = $derived(await remoteGetChannelDetails(data.channelId));
</script>

<div class="p-8">
	<div class="mb-6">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/app/channels">Channels</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/app/channels/{data.channelId}/channel"
						>{channel.name}</Breadcrumb.Link
					>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Sponsors</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Sponsors</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				Channel: {channel.name}
			</p>
		</div>
	</div>

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
		<ChannelSponsorsTable channelId={data.channelId} />
	</svelte:boundary>
</div>
