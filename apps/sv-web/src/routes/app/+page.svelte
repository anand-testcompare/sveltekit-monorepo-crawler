<script lang="ts">
	import { goto } from '$app/navigation';

	$effect(() => {
		goto('/app/channel/all');
	});
</script>
