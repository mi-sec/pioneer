<template>
	<v-container
		fluid
		ma-0
		pa-0
	>
		
		<v-container
			v-if="scan"
			grid-list-xl
			ma-0
			pa-auto
		>
			<v-layout row wrap>
				<v-flex xs12 sm6 md6>
					<v-flex xs12>
						<SummaryCard
							:scan="scan"
						/>
					</v-flex>
					
					<v-flex xs12>
						<SecurityInfoCard
							:scan="scan"
						/>
					</v-flex>
				</v-flex>
				
				<v-flex xs12 sm6 md6>
					
				</v-flex>
			</v-layout>
		</v-container>
		
		<v-layout>
			<v-flex xs12 sm6 offset-sm3>
			</v-flex>
		</v-layout>
	
	</v-container>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex';
	import SummaryCard                              from '@/components/scanPage/SummaryCard';
	import SecurityInfoCard                         from '@/components/scanPage/SecurityInfoCard';
	
	export default {
		name: 'Scan',
		components: { SecurityInfoCard, SummaryCard },
		data() {
			return {
				id: null,
				screenshot: null
			};
		},
		computed: {
			...mapGetters( 'scan', {
				scan: 'getCurrentScan'
			} )
		},
		async mounted() {
			this.id = this.$route.params._id;
			
			await this.getScan( this.id );
			this.setCurrentScan( this.id );
			
			// const screenshot = this.scan.data.plugins.find( plugin => plugin.module === 'screenshot' );
			//
			// if ( screenshot ) {
			// 	this.screenshot = screenshot.apiPath;
			// }
		},
		methods: {
			...mapActions( 'scan', [ 'getScan' ] ),
			...mapMutations( 'scan', [ 'setCurrentScan' ] )
		}
	};
</script>

<style>
	.tree {
		height: 800px;
	}
</style>
