<script lang="ts">
	import { page } from "$app/stores";
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
	import { MediaStore, type MediaType } from "$lib/stores";

	const workspaceId = $page.params.id;

	const pageLinkPrefix = `/workspace/${workspaceId}`;
	const workspace = $MediaStore ? $MediaStore[workspaceId] : null;
	console.log("🚀 ~ workspace:", workspace);
	const BASE_URL = `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/`;

	let photos = workspace?.Media;
	console.log("🚀 ~ photos:", photos);

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

	const deletePhoto = async (filePath: string) => {
		console.log(filePath);
		try {
			const response = await fetch(`http://localhost:9000/api/media/delete`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ filePath })
			});
			if (!response.ok) {
				throw new Error("Failed to delete photo");
			}
			photos = photos?.filter((photo) => photo.filePath !== filePath);
			selectedMedia = undefined;
			toggleModal();
		} catch (error) {
			console.error("Error deleting photo:", error);
			alert("Error deleting photo. Please try again.");
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
	console.log(selectedMedia);
</script>

<section class="masonry mx-auto below-section">
	{#if photos}
		{#each photos as photo}
			<div class="masonry-item group relative">
				<a href="." on:click|preventDefault={() => toggleModal(photo.id)} class="block relative">
					<img
						id={photo.id}
						height={300}
						src={photo.filePath}
						alt={photo.id}
						class="placeholder animate-pulse bg-gray-200 w-full rounded-none"
						style="object-fit: cover;border-radius:10px"
						on:load={() => removePlaceholder(photo.id)}
					/>
				</a>
				<!-- Delete Button -->
				<button
					class="delete-button absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
					on:click={() => deletePhoto(photo.filePath)}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
						<path
							d="M6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V7H6V19ZM19 4H15.5L14.793 3.293C14.402 2.902 13.837 2.902 13.446 3.293L12.5 4.236L11.554 3.293C11.163 2.902 10.598 2.902 10.207 3.293L9.5 4H6C5.447 4 5 4.447 5 5C5 5.553 5.447 6 6 6H19C19.553 6 20 5.553 20 5C20 4.447 19.553 4 19 4Z"
						/>
					</svg>
				</button>
			</div>
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
				src={selectedMedia.filePath}
				alt={selectedMedia.id}
				class="h-fit w-fit lg:max-w-[1000px] lg:max-h-[600px] cover"
			/>
			{#if selectedMedia.tags?.length}
				<h3 class="font-semibold text-lg mt-3">People in this Photo</h3>
				<div class="flex flex-row gap-3 w-full overflow-scroll mt-2">
					{#each Array.from(selectedMedia.tags) as people}
						<img
							src={selectedMedia.filePath.substring(0, selectedMedia.filePath.lastIndexOf("/")) +
								"/Unique_Faces/" +
								people}
							alt={people}
							class="w-[50px] h-[50px] md:w-[80px] md:h-[80px]"
						/>
					{/each}
				</div>
			{/if}
		</section>
	{/if}
</dialog>

<style>
	.delete-button {
		display: none;
	}
	.group:hover .delete-button {
		display: block;
	}
	.masonry {
		column-count: 4;
		column-gap: 8px; /* Gap between columns */
	}

	.masonry-item {
		break-inside: avoid;
		margin-bottom: 10px; /* Space between items */
		/* width: 90%; */
	}
	@media (max-width: 640px) {
		.masonry {
			column-count: 1;
			column-gap: 8px; /* Gap between columns */
		}
		.masonry-item {
			flex-basis: calc(50% - 8px);
		}
	}

	@media (min-width: 640px) {
		.masonry {
			column-count: 2;
			column-gap: 8px; /* Gap between columns */
		}
		.masonry-item {
			flex-basis: calc(50% - 8px);
		}
	}

	@media (min-width: 768px) {
		.masonry {
			column-count: 3;
			column-gap: 8px; /* Gap between columns */
		}
		.masonry-item {
			flex-basis: calc(33.333% - 8px);
		}
	}

	@media (min-width: 1024px) {
		.masonry {
			column-count: 4;
			column-gap: 8px; /* Gap between columns */
		}
		.masonry-item {
			flex-basis: calc(25% - 8px);
		}
	}
</style>
