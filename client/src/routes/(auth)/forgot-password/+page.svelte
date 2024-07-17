<svelte:head>
	<title>Forgot Password - HelloSnaps</title>
</svelte:head>

<form class=" md:mx-auto p-5 flex flex-col gap-3 w-full md:w-[500px]" method="post">
	<h1 class="text-2xl font-bold text-center">Forgot your Password?</h1>
	<div class="w-fit h-fit p-2" />
	<fieldset class="flex flex-col gap-2 w-full h-full">
		<label for="login">Email</label>
		<input
			type="email"
			name="email"
			id="email"
			class="border-2 outline-tertiary-100 focus:outline-primary-300 p-2 w-full max-w-xl"
			placeholder="Enter your email"
			required
		/>
	</fieldset>
	<button type="submit" class="px-3 py-3 bg-primary-500 font-semibold text-white mt-4">Submit</button
	>
	<p class="text-center">
		Already have an Account? <a href="/login" class="underline">Login</a>
	</p>
</form>
