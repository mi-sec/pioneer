<template>
	<v-container
		fluid
		ma-0
		pa-0
	>
		
		<v-form v-model="valid">
			<v-container>
				<v-layout>
					
					<v-flex
						xs12
						md4
					>
						<v-text-field
							v-model="ip"
							:rules="ipRules"
							label="Host"
							Placeholder="<protocol>://<hostname>:<port>/"
							required
						>
						</v-text-field>
					</v-flex>
					
					<v-btn
						:disabled="!valid"
						color="success"
						@click="submit"
					>
						Scan
					</v-btn>
				
				</v-layout>
			</v-container>
		</v-form>
		
		<v-container>
			<v-card>
				<v-list two-line>
					<template v-for="( item, index ) in scans">
						<v-list-tile
							:key="item._id"
						>
							<v-list-tile-content
								ripple
								@click="select( item._id )"
							>
								<v-list-tile-title>{{ item.config.url }}</v-list-tile-title>
								<v-list-tile-sub-title class="text--primary">{{ item.state }}</v-list-tile-sub-title>
								<v-list-tile-sub-title>
									{{ item.config.plugins }}
								</v-list-tile-sub-title>
							</v-list-tile-content>
							
							<v-list-tile-action>
								<v-list-tile-action-text>
									{{ item.updatedAt }}
								</v-list-tile-action-text>
								
								<v-btn
									color="error"
									flat
									icon
									@click="removeScan( item._id )"
								>
									<v-icon>mdi-trash-can-outline</v-icon>
								</v-btn>
							</v-list-tile-action>
						
						</v-list-tile>
						<v-divider
							v-if="index + 1 < scans.length"
							:key="index"
						></v-divider>
					</template>
				</v-list>
			</v-card>
		</v-container>
	
	</v-container>
</template>

<script>
	import { mapActions, mapGetters } from 'vuex';
	
	export default {
		name: 'Home',
		components: {},
		data() {
			return {
				valid: false,
				ip: '',
				ipRules: [
					v => !!v || 'Hostname is required'
				],
				refreshInterval: null
			};
		},
		computed: {
			...mapGetters( 'scan', {
				scans: 'getScans'
			} )
		},
		async mounted() {
			await this.listScans();
			
			this.refreshInterval = setInterval(
				async () => await this.listScans(),
				1500
			);
		},
		beforeDestroy() {
			clearInterval( this.refreshInterval );
		},
		methods: {
			...mapActions( 'scan', [ 'listScans', 'deleteScan' ] ),
			async submit() {
			
			},
			select( _id ) {
				this.$router.push( {
					name: 'scan',
					params: { _id }
				} );
			},
			removeScan( _id ) {
				// TODO: marked for deletion disable
				this.deleteScan( _id );
			}
		}
	};
</script>

<style>
</style>
