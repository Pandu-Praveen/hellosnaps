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

	let people: _Object[] | undefined;

	// const getImages = async () => {
	// 	const images = await getPeople(workspaceId);
	// 	people = images.Contents;
	// };

	// getImages();
</script>

<section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mx-auto">
	{#if people}
		{#each people as person}
			<img
				src={BASE_URL + "/" + person.Key}
				alt={person.ETag}
				class="h-full w-full"
				loading="lazy"
			/>
		{/each}
	{/if}
</section>

{#if !people || people?.length == 0}
	<h2 class="text-center font-bold text-xl">No People Found</h2>
	<p class="text-center">Analyze Photos to Find People</p>
{/if}
