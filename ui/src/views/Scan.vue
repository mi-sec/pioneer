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
						<v-card>
							<v-img
								v-if="screenshot"
								:src="screenshot"
								class="elevation-4"
								aspect-ratio="3.0"
							/>
							
							<v-card-title>
								<div>
									<h3 class="mb-0">{{ scan.data.url }}</h3>
									<span class="grey--text">Created: {{ scan.createdAt }}</span><br/>
									
									<span class="font-weight-bold">Type: </span>
									<span>{{ scan.data.type }}</span><br/>
									
									<span class="font-weight-bold">Mime-Type: </span>
									<span>{{ scan.data.response.mimeType }}</span><br/>
									
									<v-divider class="mt-2 mb-2"/>
									
									<span class="font-weight-bold">Protocol: </span>
									<code>{{ scan.data.response.protocol }}</code><br/>
									
									<span class="font-weight-bold">Remote Address: </span>
									<code>{{ scan.data.response.remoteIPAddress }}</code><br/>
									
									<span class="font-weight-bold">Remote Port: </span>
									<code>{{ scan.data.response.remotePort }}</code><br/>
								</div>
							</v-card-title>
						</v-card>
					</v-flex>
					
					<v-flex xs12>
						<v-card>
							<v-card-title>
								<div>
									<h3 class="mb-0">Security</h3>
									
									<span class="font-weight-bold">security state: </span>
									<v-btn
										small
										dark
										:color="scan.data.response.securityState === 'secure' ? 'green' : 'red'"
									>
										{{ scan.data.response.securityState }}
									</v-btn>
									<br/>
									
									<div v-if="scan.data.response.securityDetails">
										<span class="font-weight-bold">Connection:</span>
										<ul>
											<li>
												<span class="font-weight-bold">Protocol: </span>
												<code>{{ scan.data.response.securityDetails.protocol }}</code>
											</li>
											<li>
												<span class="font-weight-bold">Key exchange: </span>
												<code>{{ scan.data.response.securityDetails.keyExchange }}</code>
											</li>
											<li>
												<span class="font-weight-bold">Key exchange group: </span>
												<code>{{ scan.data.response.securityDetails.keyExchangeGroup }}</code>
											</li>
											<li>
												<span class="font-weight-bold">Cipher: </span>
												<code>{{ scan.data.response.securityDetails.cipher }}</code>
											</li>
											<li>
												<span class="font-weight-bold">Cipher Suite: </span>
												<code>{{ scan.data.response.securityDetails.cipherSuite }}</code>
											</li>
										</ul>
										
										<br/>
										
										<span class="font-weight-bold">Certificate:</span>
										<ul>
											<li>
												<span class="font-weight-bold">Subject: </span>
												<code>{{ scan.data.response.securityDetails.subjectName }}</code>
											</li>
											<li>
												<span class="font-weight-bold">SAN: </span>
												<code>{{ scan.data.response.securityDetails.sanList }}</code>
											</li>
											<li>
												<span class="font-weight-bold">Valid from: </span>
												<code>{{ scan.data.response.securityDetails.validFrom }}</code>
											</li>
											<li>
												<span class="font-weight-bold">Valid to: </span>
												<code>{{ scan.data.response.securityDetails.validTo }}</code>
											</li>
											<li>
												<span class="font-weight-bold">Issuer: </span>
												<code>{{ scan.data.response.securityDetails.issuer }}</code>
											</li>
										</ul>
									</div>
								</div>
							</v-card-title>
						</v-card>
					</v-flex>
				</v-flex>
				
				<v-flex xs7 offset-xs5 offset-md2 offset-lg5>
					<v-card dark color="secondary">
						<v-card-text>xs7 offset-(xs5 | md2 | lg5)</v-card-text>
					</v-card>
				</v-flex>
				
				<v-flex xs12 sm5 md3>
					<v-card dark color="primary">
						<v-card-text>(xs12 | sm5 | md3)</v-card-text>
					</v-card>
				</v-flex>
				
				<v-flex xs12 sm5 md5 offset-xs0 offset-lg2>
					<v-card dark color="green">
						<v-card-text>(xs12 | sm5 | md5) offset-(xs0 | lg2)</v-card-text>
					</v-card>
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
	
	export default {
		name: 'Scan',
		components: {},
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
			
			const screenshot = this.scan.data.plugins.find( plugin => plugin.module === 'screenshot' );
			
			if ( screenshot ) {
				this.screenshot = screenshot.apiPath;
			}
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
