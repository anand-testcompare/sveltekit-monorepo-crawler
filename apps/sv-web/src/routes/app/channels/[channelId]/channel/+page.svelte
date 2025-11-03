<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { remoteGetChannelDetails } from '$lib/remote/channels.remote';
	import ChannelVideos from '$lib/components/ChannelVideos.svelte';
	import ChannelNotifications from '$lib/components/ChannelNotifications.svelte';
	import { Spinner } from '$lib/components/ui/spinner';

	const { data } = $props();

	const channel = $derived(await remoteGetChannelDetails(data.channelId));
</script>

<svelte:head>
	<title>{channel.name}</title>
</svelte:head>

<div class="p-8">
	<div class="mb-6">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/app/channels">Channels</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>{channel.name}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-foreground">{channel.name}</h1>
		<p class="mt-2 text-sm text-muted-foreground">YouTube Channel ID: {channel.ytChannelId}</p>
	</div>
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
			<ChannelVideos channelId={data.channelId} />
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
			<ChannelNotifications channelId={data.channelId} />
		</svelte:boundary>
	</div>
</div>
