<script lang="ts">
	import { page } from "$app/stores";
	import api from "$lib/api";
	import { user } from "$lib/auth";
	import { uploadFile } from "$lib/s3";
	import { MediaStore, uploadingStatus, workspaceStore, type WorkspaceType } from "$lib/stores";
	import { FileDropzone, ProgressBar, getToastStore } from "@skeletonlabs/skeleton";

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

	$: if (
		$uploadingStatus?.totalFiles &&
		$uploadingStatus.totalFiles === $uploadingStatus.uploadedFiles
	) {
		toastStore.trigger({
			message: `${$uploadingStatus.success.length} Files Uploaded Successfully`
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

	const handleFileUpload = () => {
		console.log($user?.name);
		
		uploadingStatus.set({
			totalFiles: files.length,
			uploadedFiles: 0,
			success: [],
			failed: [],
			workspaceId,
			status: "in-progress"
		});
		Array.from(files).forEach(async (file: File) => {
			if (!$user) return alert("Cant find user info");
			
			const response = await uploadFile($user?.id, $user?.name, workspace?.name || "", file);
			if (response && response.ok) {
				console.log(response);
				uploadingStatus.update((currentStat) => {
					if (currentStat) {
						currentStat.uploadedFiles++;
						currentStat.success.push(file.name);
						api.post("/media", {
							workspace: workspaceId,
							filePath: `${workspaceId}/${file.name}`
						});
					}
					return currentStat;
				});
			} else {
				uploadingStatus.update((currentStat) => {
					if (currentStat) {
						currentStat.uploadedFiles++;
						currentStat.failed.push(file.name);
					}
					return currentStat;
				});
			}
		});
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
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="32"
				height="32"
				class="mx-auto"
				><path
					d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5ZM4 5V19H20V7H11.5858L9.58579 5H4ZM13 13V17H11V13H8L12 9L16 13H13Z"
				/></svg
			>
		</svelte:fragment>
		<svelte:fragment slot="message"><strong>Upload a File</strong> or Drag and Drop</svelte:fragment
		>
		<svelte:fragment slot="meta">PNG and JPG are allowed</svelte:fragment>
	</FileDropzone>
{:else}
	<section class="flex flex-col gap-2">
		<div class="flex flex-row justify-between">
			<h2 class="font-bold text-2xl">Uploading Files...</h2>
			<span class="font-bold text-xl"
				>{$uploadingStatus.status !== "failed"
					? Math.round(
							($uploadingStatus.uploadedFiles / $uploadingStatus.totalFiles) * 100
					  ).toString() + "%"
					: "Failed"}</span
			>
		</div>
		<ProgressBar
			label="Uploaded"
			value={$uploadingStatus.uploadedFiles}
			max={$uploadingStatus.totalFiles}
			meter={$uploadingStatus.status !== "failed" ? "bg-primary-500" : "bg-red-500"}
			track="bg-primary-200"
			height="h-3"
		/>
	</section>
{/if}
