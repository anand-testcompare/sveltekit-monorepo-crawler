<script lang="ts">
	import { remoteGetSponsorDetails, remoteGetChannelDetails } from '$lib/remote/channels.remote';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Spinner } from '$lib/components/ui/spinner';
	import SponsorStats from '$lib/components/SponsorStats.svelte';
	import SponsorVideosTable from '$lib/components/SponsorVideosTable.svelte';

	const { data } = $props();

	const sponsor = $derived(await remoteGetSponsorDetails(data.sponsorId));
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
					<Breadcrumb.Page>{sponsor.sponsor.name}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">{sponsor.sponsor.name}</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				Sponsor Key: {sponsor.sponsor.sponsorKey}
			</p>
		</div>
	</div>

	<div class="space-y-8">
		<SponsorStats sponsorData={sponsor} />
		<SponsorVideosTable sponsorData={sponsor} channelId={data.channelId} />
	</div>
</div>
