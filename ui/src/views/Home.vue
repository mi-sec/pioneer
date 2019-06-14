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
		
		<v-layout align-center justify-center row fill-height>
			<v-card>
				<v-list two-line>
					<template v-for="(item, index) in items">
						<v-list-tile
							:key="item.title"
							avatar
							ripple
							@click="toggle(index)"
						>
							<v-list-tile-content>
								<v-list-tile-title>{{ item.title }}</v-list-tile-title>
								<v-list-tile-sub-title class="text--primary">{{ item.headline }}</v-list-tile-sub-title>
								<v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
							</v-list-tile-content>
							
							<v-list-tile-action>
								<v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text>
								<v-icon
									v-if="selected.indexOf(index) < 0"
									color="grey lighten-1"
								>
									star_border
								</v-icon>
								
								<v-icon
									v-else
									color="yellow darken-2"
								>
									star
								</v-icon>
							</v-list-tile-action>
						
						</v-list-tile>
						<v-divider
							v-if="index + 1 < items.length"
							:key="index"
						></v-divider>
					</template>
				</v-list>
			</v-card>
		</v-layout>
	
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
				],
				
				selected: [ 2 ],
				items: [
					{
						action: '15 min',
						headline: 'Brunch this weekend?',
						title: 'Ali Connors',
						subtitle: 'I\'ll be in your neighborhood doing errands this weekend. Do you want to hang out?'
					},
					{
						action: '2 hr',
						headline: 'Summer BBQ',
						title: 'me, Scrott, Jennifer',
						subtitle: 'Wish I could come, but I\'m out of town this weekend.'
					},
					{
						action: '6 hr',
						headline: 'Oui oui',
						title: 'Sandra Adams',
						subtitle: 'Do you have Paris recommendations? Have you ever been?'
					},
					{
						action: '12 hr',
						headline: 'Birthday gift',
						title: 'Trevor Hansen',
						subtitle: 'Have any ideas about what we should get Heidi for her birthday?'
					},
					{
						action: '18hr',
						headline: 'Recipe to try',
						title: 'Britta Holt',
						subtitle: 'We should eat this: Grate, Squash, Corn, and tomatillo Tacos.'
					}
				]
			};
		},
		mounted() {
		},
		methods: {
			async submit() {
			
			},
			toggle( index ) {
				const i = this.selected.indexOf( index );
				
				if ( i > -1 ) {
					this.selected.splice( i, 1 );
				}
				else {
					this.selected.push( index );
				}
			}
		}
	};
</script>

<style>
</style>
