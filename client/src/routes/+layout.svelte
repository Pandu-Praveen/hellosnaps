<script lang="ts">
	import "../app.postcss";
	import { AppShell, Avatar, initializeStores, Toast } from "@skeletonlabs/skeleton";

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
	import { storePopup } from "@skeletonlabs/skeleton";
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { logout, user, type UserType } from "$lib/auth";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";

	initializeStores();

	export let data: UserType | null;
	$: if(data?.name) {
		user.set(data);
	}

	$: if(!$user && !$page.route.id?.startsWith("/(auth)")){
		goto("/login");
	}

</script>

<!-- App Shell -->
<AppShell regionPage="relative" slotPageHeader="sticky top-0 z-10">
	<svelte:fragment slot="header">
		<div class="max-w-screen-xl flex flex-row mx-auto p-3 pt-5 justify-between">
			<a href="/"><img src="/Logo.png" alt="Captura Logo" class="h-[3rem] w-fit mx-auto" /></a>
			{#if $user}
				<Avatar
					src={`https://ui-avatars.com/api?name=${$user.name}`}
					initials={$user.name[0]}
					background="bg-primary-500"
					class="h-[42px] w-[42px] cursor-pointer"
					on:click={() => {
						if (confirm("Click Ok to Logout.")) {
							logout();
						}
					}}
				/>
			{/if}
		</div>
	</svelte:fragment>
	<slot />
</AppShell>

<Toast position="tr" />
