<script lang="ts">
	import { page } from "$app/stores";
	import api from "$lib/api";
	import { user } from "$lib/auth";
	import { uploadFile } from "$lib/s3";
	import { MediaStore, uploadingStatus, workspaceStore, type WorkspaceType } from "$lib/stores";
	import { FileDropzone, getToastStore } from "@skeletonlabs/skeleton";

	const toastStore = getToastStore();

	let files: FileList;

	const workspaceId = $page.params.id;

	let workspace: WorkspaceType | null;
	const getWorkspace = async () => {
		if ($MediaStore && $MediaStore[workspaceId]) {
			workspace = $MediaStore[workspaceId];
		} else {
			const request = await api.get("/workspaces/" + $page.params.id);
			if (request.status == 200) {
				workspace = request.data.workspace;

				workspace?.Media.sort((a, b) => {
					if (a.filePath && b.filePath) {
						return a.filePath < b.filePath ? -1 : 1;
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

	$: if (
		$uploadingStatus?.totalFiles &&
		$uploadingStatus.totalFiles === $uploadingStatus.uploadedFiles
	) {
		toastStore.trigger({
			message: `${Math.abs($uploadingStatus.success.length - 1)} Files Uploaded Successfully`
		});
		uploadingStatus.set(null);
		workspaceStore.set(null);
		MediaStore.set(null);
	}

	$: if ($uploadingStatus?.status === "failed") {
		toastStore.trigger({
			message: "Upload Images Failed",
			background: "bg-red-400"
		});
	}

	getWorkspace();

	const handleFileUpload = async () => {
		console.log($user?.name);

		uploadingStatus.set({
			totalFiles: files.length,
			uploadedFiles: 0,
			success: [],
			failed: [],
			workspaceId,
			status: "in-progress"
		});
		if (!$user) return alert("Cant find user info");

		const response = await uploadFile(
			$user?.id,
			$user?.name,
			workspace?.name || "",
			workspaceId,
			files
		);

		if (response && response.status == "ok") {
			console.log(response);
			uploadingStatus.update((currentStat) => {
				if (currentStat) {
					// currentStat.uploadedFiles++;
					Array.from(files).forEach((file) => {
						currentStat.success.push(file.name);
					});
					currentStat.success.push(files[0].name);
					currentStat.uploadedFiles = files.length;
				}
				console.log(currentStat?.success, currentStat?.uploadedFiles);
				return currentStat;
			});
		} else {
			uploadingStatus.update((currentStat) => {
				if (currentStat) {
					Array.from(files).forEach((file) => {
						currentStat.failed.push(file.name);
					});
					currentStat.uploadedFiles = files.length;
				}
				return currentStat;
			});
		}
	};
</script>

{#if !$uploadingStatus || $uploadingStatus.workspaceId !== workspaceId}
	<FileDropzone
		name="files"
		class="border-dashed border-black mt-5"
		multiple
		accept=".jpeg,.jpg,.png"
		bind:files
		on:change={handleFileUpload}
	>
		<svelte:fragment slot="lead">
			<div class="centered">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="32"
					height="32"
					class="mx-auto"
				>
					<path
						d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5ZM4 5V19H20V7H11.5858L9.58579 5H4ZM13 13V17H11V13H8L12 9L16 13H13Z"
					/>
				</svg>
			</div>
		</svelte:fragment>
		<svelte:fragment slot="message"><strong>Upload a File</strong> or Drag and Drop</svelte:fragment
		>
		<svelte:fragment slot="meta">PNG and JPG are allowed</svelte:fragment>
	</FileDropzone>
{:else}
	<section class="flex flex-col gap-2 centered">
		<div class="custom-loader" />
		<h6 class="font-bold text-2xl">Uploading Files...</h6>
	</section>
{/if}

<style>
	.custom-loader {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: radial-gradient(farthest-side, #0076e5 94%, #0000) top/8px 8px no-repeat,
			conic-gradient(#0000 30%, #0076e5);
		-webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
		animation: s3 1s infinite linear;
	}

	@keyframes s3 {
		100% {
			transform: rotate(1turn);
		}
	}

	.centered {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
</style>
