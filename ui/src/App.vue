<template>
	<v-app>
		<Toolbar/>
		<v-content>
			<router-view></router-view>
		</v-content>
	</v-app>
</template>

<script>
	import { mapActions } from 'vuex';
	
	import Toolbar from './components/Toolbar';
	
	export default {
		name: 'App',
		metaInfo() {
			return {
				title: 'Pioneer'
			};
		},
		components: {
			Toolbar
		},
		data() {
			return {};
		},
		methods: {
			...mapActions( [ 'loadConfig' ] )
		},
		async mounted() {
			await this.loadConfig();
		}
	};
</script>
