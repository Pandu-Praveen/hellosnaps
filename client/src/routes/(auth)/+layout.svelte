<script>
	import { goto } from "$app/navigation";
	import { user } from "$lib/auth";

	$: if($user){
		goto("/");
	}
</script>

<main class="h-full bg-gray-100 py-8 flex flex-col justify-center">
	<section class="flex flex-col justify-center h-fit w-max mx-auto p-2 rounded-xl bg-white border-2 border-gray-150">
		<slot />
	</section>
</main>

<style>
	main {
		background-image: url("/login-bg.jpg");
		background-size: contain;
		background-position: center;
	}
</style>