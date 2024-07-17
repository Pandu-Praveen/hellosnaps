<script lang="ts">
	import { page } from "$app/stores";
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
	import { MediaStore, type MediaType } from "$lib/stores";

	const workspaceId = $page.params.id;
	const workspace = $MediaStore ? $MediaStore[workspaceId] : null;
	const BASE_URL = `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/`;

	let photos = workspace?.Media;
	let selectedMedia: MediaType | undefined;
	let selectedIndex: number = 0;

	const removePlaceholder = (id: string) => {
		document.getElementById(id)?.classList.remove("placeholder", "animate-pulse");
	};

	const toggleModal = (mediaId?: string) => {
		const modal = document.querySelector("dialog") as HTMLDialogElement;
		if (mediaId) {
			modal?.showModal();
			selectedMedia = photos?.find((p) => p.id === mediaId);
			selectedIndex = photos?.indexOf(selectedMedia as MediaType) || 0;
		} else {
			modal?.close();
		}
	};

	window.addEventListener("keydown", (ev) => {
		if (!photos || !selectedMedia) {
			return;
		}
		if (ev.key == "ArrowRight") {
			selectedIndex = (selectedIndex + 1) % photos.length;
		} else if (ev.key == "ArrowLeft") {
			selectedIndex = (selectedIndex - 1) % photos.length;
			if (selectedIndex < 0) {
				selectedIndex = selectedIndex + photos.length;
			}
		}
		selectedMedia = photos[selectedIndex];
		console.log(selectedIndex);
	});
</script>

<section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mx-auto">
	{#if photos}
		{#each photos as photo}
			<a href="." on:click|preventDefault={() => toggleModal(photo.id)}>
				<img
					id={photo.id}
					height={300}
					src={ BASE_URL + photo.filePath}
					alt={photo.id}
					class="placeholder animate-pulse bg-gray-200 min-h-48 w-full rounded-none image-fit aspect-video"
					on:load={() => removePlaceholder(photo.id)}
				/>
			</a>
		{/each}
	{/if}
</section>

{#if photos?.length == 0}
	<h2 class="text-center font-bold text-xl">No Photos Uploaded</h2>
	<p class="text-center">Upload Photos to Show Here</p>
{/if}

<dialog>
	{#if selectedMedia}
		<section class="bg-white-300 w-fit h-fit p-3">
			<div class="flex flex-row justify-between w-full mb-3">
				<div class="flex flex-col">
					<h2 class="text-2xl font-bold my-auto flex-1">
						{selectedMedia.filePath?.split("/")[selectedMedia.filePath?.split("/").length - 1]}
					</h2>
					<p>Created At {new Date(selectedMedia.createdAt).toLocaleString()}</p>
				</div>
				<a href="." class="cursor-pointer" on:click|preventDefault={() => toggleModal()}>
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
			<img
				id={selectedMedia.id}
				src={BASE_URL + selectedMedia.filePath}
				alt={selectedMedia.id}
				class="h-fit w-fit lg:max-w-[1000px] lg:max-h-[600px] cover"
			/>
			{#if selectedMedia.tags?.length}
				<h3 class="font-semibold text-lg mt-3">People in this Photo</h3>
				<div class="flex flex-row gap-3 w-full overflow-scroll mt-2">
					{#each Array.from(selectedMedia.tags) as people}
						<img
							src={BASE_URL + workspaceId + "/people/" + people}
							alt={people}
							class="w-[50px] h-[50px] md:w-[80px] md:h-[80px]"
						/>
					{/each}
				</div>
			{/if}
		</section>
	{/if}
</dialog>
