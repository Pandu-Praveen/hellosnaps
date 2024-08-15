<script lang='ts'>
	import { page } from "$app/stores";
	import api from "$lib/api";

    const workspaceId = $page.params.id;
	let disableButton = false;
	let emailInput: string = "";
	let tags: string[] = [];

	// Handle input changes
	const handleInput = (event: Event) => {
		emailInput = (event.target as HTMLInputElement).value;
	};

	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === 'Tab') {
			event.preventDefault();
			if (emailInput.trim()) {
				addTags();
			}
		}
	};

	const addTags = () => {
		const modal = document.querySelector("dialog");
		const newTags = emailInput
			.split(',')
			.map(tag => tag.trim())
			.filter(tag => {
				if (!tag.length) return false;
				const inputElement = modal?.querySelector("#email-input") as HTMLInputElement;
				// Check if the tag is a valid email
				if (!emailPattern.test(tag)) {
					// Provide feedback to the user that the email is invalid
					const inputElement = modal?.querySelector("#email-input") as HTMLInputElement;
					if (inputElement) {
						inputElement.style.borderColor = "red";
					}
					return false;
				}
				else{
					inputElement.style.borderColor = "gray";
				}
				if (tags.includes(tag)) {
					const inputElement = modal?.querySelector("#email-input") as HTMLInputElement;
					if (inputElement) {
						inputElement.style.borderColor = "red";
					}
					
					return false;
				}
				else{
						inputElement.style.borderColor = "gray";
					}

				return true;
			});

		if (newTags.length > 0) {
			tags = [...tags, ...newTags];
			emailInput = ''; 
		}
	};
	// Handle tag removal
	const deleteTag = (index: number) => {
		tags = tags.filter((_, i) => i !== index);
	};

	const deleteWorkspace = async () => {
        if (confirm("Click OK to Delete this Workspace and Its Files")) {
            const response = await api.delete(`/workspaces/${workspaceId}`);
            if (response.status === 200) {
                window.location.replace("/");
            }
        }
    }

	const toggleModal = () => {
		const modal = document.querySelector("dialog");
		if (modal?.open) {
			modal.close();
		} else {
			modal?.showModal();
			modal?.querySelector("#email-input")?.setAttribute("autofocus", "true");
		}
	};

	const shareWorkspace = async () => {
		if (tags.length === 0) {
			return;
		}
		disableButton = true;
		const response = await api.post(`/workspaces/${workspaceId}/sharedemail`, {
			emails: tags
		});
		toggleModal();
		if (response.status === 200) {
			window.location.reload();
		}
	};
</script>

<section class="flex flex-col gap-3 mx-auto">
	<h2 class="text-2xl font-bold">Settings</h2>
	<button
		class="flex flex-col gap-2 justify-between max-w-sm"
		on:click|preventDefault={deleteWorkspace}
	>
		<a
			href="."
			class="bg-red-600 text-white font-bold p-2 rounded-lg cursor-pointer hover:text-white-600 hover:bg-red-300 w-fit"
		>DELETE WORKSPACE</a>
	</button>
	<button
		class="flex flex-col gap-2 justify-between max-w-sm"
		on:click|preventDefault={toggleModal}
	>
		<a
			href="."
			class="bg-blue-600 text-white font-bold p-2 rounded-lg cursor-pointer hover:text-white hover:bg-blue-400 w-fit"
		>SHARE WORKSPACE</a>
	</button>
</section>

<dialog class="w-full max-w-prose p-3 border-2 border-gray-100 mx-2 sm:mx-auto">
	<div class="bg-white h-fit flex flex-col gap-2 rounded-2xl">
		<div class="flex flex-row justify-between">
			<h2 class="text-2xl font-bold my-auto flex-1">Share Workspace</h2>
			<a href="." class="cursor-pointer" on:click={toggleModal}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" class="my-auto">
					<path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"/>
				</svg>
			</a>
		</div>
		<form on:submit|preventDefault={shareWorkspace}>
			<fieldset class="flex flex-col gap-2 w-full h-full">
				<label for="email-input">Enter the Email:</label>
				<div class="flex flex-wrap gap-2 mb-2">
					{#each tags as tag, index}
						<span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full flex items-center gap-2">
							{tag}
							<button type="button" on:click={() => deleteTag(index)} class="text-red-600">&times;</button>
						</span>
					{/each}
				</div>
				<input
					type="text"
					id="email-input"
					bind:value={emailInput}
					on:input={handleInput}
					on:keydown={handleKeydown}
					class="border-2 outline-tertiary-100 focus:outline-primary-300 p-2 w-full"
					placeholder="abc@gmail.com, xyz@gmail.com, . . ."
					title="Enter comma separated email IDs"
				/>
			</fieldset>
			<input
				type="submit"
				class="px-3 py-3 bg-primary-500 font-semibold text-white mt-4 w-full disabled:bg-gray-400 disabled:text-black"
				value={disableButton ? "Sharing Workspace..." : "Share"}
				disabled={disableButton}
			/>
		</form>
	</div>
</dialog>
