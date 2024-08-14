<script lang="ts">
	import { page } from "$app/stores";
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
	// import { PUBLIC_S3_BUCKET_NAME, PUBLIC_S3_ENDPOINT } from "$env/static/public";
	// import { getPeople } from "$lib/s3";
	import type { _Object } from "@aws-sdk/client-s3";
	import { MediaStore, type MediaType } from "$lib/stores";

	const workspaceId = $page.params.id;
	const workspace = $MediaStore ? $MediaStore[workspaceId] : null;
	console.log("🚀 ~ workspace:", workspace);
	console.log("🚀 ~ workspaceId:", workspaceId);
	const BASE_URL = `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/`;

	// let people: _Object[] | undefined;
	let people = workspace?.Media;
	let totalTags: any = [];
	let overlayImg = "";
	console.log("🚀 ~ people:", people);
	if (people) {
		for (const val of people) {
			overlayImg = val.filePath;
			const tags = val.tags || [];
			for (const key of tags) {
				if (!totalTags.includes(key)) {
					totalTags.push(key);
				}
			}
		}
	}

	totalTags.sort();
	console.log("🚀 ~ totalTags:", totalTags);
	console.log(overlayImg);
	let folderUrl: any = overlayImg.split("/").filter((val) => val != "");

	folderUrl = folderUrl.slice(0, folderUrl.length - 1).join("/");

	console.log(folderUrl);
	// const getImages = async () => {
	// 	const images = await getPeople(workspaceId);
	// 	people = images.Contents;
	// };

	// getImages();
</script>

<!-- <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mx-auto">
	{#if people}
		{#each people as person}
			<img src={person.filePath} alt={"person.ETag"} class="h-full w-full" loading="lazy" />
		{/each}
	{/if}
</section> -->
<main class="max-w-screen-xl mx-auto">
	<section class="mx-auto max-w-screen-xl p-5 pt-12">
		<div class="flex flex-col md:grid grid-cols-4 mt-5 gap-4">
			{#if totalTags}
				{#each totalTags as tags}
					<a
						href={`people/${tags}`}
						class="card relative p-2 h-[10rem] bg-[#F7F5F2] hover:bg-primary-200 flex flex-col justify-center gap-1 hover:border border-primary-500 rounded-lg"
					>
						<!-- Round Overlay Image -->
						<div class="absolute inset-0 flex items-center justify-center">
							<img
								src={`${folderUrl}/Unique_Faces/${tags}`}
								alt={tags}
								class="rounded-full w-24 h-24 object-cover"
							/>
						</div>

						<!-- Optional Text -->
						<!-- <h2 class="text-center font-bold text-2xl">{tags}</h2> -->
						<div
							class="text-center font-semibold bg-[#a0a0a0] w-fit mx-auto text-white rounded-2xl px-2"
						>
							<!-- {#if totalTags.length > 0}
								{`${totalTags.length} Images`}
							{:else}
								No Images 
							{/if} -->
						</div>
					</a>
				{/each}
			{/if}
		</div>
	</section>
</main>

{#if !totalTags || totalTags?.length == 0}
	<h2 class="text-center font-bold text-xl">No People Found</h2>
	<p class="text-center">Analyze Photos to Find People</p>
{/if}

<style>
	.card {
		position: relative;
	}
	.card img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
	}
</style>
