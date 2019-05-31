<template>
	<!--<Chart :tweetData="loadData"/>-->
	<FlowTree2
		v-if="loadData"
		:treeData="loadData"/>
</template>

<script>
	import * as d3  from 'd3';
	import LightMap from '@mi-sec/lightmap';
	
	// import Chart      from '@/components/Chart';
	import FlowTree2 from '@/components/FlowTree2';
	
	export default {
		name: 'Home',
		components: {
			FlowTree2
			// Chart
		},
		data: function() {
			return {
				loadData: null
			};
		},
		mounted() {
			console.log( 'App loaded' );
			this.fetchData();
		},
		methods: {
			async fetchData() {
				let data = await d3.json( './scantree.json' );
				data     = new LightMap( data );
				
				const root = {};
				
				root.name     = data.get( 'baseUrl' );
				root.children = data.get( 'nodes' );
				
				console.log( root );
				const x = {
					'name': 'Eve',
					'children': [
						{
							'name': 'Cain'
						},
						{
							'name': 'Seth',
							'children': [
								{
									'name': 'Enos'
								},
								{
									'name': 'Noam'
								}
							]
						},
						{
							'name': 'Abel'
						},
						{
							'name': 'Awan',
							'children': [
								{
									'name': 'Enoch'
								}
							]
						},
						{
							'name': 'Azura'
						}
					]
				};
				
				this.loadData = root;
			}
		}
	};
</script>
