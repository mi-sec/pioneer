<template>
	<v-navigation-drawer
		v-model="model"
		mini-variant
		permanent
		floating
		clipped
		left
		dark
		app
	>
		<v-list class="pt-0" dense>
			<v-divider></v-divider>
			
			<v-list-tile
				v-for="item in items"
				:key="item.title"
				@click=""
			>
				<v-list-tile-action>
					<v-icon>{{ item.icon }}</v-icon>
				</v-list-tile-action>
				
				<v-list-tile-content>
					<v-list-tile-title>{{ item.title }}</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
	export default {
		name: 'ScanSidebar',
		data() {
			return {
				model: null,
				items: [
					{ title: 'Home', icon: 'dashboard' },
					{ title: 'About', icon: 'question_answer' }
				]
			};
		}
	};
</script>
