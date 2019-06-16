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
	
	import Toolbar from '@/components/Toolbar';
	
	export default {
		name: 'App',
		components: {
			Toolbar
		},
		data() {
			return {};
		},
		beforeCreate() {
			this.$installApi();
		},
		methods: {
			...mapActions( [
				'loadLocalConfig',
				'loadApiConfig'
			] )
		},
		async mounted() {
			await this.loadLocalConfig();
			await this.loadApiConfig();
		}
	};
</script>
