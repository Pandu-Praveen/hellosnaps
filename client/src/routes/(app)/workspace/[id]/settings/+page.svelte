<script>
	import { page } from "$app/stores";
	import api from "$lib/api";

    const workspaceId = $page.params.id;

    const deleteWorkspace = async () => {
        if(confirm("Click OK to Delete this Workspace and It's Files")) {
            const response = await api.delete(`/workspaces/${workspaceId}`);
            if(response.status == 200){
                window.location.replace("/");
            }
        }
    }
</script>
<section class="flex flex-col gap-3 mx-auto">
	<h2 class="text-2xl font-bold">Settings</h2>
	<button
		class="flex flex-col gap-2 justify-between max-w-sm"
		on:click|preventDefault={deleteWorkspace}
	>
		<a
			href="."
			class="bg-red-600 text-white font-bold p-2 rounded-lg cursor-pointer hover:text-red-600 hover:bg-black w-fit"
			>DELETE WORKSPACE</a
		>
	</button>
</section>
