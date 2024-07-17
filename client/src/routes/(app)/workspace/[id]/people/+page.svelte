<script lang="ts">
	import { page } from "$app/stores";
	import { PUBLIC_S3_BUCKET_NAME, PUBLIC_S3_ENDPOINT } from "$env/static/public";
	import { getPeople } from "$lib/s3";
	import type { _Object } from "@aws-sdk/client-s3";

	const workspace = $page.params.id;
	const BASE_URL = PUBLIC_S3_ENDPOINT + "/" + PUBLIC_S3_BUCKET_NAME;

	let people: _Object[] | undefined;

	const getImages = async () => {
		const images = await getPeople(workspace);
		people = images.Contents;
	};

	getImages();
</script>

<section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mx-auto">
	{#if people}
		{#each people as person}
			<img src={BASE_URL + "/" + person.Key} alt={person.ETag} class="h-full w-full" loading="lazy" />
		{/each}
	{/if}
</section>

{#if !people || people?.length == 0}
	<h2 class="text-center font-bold text-xl">No People Found</h2>
	<p class="text-center">Analyze Photos to Find People</p>
{/if}
