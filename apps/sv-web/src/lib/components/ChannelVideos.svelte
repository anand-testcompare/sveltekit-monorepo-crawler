<script lang="ts">
	import { remoteGetChannelVideos } from '$lib/remote/channels.remote';
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

	const videos = $derived(await remoteGetChannelVideos(channelId));

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

	type Video = {
		ytVideoId: string;
		title: string;
		thumbnailUrl: string;
		viewCount: number;
		likeCount: number;
		publishedAt: Date | string;
		sponsor: {
			name: string;
			sponsorId: string;
		} | null;
	};

	const columns: ColumnDef<Video>[] = [
		{
			accessorKey: 'thumbnailUrl',
			header: 'Thumbnail',
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ video: Video; channelId: string }]>((params) => {
					const { video, channelId } = params();
					return {
						render: () =>
							`<a href="/app/view/video?videoId=${video.ytVideoId}&channelId=${channelId}"><img src="${video.thumbnailUrl}" alt="${video.title}" class="h-12 w-20 rounded object-cover transition-opacity hover:opacity-80" /></a>`
					};
				});
				return renderSnippet(snippet, { video: row.original, channelId });
			}
		},
		{
			accessorKey: 'title',
			header: 'Title',
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ video: Video; channelId: string }]>((params) => {
					const { video, channelId } = params();
					return {
						render: () =>
							`<a href="/app/view/video?videoId=${video.ytVideoId}&channelId=${channelId}" class="max-w-md truncate text-sm font-medium text-card-foreground transition-colors hover:text-primary block">${video.title}</a>`
					};
				});
				return renderSnippet(snippet, { video: row.original, channelId });
			}
		},
		{
			accessorKey: 'viewCount',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					title: 'Views',
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
				return renderSnippet(snippet, { views: row.original.viewCount });
			}
		},
		{
			accessorKey: 'likeCount',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					title: 'Likes',
					isSorted: column.getIsSorted(),
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ likes: number }]>((params) => {
					const { likes } = params();
					return {
						render: () => `<div class="text-sm text-muted-foreground">${formatNumber(likes)}</div>`
					};
				});
				return renderSnippet(snippet, { likes: row.original.likeCount });
			}
		},
		{
			accessorKey: 'sponsor',
			header: 'Sponsor',
			cell: ({ row }) => {
				if (!row.original.sponsor) {
					const noneSnippet = createRawSnippet(() => ({
						render: () => `<div class="text-sm text-muted-foreground">None</div>`
					}));
					return renderSnippet(noneSnippet, {});
				}
				const snippet = createRawSnippet<
					[{ sponsor: NonNullable<Video['sponsor']>; channelId: string }]
				>((params) => {
					const { sponsor, channelId } = params();
					return {
						render: () =>
							`<a href="/app/view/sponsor?sponsorId=${sponsor.sponsorId}&channelId=${channelId}" class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-primary ring-2 ring-primary transition-colors hover:bg-primary hover:text-primary-foreground">${sponsor.name}</a>`
					};
				});
				return renderSnippet(snippet, { sponsor: row.original.sponsor, channelId });
			}
		},
		{
			accessorKey: 'publishedAt',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					title: 'Published',
					isSorted: column.getIsSorted(),
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ date: Date | string }]>((params) => {
					const { date } = params();
					return {
						render: () => `<div class="text-sm text-muted-foreground">${formatDate(date)}</div>`
					};
				});
				return renderSnippet(snippet, { date: row.original.publishedAt });
			},
			sortingFn: 'datetime'
		}
	];

	let sorting = $state<SortingState>([]);

	const table = createSvelteTable({
		get data() {
			return videos;
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
	<h2 class="mb-4 text-xl font-semibold text-foreground">Last 20 Videos</h2>
	{#if videos.length === 0}
		<div class="rounded-lg border border-border bg-muted p-8">
			<p class="text-center text-muted-foreground">No videos found</p>
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
