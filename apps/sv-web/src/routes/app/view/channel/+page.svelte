<script lang="ts">
	import RootLoader from '$lib/components/RootLoader.svelte';
	import Channel from '$lib/components/view/Channel.svelte';
	import { useSearchParams } from 'runed/kit';
	import AppError from '$lib/components/AppError.svelte';
	import z from 'zod';

	const viewParamsSchema = z.object({
		channelId: z.string().default('')
	});

	const params = useSearchParams(viewParamsSchema);

	const channelId = $derived(params.channelId);
</script>

<svelte:boundary>
	{#snippet pending()}
		<RootLoader />
	{/snippet}
	{#snippet failed(err, retryFn)}
		<AppError {err} {retryFn} />
	{/snippet}
	<Channel {channelId} />
</svelte:boundary>
