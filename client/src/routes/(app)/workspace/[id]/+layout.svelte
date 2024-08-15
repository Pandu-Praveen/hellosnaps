<script lang="ts">
	import { page } from "$app/stores";
	import api from "$lib/api";
	import { goto } from "$app/navigation";
	import { MediaStore, type WorkspaceType } from "$lib/stores";
	import WorkspaceTabs from "../../../../components/WorkspaceTabs.svelte";
	import { getToastStore } from "@skeletonlabs/skeleton";

	const toastStore = getToastStore();
	const workspaceId = $page.params.id;
	export let workspace: WorkspaceType | null;
	let buttonText = "Analyze Photos";
	let buttonDisabled = false;
	let loading = false;
	// console.log($page.url.pathname);

	const getWorkspace = async () => {
		if ($MediaStore && $MediaStore[workspaceId]) {
			workspace = $MediaStore[workspaceId];
		} else {
			const request = await api.get("/workspaces/" + workspaceId);
			if (request.status == 200) {
				workspace = request.data.workspace;
				workspace?.Media.sort((a, b) => {
					return a.filePath < b.filePath ? -1 : 1;
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

	const analyzeWorkspace = async () => {
		loading = true;
		setButtonStatus("queued");
		try {
			const response = await api.post(`/workspaces/${workspaceId}/analyze`);
			if (response.status === 201) {
				console.log(response.data.status.status);
				setButtonStatus("completed");
				toastStore.trigger({
					message: "Albums created successfully!",
					background: "bg-green-500",
					autohide: true
				});
				const currentPath = $page.url.pathname;
				goto(`${currentPath}/people`);
			} else {
				throw new Error("Failed to analyze workspace");
			}
		} catch (error) {
			toastStore.trigger({
				message: "Error creating albums: " + error,
				background: "bg-red-500",
				autohide: true
			});
		} finally {
			loading = false;
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
							class="bg-primary-500 text-white p-2 font-semibold rounded-lg disabled:bg-green-300 disabled:text-black disabled:cursor-not-allowed flex items-center justify-center gap-2"
							disabled={buttonDisabled || loading}
						>
							{#if loading}
								<div class="loader" />
							{/if}
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

<style>
	.loader {
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top: 2px solid white;
		border-radius: 50%;
		animation: spin 0.5s linear infinite;
	}

	@keyframes spin {
		100% {
			transform: rotate(360deg);
		}
	}
</style>
