<template>
	<v-toolbar
		clipped-left
		dense
		app
	>
		
		<v-toolbar-title class="headline">
			<span>Pioneer</span>
			<span class="font-weight-light">Scan</span>
		</v-toolbar-title>
		
		<v-spacer></v-spacer>
		
		<v-toolbar-items class="hidden-sm-and-down">
			<v-btn to="/" flat>Home</v-btn>
		</v-toolbar-items>
		
		<v-toolbar-items class="hidden-sm-and-down">
			<v-btn to="/scan" flat>Scan</v-btn>
		</v-toolbar-items>
	
	</v-toolbar>
</template>

<script>
	export default {};
</script>
