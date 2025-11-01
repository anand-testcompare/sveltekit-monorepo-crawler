<script lang="ts">
	import { remoteDemo } from '$lib/demo.remote';

	const result = await remoteDemo();
</script>

{#each result.channels as channel}
	<div class="flex flex-row items-center justify-center gap-2">
		<p>{channel.name}</p>
	</div>
{/each}
