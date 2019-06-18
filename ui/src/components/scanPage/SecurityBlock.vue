<template>
	<v-layout
		pa-3
		wrap
		row
	>
		<v-flex xs12 sm6 md6>
			<v-flex xs12>
				<SecurityInfoCard
					:scan="scan"
				/>
			</v-flex>
		</v-flex>
	
	</v-layout>
</template>

<script>
	import SecurityInfoCard from '@/components/scanPage/SecurityInfoCard';
	
	export default {
		name: 'SecurityBlock',
		components: {
			SecurityInfoCard
		},
		props: {
			scan: Object
		},
		data() {
			return {};
		}
	};
</script>

<style>
</style>
