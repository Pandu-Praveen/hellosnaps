<script lang="ts">
	import { signUp } from "$lib/auth";

	let name: string, email: string, password: string;
</script>

<svelte:head>
	<title>SignUp - HelloSnaps</title>
</svelte:head>

<form
	class=" md:mx-auto p-5 flex flex-col gap-3 w-full md:w-[500px]"
	method="post"
	on:submit|preventDefault={() => signUp(name, email, password)}
>
	<h1 class="text-2xl font-bold text-center">Create a New Account</h1>
	<div class="w-fit h-fit p-2" />
	<fieldset class="flex flex-col gap-2 w-full h-full">
		<label for="login">Name</label>
		<input
			type="text"
			name="name"
			id="name"
			bind:value={name}
			class="border-2 outline-tertiary-100 focus:outline-primary-300 p-2 w-full max-w-xl"
			placeholder="Name"
			required
		/>
	</fieldset>
	<fieldset class="flex flex-col gap-2 w-full h-full">
		<label for="login">Email</label>
		<input
			type="email"
			name="email"
			id="email"
			bind:value={email}
			class="border-2 outline-tertiary-100 focus:outline-primary-300 p-2 w-full max-w-xl"
			placeholder="Enter your email"
			required
		/>
	</fieldset>
	<fieldset class="flex flex-col gap-2">
		<label for="password">Password</label>
		<input
			type="password"
			name="password"
			id="password"
			bind:value={password}
			class="border-2 outline-tertiary-100 focus:outline-primary-300 p-2 w-full max-w-xl"
			placeholder="********"
			required
		/>
	</fieldset>
	<button type="submit" class="px-3 py-3 bg-primary-500 font-semibold text-white mt-4"
		>SignUp</button
	>
	<!-- <p class="text-red-500 text-center">{err}</p> -->
	<p class="text-center">
		Already have an Account? <a href="/login" class="underline">Login</a>
	</p>
</form>
<!-- <p class="text-center m-2">- or -</p> -->
<!-- <button on:click={() => signInWithGoogle(respCallback)} class="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full max-w-sm justify-center mx-auto">
    <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500px" height="500px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
    <span>Continue with Google</span>
</button> -->
