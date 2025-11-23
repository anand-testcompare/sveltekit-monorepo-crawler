<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import { Button } from '$lib/components/ui/button/index.js';

	let {
		title,
		isSorted = false,
		...restProps
	}: { title: string; isSorted?: false | 'asc' | 'desc' } & ComponentProps<
		typeof Button
	> = $props();
</script>

<button size="sm" {...restProps} class="flex flex-row items-center justify-between gap-2">
	<span>
		{title}
	</span>
	{#if isSorted === 'asc'}
		<ArrowUpIcon class="h-4 w-4" />
	{:else if isSorted === 'desc'}
		<ArrowDownIcon class="h-4 w-4" />
	{/if}
</button>
