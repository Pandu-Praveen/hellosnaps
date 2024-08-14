<script lang="ts">
	import api from "$lib/api";
	import { workspaceStore, type WorkspaceType } from "$lib/stores";
	import {onMount, onDestroy} from 'svelte'

	let disableButton = false;

	let workspaceTitle: string;
	let search: string = "";
	let workspaces: WorkspaceType[] | null | undefined;

	const toggleModal = () => {
		const modal = document.querySelector("dialog");
		if (modal?.open) {
			modal.close();
		} else {
			modal?.showModal();
			modal?.querySelector("#name")?.setAttribute("autofocus", "true");
		}
	};

	const getWorkspaces = async () => {
		const response = await api.get("/workspaces");
		if (response.status == 200) {
			console.log(response.data.workspaces)
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

	const newWorkspace = async () => {
		if (!workspaceTitle.trim()) {
			return;
		}
		disableButton = true;
		const success = await api.post("/workspaces", {
			name: workspaceTitle
		});
		toggleModal();
		if (success.status == 201) {
			window.location.reload();
		}
	};

	onMount(() => {
		getWorkspaces();
	});

	onDestroy(() => {
  		workspaceStore.set([]); // Clear the data in the store
	});

	workspaceStore.subscribe((ws) => {
		workspaces = ws;
	});
</script>

<svelte:head>
	<title>Workspaces - HelloSnaps</title>
</svelte:head>

<main class="max-w-screen-xl mx-auto">
	<section class="mx-auto max-w-screen-xl p-5 pt-12">
		<div class="flex flex-col gap-3 md:flex-row justify-between sticky top-0 bg-white p-2 pb-4">
			<h1 class="text-3xl font-bold my-auto">My Workspaces</h1>
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
			<a
				class="card bg-primary-500 hover:bg-primary-600 cursor-pointer p-2 h-[10rem] flex flex-col gap-2 justify-center text-center"
				on:click={toggleModal}
				href="."
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="48"
					height="48"
					class="mx-auto"
					><path
						d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
						fill="rgba(255,255,255,1)"
					/></svg
				>
				<h2 class="font-bold text-2xl text-center text-white">New Workspace</h2>
			</a>
			<a
				class="card bg-primary-500 hover:bg-primary-600 cursor-pointer p-2 h-[10rem] flex flex-col gap-2 justify-center text-center"
				href="/shared"
			>
				<svg
					fill="#ffff"
					height="48"
					width="48"
					version="1.1"
					class="mx-auto"
					id="Layer_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 458.624 458.624"
					xml:space="preserve"
					stroke="#ffff"
				>
					<g id="SVGRepo_bgCarrier" stroke-width="0" />
					<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
					<g id="SVGRepo_iconCarrier">
						<g>
							<g>
								<path
									d="M339.588,314.529c-14.215,0-27.456,4.133-38.621,11.239l-112.682-78.67c1.809-6.315,2.798-12.976,2.798-19.871 c0-6.896-0.989-13.557-2.798-19.871l109.64-76.547c11.764,8.356,26.133,13.286,41.662,13.286c39.79,0,72.047-32.257,72.047-72.047 C411.634,32.258,379.378,0,339.588,0c-39.79,0-72.047,32.257-72.047,72.047c0,5.255,0.578,10.373,1.646,15.308l-112.424,78.491 c-10.974-6.759-23.892-10.666-37.727-10.666c-39.79,0-72.047,32.257-72.047,72.047s32.256,72.047,72.047,72.047 c13.834,0,26.753-3.907,37.727-10.666l113.292,79.097c-1.629,6.017-2.514,12.34-2.514,18.872c0,39.79,32.257,72.047,72.047,72.047 c39.79,0,72.047-32.257,72.047-72.047C411.635,346.787,379.378,314.529,339.588,314.529z"
								/>
							</g>
						</g>
					</g>
				</svg>

				<h2 class="font-bold text-2xl text-center text-white">Shared Workspace</h2>
			</a>
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

<!-- New Workspace Modal -->
<dialog class="w-full max-w-prose p-3 border-2 border-gray-100 mx-2 sm:mx-auto">
	<div class="bg-white h-fit flex flex-col gap-2 rounded-2xl">
		<div class="flex flex-row justify-between">
			<h2 class="text-2xl font-bold my-auto flex-1">New Workspace</h2>
			<a href="." class="cursor-pointer" on:click={toggleModal}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="32"
					height="32"
					class="my-auto"
					><path
						d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"
					/></svg
				>
			</a>
		</div>
		<form on:submit|preventDefault={newWorkspace}>
			<fieldset class="flex flex-col gap-2 w-full h-full">
				<label for="login">Workspace Title</label>
				<input
					type="text"
					name="name"
					id="name"
					bind:value={workspaceTitle}
					class="border-2 outline-tertiary-100 focus:outline-primary-300 p-2 w-full"
					placeholder="Title"
					required
				/>
			</fieldset>
			<input
				type="submit"
				class="px-3 py-3 bg-primary-500 font-semibold text-white mt-4 w-full disabled:bg-gray-400 disabled:text-black"
				value={disableButton ? "Creating Workspace..." : "Create"}
				disabled={disableButton}
			/>
		</form>
	</div>
</dialog>
