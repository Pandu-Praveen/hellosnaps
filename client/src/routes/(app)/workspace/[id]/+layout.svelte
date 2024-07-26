<script lang="ts">
	import { page } from "$app/stores";
	import api from "$lib/api";
	import { MediaStore, type WorkspaceType } from "$lib/stores";
	import WorkspaceTabs from "../../../../components/WorkspaceTabs.svelte";

	const workspaceId = $page.params.id;
	export let workspace: WorkspaceType | null;
	let buttonText = "Analyze Photos";
	let buttonDisabled = false;

	const getWorkspace = async () => {
		if ($MediaStore && $MediaStore[workspaceId]) {
			workspace = $MediaStore[workspaceId];
		} else {
			const request = await api.get("/workspaces/" + $page.params.id);
			if (request.status == 200) {
				workspace = request.data.workspace;
				workspace?.Media.sort((a, b) => {
					if (a.filePath && b.filePath) {
						if (a.filePath < b.filePath) {
							return -1;
						} else {
							return 1;
						}
					}
					return 0;
				});
				MediaStore.update((ms) => {
					if (!ms) {
						ms = {};
					}
					ms[workspaceId] = workspace as WorkspaceType;
					return ms;
				});
			}
		}
	};

	const setButtonStatus = (status?: string) => {
		switch (status) {
			case "queued":
				buttonDisabled = true;
				buttonText = "In Queue";
				break;
			case "running":
				buttonDisabled = true;
				buttonText = "Processing Images";
				break;
			default:
				buttonDisabled = false;
				
				buttonText = "Analyze Photos";
				
		}
	};
	// setButtonStatus('')
	setButtonStatus("Analyze Photos")
	const analyzeWorkspace = async () => {
		const response = await api.post(`/workspaces/${workspaceId}/analyze`);
		console.log(response);
		
		if (response.status === 201) {
			setButtonStatus(response.data.status.status);
		}
	};

	getWorkspace();

	$: setButtonStatus(workspace?.Queues[workspace.Queues.length - 1]?.status);
</script>

<svelte:head>
	<title>{workspace?.name} - HelloSnaps</title>
</svelte:head>

<main class="max-w-screen-xl mx-auto">
	{#if workspace}
		<section class="mx-auto max-w-screen-xl p-5 pt-5">
			<div class="sticky top-0 bg-white pt-5">
				<div class="flex flex-row justify-between">
					<h2 class="font-bold text-3xl">{workspace.name}</h2>
					<div class="flex flex-row gap-2">
						<button
							id="analyze"
							on:click|preventDefault={analyzeWorkspace}
							class="bg-primary-500 text-white p-2 font-semibold rounded-lg disabled:bg-green-300 disabled:text-black disabled:cursor-not-allowed"
							disabled={buttonDisabled}
						>
							{buttonText}
						</button>
					</div>
				</div>
				<WorkspaceTabs />
			</div>
			<slot />
		</section>
	{/if}
</main>
