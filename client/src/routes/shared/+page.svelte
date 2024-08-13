<script lang="ts">
	import api from "$lib/api";
	import { workspaceStore, type WorkspaceType } from "$lib/stores";

	let disableButton = false;

	let workspaceTitle: string;
	let search: string = "";
	let workspaces: WorkspaceType[] | null | undefined;

	const getWorkspaces = async () => {
		const response = await api.get("/sharedworkspaces");
		if (response.status == 200) {
			workspaceStore.set(response.data.workspaces);
		}
	};

	const searchWorkspaces = () => {
		if (search.trim()) {
			workspaces = $workspaceStore?.filter((ws) => {
				return ws.name.toLowerCase().includes(search.toLowerCase());
			});
		} else {
			workspaces = $workspaceStore;
		}
	};

	if (!$workspaceStore) {
		getWorkspaces();
	}

	workspaceStore.subscribe((ws) => {
		workspaces = ws;
	});
</script>

<svelte:head>
	<title>Shared Workspace</title>
</svelte:head>

<main class="max-w-screen-xl mx-auto">
	<section class="mx-auto max-w-screen-xl p-5 pt-12">
		<div class="flex flex-col gap-3 md:flex-row justify-between sticky top-0 bg-white p-2 pb-4">
			<h1 class="text-3xl font-bold my-auto">Shared Workspaces</h1>
			<div
				class="flex bg-white gap-2 outline outline-gray-100 px-1 focus-within:outline-blue-300 group"
			>
				<svg
					class="my-auto group-focus-within:fill-blue-500"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
					><path
						d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"
					/></svg
				>
				<input
					type="text"
					name="search"
					bind:value={search}
					on:input={searchWorkspaces}
					id="search"
					placeholder="Search Workspaces"
					class="p-2 pl-0 focus:outline-none"
				/>
			</div>
		</div>
		<div class="flex flex-col md:grid grid-cols-4 mt-5 gap-4">
			{#if workspaces}
				{#each workspaces as workspace}
					<a
						href={`/workspace/${workspace.id}`}
						class="card p-2 h-[10rem] bg-[#F7F5F2] hover:bg-primary-200 flex flex-col justify-center gap-1 hover:border border-primary-500"
					>
						<h2 class="text-center font-bold text-2xl">{workspace.name}</h2>
						<div
							class="text-center font-semibold bg-[#a0a0a0] w-fit mx-auto text-white rounded-2xl px-2"
						>
							{#if workspace.Media.length > 0}
								{`${workspace.Media.length} Images`}
							{:else}
								No Images
							{/if}
						</div>
					</a>
				{/each}
			{/if}
		</div>
	</section>
</main>
