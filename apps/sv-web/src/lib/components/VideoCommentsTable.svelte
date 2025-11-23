<script lang="ts">
	import { Pencil, DollarSign, CircleHelp } from '@lucide/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
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
		getFilteredRowModel,
		type ColumnDef,
		type SortingState,
		type ColumnFiltersState
	} from '@tanstack/table-core';

	const {
		videoData
	}: {
		videoData: Awaited<
			ReturnType<typeof import('$lib/remote/channels.remote').remoteGetVideoDetails>
		>;
	} = $props();

	let showQuestions = $state(false);
	let showSponsorMentions = $state(false);
	let showEditingMistakes = $state(false);

	const filteredComments = $derived.by(() => {
		if (!videoData.comments) return [];
		const comments = videoData.comments;
		if (!showQuestions && !showSponsorMentions && !showEditingMistakes) {
			return comments;
		}
		return comments.filter((comment) => {
			if (showQuestions && comment.isQuestion) return true;
			if (showSponsorMentions && comment.isSponsorMention) return true;
			if (showEditingMistakes && comment.isEditingMistake) return true;
			return false;
		});
	});

	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	type Comments = ColumnDef<(typeof videoData.comments)[number]>[];

	const columns: Comments = [
		{
			accessorKey: 'author',
			header: 'Author',
			size: 120,
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ author: string }]>((params) => {
					const { author } = params();
					return {
						render: () =>
							`<div class="text-sm font-medium text-card-foreground truncate">${author}</div>`
					};
				});
				return renderSnippet(snippet, { author: row.original.author });
			}
		},
		{
			accessorKey: 'text',
			header: 'Comment',
			size: 300,
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ text: string }]>((params) => {
					const { text } = params();
					return {
						render: () =>
							`<a href="https://www.youtube.com/watch?v=${videoData.video.ytVideoId}&lc=${row.original.ytCommentId}" target="_blank" class="break-words text-sm text-card-foreground whitespace-normal">${text}</a>`
					};
				});
				return renderSnippet(snippet, { text: row.original.text });
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
			size: 80,
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
			accessorKey: 'replyCount',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					title: 'Replies',
					isSorted: column.getIsSorted(),
					onclick: column.getToggleSortingHandler()
				}),
			size: 90,
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ replies: number }]>((params) => {
					const { replies } = params();
					return {
						render: () =>
							`<div class="text-sm text-muted-foreground">${formatNumber(replies)}</div>`
					};
				});
				return renderSnippet(snippet, { replies: row.original.replyCount });
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
			size: 110,
			cell: ({ row }) => {
				const snippet = createRawSnippet<[{ date: Date }]>((params) => {
					const { date } = params();
					return {
						render: () => `<div class="text-sm text-muted-foreground">${formatDate(date)}</div>`
					};
				});
				return renderSnippet(snippet, { date: row.original.publishedAt });
			},
			sortingFn: 'datetime'
		},
		{
			accessorKey: 'flags',
			header: 'Flags',
			size: 180,
			cell: ({ row }) => {
				const comment = row.original;
				const snippet = createRawSnippet(() => {
					const comment = row.original;
					const badges: string[] = [];
					if (comment.isEditingMistake) {
						badges.push(
							'<span class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>Edit</span>'
						);
					}
					if (comment.isSponsorMention) {
						badges.push(
							'<span class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>Sponsor</span>'
						);
					}
					if (comment.isQuestion) {
						badges.push(
							'<span class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v.01M12 12a1 1 0 0 0-1-1 1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1z"></path></svg>Question</span>'
						);
					}
					if (comment.isPositiveComment) {
						badges.push(
							'<span class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-primary text-primary-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.08c4.993 0 9-1.806 9-4.02V12c0 4.418-4.03 8-9 8s-9-3.582-9-8V12c0 2.214 4.007 4.02 9 4.02z"></path><ellipse cx="12" cy="12" rx="9" ry="4"></ellipse><path d="M12 4v8"></path></svg>Positive</span>'
						);
					}
					if (comment.isProcessed) {
						badges.push(
							'<span class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Processed</span>'
						);
					}
					return {
						render: () => `<div class="flex flex-wrap gap-1">${badges.join('')}</div>`
					};
				});
				return renderSnippet(snippet, { comment });
			}
		}
	];

	let sorting = $state<SortingState>([{ id: 'publishedAt', desc: true }]);
	let columnFilters = $state<ColumnFiltersState>([]);

	const table = createSvelteTable({
		get data() {
			return filteredComments;
		},
		columns,
		state: {
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	});
</script>

<div class="h-96">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-semibold text-foreground">
			Comments ({videoData.comments?.length ?? 0})
		</h2>
	</div>
	{#if !videoData.comments || videoData.comments.length === 0}
		<div class="rounded-lg border border-border bg-muted p-8">
			<p class="text-center text-muted-foreground">No comments found</p>
		</div>
	{:else}
		<div class="mb-4 flex flex-row justify-between">
			<Input
				placeholder="Search comments by title..."
				value={(table.getColumn('text')?.getFilterValue() as string) ?? ''}
				oninput={(e) => table.getColumn('text')?.setFilterValue(e.currentTarget.value)}
				onchange={(e) => table.getColumn('text')?.setFilterValue(e.currentTarget.value)}
				class="max-w-sm"
			/>

			<div class="flex items-center gap-2">
				<Button
					variant={showQuestions ? 'default' : 'outline'}
					size="sm"
					onclick={() => (showQuestions = !showQuestions)}
				>
					<CircleHelp class="h-4 w-4" />
					Questions
				</Button>
				<Button
					variant={showSponsorMentions ? 'default' : 'outline'}
					size="sm"
					onclick={() => (showSponsorMentions = !showSponsorMentions)}
				>
					<DollarSign class="h-4 w-4" />
					Sponsor Mentions
				</Button>
				<Button
					variant={showEditingMistakes ? 'default' : 'outline'}
					size="sm"
					onclick={() => (showEditingMistakes = !showEditingMistakes)}
				>
					<Pencil class="h-4 w-4" />
					Edit Mistakes
				</Button>
			</div>
		</div>
		{#if table.getRowModel().rows.length === 0}
			<div class="rounded-lg border border-border bg-muted p-8">
				<p class="text-center text-muted-foreground">No comments match the search</p>
			</div>
		{:else}
			<div class="max-h-[600px] overflow-hidden rounded-lg border border-border bg-card">
				<div class="max-h-[600px] overflow-y-auto">
					<Table.Root class="w-full table-fixed">
						<Table.Header class="sticky top-0 z-10 bg-muted">
							{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
								<Table.Row>
									{#each headerGroup.headers as header (header.id)}
										<Table.Head style="width: {header.getSize() ?? 100}px">
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
										<Table.Cell style="width: {cell.column.getSize() ?? 100}px">
											<FlexRender
												content={cell.column.columnDef.cell}
												context={cell.getContext()}
											/>
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
	{/if}
</div>
