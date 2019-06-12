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
	
	</v-container>
</template>

<script>
	export default {
		name: 'Home',
		components: {},
		data() {
			return {
				valid: false,
				ip: '',
				ipRules: [
					v => !!v || 'Hostname is required'
				]
			};
		},
		mounted() {
		},
		methods: {
			async submit() {
			
			}
		}
	};
</script>

<style>
</style>
