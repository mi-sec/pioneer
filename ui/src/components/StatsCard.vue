<template>
	<v-card
		elevation-2
		pa-4
		dark
	>
		<v-icon size="40">
			{{ icon }}
		</v-icon>
	</v-card>
</template>

<script>
	export default {
		name: 'StatsCard',
		props: {
			icon: {
				type: String,
				required: true
			},
			subTextColor: {
				type: String,
				default: undefined
			},
			subText: {
				type: String,
				default: undefined
			},
			title: {
				type: String,
				default: undefined
			},
			value: {
				type: String,
				default: undefined
			},
			smallValue: {
				type: String,
				default: undefined
			}
		}
	};
</script>

<style lang="scss">
	.v-card--material-stats {
		display: flex;
		flex-wrap: wrap;
		position: relative;
		
		.v-offset {
			display: inline-block;
			flex: 0 1;
			margin-top: 0;
			margin-left: 0;
			margin-right: auto;
			margin-bottom: 0 !important;
			max-width: auto;
			padding: 0 16px 0;
		}
		
		.v-card {
			border-radius: 4px;
			flex: 0 1 auto;
		}
		
		.v-card__text {
			display: inline-block;
			position: absolute;
			top: 0;
			right: 0;
			width: 100%;
		}
		
		.v-card__actions {
			flex: 1 0 100%;
		}
	}
</style>
