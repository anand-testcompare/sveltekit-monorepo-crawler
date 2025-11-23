<script lang="ts">
	import { remoteGetChannelSponsors } from '$lib/remote/channels.remote';
	import { createRawSnippet } from 'svelte';
	import {
		renderComponent,
		renderSnippet,
		createSvelteTable,
		FlexRender
	} from '$lib/components/ui/data-table/index.js';
	import DataTableColumnHeader from '$lib/components/ui/data-table/data-table-column-header.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import {
		getCoreRowModel,
		getSortedRowModel,
		type ColumnDef,
		type SortingState
	} from '@tanstack/table-core';

	const { channelId }: { channelId: string } = $props();

	const sponsors = $derived(await remoteGetChannelSponsors(channelId));

	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	};

	const formatDate = (date: Date | string) => {
		const d = new Date(date);
		return d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	type Sponsor = (typeof sponsors)[number];

	const columns: ColumnDef<Sponsor>[] = [
		{
			accessorKey: 'name',
			header: 'Sponsor Name',
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ sponsor: Sponsor; channelId: string }]>((params) => {
					const { sponsor, channelId } = params();
					return {
						render: () =>
							`<a href="/app/view/sponsor?sponsorId=${sponsor.sponsorId}&channelId=${channelId}" class="text-sm font-medium text-card-foreground transition-colors hover:text-primary">${sponsor.name}</a>`
					};
				});
				return renderSnippet(snippet, { sponsor: row.original, channelId });
			}
		},
		{
			accessorKey: 'sponsorKey',
			header: 'Sponsor Key',
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ key: string }]>((params) => {
					const { key } = params();
					return {
						render: () => `<div class="text-sm text-muted-foreground">${key}</div>`
					};
				});
				return renderSnippet(snippet, { key: row.original.sponsorKey });
			}
		},
		{
			accessorKey: 'totalViews',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					title: 'Total Views',
					isSorted: column.getIsSorted(),
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ views: number }]>((params) => {
					const { views } = params();
					return {
						render: () => `<div class="text-sm text-muted-foreground">${formatNumber(views)}</div>`
					};
				});
				return renderSnippet(snippet, { views: row.original.totalViews });
			}
		},
		{
			accessorKey: 'totalVideos',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					title: 'Total Videos',
					isSorted: column.getIsSorted(),
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ count: number }]>((params) => {
					const { count } = params();
					return {
						render: () => `<div class="text-sm text-muted-foreground">${count}</div>`
					};
				});
				return renderSnippet(snippet, { count: row.original.totalVideos });
			}
		},
		{
			accessorKey: 'lastVideoPublishedAt',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					title: 'Last Video Published',
					isSorted: column.getIsSorted(),
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ date: Date | string | null }]>((params) => {
					const { date } = params();
					return {
						render: () =>
							date
								? `<div class="text-sm text-muted-foreground">${formatDate(date)}</div>`
								: `<span class="text-sm text-muted-foreground/50">Never</span>`
					};
				});
				const { lastVideoPublishedAt } = row.original;

				const dateProp = lastVideoPublishedAt ? new Date(lastVideoPublishedAt) : null;

				return renderSnippet(snippet, { date: dateProp });
			},
			sortingFn: 'datetime'
		},
		{
			accessorKey: 'lastVideoPublishedDaysAgo',
			header: 'Days Ago',
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ daysAgo: number | null }]>((params) => {
					const { daysAgo } = params();
					return {
						render: () =>
							daysAgo !== null
								? `<div class="text-sm text-muted-foreground">${daysAgo} days</div>`
								: `<span class="text-sm text-muted-foreground/50">—</span>`
					};
				});
				return renderSnippet(snippet, { daysAgo: row.original.lastVideoPublishedDaysAgo });
			}
		}
	];

	let sorting = $state<SortingState>([]);

	const table = createSvelteTable({
		get data() {
			return sponsors;
		},
		columns,
		state: {
			get sorting() {
				return sorting;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});
</script>

<div>
	<h2 class="mb-4 text-xl font-semibold text-foreground">All Channel Sponsors</h2>
	{#if sponsors.length === 0}
		<div class="rounded-lg border border-border bg-muted p-8">
			<p class="text-center text-muted-foreground">No sponsors found</p>
		</div>
	{:else}
		<div class="max-h-[600px] overflow-hidden rounded-lg border border-border bg-card">
			<div class="max-h-[600px] overflow-y-auto">
				<Table.Root>
					<Table.Header class="sticky top-0 z-10 bg-muted">
						{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
							<Table.Row>
								{#each headerGroup.headers as header (header.id)}
									<Table.Head>
										{#if !header.isPlaceholder}
											<FlexRender
												content={header.column.columnDef.header}
												context={header.getContext()}
											/>
										{/if}
									</Table.Head>
								{/each}
							</Table.Row>
						{/each}
					</Table.Header>
					<Table.Body>
						{#each table.getRowModel().rows as row (row.id)}
							<Table.Row data-state={row.getIsSelected() && 'selected'}>
								{#each row.getVisibleCells() as cell (cell.id)}
									<Table.Cell>
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									</Table.Cell>
								{/each}
							</Table.Row>
						{:else}
							<Table.Row>
								<Table.Cell colspan={columns.length} class="h-24 text-center"
									>No results.</Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	{/if}
</div>
